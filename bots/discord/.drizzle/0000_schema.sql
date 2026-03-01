CREATE TABLE `applied_presets` (
	`member` text NOT NULL,
	`guild` text NOT NULL,
	`roles` text DEFAULT '[]' NOT NULL,
	`preset` text NOT NULL,
	`until` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_composite` ON `applied_presets` (`member`,`preset`,`guild`);--> statement-breakpoint
CREATE TABLE `responses` (
	`reply` text PRIMARY KEY NOT NULL,
	`channel` text NOT NULL,
	`guild` text NOT NULL,
	`ref` text NOT NULL,
	`label` text NOT NULL,
	`text` text NOT NULL,
	`by` text
);
