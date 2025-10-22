CREATE TABLE `versions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`version` varchar(50) NOT NULL,
	`releaseNotes` text,
	`releasedAt` timestamp NOT NULL DEFAULT (now()),
	`isCurrent` int NOT NULL DEFAULT 0,
	CONSTRAINT `versions_id` PRIMARY KEY(`id`)
);
