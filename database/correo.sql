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

create table history (
	id int auto_increment primary key,
    user_id int,
    foreign key (user_id) references users(id)
);


create table labels (
	id varchar(50) primary key,
    name varchar(50) not null
);

insert into labels values 
	('INBOX', 'INBOX'),
    ('SENT', 'SENT'),
    ('DRAFT', 'DRAFT');

create table user_emails (
	user_id int,
    label_id varchar(50),
    email_id int,
    draft_id int,
    primary key (user_id, label_id, email_id, draft_id),
    foreign key (user_id) references users(id),
    foreign key (label_id) references labels(id)
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

/*
create procedure delete_received_email (in user_id int, in email_id int)
begin
	delete from user_emails t where t.user_id = user_id and t.label_id <> 'SENT' and t.email_id = email_id;
end//

create procedure delete_sent_email (in user_id int, in email_id int)
begin
	delete from user_emails t where t.user_id = user_id and t.label_id = 'SENT' and t.email_id = email_id;
end//

*/


-- create procedure get_emails (in userId int) 


delimiter ;


insert into users values 
	(2, 'Juan', 'Garcia', 'juan23@email.com', '123'),
    (3, 'Antonio', 'Perez', 'anto3@email.com', '123'),
	(4, 'Stevan', 'Velez', 'svelez1@email.com', '123');

insert into emails (id, from_user, to_user, subject, message) values
	(null, 2, 3, 'test1', 'Esto es un 1111'),
	(null, 4, 2, 'test2', 'ESte es el cuerpo del test 222'),
    (null, 4, 2, 'test3', 'ESte es el cuerpo de3'),
	(null, 3, 4, 'test3', 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium in enim voluptate eaque aperiam labore quaerat eveniet eius, sunt mollitia quos iure consequuntur magnam similique nesciunt, cumque itaque veniam ad.');

insert into emails (from_user, to_user, subject, message, unread) values
	(2, 2, 'Mi Asunto', 'Mi mensaje 2 Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium in enim volupta', 0);

insert into drafts (from_user, to_user, subject, message) values
 	(2, 'svelez1@email.com', 'Hola', 'Este es mi mensaje'),
     (2, 'aa@ff', null, null);	


-- select * from user_emails;


-- select * from user_emails where user_id = 2;



