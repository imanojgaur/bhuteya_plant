export const ROUTES = {
	HOME: "/",

	FOOD_AND_TOOLS: "/collections/food-and-tools",

	CATEGORIES: {
		ROOT: "/collections", // The "Shop All" fallback page

		// Space Categories
		INDOOR: "/collections/indoor",
		OUTDOOR: "/collections/outdoor",

		// Size Categories
		SIZE_S: "/collections/s",
		SIZE_L: "/collections/l",
		SIZE_XL: "/collections/xl",

		// Plant Type Categories
		SUCCULENTS: "/collections/succulents",
		CACTUS: "/collections/cactus",
		TROPICAL: "/collections/tropical",
		AIR_PLANT: "/collections/air-plant",
		FLOWERING: "/collections/flowering",
	},

	SERVICES: {
		ROOT: "/services",
		BULK_INSTALLATION: "/services",
		CONSULT: "/services",
		MAINTENANCE: "/services/maintenance",
		WARRENTY: "/services/warrenty",
	},
} as const;
