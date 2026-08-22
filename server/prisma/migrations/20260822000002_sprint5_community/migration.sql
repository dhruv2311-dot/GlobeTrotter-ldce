CREATE TABLE "community_posts" (
  "id" SERIAL NOT NULL,
  "user_id" INTEGER NOT NULL,
  "trip_id" INTEGER,
  "title" VARCHAR(180) NOT NULL,
  "content" TEXT NOT NULL,
  "image" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "community_posts_user_id_idx" ON "community_posts"("user_id");
CREATE INDEX "community_posts_trip_id_idx" ON "community_posts"("trip_id");
CREATE INDEX "community_posts_created_at_idx" ON "community_posts"("created_at");

ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;
