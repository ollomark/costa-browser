CREATE TABLE `sites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`url` text NOT NULL,
	`title` varchar(255) NOT NULL,
	`favicon` text,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sites_id` PRIMARY KEY(`id`)
);
