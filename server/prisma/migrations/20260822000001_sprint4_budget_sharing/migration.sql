ALTER TABLE "trips" ADD COLUMN "budget_amount" DOUBLE PRECISION;
ALTER TABLE "trips" ADD COLUMN "budget_currency" VARCHAR(3);

CREATE TYPE "ExpenseCategory" AS ENUM ('TRANSPORT', 'STAY', 'ACTIVITY', 'MEAL', 'OTHER');

CREATE TABLE "trip_expenses" (
  "id" SERIAL NOT NULL,
  "trip_id" INTEGER NOT NULL,
  "trip_stop_id" INTEGER,
  "trip_activity_id" INTEGER,
  "category" "ExpenseCategory" NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "currency" VARCHAR(3) NOT NULL,
  "date" DATE NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "trip_expenses_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "saved_destinations" (
  "id" SERIAL NOT NULL,
  "user_id" INTEGER NOT NULL,
  "city_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "saved_destinations_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "trip_shares" (
  "id" SERIAL NOT NULL,
  "trip_id" INTEGER NOT NULL,
  "share_slug" VARCHAR(80) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "trip_shares_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "saved_destinations_user_id_city_id_key" ON "saved_destinations"("user_id", "city_id");
CREATE UNIQUE INDEX "trip_shares_trip_id_key" ON "trip_shares"("trip_id");
CREATE UNIQUE INDEX "trip_shares_share_slug_key" ON "trip_shares"("share_slug");
CREATE INDEX "trip_expenses_trip_id_idx" ON "trip_expenses"("trip_id");
CREATE INDEX "trip_expenses_date_idx" ON "trip_expenses"("date");
CREATE INDEX "trip_expenses_category_idx" ON "trip_expenses"("category");
CREATE INDEX "saved_destinations_user_id_idx" ON "saved_destinations"("user_id");
CREATE INDEX "saved_destinations_city_id_idx" ON "saved_destinations"("city_id");
CREATE INDEX "trip_shares_share_slug_idx" ON "trip_shares"("share_slug");
ALTER TABLE "trip_expenses" ADD CONSTRAINT "trip_expenses_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trip_expenses" ADD CONSTRAINT "trip_expenses_trip_stop_id_fkey" FOREIGN KEY ("trip_stop_id") REFERENCES "trip_stops"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "trip_expenses" ADD CONSTRAINT "trip_expenses_trip_activity_id_fkey" FOREIGN KEY ("trip_activity_id") REFERENCES "trip_activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "saved_destinations" ADD CONSTRAINT "saved_destinations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "saved_destinations" ADD CONSTRAINT "saved_destinations_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trip_shares" ADD CONSTRAINT "trip_shares_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
