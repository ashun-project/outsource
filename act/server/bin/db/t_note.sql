CREATE TABLE if not exists t_note (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  lottery INT NOT NULL,
  issue VARCHAR(45) NULL,
  openCode VARCHAR(45) NULL,
  openTime VARCHAR(45) NULL,
  videoUrl VARCHAR(45) NULL,
  pet VARCHAR(45) NULL,
  create_date DATETIME NULL
) default charset = utf8;

commit;
