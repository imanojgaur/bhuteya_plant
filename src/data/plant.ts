import prisma from '@/lib/prisma';
import type { PlantCardData } from '@/types';

export async function getPlantsForCards(categorySlug?: string): Promise<PlantCardData [] >{
    try {
        const plants = await prisma.plant.findMany({

            where: categorySlug ? {
                categories: {
                    some: { slug: categorySlug }
                }
            } : {},
            
            select: {
                id: true,
                name: true,
                slug: true, 
                price: true,
                compareAtPrice: true,
                stockQuantity: true,
                
                // Requirement 1: Fetch exactly the first 3 categories
                categories: {
                    where: {
                        slug: { not: "home" }, 
                    },
                    take: 3,
                    select: {
                        name: true,
                        slug: true,
                    }
                },
                
                images: {
                    where: { isPrimary: true },
                    take: 1, 
                    select: {
                        publicId: true,
                        secureUrl: true,
                        width: true,
                        height: true,
                    }
                }
            }
        });

        return plants;

    } catch (error) {
        console.error("❌ Error fetching plants for cards:", error);
        return [];
    }
}