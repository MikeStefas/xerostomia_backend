/*
  Warnings:

  - You are about to drop the `Supervisors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Supervisors";

-- CreateTable
CREATE TABLE "Pairs" (
    "id" SERIAL NOT NULL,
    "clinicianID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "Pairs_pkey" PRIMARY KEY ("id")
);
