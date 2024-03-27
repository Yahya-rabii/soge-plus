CREATE TABLE IF NOT EXISTS `loan` (
                                      `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                      `amount` DOUBLE,
                                      `type` VARCHAR(50),
                                      `payment_duration` VARCHAR(50),
                                      `status` VARCHAR(50),
                                      `approved` BOOLEAN,
                                      `signature` VARCHAR(300000), -- Changed to VARCHAR assuming PNG
                                      `cin_cart_recto` VARCHAR(300000), -- Changed column name
                                      `cin_cart_verso` VARCHAR(300000), -- Changed column name
                                      `cin_number` VARCHAR(50),
                                      `tax_id` VARCHAR(50),
                                      `reception_method` VARCHAR(50),
                                      `bank_account_credentials_rib` VARCHAR(255), -- Changed column name
                                      `selected_agency` VARCHAR(255),
                                      `loan_creation_date` DATETIME,
                                      `client_id` VARCHAR(255) -- Foreign key to reference client
);
