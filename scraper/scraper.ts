import fs from 'node:fs';
import { chromium } from 'playwright';
import type { PlantCardData } from '@/types'; 

// [BATCH UPGRADE 1]: The function now accepts an Array of strings (urls: string[])
async function scrapeCollections(urls: string[]) {
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
  });

  // [BATCH UPGRADE 2]: A master array to hold data from ALL websites combined
  const masterPlantList: PlantCardData[] = [];
  const baseUrl = "https://kyari.co";

  // [BATCH UPGRADE 3]: The Batch Loop. It will process one URL completely before moving to the next.
  for (const url of urls) {
    console.log(`\n🚚 Navigating to Catalog: ${url}...`);
    
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

      console.log("⏳ Waiting for the product grid to load...");
      await page.waitForSelector('.product-item', { timeout: 15000 });

      console.log("📜 Scrolling slowly to force Shopify to load all images...");
      await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
          let totalHeight = 0;
          const distance = 300; 
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            
            if (totalHeight >= scrollHeight + 500) {
              clearInterval(timer);
              resolve();
            }
          }, 300); 
        });
      });
      
      await page.waitForTimeout(3000); 

      console.log(`✂️ Extracting data from ${url}...`);

      const pagePlants: PlantCardData[] = await page.evaluate((base) => {
        const productCards = document.querySelectorAll('.product-item');
        
        return Array.from(productCards).map(card => {
          const nameEl = card.querySelector('.product-item__title');
          const name = nameEl ? nameEl.textContent?.trim() || "Unknown" : "Unknown";

          const idInput = card.querySelector('input[name="product-id"]');
          const productId = idInput ? (idInput as HTMLInputElement).value : card.id.replace('product-item-', '');

          const linkEl = card.querySelector('a.product-item__image');
          const route = linkEl ? linkEl.getAttribute('href') : "";
          const sourceUrl = route ? base + route : base;

          const priceEl = card.querySelector('.product-price--original');
          const priceText = priceEl ? priceEl.textContent || "0" : "0";
          const currentPrice = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0;

          const cutPriceEl = card.querySelector('.product-price--compare'); 
          const cutPriceText = cutPriceEl ? cutPriceEl.textContent || "0" : "0";
          const secondaryPrice = parseInt(cutPriceText.replace(/[^0-9]/g, ''), 10) || currentPrice;

          const soldOutBadge = card.querySelector('.badge--sold-out');
          const inStock = !soldOutBadge;

          const imgNodes = card.querySelectorAll('.product-item__image-figure img.img');
          const images = Array.from(imgNodes)
            .map(img => {
              let url = (img as HTMLImageElement).src || "";
              if (!url || url.includes('data:image')) {
                url = img.getAttribute('data-src') || "";
              }
              if (!url || url.includes('data:image')) {
                const srcset = img.getAttribute('srcset') || "";
                if (srcset) {
                  url = srcset.split(',')[0].trim().split(' ')[0];
                }
              }
              if (url.startsWith('//')) {
                url = `https:${url}`;
              }
              return url;
            })
            .filter(url => url.includes('cdn.shopify.com') || url.includes('kyari.co/cdn'))
            .filter((value, index, self) => self.indexOf(value) === index); 

          return {
            sourceUrl,
            productId,
            name,
            price: currentPrice,
            secondaryPrice,
            inStock,
            images,
          };
        }).filter(plant => plant.name !== "Unknown"); 
      }, baseUrl);

      // [BATCH UPGRADE 4]: Push the plants from this specific page into the master list
      masterPlantList.push(...pagePlants);
      console.log(`✔️ Grabbed ${pagePlants.length} plants from this page.`);

    } catch (error) {
      console.error(`❌ Failed to scrape ${url}. Skipping to next. Error:`, error);
      // We use try/catch inside the loop so if one link crashes, the others still run!
    }
  }

  // [BATCH UPGRADE 5]: The Deduplicator. Removes duplicate plants from the master list using their unique productId.
  console.log("\n🧹 Cleaning up duplicate plants...");
  const uniquePlants = masterPlantList.filter((plant, index, self) =>
    index === self.findIndex((target) => target.productId === plant.productId)
  );

  // [BATCH UPGRADE 6]: Write the final, combined, deduplicated array to the hard drive
  fs.writeFileSync('./scripts/collection_plants.json', JSON.stringify(uniquePlants, null, 2));
  console.log(`\n✅ BATCH COMPLETE! Saved ${uniquePlants.length} unique plants to collection_plants.json`);

  await browser.close();
}

// Pass all 5-6 of your links into this array
const collectionUrls = [
  'https://kyari.co/',
  'https://kyari.co/collections/air-purifying-plants',
  'https://kyari.co/collections/vastu-plants',
  'https://kyari.co/collections/office-plants',
  'https://kyari.co/collections/living-room-plants',
  'https://kyari.co/collections/balcony-plants',
  'http://kyari.co/collections/mood-improving-plants',
  'https://kyari.co/collections/indoor-plants',
  'http://kyari.co/collections/plants-1/',
  'https://kyari.co/pages/deal-of-the-day',
  'https://kyari.co/collections/10-inch-pot',
  'https://kyari.co/collections/8-inch-pot',
  'https://kyari.co/collections/aura-planter',
  'https://kyari.co/collections/aura-planter',
  // Add as many links here as you want
];

scrapeCollections(collectionUrls).catch(err => console.error("❌ Fatal Error:", err));