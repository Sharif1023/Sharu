# Database schema and XAMPP (MySQL) migration

This folder originally contained a Postgres/Supabase schema. This project has a new MySQL-compatible migration you can run on XAMPP/MariaDB.

Files:
- mysql_init.sql — MySQL-compatible schema for use with XAMPP (`db/mysql_init.sql`)
- mysql_seed.sql — Minimal seed for MySQL (`db/mysql_seed.sql`)

Notes: the original Postgres/Supabase migration files were removed from this repo after migrating to XAMPP/MySQL.

Quick start (XAMPP / MySQL):
1. Start **Apache** and **MySQL** using the XAMPP Control Panel.
2. Create a MySQL database in phpMyAdmin (e.g., `sharunduu`) or via `mysql` CLI.
3. Import the schema: open phpMyAdmin and import `db/mysql_init.sql`, then import `db/mysql_seed.sql`. Or from CLI:
   - mysql -u root -p sharunduu < db/mysql_init.sql
   - mysql -u root -p sharunduu < db/mysql_seed.sql
4. Update `api/config.php` with your MySQL credentials (host, db name, user, password).
5. Copy the `api/` folder into your XAMPP htdocs location (e.g., `C:\xampp\htdocs\sharunduu\api`) or configure Apache to serve the repo's `api/` path so that `/api/portfolio.php` is reachable.

Notes:
- The frontend now calls `/api/portfolio` (GET to read, POST to upsert). The PHP endpoint performs the same normalization previously done in the Supabase client.
- After switching to XAMPP, remove Supabase client dependency: run `npm prune` or remove `@supabase/supabase-js` from `package.json` and reinstall packages.




