/*
  Warnings:

  - A unique constraint covering the columns `[shortioIdString]` on the table `Link` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Link_shortioIdString_key" ON "public"."Link"("shortioIdString");
