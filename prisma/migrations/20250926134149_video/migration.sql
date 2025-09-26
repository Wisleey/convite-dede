-- CreateEnum
CREATE TYPE "public"."band_type" AS ENUM ('PRINCIPAL', 'ESPECIAL', 'ABERTURA', 'ENCERRAMENTO');

-- CreateTable
CREATE TABLE "public"."videos" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "video_url" VARCHAR(500) NOT NULL,
    "thumbnail_url" VARCHAR(500),
    "band_type" "public"."band_type" NOT NULL DEFAULT 'PRINCIPAL',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER,
    "file_size" BIGINT,
    "mime_type" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "event_settings_id" INTEGER,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."videos" ADD CONSTRAINT "videos_event_settings_id_fkey" FOREIGN KEY ("event_settings_id") REFERENCES "public"."EventSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
