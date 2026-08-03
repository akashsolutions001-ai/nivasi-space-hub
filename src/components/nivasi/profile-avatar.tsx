import { useEffect, useState } from "react";
import { User } from "lucide-react";

import { getProfileImageUrl } from "@/lib/storage";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ProfileAvatar({
  path,
  url,
  name,
  className,
}: {
  path?: string | null | undefined;
  url?: string | null | undefined;
  name?: string | undefined;
  className?: string | undefined;
}) {
  const [src, setSrc] = useState<string | null>(url ?? null);

  useEffect(() => {
    let alive = true;
    if (url) {
      setSrc(url);
      return;
    }
    if (!path) {
      setSrc(null);
      return;
    }
    getProfileImageUrl(path).then((resolved) => {
      if (alive) setSrc(resolved);
    });
    return () => {
      alive = false;
    };
  }, [path, url]);

  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-soft text-sm font-semibold text-primary ring-1 ring-border",
        className,
      )}
    >
      {src ? (
        <img src={src} alt={name ? `${name} profile photo` : "Profile photo"} className="size-full object-cover" loading="lazy" />
      ) : name ? (
        initials(name) || <User className="size-1/2" />
      ) : (
        <User className="size-1/2 opacity-70" />
      )}
    </span>
  );
}
