-- Create the client table
CREATE TABLE IF NOT EXISTS `client` (
                                        `id` VARCHAR(50) NOT NULL PRIMARY KEY,
                                        `email` VARCHAR(50),
                                        `first_name` VARCHAR(50),
                                        `last_name` VARCHAR(50),
                                        `has_account` BOOLEAN,
                                        `street` VARCHAR(100),
                                        `city` VARCHAR(100),
                                        `postal_code` VARCHAR(20),
                                        `country` VARCHAR(50),
                                        `roles` TEXT -- Assuming roles are stored as a JSON array or comma-separated values
);

-- Create the RIBs table
CREATE TABLE IF NOT EXISTS `client_ribs` (
                                             `client_id` VARCHAR(50),
                                             `rib` NUMBER,
                                             FOREIGN KEY (`client_id`) REFERENCES `client`(`id`)
);
