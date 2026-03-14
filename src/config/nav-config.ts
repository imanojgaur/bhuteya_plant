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
		items: [
			{
				title: "Featured",
				items: [
					{
						title: "New",
						href: ROUTES.HOME,
					},
					{
						title: "BestSeller",
						href: ROUTES.HOME,
					},
					{
						title: "Top picks under $299",
						href: ROUTES.HOME,
					},
				],
			},

			{
				title: "Recomendation",
				href: ROUTES.HOME,
			},

			{
				title: "Air Purifiers",
				href: "/",
			},
		],
	},
	{
		title: "Trending",
		href: ROUTES.TRENDING,
		items: [
			{
				title: "Alert Dialog",
				href: "/docs/primitives/alert-dialog",
				description: "A modal dialog that interrupts the user.",
			},
			{
				title: "Hover Card",
				href: "/docs/primitives/hover-card",
				description: "For sighted users to preview content.",
			},
		],
	},

	{
		title: "Categories",
		href: ROUTES.CATEGORIES.ROOT,
		items: [
			{
				title: "Size",
				href: ROUTES.CATEGORIES.SIZE,
				items: [
					{
						title: "Xl",
						href: ROUTES.CATEGORIES.SIZE,
					},
					{
						title: "l",
						href: ROUTES.CATEGORIES.SIZE,
					},
					{
						title: "s",
						href: ROUTES.CATEGORIES.SIZE,
					},
				],
			},
		],
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
				title: "Consult",
				href: ROUTES.SERVICES.CONSULT,
			},
			{
				title: "Maintenance",
				href: ROUTES.SERVICES.MAINTENANCE,
			},
		],
	},

	{
		title: "About Us",
		href: ROUTES.HOME,
	},
];

export { siteName, navConfig, logoConfig };
