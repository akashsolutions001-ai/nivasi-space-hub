import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { n as useAuth, r as useIsGlobalAdmin } from "./auth-D8HbqhQ8.mjs";
import { D as Plus, F as Lock, I as LoaderCircle, N as MapPin, V as GraduationCap, g as Stethoscope, l as UserPlus, r as Wrench } from "../_libs/lucide-react.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { M as setCollegeActive, S as fetchAdmissions, b as ensureStudentAuthAccount, et as useCities, j as setCityActive, n as addCollege, o as createAdminUser, t as addCity, tt as useColleges, z as updateCollege } from "./hooks-D74yrvlv.mjs";
import { t as Skeleton } from "./skeleton-DLRLwmh_.mjs";
import { a as SelectItem, i as SelectContent, o as SelectTrigger, r as Select, s as SelectValue, t as AdminShell } from "./admin-shell-Gk-9Tmgx.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { a as isValidEmail } from "./format-CWXVlUmU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Switch } from "./switch-C6cVMin1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-ZOCGoF2W.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const { user } = useAuth();
	const isGlobalAdmin = useIsGlobalAdmin();
	useQueryClient();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Settings",
		subtitle: "Workspace configuration for the NivasiSpace team.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-soft lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-base font-bold",
							children: "Signed-in Account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm font-medium",
							children: user?.displayName || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-sm text-muted-foreground",
							children: user?.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Staff accounts are created by an administrator in Firebase Authentication. Self sign-up is disabled for this workspace."
						})
					]
				}),
				!isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "rounded-2xl border border-dashed border-border bg-muted/30 p-5 lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm font-medium text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }), "Some settings below are managed by the Global Admin only."]
					})
				}),
				isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitiesCard, {}),
				isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EngineeringCollegesCard, {}),
				isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MedicalCollegesCard, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollegesCard, { isGlobalAdmin }),
				isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminUsersCard, {}),
				isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackfillStudentAuthCard, {})
			]
		})
	});
}
function CitiesCard() {
	const { data: cities = [], isLoading } = useCities();
	const queryClient = useQueryClient();
	const [name, setName] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	async function add(e) {
		e.preventDefault();
		if (!name.trim()) return;
		setSaving(true);
		try {
			await addCity(name.trim());
			await queryClient.invalidateQueries({ queryKey: ["cities"] });
			setName("");
			toast.success("City added");
		} catch {
			toast.error("Could not add the city.");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "flex items-center gap-2 font-display text-base font-bold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4 text-primary" }), "Cities"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: add,
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "Add a city"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "icon",
					disabled: saving,
					"aria-label": "Add city",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-2",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }) : cities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "No cities yet."
				}) : cities.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-sm",
						children: c.cityName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: c.active,
						"aria-label": "City active",
						onCheckedChange: async (v) => {
							await setCityActive(c.id, v);
							await queryClient.invalidateQueries({ queryKey: ["cities"] });
						}
					})]
				}, c.id))
			})
		]
	});
}
function AdminUsersCard() {
	const { data: colleges = [] } = useColleges();
	const { data: cities = [] } = useCities();
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [cityFilter, setCityFilter] = (0, import_react.useState)("");
	const [collegeId, setCollegeId] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const activeCities = cities.filter((c) => c.active);
	const filteredColleges = colleges.filter((c) => c.active && (cityFilter === "" || c.city === cityFilter));
	const selectedCollege = colleges.find((c) => c.id === collegeId);
	function handleCityChange(val) {
		setCityFilter(val);
		if (!colleges.find((c) => c.id === collegeId && (val === "" || c.city === val))) setCollegeId("");
	}
	async function add(e) {
		e.preventDefault();
		if (!displayName.trim() || !email.trim() || !password || !collegeId) {
			toast.error("Please fill in all fields and select a college.");
			return;
		}
		if (!isValidEmail(email)) {
			toast.error("Enter a valid email address.");
			return;
		}
		if (password.length < 6) {
			toast.error("Password must be at least 6 characters.");
			return;
		}
		setSaving(true);
		try {
			await createAdminUser({
				email: email.trim(),
				password,
				displayName: displayName.trim(),
				collegeId,
				collegeName: selectedCollege?.collegeName ?? ""
			});
			setDisplayName("");
			setEmail("");
			setPassword("");
			setCityFilter("");
			setCollegeId("");
			toast.success(`Admin account created for ${displayName.trim()}`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not create admin account.");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "flex items-center gap-2 font-display text-base font-bold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4 text-primary" }), "Add Admin for College"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Creates a Firebase Auth account and saves the admin to the users collection."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: add,
				className: "mt-3 space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: displayName,
						onChange: (e) => setDisplayName(e.target.value),
						placeholder: "Display name",
						autoComplete: "off"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: "Email address",
						type: "email",
						autoComplete: "off"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: password,
						onChange: (e) => setPassword(e.target.value),
						placeholder: "Password (min 6 characters)",
						type: "password",
						autoComplete: "new-password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: cityFilter,
						onValueChange: handleCityChange,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Filter by city (optional)" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "",
							children: "All cities"
						}), activeCities.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: c.cityName,
							children: c.cityName
						}, c.id))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: collegeId,
							onValueChange: setCollegeId,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "flex-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: filteredColleges.length === 0 ? "No colleges for this city" : "Select college" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: filteredColleges.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: c.id,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex flex-col",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.collegeName }), c.city && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground",
										children: c.city
									})]
								})
							}, c.id)) })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "icon",
							disabled: saving,
							"aria-label": "Create admin",
							children: saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
						})]
					})
				]
			})
		]
	});
}
/** Small pause so Firebase doesn't rate-limit the bulk signUp calls. */
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
function BackfillStudentAuthCard() {
	const [running, setRunning] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)(null);
	const [result, setResult] = (0, import_react.useState)(null);
	async function run() {
		setRunning(true);
		setResult(null);
		setProgress(null);
		try {
			const admissions = await fetchAdmissions();
			let created = 0, exists = 0, skipped = 0;
			const skippedList = [];
			setProgress({
				done: 0,
				total: admissions.length
			});
			for (let i = 0; i < admissions.length; i++) {
				const a = admissions[i];
				const email = a.email ?? "";
				const phone = a.parentPhone ?? "";
				const password = phone.replace(/\D/g, "");
				if (!email || password.length < 6) {
					skipped++;
					skippedList.push({
						name: a.fullName,
						admissionId: a.admissionId,
						reason: !email ? "no-email" : "no-phone"
					});
					setProgress({
						done: i + 1,
						total: admissions.length
					});
					continue;
				}
				if (i > 0) await sleep(300);
				let status = await ensureStudentAuthAccount(email, phone, a.fullName);
				if (status === "rate-limited") {
					await sleep(5e3);
					status = await ensureStudentAuthAccount(email, phone, a.fullName);
				}
				if (status === "created") created++;
				else if (status === "exists") exists++;
				else {
					skipped++;
					skippedList.push({
						name: a.fullName,
						admissionId: a.admissionId,
						reason: status === "rate-limited" ? "rate-limited" : "other"
					});
				}
				setProgress({
					done: i + 1,
					total: admissions.length
				});
			}
			setResult({
				created,
				exists,
				skipped,
				skippedList
			});
			setProgress(null);
			toast.success(`Done — ${created} created, ${exists} already existed, ${skipped} skipped.`);
		} catch {
			toast.error("Failed to backfill student auth accounts.");
		} finally {
			setRunning(false);
		}
	}
	const skippedList = result?.skippedList ?? [];
	const noEmail = skippedList.filter((s) => s.reason === "no-email");
	const noPhone = skippedList.filter((s) => s.reason === "no-phone");
	const rateLimited = skippedList.filter((s) => s.reason === "rate-limited");
	const otherErr = skippedList.filter((s) => s.reason === "other");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "flex items-center gap-2 font-display text-base font-bold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-4 text-primary" }), "Backfill Student Login Accounts"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Creates Firebase Auth accounts for existing students who don't have one yet. Password = parent phone number (digits only). Safe to run multiple times."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				className: "mt-3",
				onClick: run,
				disabled: running,
				children: [running && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 size-4 animate-spin" }), running ? "Running…" : "Run Backfill"]
			}),
			running && progress && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: [
					"Processing ",
					progress.done,
					" / ",
					progress.total,
					"…"
				]
			}),
			result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-2 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted-foreground",
						children: [
							"Created: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: result.created
							}),
							" · ",
							"Already existed: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: result.exists
							}),
							" · ",
							"Skipped: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: result.skipped
							})
						]
					}),
					noEmail.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-semibold text-yellow-700 dark:text-yellow-400 mb-1",
							children: [
								"Missing email (",
								noEmail.length,
								") — add email to these admission records"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-0.5 text-muted-foreground",
							children: noEmail.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								s.name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-primary",
									children: s.admissionId
								})
							] }, s.admissionId))
						})]
					}),
					noPhone.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-semibold text-orange-700 dark:text-orange-400 mb-1",
							children: [
								"Missing / short parent phone (",
								noPhone.length,
								") — add parent phone to these records"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-0.5 text-muted-foreground",
							children: noPhone.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								s.name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-primary",
									children: s.admissionId
								})
							] }, s.admissionId))
						})]
					}),
					rateLimited.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-semibold text-blue-700 dark:text-blue-400 mb-1",
							children: [
								"Rate-limited by Firebase (",
								rateLimited.length,
								") — wait a few minutes and run again"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-0.5 text-muted-foreground",
							children: rateLimited.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								s.name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-primary",
									children: s.admissionId
								})
							] }, s.admissionId))
						})]
					}),
					otherErr.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-semibold text-red-700 dark:text-red-400 mb-1",
							children: [
								"Firebase error (",
								otherErr.length,
								") — check browser console"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-0.5 text-muted-foreground",
							children: otherErr.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								s.name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-primary",
									children: s.admissionId
								})
							] }, s.admissionId))
						})]
					})
				]
			})
		]
	});
}
function EngineeringCollegesCard() {
	const { data: allColleges = [], isLoading } = useColleges();
	const queryClient = useQueryClient();
	const { data: cities = [] } = useCities();
	const [name, setName] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const engineering = allColleges.filter((c) => c.collegeType === "engineering");
	async function add(e) {
		e.preventDefault();
		if (!name.trim()) return;
		setSaving(true);
		try {
			await addCollege(name.trim(), "engineering", city);
			await queryClient.invalidateQueries({ queryKey: ["colleges"] });
			setName("");
			setCity("");
			toast.success("Engineering college added");
		} catch {
			toast.error("Could not add the college.");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "flex items-center gap-2 font-display text-base font-bold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-4 text-primary" }), "Engineering Colleges"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: add,
				className: "mt-3 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "College name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: city,
						onValueChange: setCity,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select city" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: cities.filter((c) => c.active).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: c.cityName,
							children: c.cityName
						}, c.id)) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "icon",
						disabled: saving,
						"aria-label": "Add engineering college",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-2",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }) : engineering.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "No engineering colleges yet."
				}) : engineering.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-sm",
							children: c.collegeName
						}), c.city && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground",
							children: c.city
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: c.active,
						"aria-label": "College active",
						onCheckedChange: async (v) => {
							await setCollegeActive(c.id, v);
							await queryClient.invalidateQueries({ queryKey: ["colleges"] });
						}
					})]
				}, c.id))
			})
		]
	});
}
function MedicalCollegesCard() {
	const { data: allColleges = [], isLoading } = useColleges();
	const queryClient = useQueryClient();
	const { data: cities = [] } = useCities();
	const [name, setName] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const medical = allColleges.filter((c) => c.collegeType === "medical");
	async function add(e) {
		e.preventDefault();
		if (!name.trim()) return;
		setSaving(true);
		try {
			await addCollege(name.trim(), "medical", city);
			await queryClient.invalidateQueries({ queryKey: ["colleges"] });
			setName("");
			setCity("");
			toast.success("Medical college added");
		} catch {
			toast.error("Could not add the college.");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "flex items-center gap-2 font-display text-base font-bold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { className: "size-4 text-primary" }), "Medical Colleges"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: add,
				className: "mt-3 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "College name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: city,
						onValueChange: setCity,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select city" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: cities.filter((c) => c.active).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: c.cityName,
							children: c.cityName
						}, c.id)) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "icon",
						disabled: saving,
						"aria-label": "Add medical college",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-2",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }) : medical.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "No medical colleges yet."
				}) : medical.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-sm",
							children: c.collegeName
						}), c.city && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground",
							children: c.city
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: c.active,
						"aria-label": "College active",
						onCheckedChange: async (v) => {
							await setCollegeActive(c.id, v);
							await queryClient.invalidateQueries({ queryKey: ["colleges"] });
						}
					})]
				}, c.id))
			})
		]
	});
}
function CollegesCard({ isGlobalAdmin }) {
	const { data: colleges = [], isLoading } = useColleges();
	const { data: cities = [] } = useCities();
	const queryClient = useQueryClient();
	const [name, setName] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("");
	const [collegeType, setCollegeType] = (0, import_react.useState)("other");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editType, setEditType] = (0, import_react.useState)("other");
	const [editCity, setEditCity] = (0, import_react.useState)("");
	async function add(e) {
		e.preventDefault();
		if (!name.trim()) return;
		setSaving(true);
		try {
			await addCollege(name.trim(), collegeType, city);
			await queryClient.invalidateQueries({ queryKey: ["colleges"] });
			setName("");
			setCity("");
			setCollegeType("other");
			toast.success("College added");
		} catch {
			toast.error("Could not add the college.");
		} finally {
			setSaving(false);
		}
	}
	function startEdit(c) {
		setEditingId(c.id);
		setEditType(c.collegeType || "other");
		setEditCity(c.city || "");
	}
	async function saveEdit(id) {
		try {
			await updateCollege(id, {
				collegeType: editType,
				city: editCity
			});
			await queryClient.invalidateQueries({ queryKey: ["colleges"] });
			setEditingId(null);
			toast.success("College updated");
		} catch {
			toast.error("Could not update the college.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-soft lg:col-span-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "flex items-center gap-2 font-display text-base font-bold",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-4 text-primary" }),
					"All Colleges",
					isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto text-[11px] font-normal text-muted-foreground",
						children: "Click Edit to set type & city on existing colleges"
					})
				]
			}),
			isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: add,
				className: "mt-3 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "College name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: collegeType,
							onValueChange: (v) => setCollegeType(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-40",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Type" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "engineering",
									children: "Engineering"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "medical",
									children: "Medical"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "other",
									children: "Other"
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: city,
							onValueChange: setCity,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "flex-1 min-w-32",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select city" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: cities.filter((c) => c.active).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: c.cityName,
								children: c.cityName
							}, c.id)) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "icon",
							disabled: saving,
							"aria-label": "Add college",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-2 sm:grid-cols-2",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl sm:col-span-2" }) : colleges.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "No colleges yet."
				}) : colleges.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border px-3 py-2",
					children: editingId === c.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-semibold",
								children: c.collegeName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: editType,
									onValueChange: (v) => setEditType(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-36",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "engineering",
											children: "Engineering"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "medical",
											children: "Medical"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "other",
											children: "Other"
										})
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: editCity,
									onValueChange: setEditCity,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "flex-1 min-w-24 h-9 text-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select city" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: cities.filter((c) => c.active).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: c.cityName,
										children: c.cityName
									}, c.id)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									className: "h-7 text-xs",
									onClick: () => saveEdit(c.id),
									children: "Save"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									className: "h-7 text-xs",
									onClick: () => setEditingId(null),
									children: "Cancel"
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-sm",
								children: c.collegeName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-muted-foreground capitalize",
								children: [c.collegeType && c.collegeType !== "other" ? c.collegeType : "—", c.city ? ` · ${c.city}` : ""]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-2",
							children: [isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								className: "h-7 px-2 text-xs text-muted-foreground",
								onClick: () => startEdit(c),
								children: "Edit"
							}), isGlobalAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: c.active,
								"aria-label": "College active",
								onCheckedChange: async (v) => {
									await setCollegeActive(c.id, v);
									await queryClient.invalidateQueries({ queryKey: ["colleges"] });
								}
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[11px] font-medium ${c.active ? "text-green-600" : "text-muted-foreground"}`,
								children: c.active ? "Active" : "Inactive"
							})]
						})]
					})
				}, c.id))
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
