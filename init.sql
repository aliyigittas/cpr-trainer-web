CREATE DATABASE IF NOT EXISTS cpr;

CREATE USER IF NOT EXISTS 'cpr-trainer'@'%' IDENTIFIED WITH mysql_native_password BY 'cprTrainer123';

GRANT ALL PRIVILEGES ON cpr.* TO 'cpr-trainer'@'%';

FLUSH PRIVILEGES;