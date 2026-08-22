CREATE TYPE "Visibility" AS ENUM ('PRIVATE', 'PUBLIC');

CREATE TABLE "trips" (
  "id" SERIAL NOT NULL,
  "user_id" INTEGER NOT NULL,
  "name" VARCHAR(150) NOT NULL,
  "description" TEXT,
  "cover_photo" TEXT,
  "start_date" DATE NOT NULL,
  "end_date" DATE NOT NULL,
  "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "trip_stops" (
  "id" SERIAL NOT NULL,
  "trip_id" INTEGER NOT NULL,
  "city_id" INTEGER NOT NULL,
  "start_date" DATE NOT NULL,
  "end_date" DATE NOT NULL,
  "order" INTEGER NOT NULL,
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "trip_stops_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "trip_days" (
  "id" SERIAL NOT NULL,
  "trip_id" INTEGER NOT NULL,
  "date" DATE NOT NULL,
  "title" VARCHAR(150),
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "trip_days_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "trip_activities" (
  "id" SERIAL NOT NULL,
  "trip_day_id" INTEGER NOT NULL,
  "activity_id" INTEGER NOT NULL,
  "start_time" VARCHAR(5),
  "end_time" VARCHAR(5),
  "custom_cost" DOUBLE PRECISION,
  "notes" TEXT,
  "sequence" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "trip_activities_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "trip_stops_trip_id_order_key" ON "trip_stops"("trip_id", "order");
CREATE UNIQUE INDEX "trip_days_trip_id_date_key" ON "trip_days"("trip_id", "date");
CREATE UNIQUE INDEX "trip_activities_trip_day_id_sequence_key" ON "trip_activities"("trip_day_id", "sequence");
CREATE INDEX "trips_user_id_idx" ON "trips"("user_id");
CREATE INDEX "trips_start_date_end_date_idx" ON "trips"("start_date", "end_date");
CREATE INDEX "trip_stops_trip_id_idx" ON "trip_stops"("trip_id");
CREATE INDEX "trip_stops_city_id_idx" ON "trip_stops"("city_id");
CREATE INDEX "trip_stops_start_date_end_date_idx" ON "trip_stops"("start_date", "end_date");
CREATE INDEX "trip_days_trip_id_date_idx" ON "trip_days"("trip_id", "date");
CREATE INDEX "trip_activities_trip_day_id_idx" ON "trip_activities"("trip_day_id");
CREATE INDEX "trip_activities_activity_id_idx" ON "trip_activities"("activity_id");

ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "trip_days" ADD CONSTRAINT "trip_days_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trip_activities" ADD CONSTRAINT "trip_activities_trip_day_id_fkey" FOREIGN KEY ("trip_day_id") REFERENCES "trip_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trip_activities" ADD CONSTRAINT "trip_activities_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
