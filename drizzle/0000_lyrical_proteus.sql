CREATE TABLE `games` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titleId` text NOT NULL,
	`name` text NOT NULL,
	`bannerUrl` text,
	`releaseDate` text,
	`category` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `games_titleId_unique` ON `games` (`titleId`);