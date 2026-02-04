This `api/` directory contains minimal PHP endpoints to run on XAMPP (Apache + MySQL).

Setup:
1. Edit `config.php` and set your MySQL connection values (host, db_name, db_user, db_pass).
2. Copy the `api/` folder into `C:\xampp\htdocs\sharunduu\api` (or update Apache document root to point to your project public directory).
3. Start Apache and MySQL in XAMPP Control Panel.
4. Ensure `db/mysql_init.sql` and `db/mysql_seed.sql` have been imported into your MySQL database.

Endpoints:
- `GET /api/portfolio.php` — returns `{ success: true, data: {...} }` or 404
- `POST /api/portfolio.php` — accepts the full portfolio JSON and upserts normalised tables

CORS: the API returns `Access-Control-Allow-Origin: *` to allow local development. For production, tighten this header.
