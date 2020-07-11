
#!/bin/bash
/usr/local/MySQL/bin/mysql -uroot -p --default-character-set=utf8 <<EOF
drop database if exists recharge;
create database recharge character set utf8;
use recharge;
source init.sql;
EOF