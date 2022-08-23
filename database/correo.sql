drop database if exists correo;
create database correo;
use correo;

SET SQL_SAFE_UPDATES = 0;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email_address VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(64) NOT NULL,
    image_profile blob,
    newuser boolean default true
);

CREATE TABLE emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_user int NOT NULL,
    to_user int not null,
    subject varchar(400),
    message varchar(2000),
    unread BOOLEAN DEFAULT TRUE,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key (from_user) references users (id),
    foreign key (to_user) references users (id)
);

create table drafts (
	id INT AUTO_INCREMENT PRIMARY KEY,
    from_user int NOT NULL,
    to_user varchar(100),
    subject varchar(400),
    message varchar(2000),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table history (
	id int auto_increment primary key,
    user_id int,
    foreign key (user_id) references users(id)
);

create table labels (
	id varchar(50) primary key,
    name varchar(50) not null,
    user_id int,
    index (user_id)
);

create table user_emails (
	user_id int,
    label_id varchar(50),
    email_id int,
    draft_id int,
    primary key (user_id, label_id, email_id, draft_id),
    foreign key (user_id) references users(id)
    -- foreign key (label_id) references labels(id)
);

create table calendar_events(
	id varchar(20) primary key,
    user_id int not null,
    title varchar(40) not null,
    start datetime not null,
    `end` datetime,
    description varchar(200),
    foreign key (user_id) references users(id)
);

delimiter //
create trigger insert_email_trigger 
after insert on emails for each row
begin
	insert into user_emails values (new.to_user, 'INBOX', new.id, -1);
    insert into user_emails values (new.from_user, 'SENT', new.id, -1);
    
    insert into history (user_id) value (new.to_user);
    insert into history (user_id) value (new.from_user);
end//

create trigger insert_draft_trigger
after insert on drafts for each row
begin
    insert into user_emails values (new.from_user, 'DRAFT', -1, new.id);
    insert into history (user_id) value (new.from_user);
end//

delimiter ;



insert into labels values 
	('INBOX', 'Bandeja de Entrada', 0),
    ('SENT', 'Enviados', 0),
    ('DRAFT', 'Borradores', 0),
    ('ARCHIVE', 'Archivados', 0),
    ('DELETED', 'Papelera', 0);

insert into users values 
	(2, 'Juan', 'Garcia', 'juan23@email.com', '123', null, true),
    (3, 'Antonio', 'Perez', 'anto3@email.com', '123', null, true),
	(4, 'Stevan', 'Velez', 'svelez1@email.com', '123', null, false);

insert into emails (id, from_user, to_user, subject, message) values
	(null, 2, 3, 'test1', 'Esto es un 1111'),
	(null, 4, 2, 'test2', 'ESte es el cuerpo del test 222'),
    (null, 4, 2, 'test3', 'ESte es el cuerpo de3'),
	(null, 3, 4, 'test3', 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium in enim voluptate eaque aperiam labore quaerat eveniet eius, sunt mollitia quos iure consequuntur magnam similique nesciunt, cumque itaque veniam ad.');

insert into drafts (from_user, to_user, subject, message) values
 	(2, 'svelez1@email.com', 'Hola', 'Este es mi mensaje'),
     (2, 'aa@ff', null, null);	

insert into calendar_events values
	('evet-1234', 2, 'Mi titulo', current_time(), null, 'Esta es mi descripcion1'),
    ('evet-56789', 2, 'cita', '2022-08-16T20:00:00', null, 'Esta es mi descripcion2'),
    ('evet-2222', 2, 'AAAAA', '2022-08-16', '2022-08-18', 'Esta es mi descripcion');

insert into calendar_events values ('evet-424234', 3, 'Mi titulo', current_time(), null, null);


select * from users;

-- select * from calendar_events where user_id = 2;

-- select * from labels where id in ('INBOX');

-- select * from user_emails where user_id = 2;
-- UPDATE user_emails set label_id = 'ARCHIVE' where user_id = 2 and label_id = 'SENT' AND email_id = 5;

-- select * from user_emails where user_id = 5;
-- select * from user_emails where user_id = 2 and email_id in (2);

-- select * from user_emails where user_id = 2 and label_id = 'INBOX' AND email_id in (3, 2);