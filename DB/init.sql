DROP DATABASE IF EXISTS notice_db;
CREATE DATABASE IF NOT EXISTS notice_db;

use notice_db;

CREATE TABLE notices (
    id INT NOT NULL PRIMARY KEY,
    title VARCHAR(512) NOT NULL,
    link VARCHAR(512),
    created_at DATE NOT NULL
);


