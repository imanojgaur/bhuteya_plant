type SiteName = string;

type LogoConfig = {
	title: string;
	href: string;
	svg: string;
	alt: string;
	width: number;
	height: number;
};

type NavItem = {
	title: string;
	href?: string;
	description?: string;
	items?: NavItem[];
};

export type { SiteName, LogoConfig, NavItem };
