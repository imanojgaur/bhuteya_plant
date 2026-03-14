import Image from "next/image";
import Link from "next/link";
import { logoConfig } from "@/config/nav-config";

export function Logo() {
	return (
		<Link href={logoConfig.href} className="flex items-center h-full pl-6">
			<Image
				src={logoConfig.svg}
				alt={logoConfig.alt}
				width={logoConfig.width}
				height={logoConfig.height}
				priority
				className="h-auto w-auto object-contain"
			/>
		</Link>
	);
}
