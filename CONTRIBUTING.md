# 🤝 Contributing Guide

ขอบคุณที่สนใจร่วมพัฒนา MySQL Shell Command Generator!

## 🎯 วิธีการมีส่วนร่วม

### 1. Report Bugs

พบ Bug? สร้าง Issue พร้อมข้อมูล:
- คำอธิบายปัญหา
- ขั้นตอนการทำซ้ำ
- ผลลัพธ์ที่คาดหวัง vs ที่เกิดขึ้นจริง
- Screenshot (ถ้ามี)
- Browser และ OS

### 2. Suggest Features

มีไอเดีย? สร้าง Feature Request:
- คำอธิบายฟีเจอร์
- Use case
- ตัวอย่างการใช้งาน
- Mockup (ถ้ามี)

### 3. Submit Pull Requests

ต้องการเขียนโค้ด? ทำตามขั้นตอนนี้:

#### Step 1: Fork และ Clone

```bash
# Fork repository บน GitHub
# แล้ว Clone มา

git clone https://github.com/YOUR_USERNAME/mysqlsh-generator.git
cd mysqlsh-generator
```

#### Step 2: สร้าง Branch

```bash
# สร้าง branch ใหม่
git checkout -b feature/your-feature-name
# หรือ
git checkout -b fix/bug-description
```

#### Step 3: ติดตั้ง Dependencies

```bash
bun install
# หรือ
npm install
```

#### Step 4: เขียนโค้ด

- ทำตาม Code Style ของโปรเจกต์
- เขียน TypeScript แบบ Type-safe
- เพิ่ม Comment สำหรับโค้ดที่ซับซ้อน
- ทดสอบให้แน่ใจว่าทำงานได้

#### Step 5: Test

```bash
# รัน dev server
bun run dev

# ทดสอบ build
bun run build

# ทดสอบ production build
bun run preview

# Type check
bun run type-check

# Lint
bun run lint
```

#### Step 6: Commit

```bash
# Commit ด้วย message ที่ชัดเจน
git add .
git commit -m "feat: add ALTER TABLE support"
# หรือ
git commit -m "fix: resolve SELECT query generation bug"
```

**Commit Message Format:**
- `feat:` - ฟีเจอร์ใหม่
- `fix:` - แก้ bug
- `docs:` - แก้ไข documentation
- `style:` - แก้ไข formatting, ไม่กระทบโค้ด
- `refactor:` - ปรับปรุงโค้ด
- `test:` - เพิ่ม tests
- `chore:` - งานอื่น ๆ

#### Step 7: Push

```bash
git push origin feature/your-feature-name
```

#### Step 8: Create Pull Request

1. ไปที่ GitHub Repository
2. คลิก "New Pull Request"
3. เลือก branch ของคุณ
4. กรอกรายละเอียด:
   - Title ที่ชัดเจน
   - คำอธิบายการเปลี่ยนแปลง
   - Screenshot (ถ้ามี)
   - Related Issues (ถ้ามี)

---

## 📝 Code Style Guide

### TypeScript

```typescript
// ✅ ดี - ใช้ Type อย่างชัดเจน
interface User {
  id: number;
  name: string;
  email: string;
}

function getUser(id: number): User {
  // ...
}

// ❌ ไม่ดี - ไม่มี Type
function getUser(id) {
  // ...
}
```

### React Components

```typescript
// ✅ ดี - Functional Component พร้อม Props Type
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function Button({ label, onClick, disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// ❌ ไม่ดี - ไม่มี Props Type
export default function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}
```

### CSS

```css
/* ✅ ดี - ใช้ CSS Variables */
.button {
  background: var(--primary);
  color: white;
  padding: 0.75rem 1.5rem;
}

/* ❌ ไม่ดี - Hard-coded values */
.button {
  background: #3b82f6;
  color: white;
  padding: 12px 24px;
}
```

### Naming Conventions

