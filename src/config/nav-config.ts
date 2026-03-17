import { ROUTES } from "@/lib/constants/routes";
import type { LogoConfig, NavItem, SiteName } from "@/types/nav";

const siteName: SiteName = "DAP";

const logoConfig: LogoConfig = {
	title: "DAP",
	href: "/",
	svg: "/logo/logo.svg",
	alt: "Site logo",
	width: 120,
	height: 60,
};

const navConfig: NavItem[] = [
	{
		title: "New & Featured",
		href: ROUTES.HOME,
	},
	{
		title: "Categories",
		href: ROUTES.CATEGORIES.ROOT,
		items: [
			{
				title: "By Plant Type",
				items: [
					{ title: "Succulents", href: ROUTES.CATEGORIES.SUCCULENTS },
					{ title: "Cactus", href: ROUTES.CATEGORIES.CACTUS },
					{ title: "Tropical", href: ROUTES.CATEGORIES.TROPICAL },
					{ title: "Air Plant", href: ROUTES.CATEGORIES.AIR_PLANT },
					{ title: "Flowering", href: ROUTES.CATEGORIES.FLOWERING },
				],
			},
			{
				title: "Size",
				items: [
					{ title: "S", href: ROUTES.CATEGORIES.SIZE_S },
					{ title: "L", href: ROUTES.CATEGORIES.SIZE_L },
					{ title: "XL", href: ROUTES.CATEGORIES.SIZE_XL },
				],
			},
			{
				title: "Indoor & Outdoor",
				items: [
					{ title: "Indoor", href: ROUTES.CATEGORIES.INDOOR },
					{ title: "Outdoor", href: ROUTES.CATEGORIES.OUTDOOR },
				],
			},
		],
	},
	{
		title: "Food & Tools",
		href: ROUTES.FOOD_AND_TOOLS,
	},
	{
		title: "Services",
		href: ROUTES.SERVICES.ROOT,
		items: [
			{
				title: "Bulk Installation",
				href: ROUTES.SERVICES.BULK_INSTALLATION,
			},
			{
				title: "Consult a Doctor",
				href: ROUTES.SERVICES.CONSULT,
			},
			{
				title: "Maintenance",
				href: ROUTES.SERVICES.MAINTENANCE,
			},
			{
				title: "Warranty",
				href: ROUTES.SERVICES.WARRENTY,
			},
		],
	},
	{
		title: "About Us",
		href: ROUTES.HOME,
	},
];

export { siteName, navConfig, logoConfig };
