-- CreateTable
CREATE TABLE `ConsumeHistory` (
    `user_id` INTEGER NOT NULL,
    `savings_rate` DECIMAL(5, 2) NOT NULL,
    `investment_rate` DECIMAL(5, 2) NOT NULL,
    `leisure_rate` DECIMAL(5, 2) NOT NULL,
    `living_expense_rate` DECIMAL(5, 2) NOT NULL,
    `other_rate` DECIMAL(5, 2) NOT NULL,

    INDEX `ConsumeHistory_user_id_fkey`(`user_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserFinancialProduct` (
    `user_product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `current_value` BIGINT NOT NULL,
    `product_end_date` DATETIME(3) NULL,
    `product_id` INTEGER NOT NULL,

    INDEX `UserFinancialProduct_user_id_fkey`(`user_id`),
    INDEX `UserFinancialProduct_product_id_fkey`(`product_id`),
    PRIMARY KEY (`user_product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinancialProduct` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(191) NOT NULL,
    `institution_name` VARCHAR(191) NOT NULL,
    `risk_level` ENUM('VERY_HIGH', 'HIGH', 'LITTLE_HIGH', 'MEDIUM', 'LOW', 'VERY_LOW') NOT NULL,
    `category` ENUM('SAVINGS', 'DOMESTIC_STOCKS', 'DEVELOPED_STOCKS', 'EMERGING_STOCKS', 'DOMESTIC_BONDS', 'FOREIGN_BONDS', 'ALTERNATIVE', 'CASH', 'LOAN') NOT NULL,

    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserMatchLog` (
    `match_id` INTEGER NOT NULL AUTO_INCREMENT,
    `sent_id` INTEGER NOT NULL,
    `receive_id` INTEGER NOT NULL,
    `match_status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL,

    INDEX `UserMatchLog_receive_id_fkey`(`receive_id`),
    INDEX `UserMatchLog_sent_id_fkey`(`sent_id`),
    PRIMARY KEY (`match_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRecoLog` (
    `recommend_id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `base_user` INTEGER NOT NULL,
    `candidate_id` INTEGER NOT NULL,
    `like_status` BOOLEAN NOT NULL DEFAULT false,

    INDEX `UserRecoLog_base_user_fkey`(`base_user`),
    PRIMARY KEY (`recommend_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Loan` (
    `loan_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `loan_name` VARCHAR(191) NOT NULL,
    `loan_institution_name` VARCHAR(191) NOT NULL,
    `loan_balance` BIGINT NOT NULL,
    `loan_rate` DECIMAL(5, 2) NOT NULL,
    `loan_end_date` DATETIME(3) NOT NULL,

    INDEX `Loan_user_id_fkey`(`user_id`),
    PRIMARY KEY (`loan_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatMessage` (
    `message_id` INTEGER NOT NULL AUTO_INCREMENT,
    `room_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `regdate` DATETIME(3) NOT NULL,

    INDEX `ChatMessage_room_id_fkey`(`room_id`),
    INDEX `ChatMessage_user_id_fkey`(`user_id`),
    PRIMARY KEY (`message_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatRoom` (
    `room_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `user_id2` INTEGER NOT NULL,
    `is_agree` BOOLEAN NULL,
    `is_agree2` BOOLEAN NULL,
    `last_message` VARCHAR(191) NULL,
    `last_message_at` DATETIME(3) NULL,

    INDEX `ChatRoom_user_id_fkey`(`user_id`),
    INDEX `ChatRoom_user_id2_fkey`(`user_id2`),
    PRIMARY KEY (`room_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PairingAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `car_budget` BIGINT NOT NULL,
    `date_budget` INTEGER NOT NULL,
    `shoes_budget` INTEGER NOT NULL,
    `preferred_city` VARCHAR(191) NOT NULL,
    `ideal_income_range` ENUM('NEAR_400', 'NEAR_600', 'NEAR_800', 'OVER_1000') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PairingAnswer_user_id_key`(`user_id`),
    INDEX `PairingAnswer_user_id_fkey`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `birth_year` INTEGER NOT NULL,
    `car_value` BIGINT NULL,
    `city` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `current_type` ENUM('안정형', '안정추구형', '위험중립형', '적극투자형', '공격투자형') NULL,
    `description` VARCHAR(100) NULL,
    `gender` ENUM('M', 'F') NOT NULL,
    `goal_amount` BIGINT NULL,
    `goal_period` ENUM('1년 이내', '3년 이내', '5년 이내', '5년 이상') NULL,
    `goal_type` ENUM('내집마련', '목돈마련', '노후자금', '결혼자금') NULL,
    `has_car` BOOLEAN NULL DEFAULT false,
    `has_house` BOOLEAN NULL DEFAULT false,
    `house_value` BIGINT NULL,
    `job` VARCHAR(20) NULL,
    `nickname` VARCHAR(10) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `preferred_type` ENUM('안정형', '안정추구형', '위험중립형', '적극투자형', '공격투자형') NULL,
    `profile_image` VARCHAR(191) NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subject` (
    `subject_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `features` VARCHAR(191) NOT NULL,
    `period` VARCHAR(191) NOT NULL,
    `amount` VARCHAR(191) NOT NULL,
    `interest_rate` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `subject_type` VARCHAR(191) NOT NULL,
    `subject_url` VARCHAR(191) NULL,

    PRIMARY KEY (`subject_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quiz` (
    `quiz_id` INTEGER NOT NULL AUTO_INCREMENT,
    `subject_id` INTEGER NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `explanation` VARCHAR(191) NOT NULL,
    `answer` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Quiz_subject_id_idx`(`subject_id`),
    PRIMARY KEY (`quiz_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserQuizLog` (
    `quiz_log_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_passed` BOOLEAN NOT NULL,

    INDEX `UserQuizLog_user_subject_idx`(`user_id`, `subject_id`),
    INDEX `UserQuizLog_subject_id_fkey`(`subject_id`),
    INDEX `UserQuizLog_user_id_fkey`(`user_id`),
    PRIMARY KEY (`quiz_log_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ConsumeHistory` ADD CONSTRAINT `ConsumeHistory_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserFinancialProduct` ADD CONSTRAINT `UserFinancialProduct_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `FinancialProduct`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserFinancialProduct` ADD CONSTRAINT `UserFinancialProduct_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMatchLog` ADD CONSTRAINT `UserMatchLog_receive_id_fkey` FOREIGN KEY (`receive_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMatchLog` ADD CONSTRAINT `UserMatchLog_sent_id_fkey` FOREIGN KEY (`sent_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRecoLog` ADD CONSTRAINT `UserRecoLog_base_user_fkey` FOREIGN KEY (`base_user`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `Loan_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatMessage` ADD CONSTRAINT `ChatMessage_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `ChatRoom`(`room_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatMessage` ADD CONSTRAINT `ChatMessage_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatRoom` ADD CONSTRAINT `ChatRoom_user_id2_fkey` FOREIGN KEY (`user_id2`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatRoom` ADD CONSTRAINT `ChatRoom_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PairingAnswer` ADD CONSTRAINT `PairingAnswer_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quiz` ADD CONSTRAINT `Quiz_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject`(`subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserQuizLog` ADD CONSTRAINT `UserQuizLog_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject`(`subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserQuizLog` ADD CONSTRAINT `UserQuizLog_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
