CREATE TABLE IF NOT EXISTS `client` (
                                        `id` varchar(50) NOT NULL PRIMARY KEY,
                                        `email` varchar(50),
                                        `first_name` varchar(50),
                                        `last_name` varchar(50),
                                        `has_account` BOOLEAN,
                                        `rib` varchar(100),
                                        `street` varchar(100),
                                        `city` varchar(100),
                                        `postal_code` varchar(20),
                                        `country` varchar(50),
                                        `roles` TEXT -- Assuming roles are stored as a JSON array or comma-separated values
);
