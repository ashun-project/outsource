CREATE TABLE if not exists t_user(
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  account VARCHAR(45) NULL,
  password VARCHAR(45) NULL,
  create_date DATETIME NULL,
  amount INT NULL
) default charset = utf8;;

insert into t_user values(1,'admin','123123',now(),1000);

commit;
