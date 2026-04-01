type ImageTypes = {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
}

interface PlantData {
  shopifyId: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number;
  inStock: boolean;
  productUrl: string;
  description: string;
  categories: string[]; 
}

interface ScrapedPlantData extends PlantData {
  images: string[];
}

interface EnrichedPlantData extends PlantData {
  images: ImageTypes[];
}


export type { 
  PlantData, 
  ImageTypes, 
  ScrapedPlantData, 
  EnrichedPlantData 
}
