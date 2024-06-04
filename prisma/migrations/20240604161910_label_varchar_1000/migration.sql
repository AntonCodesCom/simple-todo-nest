/*
  Warnings:

  - You are about to alter the column `label` on the `Todo` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.

*/
-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "label" SET DATA TYPE VARCHAR(1000);
