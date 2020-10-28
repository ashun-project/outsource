CREATE TABLE if not exists t_user(
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  account VARCHAR(45) NULL,
  password VARCHAR(45) NULL,
  create_date DATETIME NULL,
  nick_name VARCHAR(45) NULL,
  tx VARCHAR(45) NULL
) default charset = utf8;

commit;
