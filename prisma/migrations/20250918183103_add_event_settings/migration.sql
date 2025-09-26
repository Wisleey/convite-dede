-- CreateTable
CREATE TABLE "public"."EventSettings" (
    "id" SERIAL NOT NULL,
    "event_name" TEXT NOT NULL DEFAULT 'Aniversário de Dedê Sales',
    "event_date" TIMESTAMPTZ(6) NOT NULL,
    "location" TEXT NOT NULL DEFAULT 'Praia de Jacumã, Conde - PB',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventSettings_pkey" PRIMARY KEY ("id")
);
