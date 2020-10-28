CREATE TABLE if not exists t_collect (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  zodiac_id INT NOT NULL,
  type INT NOT NULL DEFAULT 2,
  user_name VARCHAR(45) NULL,
  issue VARCHAR(45) NULL,
  zodiac_title VARCHAR(45) NULL,
  zodiac_type VARCHAR(45) NULL,
  zodiac_img VARCHAR(45) NULL,
  create_date DATETIME NULL
) default charset = utf8;

commit;
