# 🐬 MySQL Shell Command Generator

**Production-ready Web Tool** สำหรับสร้างคำสั่ง SQL และ MySQL Shell (mysqlsh) โดยไม่ต้องพิมพ์เอง

## ✨ Features

### 🎯 UX Design Principles
- **เลือก มากกว่า พิมพ์** - ลด syntax error
- **Preview ก่อน Execute** - ทุกคำสั่งต้องผ่านการตรวจสอบ
- **Confirmation Dialog** - สำหรับคำสั่งอันตราย (DROP, DELETE, UPDATE)
- **Warning System** - เตือนเมื่อไม่มี WHERE clause
- **Command History** - เก็บประวัติคำสั่งที่ใช้

### 📋 รองรับคำสั่ง

#### MySQL Shell Commands
- `\c user@host` - เชื่อมต่อ
- `\sql` - เข้าสู่ SQL Mode
- `\use database` - เลือก Database
- `\status` - ตรวจสอบสถานะ
- `\exit` / `\quit` - ออกจากระบบ

#### Database Operations
- ✅ CREATE DATABASE
- ⚠️ DROP DATABASE (มี confirmation)

#### Table Operations
- ✅ CREATE TABLE (รองรับ PRIMARY KEY, INDEX, FOREIGN KEY)
- ⚠️ DROP TABLE (มี confirmation)
- 🔧 ALTER TABLE:
  - ADD COLUMN
  - DROP COLUMN
  - MODIFY COLUMN
  - CHANGE COLUMN
  - RENAME TABLE
  - ADD/DROP PRIMARY KEY
  - ADD/DROP INDEX
  - ADD FOREIGN KEY

#### Data Operations
- ✅ INSERT - เพิ่มข้อมูล
- ⚠️ UPDATE - แก้ไขข้อมูล (เตือนถ้าไม่มี WHERE)
- ⚠️ DELETE - ลบข้อมูล (เตือนถ้าไม่มี WHERE)

#### Query Operations
- 🔍 SELECT
  - WHERE / AND / OR
  - ORDER BY
  - LIMIT
  - GROUP BY
  - HAVING
  - JOIN (INNER, LEFT, RIGHT, FULL)
  - Aggregate Functions (AVG, MAX, MIN, SUM, COUNT)

## 🚀 Quick Start

### Installation

```bash
# ติดตั้ง dependencies
bun install
# หรือ
npm install
```

### Development

```bash
# รัน dev server
bun run dev
# หรือ
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:5173`

### Build for Production

```bash
# Build
bun run build
# หรือ
npm run build

# Preview production build
bun run preview
# หรือ
npm run preview
```

## 📖 วิธีใช้งาน

### 1. เลือกคำสั่ง SQL
คลิกเลือกคำสั่งจาก Sidebar ด้านซ้าย

### 2. กรอกข้อมูล
กรอกข้อมูลผ่าน Form ที่ออกแบบมาให้ใช้งานง่าย

### 3. Generate SQL
กดปุ่ม "Generate SQL" เพื่อสร้างคำสั่ง

### 4. Preview & Copy
- ตรวจสอบคำสั่งที่ถูกสร้าง
- คัดลอกไปใช้กับ mysqlsh
- หรือ Execute ผ่าน MySQL Shell

## 🎨 Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Monaco Editor** - SQL Preview Editor
- **Lucide React** - Icons

## 🏗️ Project Structure

```
src/
├── components/
│   ├── forms/
│   │   ├── SelectForm.tsx
│   │   ├── InsertForm.tsx
│   │   ├── UpdateForm.tsx
│   │   ├── DeleteForm.tsx
│   │   └── CreateTableForm.tsx
│   ├── OperationSelector.tsx
│   ├── SQLPreview.tsx
│   ├── ConfirmDialog.tsx
│   └── CommandHistory.tsx
├── utils/
│   └── sqlGenerator.ts
├── types/
│   └── index.ts
├── App.tsx
├── App.css
└── main.tsx
```

## 🔒 Safety Features

### 1. Dangerous Operation Detection
ระบบจะตรวจจับคำสั่งอันตราย:
- DROP DATABASE
- DROP TABLE
- DELETE
- UPDATE

### 2. Full Table Operation Warning
เตือนเมื่อ UPDATE/DELETE ไม่มี WHERE clause

### 3. Confirmation Dialog
แสดง Dialog ยืนยันก่อน Execute คำสั่งอันตราย

### 4. SQL Validation
ตรวจสอบ syntax ก่อน generate

## 💡 ตัวอย่างการใช้งาน

### SELECT with WHERE and ORDER BY
```sql
SELECT `id`, `name`, `email` 
FROM `users` 
WHERE status = 'active' 
ORDER BY created_at DESC 
LIMIT 10;
```

### INSERT
```sql
INSERT INTO `users` (`name`, `email`, `status`) 
VALUES ('John Doe', 'john@example.com', 'active');
```

### UPDATE with WHERE
```sql
UPDATE `users` 
SET `status` = 'inactive' 
WHERE id = 1;
```

### CREATE TABLE with Constraints
```sql
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
```

## 🎯 Design Philosophy

1. **Zero Syntax Errors** - ผู้ใช้ไม่ต้องจำ syntax
2. **Visual Feedback** - เห็นผลลัพธ์ทันที
3. **Safety First** - ป้องกันการลบข้อมูลโดยไม่ตั้งใจ
4. **Production Ready** - ใช้งานจริงได้ทันที
5. **Developer Friendly** - เหมาะกับทั้งมือใหม่และมืออาชีพ

## 📝 License

MIT

## 🤝 Contributing

Pull requests are welcome!

---

Made with ❤️ for MySQL Shell users
