/*
  Warnings:

  - Added the required column `painPercentage` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salivaPercentage` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teethPercentage` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tonguePercentage` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "painPercentage" INTEGER NOT NULL,
ADD COLUMN     "salivaPercentage" INTEGER NOT NULL,
ADD COLUMN     "teethPercentage" INTEGER NOT NULL,
ADD COLUMN     "tonguePercentage" INTEGER NOT NULL;
