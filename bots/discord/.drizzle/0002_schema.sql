CREATE UNIQUE INDEX `reminders_remind_at_idx` ON `reminders` (`remind_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `reminders_creator_guild_idx` ON `reminders` (`creator`,`guild`);