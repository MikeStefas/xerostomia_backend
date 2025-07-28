/*
  Warnings:

  - You are about to drop the column `painLiquid` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `painMixed` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `painSolid` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "painLiquid",
DROP COLUMN "painMixed",
DROP COLUMN "painSolid",
ADD COLUMN     "pain" TEXT NOT NULL DEFAULT '-';
