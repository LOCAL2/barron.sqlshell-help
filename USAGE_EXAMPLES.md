# 📚 ตัวอย่างการใช้งาน MySQL Shell Command Generator

## 🎯 กรณีการใช้งานจริง

### 1. สร้าง Database และ Table สำหรับระบบ E-commerce

#### Step 1: สร้าง Database
```sql
CREATE DATABASE `ecommerce`;
```

#### Step 2: สร้าง Table Users
```sql
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`)
);
```

#### Step 3: สร้าง Table Products
```sql
CREATE TABLE `products` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10,2) NOT NULL,
  `stock` INT UNSIGNED DEFAULT 0,
  `category` VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_category` (`category`)
);
```

#### Step 4: สร้าง Table Orders
```sql
CREATE TABLE `orders` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `total` DECIMAL(10,2) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
```

---

### 2. Query ข้อมูลแบบต่าง ๆ

#### ค้นหา User ที่ Active
```sql
SELECT `id`, `name`, `email` 
FROM `users` 
WHERE status = 'active' 
ORDER BY created_at DESC 
LIMIT 20;
```

#### นับจำนวน Product แต่ละ Category
```sql
SELECT `category`, COUNT(*) as total 
FROM `products` 
GROUP BY `category` 
HAVING total > 5 
ORDER BY total DESC;
```

#### ค้นหา Order พร้อม User Info (JOIN)
```sql
SELECT 
  o.id as order_id,
  o.total,
  o.status,
  u.name as customer_name,
  u.email
FROM `orders` o
INNER JOIN `users` u ON o.user_id = u.id
WHERE o.status = 'pending'
ORDER BY o.created_at DESC
LIMIT 10;
```

#### หา Product ที่ขายดี (Aggregate)
```sql
SELECT 
  p.name,
  SUM(oi.quantity) as total_sold,
  AVG(oi.price) as avg_price
FROM `products` p
INNER JOIN `order_items` oi ON p.id = oi.product_id
GROUP BY p.id
ORDER BY total_sold DESC
LIMIT 10;
```

---

### 3. Update และ Delete ข้อมูล

#### Update ราคา Product
```sql
UPDATE `products` 
SET `price` = 299.00 
WHERE id = 1;
```

#### Update หลาย Column พร้อมกัน
```sql
UPDATE `products` 
SET 
  `price` = 399.00,
  `stock` = 100,
  `updated_at` = NOW()
WHERE id = 1;
```

#### Update แบบมีเงื่อนไขซับซ้อน
```sql
UPDATE `products` 
SET `status` = 'out_of_stock' 
WHERE stock = 0 AND status = 'active';
```

#### Delete Order ที่ยกเลิก
```sql
DELETE FROM `orders` 
WHERE status = 'cancelled' AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

---

### 4. ALTER TABLE - แก้ไขโครงสร้าง

#### เพิ่ม Column ใหม่
```sql
ALTER TABLE `users` 
ADD COLUMN `phone` VARCHAR(20);
```

#### เพิ่ม Column พร้อม Constraint
```sql
ALTER TABLE `users` 
ADD COLUMN `verified` BOOLEAN NOT NULL DEFAULT FALSE;
```

#### แก้ไข Column Type
```sql
ALTER TABLE `products` 
MODIFY COLUMN `description` TEXT NOT NULL;
```

#### เปลี่ยนชื่อ Column
```sql
ALTER TABLE `users` 
CHANGE COLUMN `name` `full_name` VARCHAR(255) NOT NULL;
```

#### เพิ่ม Index
```sql
ALTER TABLE `products` 
ADD INDEX `idx_price` (`price`);
```

#### เพิ่ม UNIQUE Index
```sql
ALTER TABLE `users` 
ADD UNIQUE INDEX `idx_phone` (`phone`);
```

#### เพิ่ม Foreign Key
```sql
ALTER TABLE `order_items` 
ADD CONSTRAINT `fk_order_items_product` 
FOREIGN KEY (`product_id`) 
REFERENCES `products`(`id`) 
ON DELETE CASCADE 
ON UPDATE CASCADE;
```

---

### 5. MySQL Shell Commands

#### เชื่อมต่อ Database
```bash
\c root@localhost:3306
```

#### เชื่อมต่อพร้อมระบุ Database
```bash
\c root@localhost:3306/ecommerce
```

#### เปลี่ยนไปใช้ Database อื่น
```bash
\use ecommerce
```

#### ตรวจสอบสถานะการเชื่อมต่อ
```bash
\status
```

#### เข้าสู่ SQL Mode
```bash
\sql
```

---

## 🎨 Tips & Best Practices

### 1. การใช้ WHERE Clause
❌ **อันตราย - ไม่มี WHERE**
```sql
DELETE FROM `users`;  -- ลบทั้ง Table!
UPDATE `products` SET price = 0;  -- แก้ไขทั้ง Table!
```

✅ **ปลอดภัย - มี WHERE**
```sql
DELETE FROM `users` WHERE id = 1;
UPDATE `products` SET price = 299 WHERE id = 1;
```

### 2. การใช้ LIMIT
```sql
-- ดึงแค่ 10 รายการแรก
SELECT * FROM `users` LIMIT 10;

