CREATE TYPE "care_level" AS ENUM (
  'Beginner',
  'Expert'
);

CREATE TYPE "staff_role" AS ENUM (
  'admin',
  'warehouse_manager',
  'delivery_boy',
  'plant_expert'
);

CREATE TYPE "order_status" AS ENUM (
  'pending',
  'shipped',
  'delivered',
  'cancelled'
);

CREATE TYPE "service_type" AS ENUM (
  'installation',
  'maintenance',
  'repair'
);

CREATE TYPE "booking_status" AS ENUM (
  'scheduled',
  'completed',
  'cancelled'
);

CREATE TYPE "ticket_status" AS ENUM (
  'open',
  'reviewing',
  'resolved'
);

CREATE TYPE "return_status" AS ENUM (
  'pending',
  'approved',
  'rejected'
);

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY,
  "firstname" varchar,
  "lastname" varchar,
  "email" varchar UNIQUE,
  "password" varchar,
  "phonenumber" varchar,
  "role" varchar DEFAULT 'customer',
  "has_pets" bool,
  "is_active" bool DEFAULT true,
  "verified_at" timestamp,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "account" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid,
  "type" varchar,
  "provider" varchar,
  "provider_account_id" varchar,
  "refresh_token" text,
  "access_token" text,
  "expires_at" int,
  "token_type" varchar,
  "scope" varchar,
  "id_token" text,
  "session_state" varchar
);

CREATE TABLE "addresses" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid,
  "street" varchar,
  "city" varchar,
  "state" varchar,
  "zip_code" varchar,
  "type" varchar
);

CREATE TABLE "session" (
  "id" uuid PRIMARY KEY,
  "session_token" varchar UNIQUE,
  "user_id" uuid,
  "expires" timestamp
);

CREATE TABLE "verification_token" (
  "identifier" varchar,
  "token" varchar UNIQUE,
  "expires" timestamp
);

CREATE TABLE "plants" (
  "id" uuid PRIMARY KEY,
  "category_id" uuid,
  "name" varchar,
  "price" decimal,
  "description" text,
  "stock_quantity" int,
  "care_difficulty" care_level
);

CREATE TABLE "plant_category" (
  "id" uuid PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "orders" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid,
  "total_price" decimal,
  "status" order_status,
  "created_at" timestamp,
  "delivery_at" timestamp,
  "source_location" varchar,
  "delivery_staff_id" uuid
);

CREATE TABLE "order_items" (
  "id" uuid PRIMARY KEY,
  "order_id" uuid,
  "plant_id" uuid,
  "quantity" int,
  "price_at_purchase" decimal
);

CREATE TABLE "cart_items" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid,
  "plant_id" uuid,
  "quantity" int
);

CREATE TABLE "staff" (
  "id" uuid PRIMARY KEY,
  "name" varchar,
  "email" varchar UNIQUE,
  "password" varchar,
  "role" staff_role,
  "current_location" varchar,
  "is_available" bool DEFAULT true
);

CREATE TABLE "service_bookings" (
  "id" uuid PRIMARY KEY,
  "order_id" uuid,
  "assigned_staff_id" uuid,
  "service_type" service_type,
  "scheduled_date" timestamp,
  "status" booking_status
);

CREATE TABLE "care_logs" (
  "id" uuid PRIMARY KEY,
  "booking_id" uuid,
  "action_taken" text,
  "notes" text,
  "created_at" timestamp
);

CREATE TABLE "health_tickets" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid,
  "plant_id" uuid,
  "description" text,
  "status" ticket_status,
  "created_at" timestamp
);

CREATE TABLE "media" (
  "id" uuid PRIMARY KEY,
  "ticket_id" uuid,
  "file_url" varchar,
  "created_at" timestamp
);

CREATE TABLE "returns" (
  "id" uuid PRIMARY KEY,
  "order_item_id" uuid,
  "reason" text,
  "status" return_status,
  "request_date" timestamp
);

CREATE UNIQUE INDEX ON "account" ("provider", "provider_account_id");

CREATE UNIQUE INDEX ON "verification_token" ("identifier", "token");

ALTER TABLE "account" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "addresses" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "session" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "plants" ADD FOREIGN KEY ("category_id") REFERENCES "plant_category" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "orders" ADD FOREIGN KEY ("delivery_staff_id") REFERENCES "staff" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "order_items" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "order_items" ADD FOREIGN KEY ("plant_id") REFERENCES "plants" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "cart_items" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "cart_items" ADD FOREIGN KEY ("plant_id") REFERENCES "plants" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "service_bookings" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "service_bookings" ADD FOREIGN KEY ("assigned_staff_id") REFERENCES "staff" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "care_logs" ADD FOREIGN KEY ("booking_id") REFERENCES "service_bookings" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "health_tickets" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "health_tickets" ADD FOREIGN KEY ("plant_id") REFERENCES "plants" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "media" ADD FOREIGN KEY ("ticket_id") REFERENCES "health_tickets" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "returns" ADD FOREIGN KEY ("order_item_id") REFERENCES "order_items" ("id") DEFERRABLE INITIALLY IMMEDIATE;
