-- CreateTable
CREATE TABLE "public"."Rsvp" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" VARCHAR(190),
    "phone" VARCHAR(30),
    "guests" INTEGER NOT NULL DEFAULT 1,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rsvp_pkey" PRIMARY KEY ("id")
);
