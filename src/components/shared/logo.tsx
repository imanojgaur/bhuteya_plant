import Image from "next/image";
import Link from "next/link";

export default function Logo() {
	return (
		<Link href="/" className="pl-6 py-4">
			<Image
				src="/logo/logo.svg"
				alt="Plant Shop Logo"
				width={120}
				height={60}
			/>
		</Link>
	);
}
