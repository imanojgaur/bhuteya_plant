import fs from 'node:fs';
import { chromium } from 'playwright';
import type { PlantData } from '@/types';


async function scrapeCollections(urls: string[]) {
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
  });

  const masterPlantList: PlantData[] = [];
  const baseUrl = "https://kyari.co";

  for (const url of urls) {
 
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
    const categorySlug = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : "home";

    console.log(`\n🚚 Navigating to Catalog: [${categorySlug}]...`);
    
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForSelector('.product-item', { timeout: 15000 });

      console.log("📜 Scrolling slowly to force image hydration...");
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

      const pagePlants: PlantData[] = await page.evaluate(({ base, currentCategory }) => {
        const productCards = document.querySelectorAll('.product-item');
        
        return Array.from(productCards).map(card => {
          const nameEl = card.querySelector('.product-item__title');
          const name = nameEl ? nameEl.textContent?.trim() || "Unknown" : "Unknown";

          const idInput = card.querySelector('input[name="product-id"]');
          const shopifyId = idInput ? (idInput as HTMLInputElement).value : card.id.replace('product-item-', '');

          const linkEl = card.querySelector('a.product-item__image');
          const route = linkEl ? linkEl.getAttribute('href') : "";
          

          const slugParts = route ? route.split('/').filter(Boolean) : [];
          const plantSlug = slugParts.length > 0 ? slugParts[slugParts.length - 1] : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

          const productUrl = route ? `${base}${route}` : "";

          const priceEl = card.querySelector('.product-price--original');
          const priceText = priceEl ? priceEl.textContent || "0" : "0";
         
          const currentPrice = (parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0) * 100;

          const cutPriceEl = card.querySelector('.product-price--compare'); 
          const cutPriceText = cutPriceEl ? cutPriceEl.textContent || "0" : "0";
          const compareAtPrice = (parseInt(cutPriceText.replace(/[^0-9]/g, ''), 10) || (currentPrice / 100)) * 100;

          const soldOutBadge = card.querySelector('.badge--sold-out');
          const inStock = !soldOutBadge;

          const imgNodes = card.querySelectorAll('.product-item__image-figure img.img');
          const images = Array.from(imgNodes)
            .map(img => {
              let imgUrl = (img as HTMLImageElement).src || "";
              if (!imgUrl || imgUrl.includes('data:image')) {
                imgUrl = img.getAttribute('data-src') || "";
              }
              if (!imgUrl || imgUrl.includes('data:image')) {
                const srcset = img.getAttribute('srcset') || "";
                if (srcset) {
                  imgUrl = srcset.split(',')[0].trim().split(' ')[0];
                }
              }
              if (imgUrl.startsWith('//')) {
                imgUrl = `https:${imgUrl}`;
              }
              return imgUrl;
            })
            .filter(imgUrl => imgUrl.includes('cdn.shopify.com') || imgUrl.includes('kyari.co/cdn'))
            .filter((value, index, self) => self.indexOf(value) === index); 

          const description = "";

          // Keys explicitly match the Prisma Schema!
          return {
            shopifyId,
            name,
            slug: plantSlug,
            price: currentPrice,
            compareAtPrice,
            inStock,
            images,
            productUrl,
            description,
            categories: [currentCategory] 
          };
        }).filter(plant => plant.name !== "Unknown"); 
      }, { base: baseUrl, currentCategory: categorySlug });

      // rip off small batch(...)
      masterPlantList.push(...pagePlants);
      console.log(`✔️ Grabbed ${pagePlants.length} plants, tagged as [${categorySlug}].`);

    } catch (error) {
      console.error(`❌ Failed to scrape ${url}. Skipping to next. Error:`, error);
    }
  }

  console.log("\n🧹 Merging categories for duplicate plants...");
  
  const plantDictionary = new Map<string, PlantData>();

  for (const plant of masterPlantList) {
      const existingPlant = plantDictionary.get(plant.shopifyId);
      // 2. TypeScript Type Narrowing: If it exists, it's definitely not undefined
    if (existingPlant) {
      const newCategory = plant.categories[0]; 
      
      if (!existingPlant.categories.includes(newCategory)) {
        existingPlant.categories.push(newCategory);
      }
    } else {
      // 3. If it returned undefined, it's new. Add it to the dictionary.
      plantDictionary.set(plant.shopifyId, plant);
    }
  }

  const finalSmartPlants = Array.from(plantDictionary.values());

  fs.writeFileSync('./scraper/collection_plants.json', JSON.stringify(finalSmartPlants, null, 2));
  console.log(`\n✅ BATCH COMPLETE! Saved ${finalSmartPlants.length} perfectly mapped plants to JSON.`);

  await browser.close();
}

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
  'https://kyari.co/collections/aura-planter'
];

scrapeCollections(collectionUrls).catch(err => console.error("❌ Fatal Error:", err));          