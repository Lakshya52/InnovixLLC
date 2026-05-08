-- AlterTable
ALTER TABLE `blogpost` ADD COLUMN `keyTakeaways` JSON NULL,
    MODIFY `featuredImage` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `image` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isBlocked` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `lastActive` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `image` LONGTEXT NULL;

-- AddForeignKey
ALTER TABLE `ChatMessage` ADD CONSTRAINT `ChatMessage_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
