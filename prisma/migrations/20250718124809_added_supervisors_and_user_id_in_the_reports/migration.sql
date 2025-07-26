-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "userID" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Supervisors" (
    "id" SERIAL NOT NULL,
    "clinicianID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "Supervisors_pkey" PRIMARY KEY ("id")
);
