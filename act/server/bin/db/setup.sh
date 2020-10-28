
#!/bin/bash
/usr/local/MySQL/bin/mysql -uroot -p --default-character-set=utf8 <<EOF
drop database if exists amcp;
create database amcp character set utf8;
use amcp;
source init.sql;
EOF