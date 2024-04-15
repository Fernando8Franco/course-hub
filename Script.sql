CREATE TABLE user (
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    name VARCHAR(40) NOT NULL,
    father_last_name VARCHAR(40) NOT NULL,
    mother_last_name VARCHAR(40) NOT NULL,
    password VARCHAR(80) NOT NULL,
    birthday DATETIME NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(60) NOT NULL UNIQUE,
    user_type ENUM('CUSTOMER', 'ADMIN') NOT NULL,
    is_active BIT DEFAULT 0 NOT NULL,
    last_reset_request DATETIME NOT NULL,
    verification_code VARCHAR(6) DEFAULT NULL,
    reset_token_hash VARCHAR(64) DEFAULT NULL,
    reset_token_expires_at DATETIME DEFAULT NULL
);

CREATE TABLE school (
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	name VARCHAR(150) NOT NULL UNIQUE,
	is_active BIT DEFAULT 1 NOT NULL
);

CREATE TABLE course (
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	name VARCHAR(80) NOT NULL,
	description TEXT NOT NULL,
	price DECIMAL(10, 2) NOT NULL,
	instructor VARCHAR(80) NOT NULL,
	modality ENUM('REMOTE', 'ON-SITE', 'HYBRID') NOT NULL,
	image VARCHAR(55) NOT NULL UNIQUE,
	is_active BIT DEFAULT 1 NOT NULL,
	school_id INT NOT NULL,
	FOREIGN KEY (school_id) REFERENCES school(id)
);

CREATE TABLE transaction (
	id VARCHAR(36) PRIMARY KEY NOT NULL,
	date_purchase DATETIME NOT NULL,
	total_amount DECIMAL(10, 2) NOT NULL,
	transaction_state ENUM('PENDING', 'COMPLETED', 'CANCELED') DEFAULT 'PENDING' NOT NULL,
	image VARCHAR(200) DEFAULT NULL UNIQUE,
	user_id VARCHAR(36) NOT NULL,
	course_id INT NOT NULL,
	FOREIGN KEY (user_id) REFERENCES user(id),
	FOREIGN KEY (course_id) REFERENCES course(id)
);

/*
CREATE TRIGGER set_default_is_active
BEFORE INSERT
ON `user` FOR EACH ROW
BEGIN
IF NEW.user_type = 'ADMIN' THEN
    SET NEW.is_active = 1;
END IF;
END;

CREATE TRIGGER update_course_is_active
AFTER UPDATE ON school
FOR EACH ROW
BEGIN
    IF NEW.is_active = 0 THEN
        UPDATE course SET is_active = 0 WHERE school_id = NEW.id;
    ELSE
        UPDATE course SET is_active = 1 WHERE school_id = NEW.id;
    END IF;
END;
*/

DROP TABLE CourseHubDB.`transaction`;
DROP TABLE CourseHubDB.course;
DROP TABLE CourseHubDB.school;
DROP TABLE CourseHubDB.`user`;