"use client";

import Link from "next/link";
import type * as React from "react";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { navConfig } from "@/config/nav-config";

export function Navbar() {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				{navConfig.map((navItem) => (
					<NavigationMenuItem key={navItem.title}>
						{/* If it has sub-items, render a Trigger and Content */}
						{navItem.items ? (
							<>
								<NavigationMenuTrigger>{navItem.title}</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
										{navItem.items.map((subItem) => (
											<ListItem
												key={subItem.title}
												title={subItem.title}
												href={subItem.href!}
											>
												{subItem.description}
											</ListItem>
										))}
									</ul>
								</NavigationMenuContent>
							</>
						) : (
							/* If it DOES NOT have sub-items, render a direct Link */
							<NavigationMenuLink
								asChild
								className={navigationMenuTriggerStyle()}
							>
								<Link href={navItem.href!}>{navItem.title}</Link>
							</NavigationMenuLink>
						)}
					</NavigationMenuItem>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
}

function ListItem({
	title,
	children,
	href,
	...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
	return (
		<li {...props}>
			<NavigationMenuLink asChild>
				<Link
					href={href}
					className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
				>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
}
