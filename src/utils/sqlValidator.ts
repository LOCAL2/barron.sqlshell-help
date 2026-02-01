// SQL Validator - ตรวจสอบ Syntax และ Validation

export interface ValidationError {
  type: 'error' | 'warning';
  message: string;
  suggestion?: string;
}

export const validateSQL = (sql: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  const trimmedSQL = sql.trim();

  if (!trimmedSQL) {
    errors.push({
      type: 'error',
      message: 'คำสั่ง SQL ว่างเปล่า',
      suggestion: 'กรุณากรอกข้อมูลในฟอร์มให้ครบถ้วน',
    });
    return errors;
  }

  // ตรวจสอบว่าขึ้นต้นด้วยคำสั่งที่ถูกต้อง
  const validCommands = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'SHOW', 'DESCRIBE'];
  const startsWithValid = validCommands.some(cmd => trimmedSQL.toUpperCase().startsWith(cmd));
  
  if (!startsWithValid) {
    errors.push({
      type: 'error',
      message: 'คำสั่ง SQL ไม่ถูกต้อง',
      suggestion: 'ต้องขึ้นต้นด้วย SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, หรือ ALTER',
    });
  }

  // ตรวจสอบ Backticks
  const backtickCount = (sql.match(/`/g) || []).length;
  if (backtickCount % 2 !== 0) {
    errors.push({
      type: 'error',
      message: 'Backticks (`) ไม่ครบคู่',
      suggestion: 'ชื่อ Table และ Column ต้องครอบด้วย ` ` ให้ครบ',
    });
  }

  // ตรวจสอบ Single Quotes
  const singleQuoteCount = (sql.match(/'/g) || []).length;
  if (singleQuoteCount % 2 !== 0) {
    errors.push({
      type: 'error',
      message: 'Single quotes (\') ไม่ครบคู่',
      suggestion: 'String values ต้องครอบด้วย \' \' ให้ครบ',
    });
  }

  // ตรวจสอบ Parentheses
  const openParen = (sql.match(/\(/g) || []).length;
  const closeParen = (sql.match(/\)/g) || []).length;
  if (openParen !== closeParen) {
    errors.push({
      type: 'error',
      message: 'วงเล็บ () ไม่ครบคู่',
      suggestion: 'ตรวจสอบวงเล็บเปิด ( และวงเล็บปิด ) ให้ครบ',
    });
  }

  // ตรวจสอบ Semicolon
  if (!trimmedSQL.endsWith(';')) {
    errors.push({
      type: 'warning',
      message: 'ไม่มี semicolon (;) ปิดท้าย',
      suggestion: 'ควรใส่ ; ปิดท้ายคำสั่ง SQL',
    });
  }

  // ตรวจสอบเฉพาะแต่ละคำสั่ง
  const upperSQL = trimmedSQL.toUpperCase();

  // CREATE TABLE
  if (upperSQL.startsWith('CREATE TABLE')) {
    if (!sql.match(/CREATE TABLE `\w+`/i)) {
      errors.push({
        type: 'error',
        message: 'ไม่มีชื่อ Table',
        suggestion: 'ต้องระบุชื่อ Table หลัง CREATE TABLE',
      });
    }

    if (!sql.match(/\(/)) {
      errors.push({
        type: 'error',
        message: 'ไม่มีการกำหนด Columns',
        suggestion: 'ต้องมี () และกำหนด Columns ภายใน',
      });
    }

    // ตรวจสอบว่ามี Column อย่างน้อย 1 อัน
    const columnPattern = /`\w+`\s+(INT|VARCHAR|TEXT|DATE|DATETIME|TIMESTAMP|BOOLEAN|DECIMAL|FLOAT|DOUBLE|JSON|ENUM|BIGINT)/gi;
    const columns = sql.match(columnPattern);
    if (!columns || columns.length === 0) {
      errors.push({
        type: 'error',
        message: 'ไม่มี Column definition',
        suggestion: 'ต้องกำหนด Column อย่างน้อย 1 อัน พร้อม Data Type',
      });
    }
  }

  // INSERT
  if (upperSQL.startsWith('INSERT INTO')) {
    if (!sql.match(/INSERT INTO `\w+`/i)) {
      errors.push({
        type: 'error',
        message: 'ไม่มีชื่อ Table',
        suggestion: 'ต้องระบุชื่อ Table หลัง INSERT INTO',
      });
    }

    if (!sql.match(/VALUES/i)) {
      errors.push({
        type: 'error',
        message: 'ไม่มี VALUES clause',
        suggestion: 'ต้องมี VALUES (...) เพื่อระบุค่าที่จะ Insert',
      });
    }

    // ตรวจสอบจำนวน Columns vs Values
    const columnsMatch = sql.match(/\(([^)]+)\)\s*VALUES/i);
    const valuesMatch = sql.match(/VALUES\s*\(([^)]+)\)/i);
    
    if (columnsMatch && valuesMatch) {
      const columnCount = columnsMatch[1].split(',').length;
      const valueCount = valuesMatch[1].split(',').length;
      
      if (columnCount !== valueCount) {
        errors.push({
          type: 'error',
          message: `จำนวน Columns (${columnCount}) ไม่ตรงกับจำนวน Values (${valueCount})`,
          suggestion: 'จำนวน Columns และ Values ต้องเท่ากัน',
        });
      }
    }
  }

  // UPDATE
  if (upperSQL.startsWith('UPDATE')) {
    if (!sql.match(/UPDATE `\w+`/i)) {
      errors.push({
        type: 'error',
        message: 'ไม่มีชื่อ Table',
        suggestion: 'ต้องระบุชื่อ Table หลัง UPDATE',
      });
    }

    if (!sql.match(/SET/i)) {
      errors.push({
        type: 'error',
        message: 'ไม่มี SET clause',
        suggestion: 'ต้องมี SET เพื่อระบุค่าที่จะ Update',
      });
    }

    if (!sql.match(/WHERE/i)) {
      errors.push({
        type: 'warning',
        message: '⚠️ ไม่มี WHERE clause',
        suggestion: 'จะ UPDATE ทุกแถวในตาราง! ควรใส่ WHERE เสมอ',
      });
    }
  }

  // DELETE
  if (upperSQL.startsWith('DELETE FROM')) {
    if (!sql.match(/DELETE FROM `\w+`/i)) {
      errors.push({
        type: 'error',
        message: 'ไม่มีชื่อ Table',
        suggestion: 'ต้องระบุชื่อ Table หลัง DELETE FROM',
      });
    }

    if (!sql.match(/WHERE/i)) {
      errors.push({
        type: 'warning',
        message: '⚠️ ไม่มี WHERE clause',
        suggestion: 'จะลบทุกแถวในตาราง! ควรใส่ WHERE เสมอ',
      });
    }
  }

  // SELECT
  if (upperSQL.startsWith('SELECT')) {
    if (!sql.match(/FROM/i)) {
      errors.push({
        type: 'error',
        message: 'ไม่มี FROM clause',
        suggestion: 'ต้องมี FROM เพื่อระบุ Table ที่จะ SELECT',
      });
    }

    if (!sql.match(/FROM `\w+`/i)) {
      errors.push({
        type: 'error',
        message: 'ไม่มีชื่อ Table',
        suggestion: 'ต้องระบุชื่อ Table หลัง FROM',
      });
    }

    // ตรวจสอบ GROUP BY กับ Aggregate Functions
    if (sql.match(/GROUP BY/i)) {
      const hasAggregate = /COUNT|SUM|AVG|MAX|MIN/i.test(sql);
      if (!hasAggregate) {
        errors.push({
          type: 'warning',
          message: 'มี GROUP BY แต่ไม่มี Aggregate Function',
          suggestion: 'ควรใช้ COUNT(), SUM(), AVG(), MAX(), หรือ MIN() กับ GROUP BY',
        });
      }
    }

    // ตรวจสอบ HAVING ต้องมี GROUP BY
    if (sql.match(/HAVING/i) && !sql.match(/GROUP BY/i)) {
      errors.push({
        type: 'error',
        message: 'มี HAVING แต่ไม่มี GROUP BY',
        suggestion: 'HAVING ต้องใช้คู่กับ GROUP BY เสมอ',
      });
    }
  }

  // DROP
  if (upperSQL.startsWith('DROP')) {
    if (!sql.match(/DROP (DATABASE|TABLE) `\w+`/i)) {
      errors.push({
        type: 'error',
        message: 'ไม่มีชื่อ Database/Table',
        suggestion: 'ต้องระบุชื่อ Database หรือ Table ที่จะลบ',
      });
    }
  }

  // ALTER TABLE
  if (upperSQL.startsWith('ALTER TABLE')) {
    if (!sql.match(/ALTER TABLE `\w+`/i)) {
      errors.push({
        type: 'error',
        message: 'ไม่มีชื่อ Table',
        suggestion: 'ต้องระบุชื่อ Table หลัง ALTER TABLE',
      });
    }

    const hasOperation = /ADD|DROP|MODIFY|CHANGE|RENAME/i.test(sql);
    if (!hasOperation) {
      errors.push({
        type: 'error',
        message: 'ไม่มี ALTER operation',
        suggestion: 'ต้องระบุ ADD, DROP, MODIFY, CHANGE, หรือ RENAME',
      });
    }
  }

  // ตรวจสอบ Reserved Keywords ที่ไม่ควรใช้เป็นชื่อ
  const reservedKeywords = ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'TABLE', 'DATABASE', 'INDEX', 'KEY', 'PRIMARY', 'FOREIGN', 'REFERENCES', 'ON', 'AND', 'OR', 'NOT', 'NULL', 'DEFAULT', 'AUTO_INCREMENT'];
  
  const tableNames = sql.match(/(?:TABLE|INTO|FROM|UPDATE)\s+`(\w+)`/gi);
  if (tableNames) {
    tableNames.forEach(match => {
      const name = match.match(/`(\w+)`/)?.[1]?.toUpperCase();
      if (name && reservedKeywords.includes(name)) {
        errors.push({
          type: 'warning',
          message: `"${name}" เป็น Reserved Keyword`,
          suggestion: 'ไม่ควรใช้ Reserved Keywords เป็นชื่อ Table/Column',
        });
      }
    });
  }

  return errors;
};
