# 🐬 MySQL Shell (mysqlsh) Complete Guide

## 📖 เกี่ยวกับ MySQL Shell

MySQL Shell (mysqlsh) คือ Advanced CLI Tool สำหรับทำงานกับ MySQL
- รองรับ SQL, JavaScript, และ Python Mode
- มี Interactive และ Batch Mode
- รองรับ MySQL Document Store (NoSQL)
- มี Admin API สำหรับจัดการ InnoDB Cluster

## 🚀 การติดตั้ง MySQL Shell

### Windows
```bash
# ดาวน์โหลดจาก MySQL Official
https://dev.mysql.com/downloads/shell/

# หรือใช้ Chocolatey
choco install mysql-shell
```

### macOS
```bash
# ใช้ Homebrew
brew install mysql-shell
```

### Linux (Ubuntu/Debian)
```bash
# เพิ่ม MySQL APT Repository
wget https://dev.mysql.com/get/mysql-apt-config_0.8.22-1_all.deb
sudo dpkg -i mysql-apt-config_0.8.22-1_all.deb

# ติดตั้ง MySQL Shell
sudo apt update
sudo apt install mysql-shell
```

## 🔌 การเชื่อมต่อ Database

### 1. เชื่อมต่อแบบ Basic
```bash
# เชื่อมต่อ localhost
mysqlsh root@localhost

# เชื่อมต่อพร้อมระบุ Port
mysqlsh root@localhost:3306

# เชื่อมต่อพร้อมระบุ Database
mysqlsh root@localhost:3306/mydb
```

### 2. เชื่อมต่อแบบระบุ Password
```bash
# จะถาม Password
mysqlsh root@localhost

# หรือระบุ Password ใน Command (ไม่แนะนำ)
mysqlsh root:password@localhost
```

### 3. เชื่อมต่อ Remote Server
```bash
# เชื่อมต่อ Remote MySQL
mysqlsh user@192.168.1.100:3306

# เชื่อมต่อผ่าน SSH Tunnel
mysqlsh --ssh user@jumphost root@mysql-server:3306
```

### 4. เชื่อมต่อแบบ URI
```bash
# MySQL URI Format
mysqlsh mysql://root@localhost:3306/mydb

# MySQL X Protocol (Port 33060)
mysqlsh mysqlx://root@localhost:33060/mydb
```

## 🎮 MySQL Shell Modes

### 1. SQL Mode (Default)
```bash
# เข้าสู่ SQL Mode
\sql

# ใช้คำสั่ง SQL ได้เลย
SELECT * FROM users;
CREATE TABLE products (id INT);
```

### 2. JavaScript Mode
```bash
# เข้าสู่ JS Mode
\js

# ใช้ JavaScript API
session.sql("SELECT * FROM users").execute();
db.users.find();
```

### 3. Python Mode
```bash
# เข้าสู่ Python Mode
\py

# ใช้ Python API
session.sql("SELECT * FROM users").execute()
db.users.find()
```

## 📝 MySQL Shell Commands (Backslash Commands)

### Connection Commands
```bash
\connect user@host:port/db    # เชื่อมต่อ Database
\c user@host                  # Shortcut สำหรับ \connect
\reconnect                    # เชื่อมต่อใหม่
\disconnect                   # ตัดการเชื่อมต่อ
```

### Mode Commands
```bash
\sql                          # เข้าสู่ SQL Mode
\js                           # เข้าสู่ JavaScript Mode
\py                           # เข้าสู่ Python Mode
```

### Database Commands
```bash
\use database_name            # เลือก Database
\status                       # แสดงสถานะการเชื่อมต่อ
\s                            # Shortcut สำหรับ \status
```

### Output Commands
```bash
\G                            # แสดงผลแบบ Vertical (ต่อท้ายคำสั่ง SQL)
\show                         # แสดงค่า Variable
\watch                        # Execute คำสั่งซ้ำทุก ๆ วินาที
```

### File Commands
```bash
\source file.sql              # Execute SQL จากไฟล์
\.  file.sql                  # Shortcut สำหรับ \source
\edit                         # เปิด Editor
```

### Help Commands
```bash
\help                         # แสดง Help
\h                            # Shortcut สำหรับ \help
\?                            # แสดง Help
```

### System Commands
```bash
\exit                         # ออกจาก MySQL Shell
\quit                         # ออกจาก MySQL Shell
\q                            # Shortcut สำหรับ \quit
```

### Options Commands
```bash
\option                       # แสดง Options ทั้งหมด
\option --persist             # บันทึก Options
\warnings                     # แสดง Warnings
\nowarnings                   # ซ่อน Warnings
```

## 💡 ตัวอย่างการใช้งานจริง

### 1. เชื่อมต่อและเลือก Database
```bash
# เปิด MySQL Shell
mysqlsh

# เชื่อมต่อ
\c root@localhost

# เข้าสู่ SQL Mode
\sql

# เลือก Database
\use ecommerce

# ตรวจสอบสถานะ
\status
```

