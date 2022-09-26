-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('google', 'custom');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authentication" "AuthType" NOT NULL DEFAULT 'custom';
