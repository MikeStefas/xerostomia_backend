/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "userID" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "userID" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userID");
