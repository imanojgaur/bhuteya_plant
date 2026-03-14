export const ROUTES = {
	HOME: "/",

	TRENDING: "/trending",

	CATEGORIES: {
		ROOT: "/categories",
		SIZE: "/categories/size",
		SPACE: "/categories/space",
	},
	SERVICES: {
		ROOT: "/categories",
		BULK_INSTALLATION: "/services/bulk-installation",
		CONSULT: "/services/consult-doctor",
		MAINTENANCE: "/services/maintainance",
	},
} as const;
