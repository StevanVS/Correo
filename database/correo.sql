drop database if exists correo;
create database correo;
use correo;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email_address VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(64) NOT NULL
);

CREATE TABLE emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_user int NOT NULL,
    to_user int not null,
    subject text,
    message text,
    -- label_id varchar(25) default null,
    unread BOOLEAN DEFAULT TRUE,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key (from_user) references users (id),
    foreign key (to_user) references users (id)
);

create table drafts (
	id INT AUTO_INCREMENT PRIMARY KEY,
    from_user int NOT NULL,
    to_user varchar(100),
    subject text,
    message text,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

alter table users auto_increment = 201;
alter table emails auto_increment = 201;
alter table drafts auto_increment = 201;

insert into users values 
	(2, 'Juan', 'Garcia', 'juan23@email.com', '123'),
    (3, 'Antonio', 'Perez', 'anto3@email.com', '123'),
	(4, 'Stevan', 'Velez', 'svelez1@email.com', '123');

insert into emails (id, from_user, to_user, subject, message) values
	(null, 2, 3, 'test1', 'Esto es un 1111'),
	(null, 4, 2, 'test2', 'ESte es el cuerpo del test 222'),
    (null, 4, 2, 'test3', 'ESte es el cuerpo de3'),
	(null, 3, 4, 'test3', 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium in enim voluptate eaque aperiam labore quaerat eveniet eius, sunt mollitia quos iure consequuntur magnam similique nesciunt, cumque itaque veniam ad.');

insert into drafts (from_user, to_user, subject, message) values
	(2, 'svelez1@email.com', 'Hola', 'Este es mi mensaje'),
    (2, 'aa@ff', null, null);	

-- select * from users;
-- select * from emails order by date desc; 



/*
-- INBOX
select * from emails where to_user = 2;

-- SENT
select * from emails where from_user = 2;

-- DRAFT
select * from drafts where from_user = 2;

