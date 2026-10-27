CREATE TABLE `admin_users` (
	`user_id` text PRIMARY KEY NOT NULL,
	`granted_by` text,
	`granted_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`granted_by`) REFERENCES `auth_user`(`id`) ON UPDATE no action ON DELETE set null
);
