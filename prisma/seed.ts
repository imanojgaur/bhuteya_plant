import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, CareLevel } from "../generated/prisma/client";
import "dotenv/config";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

// Helper function to turn "Zamia Green - ZZ Plant" into "zamia-green-zz-plant"
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

type SeedPlant = {
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    careDifficulty: CareLevel;
    subCategoryName: string; 
    imageUrl?: string;       
};

const plantMockData: SeedPlant[] = [
    { name: "Monstera Deliciosa", description: "Famous for its natural leaf holes.", price: 45000, stockQuantity: 20, careDifficulty: "MidLevel", subCategoryName: "indoor", imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d40?auto=format&fit=crop&w=800&q=80" },
    { name: "Snake Plant Laurentii", description: "Fucking unkillable. Purifies air.", price: 25000, stockQuantity: 50, careDifficulty: "Beginner", subCategoryName: "indoor", imageUrl: "https://images.unsplash.com/photo-1599002241641-a67b5fb94d03?auto=format&fit=crop&w=800&q=80" },
    { name: "Jade Plant", description: "Symbol of good luck.", price: 15000, stockQuantity: 30, careDifficulty: "Beginner", subCategoryName: "succulents", imageUrl: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=800&q=80" },
    { name: "Fiddle Leaf Fig", description: "Large, glossy leaves.", price: 85000, stockQuantity: 10, careDifficulty: "Expert", subCategoryName: "indoor", imageUrl: "https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?auto=format&fit=crop&w=800&q=80" },
    { name: "Echeveria Elegans", description: "Classic rosette-shaped succulent.", price: 12000, stockQuantity: 100, careDifficulty: "Beginner", subCategoryName: "succulents", imageUrl: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80" },
    { name: "Peace Lily", description: "Beautiful white flowers.", price: 35000, stockQuantity: 25, careDifficulty: "MidLevel", subCategoryName: "indoor", imageUrl: "https://images.unsplash.com/photo-1593691509543-c20fb1ca7015?auto=format&fit=crop&w=800&q=80" },
    { name: "Majesty Palm", description: "Brings a tropical vibe.", price: 65000, stockQuantity: 15, careDifficulty: "MidLevel", subCategoryName: "outdoor", imageUrl: "https://images.unsplash.com/photo-1620127807580-ef6270bf8990?auto=format&fit=crop&w=800&q=80" },
    { name: "Aloe Vera", description: "Medicinal, soothing gel inside.", price: 18000, stockQuantity: 40, careDifficulty: "Beginner", subCategoryName: "succulents", imageUrl: "https://images.unsplash.com/photo-1596547609652-9cb5b8d7eceb?auto=format&fit=crop&w=800&q=80" },
    { name: "Bougainvillea", description: "Vibrant pink flowers.", price: 55000, stockQuantity: 20, careDifficulty: "MidLevel", subCategoryName: "outdoor", imageUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80" },
    { name: "ZZ Plant", description: "Thrives on neglect. Perfect for busy tech bros.", price: 40000, stockQuantity: 35, careDifficulty: "Beginner", subCategoryName: "indoor" },
    { name: "Golden Barrel Cactus", description: "Classic round desert cactus.", price: 22000, stockQuantity: 15, careDifficulty: "Beginner", subCategoryName: "cactus" },
    { name: "Bird of Paradise", description: "Stunning tropical flowering plant.", price: 95000, stockQuantity: 5, careDifficulty: "MidLevel", subCategoryName: "tropical" }
];

async function main() {
    console.log("🌱 Starting seeding database...");

    // 1. Seed Users
    const users = await prisma.user.createManyAndReturn({
        data: [
            { firstName: "Manoj", lastName: "Gaur", email: "manojgaur6397@gmail.com", password: "BilluDon", phoneNumber: "7983641828", role: "ADMIN", hasPets: false },
            { firstName: "Raju", lastName: "Gopal", email: "ghalj@gmail.com", password: "708dkjsf9", phoneNumber: "79836320", role: "USER", hasPets: true },
        ],
        skipDuplicates: true,
    });
    console.log(`✅ Seeded ${users.length} users.`);

    // 2. Seed Categories (Now using clean slugs)
    await prisma.plantCategory.createMany({
        data: [{ name: "space" }, { name: "size" }, { name: "plant-type" }],
        skipDuplicates: true,
    });
    
    // Fetch them back to get their generated IDs
    const categories = await prisma.plantCategory.findMany();
    const spaceCatId = categories.find(c => c.name === "space")?.id!;
    const sizeCatId = categories.find(c => c.name === "size")?.id!;
    const typeCatId = categories.find(c => c.name === "plant-type")?.id!;

    // 3. Seed SubCategories (Now using clean slugs)
    await prisma.plantSubCategory.createMany({
        data: [
            { name: "indoor", categoryId: spaceCatId },
            { name: "outdoor", categoryId: spaceCatId },
            { name: "xl", categoryId: sizeCatId },
            { name: "l", categoryId: sizeCatId },
            { name: "s", categoryId: sizeCatId },
            { name: "succulents", categoryId: typeCatId },
            { name: "cactus", categoryId: typeCatId },
            { name: "tropical", categoryId: typeCatId },
            { name: "air-plant", categoryId: typeCatId },
            { name: "flowering", categoryId: typeCatId },
        ],
        skipDuplicates: true,
    });

    const subCategories = await prisma.plantSubCategory.findMany();
    console.log(`✅ Seeded Categories and Subcategories.`);

    // 4. Seed Plants & Images
    let plantsCreated = 0;
    for (const plantData of plantMockData) {
        const matchingSubCat = subCategories.find(sub => sub.name === plantData.subCategoryName);
        
        if (!matchingSubCat) {
            console.log(`⚠️ Warning: Subcategory ${plantData.subCategoryName} not found for ${plantData.name}. Skipping.`);
            continue;
        }

        // Create the Plant (Now inserting the generated slug!)
        const createdPlant = await prisma.plant.create({
            data: {
                name: plantData.name,
                slug: generateSlug(plantData.name), // Automatically creates the slug
                description: plantData.description,
                price: plantData.price,
                stockQuantity: plantData.stockQuantity,
                careDifficulty: plantData.careDifficulty,
                subCategoryId: matchingSubCat.id,
            }
        });

        // If an image exists, create the relational PlantImage
        if (plantData.imageUrl) {
            await prisma.plantImage.create({
                data: {
                    plantId: createdPlant.id,
                    url: plantData.imageUrl,
                    isPrimary: true
                }
            });
        }
        plantsCreated++;
    }
    console.log(`✅ Seeded ${plantsCreated} Plants and their Images.`);

    // 5. Seed Staff
    const staff = await prisma.staff.createManyAndReturn({
        data: [
            { name: "Ramesh Delivery", email: "ramesh@plantapp.com", password: "hashed_password_here", role: "DELIVERY_BOY", currentLocation: "Warehouse A" },
            { name: "Suresh Expert", email: "suresh@plantapp.com", password: "hashed_password_here", role: "PLANT_EXPERT" },
        ],
        skipDuplicates: true,
    });
    console.log(`✅ Seeded Staff.`);

    console.log("🎉 Database seeding complete!");
}

main()
    .catch((error) => {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });