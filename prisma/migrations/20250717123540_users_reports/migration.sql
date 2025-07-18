-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "tongue" TEXT NOT NULL,
    "teeth" TEXT NOT NULL,
    "saliva" TEXT NOT NULL,
    "painSolid" TEXT NOT NULL,
    "painLiquid" TEXT NOT NULL,
    "painMixed" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);