-- ดึงรายการที่ 11-20 (Pagination)
SELECT * FROM `users` LIMIT 10 OFFSET 10;
```

### 3. การใช้ INDEX
```sql
-- เพิ่ม Index สำหรับ Column ที่ค้นหาบ่อย
ALTER TABLE `products` ADD INDEX `idx_category` (`category`);

-- Composite Index สำหรับ Query ที่ใช้หลาย Column
ALTER TABLE `orders` ADD INDEX `idx_user_status` (`user_id`, `status`);
```

### 4. การใช้ Transaction (ใน mysqlsh)
```sql
START TRANSACTION;

INSERT INTO `orders` (user_id, total) VALUES (1, 1000);
INSERT INTO `order_items` (order_id, product_id, quantity) VALUES (LAST_INSERT_ID(), 1, 2);

COMMIT;
-- หรือ ROLLBACK; ถ้าเกิด error
```

### 5. การ Backup ก่อน DROP/DELETE
```bash
# Backup Database ก่อน DROP
mysqldump -u root -p ecommerce > backup_ecommerce.sql

# Backup Table ก่อน DROP
mysqldump -u root -p ecommerce users > backup_users.sql
```

---

## ⚠️ คำเตือนสำคัญ

### 1. DROP DATABASE/TABLE
- ⚠️ จะลบข้อมูลทั้งหมดถาวร
- ✅ ควร Backup ก่อนเสมอ
- ✅ ตรวจสอบชื่อให้แน่ใจ

### 2. UPDATE/DELETE ไม่มี WHERE
- ⚠️ จะกระทบทุก Row ใน Table
- ✅ ใช้ SELECT ทดสอบเงื่อนไขก่อน
- ✅ ใช้ LIMIT เพื่อจำกัดจำนวน

### 3. Foreign Key Constraints
- ⚠️ ไม่สามารถลบ Parent Record ถ้ามี Child
- ✅ ใช้ ON DELETE CASCADE ถ้าต้องการลบทั้งหมด
- ✅ หรือลบ Child ก่อน แล้วค่อยลบ Parent

---

## 🚀 Workflow แนะนำ

### สำหรับ Development
1. สร้าง Database และ Table
2. Insert ข้อมูลทดสอบ
3. ทดสอบ Query
4. แก้ไขโครงสร้างตามต้องการ

### สำหรับ Production
1. ✅ Backup ข้อมูลก่อนเสมอ
2. ✅ ทดสอบคำสั่งใน Development ก่อน
3. ✅ ใช้ Transaction สำหรับการแก้ไขหลาย Table
4. ✅ ตรวจสอบ WHERE clause ให้ดี
5. ✅ Monitor Performance หลัง Execute

---

Made with ❤️ for MySQL Shell users
