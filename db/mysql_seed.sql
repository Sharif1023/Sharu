-- Minimal seed for MySQL

INSERT INTO admins (username, password_hash) VALUES ('admin', 'admin');

INSERT IGNORE INTO portfolio_config (id, data) VALUES (1, JSON_OBJECT('version', 1, 'auth', JSON_OBJECT('username', 'admin', 'password', 'admin')));
