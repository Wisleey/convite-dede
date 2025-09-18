/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Rsvp` table. All the data in the column will be lost.
  - You are about to drop the column `guests` on the `Rsvp` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Rsvp" DROP COLUMN "createdAt",
DROP COLUMN "guests",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "guest_names" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "guests_count" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "will_attend" BOOLEAN NOT NULL DEFAULT true;
