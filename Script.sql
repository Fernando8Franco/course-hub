USE CourseHubDB;

CREATE TABLE user (
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    name VARCHAR(80) NOT NULL,
    father_last_name VARCHAR(80) NOT NULL,
    mother_last_name VARCHAR(80) NOT NULL,
    password VARCHAR(100) NOT NULL,
    birthday DATETIME NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    user_type ENUM('CUSTOMER', 'ADMIN') NOT NULL,
    is_active BIT DEFAULT 0 NOT NULL,
    last_reset_request DATETIME NOT NULL,
    verification_code VARCHAR(6) DEFAULT NULL,
    reset_token_hash VARCHAR(64) DEFAULT NULL,
    reset_token_expires_at DATETIME DEFAULT NULL
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
*/

CREATE TABLE school (
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	name VARCHAR(150) NOT NULL UNIQUE,
	is_active BIT NOT NULL
);

CREATE TABLE course (
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	name VARCHAR(150) NOT NULL,
	description TEXT NOT NULL,
	price DECIMAL(10, 2) NOT NULL,
	instructor VARCHAR(300) NOT NULL,
	modality ENUM('REMOTE', 'ON-SITE', 'HYBRID') NOT NULL,
	image VARCHAR(200) NOT NULL UNIQUE,
	is_active BIT NOT NULL,
	school_id INT NOT NULL,
	FOREIGN KEY (school_id) REFERENCES school(id)
);

CREATE TABLE transaction (
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	data_purchase DATETIME NOT NULL,
	total_amount DECIMAL(10, 2) NOT NULL,
	transaction_state ENUM('PENDING', 'COMPLETED', 'CANCELED') DEFAULT 'PENDING' NOT NULL,
	image VARCHAR(200) DEFAULT NULL UNIQUE,
	user_id INT NOT NULL,
	course_id INT NOT NULL,
	FOREIGN KEY (user_id) REFERENCES user(id),
	FOREIGN KEY (course_id) REFERENCES course(id)
);


/* SELECT EXISTS (SELECT * FROM user WHERE id = 1 AND user_type = 'ADMIN') as test; */
/* SELECT id FROM user WHERE email = 'test3@gmail.com' AND id != 2;*/
/* SELECT c.id, c.name, c.description, c.price, c.instructor, c.modality, c.image, s.name FROM course c JOIN school s ON c.school_id = s.id AND c.is_active AND s.is_active; */


