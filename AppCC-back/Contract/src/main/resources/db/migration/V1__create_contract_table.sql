CREATE TABLE IF NOT EXISTS `contract` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `type` varchar(50),
    `creation_date` timestamp,
    `payment_duration` int,
    `client_id` varchar(50) NOT NULL,
    `loan_id` BIGINT NOT NULL
);


