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
  compareAtPrice: number | null; 
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

interface PlantCardData extends Pick<PlantData, "name" | "slug" | "price" | "compareAtPrice"> {
  id: string;             
  stockQuantity: number;  
  categories: {           
      name: string;
      slug: string;
  }[]; 
  images: ImageTypes[];   
}

export type { 
  PlantData, 
  ImageTypes, 
  ScrapedPlantData, 
  EnrichedPlantData,
  PlantCardData 
}