CREATE TABLE if not exists t_banner (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  img VARCHAR(45) NULL,
  url VARCHAR(45) NULL,
  create_date DATETIME NULL
) default charset = utf8;

commit;
