CREATE TABLE if not exists t_banner (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  type INT NULL,
  cont LONGTEXT NULL,
  title VARCHAR(45) NULL,
  create_date DATETIME NULL
) default charset = utf8;

commit;
