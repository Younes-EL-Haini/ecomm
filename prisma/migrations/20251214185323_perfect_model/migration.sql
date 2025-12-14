/*
  Warnings:

  - Made the column `categoryId` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `type` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VariantType" AS ENUM ('SIZE', 'COLOR');

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductImage" ALTER COLUMN "position" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "type" "VariantType" NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