### 2. Execute SQL Commands
```bash
# สร้าง Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE
);

# Insert ข้อมูล
INSERT INTO users (name, email) VALUES ('John', 'john@example.com');

# Query ข้อมูล
SELECT * FROM users;

# Query แบบ Vertical Output
SELECT * FROM users\G
```

### 3. ใช้ Source File
```bash
# Execute SQL จากไฟล์
\source /path/to/schema.sql

# หรือ
\. /path/to/data.sql
```

### 4. Export ข้อมูล
```bash
# Export Table เป็น CSV
\sql
SELECT * FROM users INTO OUTFILE '/tmp/users.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';
```

### 5. Batch Mode (Non-Interactive)
```bash
# Execute SQL จาก Command Line
mysqlsh root@localhost --sql -e "SELECT * FROM users"

# Execute SQL จากไฟล์
mysqlsh root@localhost --sql < schema.sql

# Execute และ Save Output
mysqlsh root@localhost --sql -e "SELECT * FROM users" > output.txt
```

## 🔧 Advanced Features

### 1. MySQL Shell Options
```bash
# แสดง Options
\option

# ตั้งค่า Output Format
\option --result-format=json
\option --result-format=table
\option --result-format=vertical

# ตั้งค่า History
\option history.maxSize=10000
\option history.autoSave=true

# ตั้งค่า Pager
\option pager="less -S"
```

### 2. Session Variables
```bash
# แสดง Variables
\show variables

# ตั้งค่า Variable
SET @myvar = 'value';
SELECT @myvar;
```

### 3. Transaction Management
```bash
# เริ่ม Transaction
START TRANSACTION;

# Execute Commands
INSERT INTO users (name) VALUES ('Alice');
UPDATE products SET stock = stock - 1 WHERE id = 1;

# Commit
COMMIT;

# หรือ Rollback
ROLLBACK;
```

### 4. Stored Procedures
```bash
# สร้าง Stored Procedure
DELIMITER //
CREATE PROCEDURE GetUserById(IN userId INT)
BEGIN
  SELECT * FROM users WHERE id = userId;
END //
DELIMITER ;

# เรียกใช้
CALL GetUserById(1);
```

## 📊 Performance & Monitoring

### 1. EXPLAIN Query
```bash
# ดู Query Execution Plan
EXPLAIN SELECT * FROM users WHERE email = 'john@example.com';

# EXPLAIN แบบละเอียด
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'john@example.com';
```

### 2. Show Process List
```bash
# ดู Running Queries
SHOW PROCESSLIST;

# ดูแบบละเอียด
SHOW FULL PROCESSLIST;
```

### 3. Performance Schema
```bash
# ดู Slow Queries
SELECT * FROM performance_schema.events_statements_summary_by_digest
ORDER BY SUM_TIMER_WAIT DESC LIMIT 10;
```

## 🛡️ Security Best Practices

### 1. ใช้ Configuration File
```bash
# สร้างไฟล์ ~/.my.cnf
[client]
user=myuser
password=mypassword
host=localhost
port=3306

# เชื่อมต่อโดยไม่ต้องใส่ Password
mysqlsh
```

### 2. ใช้ SSL/TLS
```bash
# เชื่อมต่อด้วย SSL
mysqlsh root@localhost --ssl-mode=REQUIRED

# ระบุ Certificate
mysqlsh root@localhost --ssl-ca=/path/to/ca.pem
```

### 3. Limit Privileges
```sql
-- สร้าง User แบบจำกัดสิทธิ์
CREATE USER 'readonly'@'localhost' IDENTIFIED BY 'password';
GRANT SELECT ON mydb.* TO 'readonly'@'localhost';
FLUSH PRIVILEGES;
```

## 🎯 Tips & Tricks

### 1. Auto-completion
```bash
# กด Tab เพื่อ Auto-complete
USE e[Tab]  # จะแสดง Database ที่ขึ้นต้นด้วย 'e'
SELECT * FROM u[Tab]  # จะแสดง Table ที่ขึ้นต้นด้วย 'u'
```

### 2. History Navigation
```bash
# กด ↑ ↓ เพื่อดู Command History
# กด Ctrl+R เพื่อค้นหา History
```

### 3. Multi-line Commands
```bash
# พิมพ์คำสั่งหลายบรรทัด
SELECT *
FROM users
WHERE status = 'active'
ORDER BY created_at DESC;
```

### 4. Clear Screen
```bash
# Clear Screen
\! clear  # Linux/Mac
\! cls    # Windows
```

## 🔗 Useful Resources

- [MySQL Shell Documentation](https://dev.mysql.com/doc/mysql-shell/8.0/en/)
- [MySQL Shell API Reference](https://dev.mysql.com/doc/dev/mysqlsh-api-javascript/8.0/)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)

---

Made with ❤️ for MySQL Shell users
