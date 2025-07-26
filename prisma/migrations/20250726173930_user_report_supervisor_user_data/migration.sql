/*
  Warnings:

  - You are about to drop the column `dob` on the `UserData` table. All the data in the column will be lost.
  - Added the required column `yearOfBirth` to the `UserData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserData" DROP COLUMN "dob",
ADD COLUMN     "yearOfBirth" INTEGER NOT NULL;
