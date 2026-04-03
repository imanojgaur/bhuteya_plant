"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { PlantCardData } from "@/types";
import { CldImage } from "next-cloudinary"; 

export function ProductCard({ plant }: { plant: PlantCardData }) {
    return (
        <Card className="group w-full max-w-sm overflow-hidden transition-all hover:shadow-lg flex flex-col">
            <CardHeader className="p-0">
                {/* Added overflow-hidden so the image zoom doesn't break the card corners */}
                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                    
                    {/* 👇 2. Render the actual image safely */}
                    {plant.images[0]?.publicId && (
                        <CldImage
                            src={plant.images[0].publicId}
                            width={500}
                            height={500}
                            alt={plant.name}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                    )}

                    <Badge className="absolute left-3 top-3 z-10" variant="secondary">
                        {plant.categories[0]?.name}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-4 flex-grow">
                <CardTitle className="text-xl line-clamp-1">{plant.name}</CardTitle>
                <CardDescription className="mt-2 line-clamp-2 italic">
                    Perfect for beginners and low-light spaces.
                </CardDescription>
            </CardContent>

            <CardFooter className="flex items-center justify-between p-4 pt-0 mt-auto">
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-green-700">
                        ₹{plant.price}
                    </span>
                    {plant.compareAtPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                            ₹{plant.compareAtPrice}
                        </span>
                    )}
                </div>
                <Button size="sm">Add to Cart</Button>
            </CardFooter>
        </Card>
    );
}