CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint

-- Demo account for hackathon
-- Insert demo user (ON CONFLICT DO NOTHING to avoid duplicates if already exists)
INSERT INTO "user" (
    "id",
    "name",
    "email",
    "email_verified",
    "created_at",
    "updated_at"
) VALUES (
    'demo-user-id-12345',
    'デモユーザー',
    'demo@example.com',
    true,
    now(),
    now()
) ON CONFLICT ("email") DO NOTHING;--> statement-breakpoint

-- Insert demo account with real hashed password (password: demo123456)
-- Using the actual hash format from Better-Auth
INSERT INTO "account" (
    "id",
    "account_id",
    "provider_id",
    "user_id",
    "password",
    "created_at",
    "updated_at"
) VALUES (
    'demo-account-id-12345',
    'demo-user-id-12345',
    'credential',
    'demo-user-id-12345',
    '1ee7b70d04c5d2576c0b717cfcc683cd:ecea880d90701a3e10bcdc2297a2a74f729dc6c72ea7b0d8ad63e51600abf4db5266169a7648a72586599ee5a80686601bab5ce126da4ccbe337ca216ed6cbb1',
    now(),
    now()
) ON CONFLICT ("id") DO NOTHING;