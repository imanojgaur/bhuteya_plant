import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'node:url';
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import type { ImageTypes, ScrapedPlantData } from "@/types";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

//USE IN CASE OF NO API KEY LOADING: DEBUGING
//TEST 2
// // This will print ONLY the names of the keys that have "CLOUDINARY" in them, 
// // keeping your actual passwords safe!
// console.log("FOUND THESE KEYS:", Object.keys(process.env).filter(key => key.includes("CLOUDINARY")));
// process.exit(0);
//TEST 1
// console.log("TESTING ENV LOAD:", process.env.CLOUDINARY_CLOUD_NAME);
// process.exit(0); // Stops the script immediately

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// A tiny helper function to pause the script so we don't get banned by Cloudinary for spamming API requests
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function runCloudinarySync() {
	console.log("🚀 Booting up Cloudinary Transformation Pipeline...\n");

	// 1. READ THE SACRED RAW DATA
	const rawDataPath = path.join(__dirname, "../extract/collection_plants.json");

	// No line run until check hard-drive: Sync
	if (!fs.existsSync(rawDataPath)) {
		console.error(
			"❌ CRITICAL ERROR: Could not find collection_plants.json. Did you run the extractor?",
		);
		process.exit(1); //for future: NO DB auto Seeding
	}

	const rawPlants = JSON.parse(fs.readFileSync(rawDataPath, "utf-8"));
	const enrichedPlants = [];

	console.log(
		`📦 Found ${rawPlants.length} plants to process. Starting the conveyor belt...\n`,
	);

	//THE RATE-LIMITED CONVEYOR BELT
	let successCount = 0;
	let failCount = 0;

	for (let i = 0; i < rawPlants.length; i++) {
		const plant: ScrapedPlantData = rawPlants[i];
		console.log(`⏳ Processing [${i + 1}/${rawPlants.length}]: ${plant.name}`);

		try {
			// THE WORK ZONE
			const optimizedImages: ImageTypes[] = [];

			// Loop through however many images this specific plant has
			for (const kyariUrl of plant.images) {
				// Tell Cloudinary to download the image from Kyari's URL
				if (typeof kyariUrl !== 'string') {
                    throw new Error("Expected a string URL, but got an object! ");
                }
				const uploadResult = await cloudinary.uploader.upload(kyariUrl, {
					folder: "kyari_catalog", // Organizes all your images into one neat folder in Cloudinary
					overwrite: true, // Prevents creating duplicates if you run the script twice
				});

				optimizedImages.push({
					publicId: uploadResult.public_id,
					secureUrl: uploadResult.secure_url,
					width: uploadResult.width,
					height: uploadResult.height,
				});

				// Wait 500 milliseconds before uploading the next image to avoid rate limits
				await sleep(500);
			}

			// 4. THE SWAP (Create the Enriched Clone)
			const transformedPlant = {
				...plant,
				originalKyariImages: plant.images, // Keep the original as a backup, just in case
				images: optimizedImages,
			};

			enrichedPlants.push(transformedPlant);
			successCount++;
			console.log(
				`   ✔️ Success! Uploaded ${optimizedImages.length} image(s).`,
			);
		} catch (error) {
			// FAULT TOLERANCE: If one plant fails, log the error but DO NOT crash the script
			console.error(
				`   ❌ Failed to process ${plant.name}. Using original Kyari URLs.`,
			);
			console.error("message:", error);
			failCount++;

			// Push the original plant data so we don't lose the text data in the database later
			enrichedPlants.push({
				...plant,
				originalKyariImages: plant.images,
			});
		}
	}

	// 5. EXPORT THE ENRICHED FILE
	console.log("\n🧹 Writing enriched data to file...");
	const outputPath = path.join(__dirname, "enriched_plants.json");
	fs.writeFileSync(outputPath, JSON.stringify(enrichedPlants, null, 2));

	console.log(`\n✅ PIPELINE COMPLETE!`);
	console.log(`📊 Stats: ${successCount} successful, ${failCount} failed.`);
	console.log(`📁 File saved to: etl-pipeline/transform/_plants.json`);
}

// Start the engine
runCloudinarySync().catch((err) => console.error("FATAL ERROR:", err));
