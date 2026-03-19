import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "DAP | Collections",
    description:
        "Modern plant e-commerce app with curated plants, pots, tools, and gardening services",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>{ children }</>
               
    );
}
