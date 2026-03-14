import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import "dotenv/config";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
	adapter,
});

async function main() {
	console.log("🌱Starting seeding database...");

	const users = await prisma.user.createManyAndReturn({
		data: [
			{
				firstName: "Manoj",
				lastName: "Gaur",
				email: "manojgaur6397@gmail.com",
				password: "BilluDon",
				phoneNumber: "7983641828",
				role: "ADMIN",
				hasPets: false,
			},
			{
				firstName: "Raju",
				lastName: "Gopal",
				email: "ghalj@gmail.com",
				password: "708dkjsf9",
				phoneNumber: "79836320",
				role: "USER",
				hasPets: true,
			},
			{
				firstName: "Shyam",
				lastName: "Bhuz",
				email: "chaudhry@gmail.com",
				password: "808370320",
				phoneNumber: "79380720",
				role: "USER",
				hasPets: false,
			},
			{
				firstName: "Raju",
				lastName: "Paji",
				email: "manoj@int.com",
				password: "haollsldf",
				phoneNumber: "70939302",
				role: "USER",
				hasPets: false,
			},
		],
		skipDuplicates: true,
	});

	const accountData = users.map((u, i) => {
		return {
			userId: u.id,
			type: "Oauth",
			provider: i % 2 === 0 ? "google" : "github",
			providerAccountId: `test_account_${u.email}_${i % 2 === 0 ? "google" : "github"}`,
			access_token: `test_access_token_${Math.random().toString(36).substring(2, 15)}`,
			expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
		};
	});

	const accounts = await prisma.account.createMany({
		data: accountData,
		skipDuplicates: true,
	});

	console.log(`Seeded ${users.length} users and ${accounts.count} accounts.`);

	// 4. Seed Plant Categories
	const categories = await prisma.plantCategory.createManyAndReturn({
		data: [{ name: "Indoor" }, { name: "Succulents" }, { name: "Outdoor" }],
		skipDuplicates: true,
	});

	// 5. Seed Plants (Linking to Categories)
	const plants = await prisma.plant.createManyAndReturn({
		data: [
			{
				name: "Aloe Vera",
				description: "Medicinal and easy to care for.",
				price: 25000,
				stockQuantity: 50,
				careDifficulty: "Beginner",
				categoryId: categories[2].id,
			},
			{
				name: "Snake Plant",
				description: "Perfect for low light.",
				price: 45000,
				stockQuantity: 30,
				careDifficulty: "Beginner",
				categoryId: categories[1].id,
			},
		],
		skipDuplicates: true,
	});

	// 6. Seed Addresses for Users
	const addressData = users.map((u, i) => ({
		userId: u.id,
		type: (i % 2 === 0 ? "Shipping" : "Billing") as "Shipping" | "Billing", // Alternating enum types// FIX: Casted as literal Enum types
		street: `Street ${i}`,
		city: i % 2 === 0 ? "Bulandshahr" : "Mainpuri", // Seamless realistic data
		state: "U.P.",
		zipCode: "203001",
	}));
	await prisma.address.createMany({ data: addressData });

	// 7. Seed Staff Members
	const staff = await prisma.staff.createManyAndReturn({
		data: [
			{
				name: "Ramesh Delivery",
				email: "ramesh@plantapp.com",
				password: "hashed_password_here",
				role: "DELIVERY_BOY",
				currentLocation: "Warehouse A",
			},
			{
				name: "Suresh Expert",
				email: "suresh@plantapp.com",
				password: "hashed_password_here",
				role: "PLANT_EXPERT",
			},
		],
		skipDuplicates: true,
	});

	// 8. Seed a Demo Order (Using nested writes for the Order + Items)
	if (users.length > 0 && plants.length > 0) {
		await prisma.order.create({
			data: {
				userId: users[0].id,
				totalPrice: plants[0].price * 2,
				status: "PENDING",
				sourceLocation: "Main Warehouse",
				deliveryStaffId: staff[0].id,
				items: {
					create: [
						{
							plantId: plants[0].id,
							quantity: 2,
							priceAtPurchase: plants[0].price,
						},
					],
				},
			},
		});
	}
}

try {
	await main();
} catch (error) {
	console.error("Error seeding database:", error);
} finally {
	await prisma.$disconnect();
}
