/**
 * NivasiSpace Service Worker
 *
 * Strategy:
 *  - Navigation (HTML): Stale-while-revalidate with a 5-min TTL.
 *    If a cached response is fresh enough, serve it instantly (no reload flash
 *    when restoring from background / minimizing). Revalidate silently in bg.
 *  - JS / CSS chunks: Network-first with cache fallback.
 *  - Static assets (icons, images, fonts): Cache-first (immutable).
 *  - Firebase / Firestore / Auth: Network-only — never cache auth or live data.
 *  - Offline fallback: branded offline page when all else fails.
 *
 * Cache names are versioned — bump CACHE_VERSION on each deploy to purge stale caches.
 */

const CACHE_VERSION = "v2";
const SHELL_CACHE   = `nivasi-shell-${CACHE_VERSION}`;
const STATIC_CACHE  = `nivasi-static-${CACHE_VERSION}`;

// How long a cached navigation response is considered "fresh" (ms).
// Within this window, restoring the app from background serves the cache instantly.
const NAV_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Assets to pre-cache on install (app shell)
const PRECACHE_URLS = [
  "/",
  "/admin/login",
  "/student/login",
  "/offline.html",
];

// Static assets that can be served cache-first
const STATIC_EXTENSIONS = /\.(png|jpg|jpeg|webp|svg|ico|woff2|woff|ttf)$/i;

// Never cache these origins/paths
const BYPASS_PATTERNS = [
  /firestore\.googleapis\.com/,
  /identitytoolkit\.googleapis\.com/,
  /securetoken\.googleapis\.com/,
  /firebase\.googleapis\.com/,
  /firebasestorage\.googleapis\.com/,
  /\.netlify\/(functions|edge-handlers)/,
  /chrome-extension:\/\//,
];

// ── Install ───────────────────────────────────────────────────────────────────

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

// ── Activate ──────────────────────────────────────────────────────────────────

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== SHELL_CACHE && k !== STATIC_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle http(s)
  if (!url.protocol.startsWith("http")) return;

  // Skip bypass patterns (Firebase, Netlify functions, etc.)
  if (BYPASS_PATTERNS.some((p) => p.test(request.url))) return;

  // Static assets — cache-first
  if (STATIC_EXTENSIONS.test(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Navigation requests — stale-while-revalidate (fresh cache = no reload flash on restore)
  if (request.mode === "navigate") {
    event.respondWith(staleWhileRevalidateNav(request));
    return;
  }

  // JS/CSS chunks — network-first, cache as fallback
  if (/\.(js|mjs|css)$/i.test(url.pathname)) {
    event.respondWith(networkFirst(request, SHELL_CACHE));
    return;
  }

  // Everything else — network only
});

// ── Strategies ────────────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Network error", { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached ?? new Response("Network error", { status: 503 });
  }
}

/**
 * Stale-while-revalidate for navigation requests.
 *
 * - If a cached copy exists AND is younger than NAV_CACHE_TTL_MS → serve it
 *   immediately, then revalidate in the background. This prevents the page
 *   reload / blank flash when the user minimizes and restores the app.
 * - If the cache is stale (> TTL) or missing → go to network first, fall back
 *   to the stale cache, then the offline page.
 */
async function staleWhileRevalidateNav(request) {
  const cache = await caches.open(SHELL_CACHE);
  const cached = await cache.match(request);

  const cachedAt = cached ? cached.headers.get("sw-cached-at") : null;
  const isFresh = cachedAt
    ? Date.now() - new Date(cachedAt).getTime() < NAV_CACHE_TTL_MS
    : false;

  // Helper: fetch, stamp with sw-cached-at, store, return original response
  const fetchAndCache = async () => {
    const networkRes = await fetch(request);
    if (networkRes.ok) {
      cache.put(request, stampResponse(networkRes.clone()));
    }
    return networkRes;
  };

  if (isFresh) {
    // Serve cache immediately; refresh silently in background
    fetchAndCache().catch(() => { /* offline — ignore, cached copy stays valid */ });
    return cached;
  }

  // Stale or missing — try network first
  try {
    return await fetchAndCache();
  } catch {
    if (cached) return cached; // serve stale over nothing
    const offline = await caches.match("/offline.html");
    return (
      offline ??
      new Response(
        `<!doctype html><html><head><meta charset="utf-8"><title>Offline — NivasiSpace</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#faf8f4;color:#3d2e1a}
.card{text-align:center;padding:2rem;max-width:360px}h1{font-size:1.5rem;margin-bottom:.5rem}p{color:#7a5c3a;font-size:.9rem}</style>
</head><body><div class="card"><h1>You're offline</h1>
<p>NivasiSpace needs a connection to load. Check your internet and try again.</p>
<button onclick="location.reload()" style="margin-top:1.5rem;padding:.6rem 1.4rem;border-radius:.75rem;border:none;background:#c2692a;color:#fff;font-size:.9rem;cursor:pointer">Try again</button>
</div></body></html>`,
        { headers: { "Content-Type": "text/html" } },
      )
    );
  }
}

/** Clone a response and inject a sw-cached-at timestamp header for TTL checks. */
function stampResponse(response) {
  const headers = new Headers(response.headers);
  headers.set("sw-cached-at", new Date().toISOString());
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
