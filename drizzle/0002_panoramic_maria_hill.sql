CREATE TABLE "mbti_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"badge_icon" text NOT NULL,
	"recommend_service_id" integer
);
--> statement-breakpoint
CREATE TABLE "pet_mbti_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"pet_id" uuid NOT NULL,
	"mbti_type_id" integer NOT NULL,
	"score_data" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "pet_mbti_results" ADD CONSTRAINT "pet_mbti_results_pet_id_pets_pet_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("pet_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_mbti_results" ADD CONSTRAINT "pet_mbti_results_mbti_type_id_mbti_types_id_fk" FOREIGN KEY ("mbti_type_id") REFERENCES "public"."mbti_types"("id") ON DELETE no action ON UPDATE no action;