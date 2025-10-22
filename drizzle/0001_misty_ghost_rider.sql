CREATE TABLE `devices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`deviceId` varchar(255) NOT NULL,
	`notificationEnabled` int NOT NULL DEFAULT 0,
	`userAgent` text,
	`lastSeen` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `devices_id` PRIMARY KEY(`id`),
	CONSTRAINT `devices_deviceId_unique` UNIQUE(`deviceId`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`deliveredCount` int NOT NULL DEFAULT 0,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
