CREATE TABLE IF NOT EXISTS `loan` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `customer_name` VARCHAR(255),
    `amount` DOUBLE,
    `type` VARCHAR(50),
    `payment_duration` VARCHAR(50),
    `status` VARCHAR(50),
    `user_id` VARCHAR(50),
    `approved` BOOLEAN,
    `signature` LONGBLOB,
    `cin_cart_recto_verso` LONGBLOB,
    `cin_number` VARCHAR(50),
    `tax_id` VARCHAR(50),
    `reception_method` VARCHAR(50),
    `bank_account_credentials` VARCHAR(255),
    `selected_agency` VARCHAR(255),
    `loan_creation_date` DATETIME
    );
