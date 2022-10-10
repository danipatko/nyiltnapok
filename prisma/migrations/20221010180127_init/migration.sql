/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `totalGroups` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalMembers` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_groupId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "createdAt",
DROP COLUMN "creatorId",
ADD COLUMN     "totalGroups" INTEGER NOT NULL,
ADD COLUMN     "totalMembers" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "groupId",
ADD COLUMN     "appointmentId" INTEGER;

-- DropTable
DROP TABLE "Group";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
