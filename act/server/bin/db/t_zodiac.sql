CREATE TABLE if not exists t_zodiac (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  sort VARCHAR(45) NULL,
  url VARCHAR(45) NULL,
  title VARCHAR(45) NULL,
  img VARCHAR(45) NULL,
  type VARCHAR(45) NULL,
  issue VARCHAR(45) NULL,
  examine_date DATETIME NULL,
  down_date DATETIME NULL
) default charset = utf8;

commit;
