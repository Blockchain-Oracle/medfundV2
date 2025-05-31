CREATE TABLE "campaign_updates" (
	"id" text PRIMARY KEY NOT NULL,
	"campaign_id" text NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"update_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "story_content" text;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "wallet_address" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "wallet_address" text;--> statement-breakpoint
ALTER TABLE "campaign_updates" ADD CONSTRAINT "campaign_updates_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;