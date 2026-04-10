/*
  Warnings:

  - You are about to drop the column `pain` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `painPercentage` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `saliva` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `salivaPercentage` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `teeth` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `teethPercentage` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `tongue` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `tonguePercentage` on the `Report` table. All the data in the column will be lost.
  - Added the required column `result` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "pain",
DROP COLUMN "painPercentage",
DROP COLUMN "saliva",
DROP COLUMN "salivaPercentage",
DROP COLUMN "teeth",
DROP COLUMN "teethPercentage",
DROP COLUMN "tongue",
DROP COLUMN "tonguePercentage",
ADD COLUMN     "result" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
