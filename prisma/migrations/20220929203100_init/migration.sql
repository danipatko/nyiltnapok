-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_appointmentId_fkey";

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
