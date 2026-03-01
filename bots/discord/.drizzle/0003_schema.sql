DROP INDEX `reminders_remind_at_idx`;--> statement-breakpoint
DROP INDEX `reminders_creator_guild_idx`;--> statement-breakpoint
CREATE INDEX `reminders_remind_at_idx` ON `reminders` (`remind_at`);--> statement-breakpoint
CREATE INDEX `reminders_creator_guild_idx` ON `reminders` (`creator`,`guild`);