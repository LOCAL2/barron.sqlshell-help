# ⚡ Quick Start Guide

## เริ่มต้นใช้งาน MySQL Shell Command Generator ใน 5 นาที

### 🎯 สิ่งที่คุณจะได้เรียนรู้

1. วิธีสร้างคำสั่ง SQL โดยไม่ต้องพิมพ์
2. วิธีใช้งานกับ MySQL Shell (mysqlsh)
3. ตัวอย่างการใช้งานจริง

---

## 📦 Step 1: ติดตั้งและรัน

```bash
# Clone repository (ถ้ายังไม่มี)
git clone https://github.com/yourusername/mysqlsh-generator.git
cd mysqlsh-generator

# ติดตั้ง dependencies
bun install
# หรือ npm install

# รัน development server
bun run dev
# หรือ npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:5173`

---

## 🎮 Step 2: ทดลองสร้างคำสั่งแรก

### ตัวอย่างที่ 1: สร้าง Database

1. **คลิกเลือก** "สร้าง Database" จาก Sidebar
2. **กรอก** ชื่อ Database: `my_shop`
3. **กด** "Generate SQL"
4. **คัดลอก** คำสั่งที่ได้:
   ```sql
   CREATE DATABASE `my_shop`;
   ```

### ตัวอย่างที่ 2: สร้าง Table

1. **คลิกเลือก** "สร้าง Table"
2. **กรอก** ชื่อ Table: `users`
3. **กด** "+ เพิ่ม Column" และกรอก:
   - Column 1: `id`, Type: `INT`, เลือก `NOT NULL` และ `AUTO_INCREMENT`
   - Column 2: `name`, Type: `VARCHAR`, Length: `255`, เลือก `NOT NULL`
   - Column 3: `email`, Type: `VARCHAR`, Length: `255`, เลือก `NOT NULL` และ `UNIQUE`
4. **กด** "Generate SQL"
5. **คัดลอก** คำสั่งที่ได้:
   ```sql
   CREATE TABLE `users` (
     `id` INT NOT NULL AUTO_INCREMENT,
     `name` VARCHAR(255) NOT NULL,
     `email` VARCHAR(255) NOT NULL UNIQUE,
     PRIMARY KEY (`id`)
   );
   ```

### ตัวอย่างที่ 3: INSERT ข้อมูล

1. **คลิกเลือก** "เพิ่มข้อมูล (INSERT)"
2. **กรอก** ชื่อ Table: `users`
3. **กด** "+ เพิ่ม Column" และกรอก:
   - Column: `name`, Value: `'John Doe'`
   - Column: `email`, Value: `'john@example.com'`
4. **กด** "Generate SQL"
5. **คัดลอก** คำสั่งที่ได้:
   ```sql
   INSERT INTO `users` (`name`, `email`) VALUES ('John Doe', 'john@example.com');
   ```

### ตัวอย่างที่ 4: SELECT ข้อมูล

1. **คลิกเลือก** "ค้นหาข้อมูล (SELECT)"
2. **กรอก** ชื่อ Table: `users`
3. **กรอก** WHERE: `id = 1`
4. **กด** "Generate SQL"
5. **คัดลอก** คำสั่งที่ได้:
   ```sql
   SELECT * FROM `users` WHERE id = 1;
   ```

---

## 🐬 Step 3: ใช้กับ MySQL Shell

### เปิด MySQL Shell

```bash
# เปิด MySQL Shell
mysqlsh

# เชื่อมต่อ MySQL Server
\c root@localhost

# เข้าสู่ SQL Mode
\sql

# เลือก Database
\use my_shop
```

### Execute คำสั่งที่ Generate ได้

```sql
-- Paste คำสั่งที่คัดลอกมา
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
);

-- ผลลัพธ์
Query OK, 0 rows affected (0.05 sec)
```

---

## 💡 Tips สำหรับมือใหม่

### 1. ใช้ Preview ก่อนเสมอ

✅ **ดี**: ตรวจสอบคำสั่งใน Preview Panel ก่อน Execute
```sql
-- ตรวจสอบว่าถูกต้องหรือไม่
SELECT * FROM `users` WHERE id = 1;
```

❌ **ไม่ดี**: Execute โดยไม่ตรวจสอบ

### 2. ระวังคำสั่งอันตราย

เมื่อเห็น Warning สีแดง:
- ⚠️ DROP DATABASE/TABLE
- ⚠️ DELETE ไม่มี WHERE
- ⚠️ UPDATE ไม่มี WHERE

**ต้องอ่านให้ดีก่อน Confirm!**

