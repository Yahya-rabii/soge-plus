CREATE TABLE IF NOT EXISTS `account` (
                                        `id` BIGINT NOT NULL  AUTO_INCREMENT PRIMARY KEY,
                                        `account_type` varchar(50) NOT NULL,
                                        `account_holder_id` varchar(50) NOT NULL,
                                        `account_holder_rib` varchar(255) NOT NULL,
                                        `balance` DOUBLE NOT NULL,
                                        `beneficiaries_ids` JSON
);
