/*
  Warnings:

  - You are about to drop the column `url` on the `plant_images` table. All the data in the column will be lost.
  - You are about to drop the column `sub_category_id` on the `plants` table. All the data in the column will be lost.
  - You are about to drop the `plant_sub_categories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `plant_categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shopifyId]` on the table `plants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `plant_categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `plant_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_id` to the `plant_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secure_url` to the `plant_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `plant_images` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "plant_sub_categories" DROP CONSTRAINT "plant_sub_categories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "plants" DROP CONSTRAINT "plants_sub_category_id_fkey";

-- AlterTable
ALTER TABLE "plant_categories" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "plant_images" DROP COLUMN "url",
ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "public_id" TEXT NOT NULL,
ADD COLUMN     "secure_url" TEXT NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "plants" DROP COLUMN "sub_category_id",
ADD COLUMN     "compare_at_price" INTEGER,
ADD COLUMN     "shopifyId" TEXT,
ALTER COLUMN "description" DROP NOT NULL;

-- DropTable
DROP TABLE "plant_sub_categories";

-- CreateTable
CREATE TABLE "_PlantToPlantCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PlantToPlantCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PlantToPlantCategory_B_index" ON "_PlantToPlantCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "plant_categories_slug_key" ON "plant_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "plants_shopifyId_key" ON "plants"("shopifyId");

-- AddForeignKey
ALTER TABLE "_PlantToPlantCategory" ADD CONSTRAINT "_PlantToPlantCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "plants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlantToPlantCategory" ADD CONSTRAINT "_PlantToPlantCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "plant_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
