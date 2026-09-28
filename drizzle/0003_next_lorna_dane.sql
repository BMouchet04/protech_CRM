CREATE TABLE `service_centers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
PRAGMA defer_foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text,
	`site_id` text,
	`owner_id` text NOT NULL,
	`contact_type` text DEFAULT 'BUSINESS' NOT NULL,
	`relationship_status` text DEFAULT 'Prospect' NOT NULL,
	`source` text,
	`origin_center_id` text,
	`email_normalized` text,
	`phone_normalized` text,
	`name_normalized` text NOT NULL,
	`payload` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`site_id`) REFERENCES `account_sites`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`origin_center_id`) REFERENCES `service_centers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_contacts`("id", "account_id", "site_id", "owner_id", "contact_type", "relationship_status", "source", "origin_center_id", "email_normalized", "phone_normalized", "name_normalized", "payload", "created_at", "updated_at", "deleted_at", "deleted_by") SELECT "id", "account_id", "site_id", "owner_id", 'BUSINESS', CASE WHEN json_extract("payload", '$.status')='Actif' THEN 'Client actif' WHEN json_extract("payload", '$.status')='Inactif' THEN 'Inactif' ELSE 'Prospect' END, NULL, NULL, "email_normalized", "phone_normalized", "name_normalized", "payload", "created_at", "updated_at", "deleted_at", "deleted_by" FROM `contacts`;--> statement-breakpoint
DROP TABLE `contacts`;--> statement-breakpoint
ALTER TABLE `__new_contacts` RENAME TO `contacts`;--> statement-breakpoint
CREATE INDEX `idx_contacts_email` ON `contacts` (`email_normalized`);--> statement-breakpoint
CREATE INDEX `idx_contacts_phone` ON `contacts` (`phone_normalized`);--> statement-breakpoint
CREATE INDEX `idx_contacts_account` ON `contacts` (`account_id`);--> statement-breakpoint
CREATE INDEX `idx_contacts_center` ON `contacts` (`origin_center_id`);--> statement-breakpoint
CREATE TABLE `__new_opportunities` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text,
	`site_id` text,
	`primary_contact_id` text,
	`customer_type` text DEFAULT 'B2B' NOT NULL,
	`center_id` text,
	`owner_id` text NOT NULL,
	`pipeline_id` text NOT NULL,
	`stage_id` text NOT NULL,
	`status` text NOT NULL,
	`native_amount` real NOT NULL,
	`currency` text NOT NULL,
	`next_action_date` text,
	`exchange_rate_snapshot` real,
	`exchange_rate_date` text,
	`amount_eur` real,
	`payload` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`site_id`) REFERENCES `account_sites`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`primary_contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`center_id`) REFERENCES `service_centers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pipeline_id`) REFERENCES `pipelines`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`stage_id`) REFERENCES `pipeline_stages`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_opportunities`("id", "account_id", "site_id", "primary_contact_id", "customer_type", "center_id", "owner_id", "pipeline_id", "stage_id", "status", "native_amount", "currency", "next_action_date", "exchange_rate_snapshot", "exchange_rate_date", "amount_eur", "payload", "created_at", "updated_at", "deleted_at", "deleted_by") SELECT "id", "account_id", "site_id", "primary_contact_id", 'B2B', NULL, "owner_id", "pipeline_id", "stage_id", "status", "native_amount", "currency", "next_action_date", "exchange_rate_snapshot", "exchange_rate_date", "amount_eur", "payload", "created_at", "updated_at", "deleted_at", "deleted_by" FROM `opportunities`;--> statement-breakpoint
DROP TABLE `opportunities`;--> statement-breakpoint
ALTER TABLE `__new_opportunities` RENAME TO `opportunities`;--> statement-breakpoint
CREATE INDEX `idx_opps_owner` ON `opportunities` (`owner_id`);--> statement-breakpoint
CREATE INDEX `idx_opps_stage` ON `opportunities` (`stage_id`);--> statement-breakpoint
CREATE INDEX `idx_opps_next_action` ON `opportunities` (`next_action_date`);--> statement-breakpoint
CREATE INDEX `idx_opps_account` ON `opportunities` (`account_id`);--> statement-breakpoint
PRAGMA defer_foreign_keys=OFF;
