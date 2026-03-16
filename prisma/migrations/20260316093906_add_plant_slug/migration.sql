/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `plants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `plants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "plants" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "plants_slug_key" ON "plants"("slug");
