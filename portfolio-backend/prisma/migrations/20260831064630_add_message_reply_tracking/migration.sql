-- AlterTable
ALTER TABLE `messages` ADD COLUMN `replied` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `repliedAt` DATETIME(3) NULL;
