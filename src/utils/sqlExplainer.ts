// SQL Explainer - อธิบายคำสั่ง SQL ให้เข้าใจง่าย

export interface SQLExplanation {
  summary: string;
  details: string[];
  warning?: string;
}

export const explainSQL = (sql: string): SQLExplanation | null => {
  const trimmedSQL = sql.trim().toUpperCase();

  // CREATE DATABASE
  if (trimmedSQL.startsWith('CREATE DATABASE')) {
    const match = sql.match(/CREATE DATABASE `(.+?)`/i);
    const dbName = match?.[1] || 'database';
    return {
      summary: `สร้างฐานข้อมูลใหม่ชื่อ "${dbName}"`,
      details: [
        `สร้าง Database เปล่า ๆ สำหรับเก็บ Tables`,
        `ใช้คำสั่ง \\use ${dbName} เพื่อเข้าใช้งาน`,
      ],
    };
  }

  // DROP DATABASE
  if (trimmedSQL.startsWith('DROP DATABASE')) {
    const match = sql.match(/DROP DATABASE `(.+?)`/i);
    const dbName = match?.[1] || 'database';
    return {
      summary: `ลบฐานข้อมูล "${dbName}" ถาวร`,
      details: [
        `ลบ Database และข้อมูลทั้งหมดภายใน`,
        `ไม่สามารถกู้คืนได้`,
      ],
      warning: `อันตราย! ควร Backup ก่อนลบ`,
    };
  }

  // CREATE TABLE
  if (trimmedSQL.startsWith('CREATE TABLE')) {
    const match = sql.match(/CREATE TABLE `(.+?)`/i);
    const tableName = match?.[1] || 'table';
    const columnCount = (sql.match(/`\w+`\s+(INT|VARCHAR|TEXT|DATE|DATETIME|TIMESTAMP|BOOLEAN|DECIMAL|FLOAT|DOUBLE|JSON|ENUM|BIGINT)/gi) || []).length;
    const hasPK = /PRIMARY KEY/i.test(sql);
    const hasFK = /FOREIGN KEY/i.test(sql);
    const hasIndex = /INDEX/i.test(sql);

    const details = [`สร้างตาราง "${tableName}" พร้อม ${columnCount} คอลัมน์`];
    if (hasPK) details.push(`มี Primary Key (ระบุแถวได้ไม่ซ้ำ)`);
    if (hasFK) details.push(`มี Foreign Key (เชื่อมโยงกับตารางอื่น)`);
    if (hasIndex) details.push(`มี Index (ค้นหาเร็วขึ้น)`);

    return {
      summary: `สร้างตาราง "${tableName}" พร้อม ${columnCount} คอลัมน์`,
      details,
    };
  }

  // DROP TABLE
  if (trimmedSQL.startsWith('DROP TABLE')) {
    const match = sql.match(/DROP TABLE `(.+?)`/i);
    const tableName = match?.[1] || 'table';
    return {
      summary: `ลบตาราง "${tableName}" และข้อมูลทั้งหมด`,
      details: [
        `ลบตารางและข้อมูลทั้งหมด`,
        `ไม่สามารถกู้คืนได้`,
      ],
      warning: `อันตราย! ควร Backup ก่อนลบ`,
    };
  }

  // ALTER TABLE
  if (trimmedSQL.startsWith('ALTER TABLE')) {
    const match = sql.match(/ALTER TABLE `(.+?)`/i);
    const tableName = match?.[1] || 'table';
    
    if (/ADD COLUMN/i.test(sql)) {
      const colMatch = sql.match(/ADD COLUMN `(.+?)`/i);
      const colName = colMatch?.[1] || 'column';
      return {
        summary: `เพิ่มคอลัมน์ "${colName}" ในตาราง "${tableName}"`,
        details: [
          `เพิ่มคอลัมน์ใหม่เข้าไปในตาราง`,
          `ข้อมูลเดิมไม่หาย คอลัมน์ใหม่จะว่าง`,
        ],
      };
    }

    if (/DROP COLUMN/i.test(sql)) {
      const colMatch = sql.match(/DROP COLUMN `(.+?)`/i);
      const colName = colMatch?.[1] || 'column';
      return {
        summary: `ลบคอลัมน์ "${colName}" จากตาราง "${tableName}"`,
        details: [`ลบคอลัมน์และข้อมูลในคอลัมน์นั้นทั้งหมด`],
        warning: `ข้อมูลในคอลัมน์นี้จะหายถาวร`,
      };
    }

    if (/RENAME TO/i.test(sql)) {
      const newMatch = sql.match(/RENAME TO `(.+?)`/i);
      const newName = newMatch?.[1] || 'new_table';
      return {
        summary: `เปลี่ยนชื่อตาราง "${tableName}" เป็น "${newName}"`,
        details: [`เปลี่ยนชื่อตาราง ข้อมูลไม่เปลี่ยน`],
      };
    }

    return {
      summary: `แก้ไขโครงสร้างตาราง "${tableName}"`,
      details: [`แก้ไขโครงสร้างตาราง (เพิ่ม/ลบ/แก้ไข คอลัมน์หรือ Index)`],
    };
  }

  // INSERT
  if (trimmedSQL.startsWith('INSERT INTO')) {
    const match = sql.match(/INSERT INTO `(.+?)`/i);
    const tableName = match?.[1] || 'table';
    const columnCount = (sql.match(/`\w+`/g) || []).length - 1;
    
    return {
      summary: `เพิ่มข้อมูล 1 แถวใหม่ในตาราง "${tableName}"`,
      details: [
        `เพิ่มข้อมูลใหม่เข้าไปในตาราง`,
        `กำหนดค่าให้กับ ${columnCount} คอลัมน์`,
      ],
    };
  }

  // UPDATE
  if (trimmedSQL.startsWith('UPDATE')) {
    const match = sql.match(/UPDATE `(.+?)`/i);
    const tableName = match?.[1] || 'table';
    const hasWhere = /WHERE/i.test(sql);
    const setCount = (sql.match(/`\w+`\s*=/g) || []).length;

    if (!hasWhere) {
      return {
        summary: `แก้ไขข้อมูลทั้งตาราง "${tableName}"`,
        details: [
          `แก้ไขค่า ${setCount} คอลัมน์`,
          `ไม่มี WHERE = แก้ไขทุกแถว!`,
        ],
        warning: `อันตราย! จะแก้ไขทุกแถว`,
      };
    }

    return {
      summary: `แก้ไขข้อมูลในตาราง "${tableName}"`,
      details: [
        `แก้ไขค่า ${setCount} คอลัมน์`,
        `แก้ไขเฉพาะแถวที่ตรงกับเงื่อนไข WHERE`,
      ],
    };
  }

  // DELETE
  if (trimmedSQL.startsWith('DELETE FROM')) {
    const match = sql.match(/DELETE FROM `(.+?)`/i);
    const tableName = match?.[1] || 'table';
    const hasWhere = /WHERE/i.test(sql);

    if (!hasWhere) {
      return {
        summary: `ลบข้อมูลทั้งตาราง "${tableName}"`,
        details: [
          `ไม่มี WHERE = ลบทุกแถว!`,
          `โครงสร้างตารางยังอยู่`,
        ],
        warning: `อันตราย! จะลบทุกแถว`,
      };
    }

    return {
      summary: `ลบข้อมูลจากตาราง "${tableName}"`,
      details: [
        `ลบเฉพาะแถวที่ตรงกับเงื่อนไข WHERE`,
        `ไม่สามารถกู้คืนได้`,
      ],
    };
  }

  // SELECT
  if (trimmedSQL.startsWith('SELECT')) {
    const match = sql.match(/FROM `(.+?)`/i);
    const tableName = match?.[1] || 'table';
    const hasWhere = /WHERE/i.test(sql);
    const hasJoin = /JOIN/i.test(sql);
    const hasGroupBy = /GROUP BY/i.test(sql);
    const hasOrderBy = /ORDER BY/i.test(sql);
    const hasLimit = /LIMIT/i.test(sql);
    const isSelectAll = /SELECT \*/i.test(sql);

    const details = [
      isSelectAll ? `ดึงข้อมูลทุกคอลัมน์จากตาราง "${tableName}"` : `ดึงข้อมูลบางคอลัมน์จากตาราง "${tableName}"`,
    ];

    if (hasWhere) details.push(`กรองด้วยเงื่อนไข WHERE`);
    if (hasJoin) details.push(`รวมข้อมูลจากหลายตาราง (JOIN)`);
    if (hasGroupBy) details.push(`จัดกลุ่มข้อมูล (GROUP BY)`);
    if (hasOrderBy) details.push(`เรียงลำดับผลลัพธ์ (ORDER BY)`);
    if (hasLimit) details.push(`จำกัดจำนวนแถว (LIMIT)`);

    return {
      summary: `ค้นหาข้อมูลจากตาราง "${tableName}"`,
      details,
    };
  }

  return null;
};
