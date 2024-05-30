CREATE TABLE IF NOT EXISTS `contract` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `creation_date` timestamp,
    `payment_duration` int,
    `client_id` varchar(50) NOT NULL,
    `loan_id` BIGINT NOT NULL,
    `is_signed` BOOLEAN NOT NULL DEFAULT FALSE
);
