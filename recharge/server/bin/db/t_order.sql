CREATE TABLE if not exists t_order (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  account VARCHAR(45) NULL,
  type VARCHAR(45) NULL,
  order_no VARCHAR(45) NULL,
  outorder_no VARCHAR(45) NULL,
  phone VARCHAR(45) NULL,
  remark VARCHAR(45) NULL,
  create_date DATETIME NULL,
  amount INT NULL,
  status INT NULL
) default charset = utf8;;

commit;
