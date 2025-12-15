CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."car_status" AS ENUM('active', 'maintenance', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE');--> statement-breakpoint
CREATE TYPE "public"."neutered" AS ENUM('Y', 'N', 'UNKNOWN');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('unpaid', 'paid', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."reg_status" AS ENUM('Y', 'N');--> statement-breakpoint
CREATE TYPE "public"."service_type" AS ENUM('SHUTTLE', 'CARE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."species" AS ENUM('DOG', 'CAT');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"car_id" uuid NOT NULL,
	"service_type" "service_type" NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"pickup_address" text NOT NULL,
	"dropoff_address" text NOT NULL,
	"status" "booking_status" DEFAULT 'pending' NOT NULL,
	"payment_status" "payment_status" DEFAULT 'unpaid' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cars" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"region" text NOT NULL,
	"status" "car_status" DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pets" (
	"pet_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"pet_name" text NOT NULL,
	"species" "species" NOT NULL,
	"reg_status" "reg_status" NOT NULL,
	"reg_num" text,
	"breed" text NOT NULL,
	"gender" "gender" NOT NULL,
	"neutered" "neutered" NOT NULL,
	"birth_date" date NOT NULL,
	"adoption_date" date,
	"weight_kg" numeric(4, 2),
	"fur_color" text,
	"health_concerns" text,
	"profile_photo_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pets_reg_num_unique" UNIQUE("reg_num")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"sns_provider" text NOT NULL,
	"sns_id" text NOT NULL,
	"nickname" text,
	"email" text,
	"avatar_url" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_sns_id_unique" UNIQUE("sns_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_car_id_cars_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."cars"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;