### 3. ใช้ Command History

- ดูคำสั่งที่เคยใช้จาก History Panel ด้านขวา
- คลิกเพื่อใช้คำสั่งเดิมอีกครั้ง

### 4. เริ่มจาก SELECT ก่อน

ก่อน UPDATE/DELETE ควร:
1. ใช้ SELECT ทดสอบเงื่อนไข WHERE ก่อน
2. ตรวจสอบว่าได้ข้อมูลที่ต้องการ
3. แล้วค่อยเปลี่ยนเป็น UPDATE/DELETE

```sql
-- ทดสอบก่อน
SELECT * FROM `users` WHERE status = 'inactive';

-- ถ้าถูกต้อง ค่อยลบ
DELETE FROM `users` WHERE status = 'inactive';
```

---

## 🎯 Use Cases ที่ใช้บ่อย

### 1. สร้างระบบ User Management

```sql
-- 1. สร้าง Database
CREATE DATABASE `user_system`;

-- 2. สร้าง Table
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- 3. Insert ข้อมูล
INSERT INTO `users` (`username`, `email`, `password`) 
VALUES ('admin', 'admin@example.com', 'hashed_password');

-- 4. Query ข้อมูล
SELECT `id`, `username`, `email`, `status` 
FROM `users` 
WHERE status = 'active' 
ORDER BY created_at DESC;
```

### 2. สร้างระบบ Blog

```sql
-- 1. สร้าง Table Posts
CREATE TABLE `posts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `status` VARCHAR(20) DEFAULT 'draft',
  `published_at` TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_status` (`status`)
);

-- 2. เพิ่ม Foreign Key
ALTER TABLE `posts` 
ADD CONSTRAINT `fk_posts_user` 
FOREIGN KEY (`user_id`) 
REFERENCES `users`(`id`) 
ON DELETE CASCADE;

-- 3. Query Posts พร้อม User
SELECT 
  p.id,
  p.title,
  p.status,
  u.username as author
FROM `posts` p
INNER JOIN `users` u ON p.user_id = u.id
WHERE p.status = 'published'
ORDER BY p.published_at DESC
LIMIT 10;
```

### 3. Update ข้อมูลจำนวนมาก

```sql
-- 1. ตรวจสอบก่อน
SELECT COUNT(*) FROM `users` WHERE status = 'pending';

-- 2. Update
UPDATE `users` 
SET `status` = 'active' 
WHERE status = 'pending' AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY);

-- 3. ตรวจสอบผลลัพธ์
SELECT COUNT(*) FROM `users` WHERE status = 'active';
```

---

## 🚀 Next Steps

### เรียนรู้เพิ่มเติม

1. **[USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)** - ตัวอย่างการใช้งานแบบละเอียด
2. **[MYSQLSH_GUIDE.md](./MYSQLSH_GUIDE.md)** - คู่มือ MySQL Shell ฉบับสมบูรณ์
3. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - วิธี Deploy ขึ้น Production

### ฝึกฝน

1. ลองสร้าง Database และ Table ของคุณเอง
2. ทดลอง INSERT, UPDATE, DELETE ข้อมูล
3. ลองใช้ JOIN และ Aggregate Functions
4. ทดลอง ALTER TABLE เพิ่ม Column หรือ Index

### Community

- 🐛 พบ Bug? [Report Issue](https://github.com/yourusername/mysqlsh-generator/issues)
- 💡 มีไอเดีย? [Feature Request](https://github.com/yourusername/mysqlsh-generator/issues)
- ⭐ ชอบโปรเจกต์? [Star on GitHub](https://github.com/yourusername/mysqlsh-generator)

---

## ❓ FAQ

### Q: ต้องติดตั้ง MySQL Shell หรือไม่?

A: ไม่จำเป็น! Tool นี้ใช้ Generate คำสั่งได้เลย แต่ถ้าจะ Execute จริง ต้องมี MySQL Shell

### Q: รองรับ MySQL version ไหนบ้าง?

A: รองรับ MySQL 5.7+ และ MySQL 8.0+

### Q: ใช้กับ MariaDB ได้ไหม?

A: ได้! คำสั่ง SQL ส่วนใหญ่ใช้ได้กับ MariaDB

### Q: มี Mobile App ไหม?

A: ยังไม่มี แต่ Web App ใช้งานบน Mobile ได้

### Q: ฟรีหรือเปล่า?

A: ฟรี 100% และ Open Source (MIT License)

---

**Happy Coding! 🎉**

Made with ❤️ for MySQL Shell users
