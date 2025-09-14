/*
  Warnings:

  - A unique constraint covering the columns `[shortioId]` on the table `Link` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shortioId` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Link" ADD COLUMN     "shortioId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Link_shortioId_key" ON "public"."Link"("shortioId");
