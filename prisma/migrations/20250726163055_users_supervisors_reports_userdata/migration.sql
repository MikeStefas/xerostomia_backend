/*
  Warnings:

  - You are about to drop the column `age` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "age",
DROP COLUMN "firstName",
DROP COLUMN "gender",
DROP COLUMN "lastName";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT '-',
ADD COLUMN     "institution" TEXT NOT NULL DEFAULT '-',
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT '-';

-- CreateTable
CREATE TABLE "UserData" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("id")
);