```typescript
// Components - PascalCase
export default function UserProfile() {}

// Functions - camelCase
function getUserById(id: number) {}

// Constants - UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// Types/Interfaces - PascalCase
interface UserData {}
type QueryResult = {};

// CSS Classes - kebab-case
.user-profile {}
.btn-primary {}
```

---

## 🏗️ Project Structure

```
src/
├── components/          # React Components
│   ├── forms/          # Form Components
│   ├── *.tsx           # Shared Components
├── utils/              # Utility Functions
│   └── sqlGenerator.ts # SQL Generation Logic
├── types/              # TypeScript Types
│   └── index.ts        # Type Definitions
├── App.tsx             # Main App Component
├── App.css             # Global Styles
└── main.tsx            # Entry Point
```

---

## ✅ Pull Request Checklist

ก่อน Submit PR ตรวจสอบว่า:

- [ ] โค้ดทำงานได้ถูกต้อง
- [ ] ไม่มี TypeScript errors
- [ ] ไม่มี ESLint warnings
- [ ] Build ผ่าน (`bun run build`)
- [ ] ทดสอบใน Browser แล้ว
- [ ] เขียน Commit message ที่ชัดเจน
- [ ] Update Documentation (ถ้าจำเป็น)
- [ ] เพิ่ม Screenshot (ถ้าเป็น UI change)

---

## 🎨 Design Guidelines

### UX Principles

1. **เลือก มากกว่า พิมพ์**
   - ใช้ Dropdown, Checkbox มากกว่า Text Input
   - ลด syntax error

2. **Preview ก่อน Execute**
   - แสดงคำสั่งที่จะ Execute เสมอ
   - ให้ผู้ใช้ตรวจสอบก่อน

3. **Safety First**
   - Confirm สำหรับคำสั่งอันตราย
   - Warning สำหรับ Full Table Operations

4. **Clear Feedback**
   - แสดง Success/Error Message
   - ใช้สีและ Icon ที่เหมาะสม

### UI Guidelines

```typescript
// Colors
const colors = {
  primary: '#3b82f6',    // Blue - Actions
  danger: '#ef4444',     // Red - Dangerous
  success: '#10b981',    // Green - Success
  warning: '#f59e0b',    // Orange - Warning
};

// Spacing
const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
};
```

---

## 🐛 Debugging Tips

### Dev Tools

```bash
# เปิด React DevTools
# ติดตั้ง Extension: React Developer Tools

# เปิด TypeScript Errors
bun run type-check

# เปิด ESLint
bun run lint
```

### Common Issues

**Issue: Build Failed**
```bash
# ลบ cache และ build ใหม่
rm -rf node_modules dist
bun install
bun run build
```

**Issue: Type Errors**
```bash
# ตรวจสอบ types
bun run type-check

# แก้ไข type definitions ใน src/types/
```

**Issue: CSS ไม่ทำงาน**
```bash
# ตรวจสอบว่า import CSS แล้ว
import './App.css';

# ตรวจสอบ CSS Variables
:root {
  --primary: #3b82f6;
}
```

---

## 📚 Resources

### Documentation
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Vite Docs](https://vitejs.dev)
- [MySQL Docs](https://dev.mysql.com/doc/)

### Tools
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Lucide Icons](https://lucide.dev)

---

## 🙏 Code of Conduct

### Be Respectful
- ใช้ภาษาที่สุภาพ
- เคารพความคิดเห็นของผู้อื่น
- ให้ Feedback แบบสร้างสรรค์

### Be Helpful
- ช่วยเหลือผู้อื่น
- แชร์ความรู้
- ตอบคำถามอย่างละเอียด

### Be Professional
- ไม่ใช้ภาษาหยาบคาย
- ไม่ Spam
- ไม่โพสต์เนื้อหาที่ไม่เหมาะสม

---

## 📞 Contact

- GitHub Issues: [Report Bug / Request Feature](https://github.com/yourusername/mysqlsh-generator/issues)
- Email: your.email@example.com
- Twitter: @yourusername

---

**Thank you for contributing! 🎉**

Made with ❤️ by the community
