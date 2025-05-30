CREATE TYPE "public"."campaign_category" AS ENUM('surgery', 'treatment', 'therapy', 'emergency', 'medication', 'rehabilitation', 'other');--> statement-breakpoint
CREATE TYPE "public"."campaign_status" AS ENUM('pending', 'active', 'completed', 'rejected', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."donation_status" AS ENUM('pending', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."record_type" AS ENUM('diagnosis', 'test_result', 'prescription', 'treatment', 'surgery', 'consultation', 'other');--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"goal" numeric(10, 2) NOT NULL,
	"raised" numeric(10, 2) DEFAULT '0' NOT NULL,
	"category" "campaign_category" NOT NULL,
	"status" "campaign_status" DEFAULT 'pending' NOT NULL,
	"is_urgent" boolean DEFAULT false,
	"image_url" text,
	"location" varchar(255),
	"documents_url" text[],
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "donations" (
	"id" text PRIMARY KEY NOT NULL,
	"campaign_id" text NOT NULL,
	"user_id" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" "donation_status" DEFAULT 'pending' NOT NULL,
	"message" text,
	"anonymous" boolean DEFAULT false,
	"transaction_id" text,
	"payment_method" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"password" varchar(255),
	"phone" varchar(50),
	"address" text,
	"avatar_url" text,
	"is_verified" boolean DEFAULT false,
	"role" varchar(50) DEFAULT 'user',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "medical_records" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"record_type" "record_type" NOT NULL,
	"file_url" text,
	"is_shared" boolean DEFAULT false,
	"shared_with" text[],
	"record_date" timestamp NOT NULL,
	"provider" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payment_methods" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"last4" varchar(4),
	"expiry_month" integer,
	"expiry_year" integer,
	"is_default" boolean DEFAULT false,
	"billing_address" text,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;