
import { ProductCard } from "@/components/collections/product-card";
import { getPlantsForCards } from "@/data";

export default async function CategoryPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	// 1. Await params and format the title
	const slug = (await params).slug;
	const pageName = slug.split("-").join(" ");

	// 2. Fetch the plants for this specific slug
	const plants = await getPlantsForCards(slug);

	return (
		<section className="container mx-auto py-10 px-4">
			{/* Header Section */}
			<div className="mb-8">
				<h1 className="font-bold text-3xl capitalize text-primary">
					{pageName}
				</h1>
				<p className="text-muted-foreground mt-2">
					Showing {plants.length} plants in this collection.
				</p>
			</div>

			{/* 3. Conditional Rendering: Empty State vs Grid */}
			{plants.length === 0 ? (
				<div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/50">
					<h2 className="text-xl font-semibold text-muted-foreground">
						No plants found.
					</h2>
					<p className="text-sm text-muted-foreground mt-2">
						We might be out of stock, or this category is currently empty.
					</p>
				</div>
			) : (
				/* 4. The Responsive Grid For Loop (.map) */
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{plants.map((plant) => (
						<ProductCard key={plant.id} plant={plant} />
					))}
				</div>
			)}
		</section>
	);
}
