-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Drop all tables in the current database
SET GROUP_CONCAT_MAX_LEN = 32768; -- Increase group concat max length to handle large number of tables
SELECT CONCAT('DROP TABLE IF EXISTS ', GROUP_CONCAT(table_name)) 
FROM information_schema.tables 
WHERE table_schema = 'pos' -- replace with your database name, 'pos' in this case
INTO @drop_tables_query;

-- Execute the drop tables query
PREPARE stmt FROM @drop_tables_query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Enable foreign key checks again
SET FOREIGN_KEY_CHECKS = 1;
