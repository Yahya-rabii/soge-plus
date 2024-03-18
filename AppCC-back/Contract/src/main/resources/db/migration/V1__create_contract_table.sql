CREATE TABLE IF NOT EXISTS `contract` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `type` varchar(50),
    `start_date` timestamp,
    `duration` int,
    `client_id` BIGINT NOT NULL
);


