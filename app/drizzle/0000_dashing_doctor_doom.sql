CREATE TYPE "public"."category_type" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TYPE "public"."entry_type" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"display_name" text,
	"currency" text DEFAULT 'BRL' NOT NULL,
	"locale" text DEFAULT 'pt-BR' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "profiles_currency_len_check" CHECK (char_length("profiles"."currency") = 3)
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"name" text NOT NULL,
	"type" "category_type" NOT NULL,
	"color" text NOT NULL,
	"icon" text,
	"is_archived" boolean DEFAULT false NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_not_blank" CHECK (char_length(trim("categories"."name")) > 0),
	CONSTRAINT "categories_scope_check" CHECK ((("categories"."is_system" = true and "categories"."user_id" is null) or ("categories"."is_system" = false and "categories"."user_id" is not null)))
);
--> statement-breakpoint
CREATE TABLE "entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"type" "entry_type" NOT NULL,
	"amount_cents" integer NOT NULL,
	"description" text NOT NULL,
	"notes" text,
	"entry_date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "entries_amount_positive" CHECK ("entries"."amount_cents" > 0),
	CONSTRAINT "entries_description_not_blank" CHECK (char_length(trim("entries"."description")) > 0)
);
--> statement-breakpoint
ALTER TABLE "entries" ADD CONSTRAINT "entries_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "categories_system_unique_idx" ON "categories" USING btree ("type",lower("name")) WHERE "categories"."is_system" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "categories_user_unique_idx" ON "categories" USING btree ("user_id","type",lower("name")) WHERE "categories"."is_system" = false;--> statement-breakpoint
CREATE INDEX "categories_system_list_idx" ON "categories" USING btree ("type","is_archived","name") WHERE "categories"."is_system" = true;--> statement-breakpoint
CREATE INDEX "categories_user_list_idx" ON "categories" USING btree ("user_id","type","is_archived","name") WHERE "categories"."is_system" = false;--> statement-breakpoint
CREATE INDEX "entries_user_date_idx" ON "entries" USING btree ("user_id","entry_date");--> statement-breakpoint
CREATE INDEX "entries_user_type_date_idx" ON "entries" USING btree ("user_id","type","entry_date");--> statement-breakpoint
CREATE INDEX "entries_user_category_date_idx" ON "entries" USING btree ("user_id","category_id","entry_date");