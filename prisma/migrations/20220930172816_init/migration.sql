/*
  Warnings:

  - Added the required column `lastNotification` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastNotification" TIMESTAMP(3) NOT NULL;
