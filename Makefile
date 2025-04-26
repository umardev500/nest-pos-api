# Define variables for MySQL credentials
DB_USER = root
DB_PASS = root
DB_NAME = pos
DB_HOST = 127.0.0.1
DB_PORT = 3306  # Define the port (default MySQL port is 3306)

# Target to run the SQL script
drop-tables:
	@echo "Dropping all tables in database $(DB_NAME)..."
	mysql -u $(DB_USER) -p$(DB_PASS) -h $(DB_HOST) -P $(DB_PORT) $(DB_NAME) < script/drop-tables.sql

merge-schema:
	@echo "Merging schema in database $(DB_NAME)..."
	bun script/merge-schema.ts

drop-migrations:
	rm -rf prisma/schema/migrations

drop-all: drop-tables drop-migrations
	rm -rf  dist prisma/generated
