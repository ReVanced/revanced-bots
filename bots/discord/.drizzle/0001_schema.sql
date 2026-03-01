CREATE TABLE `reminders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`creator` text NOT NULL,
	`target` text NOT NULL,
	`guild` text NOT NULL,
	`channel` text NOT NULL,
	`message` text NOT NULL,
	`created_at` integer NOT NULL,
	`remind_at` integer NOT NULL,
	`interval_seconds` integer NOT NULL,
	`count` integer DEFAULT 0 NOT NULL
);
