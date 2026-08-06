import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as useAuth, o as useIsGlobalAdmin } from "./auth-DtLQDrss.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { C as Lock, D as GraduationCap, F as Building2, _ as Plus, d as Sparkles, n as Wrench, u as Stethoscope, w as LoaderCircle, x as MapPin } from "../_libs/lucide-react.mjs";
import { A as setCollegeActive, I as useCities, L as useColleges, M as setPropertyActive, O as seedDefaults, P as updateCollege, _ as addCollege, d as SelectItem, f as SelectTrigger, g as addCity, h as Skeleton, k as setCityActive, l as Select, n as Button, p as SelectValue, t as AdminShell, u as SelectContent, v as addProperty, z as useProperties } from "./admin-shell-7z6qK9qe.mjs";
import { t as Input } from "./input-Cg8moHv0.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Switch } from "./switch-aWKnekv4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-_XM0d_VR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const { user } = useAuth();
	const isGlobalAdmin = useIsGlobalAdmin();
	const queryClient = useQueryClient();
	const [seeding, setSeeding] = (0, import_react.useState)(false);
	async function runSeed() {
		setSeeding(true);
		try {
			await seedDefaults();
			await queryClient.invalidateQueries();
			toast.success("Default colleges and packages are ready.");
		} catch {
			toast.error("Could not load the default data.");
		} finally {
			setSeeding(false);
		}
	}
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
				isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl border border-primary/25 bg-brand-soft/60 p-5 shadow-soft lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-base font-bold",
							children: "Starter Data"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Load the default NivasiSpace packages and a starter college list. Existing records are never overwritten."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "mt-4",
							onClick: runSeed,
							disabled: seeding,
							children: [seeding ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), "Load Default Packages & Colleges"]
						})
					]
				}),
				isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitiesCard, {}),
				isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EngineeringCollegesCard, {}),
				isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MedicalCollegesCard, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollegesCard, { isGlobalAdmin }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropertiesCard, { isGlobalAdmin })
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
function PropertiesCard({ isGlobalAdmin }) {
	const { data: properties = [], isLoading } = useProperties();
	const queryClient = useQueryClient();
	const [name, setName] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	async function add(e) {
		e.preventDefault();
		if (!name.trim()) return;
		setSaving(true);
		try {
			await addProperty(name.trim());
			await queryClient.invalidateQueries({ queryKey: ["properties"] });
			setName("");
			toast.success("Property added");
		} catch {
			toast.error("Could not add the property.");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "flex items-center gap-2 font-display text-base font-bold",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-4 text-primary" }),
					"Properties",
					!isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3 text-muted-foreground" })
				]
			}),
			isGlobalAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: add,
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "Add a property"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "icon",
					disabled: saving,
					"aria-label": "Add property",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-2",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }) : properties.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "No properties yet."
				}) : properties.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-sm",
						children: p.propertyName
					}), isGlobalAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: p.active,
						"aria-label": "Property active",
						onCheckedChange: async (v) => {
							await setPropertyActive(p.id, v);
							await queryClient.invalidateQueries({ queryKey: ["properties"] });
						}
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `text-[11px] font-medium ${p.active ? "text-green-600" : "text-muted-foreground"}`,
						children: p.active ? "Active" : "Inactive"
					})]
				}, p.id))
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
