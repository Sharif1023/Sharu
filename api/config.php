<?php
// Development-friendly config for XAMPP MySQL
// WARNING: `display_errors` is enabled here for ease of debugging in dev only.
// Disable in production.
ini_set('display_errors', '1');
error_reporting(E_ALL);

// Edit these values for your XAMPP MySQL setup
return [
    'db_host' => '127.0.0.1',
    'db_name' => 'sharunduu',
    'db_user' => 'root',
    'db_pass' => '',
    'db_charset' => 'utf8mb4',
];
