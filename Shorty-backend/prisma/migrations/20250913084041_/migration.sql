/*
  Warnings:

  - Added the required column `shortioIdString` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Link" ADD COLUMN     "shortioIdString" TEXT NOT NULL;
