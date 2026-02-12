import type {
  SelectFormState,
  InsertFormState,
  UpdateFormState,
  DeleteFormState,
  CreateTableFormState,
  AlterTableFormState,
  ConnectionInfo,
} from '../types';

// MySQL Shell Commands Generator
export const generateMySQLShellCommand = {
  connect: (conn: ConnectionInfo): string => {
    const port = conn.port ? `:${conn.port}` : '';
    return `\\c ${conn.user}@${conn.host}${port}`;
  },
  
  use: (database: string): string => {
    return `\\use ${database}`;
  },
  
  sql: (): string => {
    return `\\sql`;
  },
  
  status: (): string => {
    return `\\status`;
  },
  
  exit: (): string => {
    return `\\exit`;
  },
};

// SQL Generator
export const generateSQL = {
  // Database Operations
  createDatabase: (name: string): string => {
    return `CREATE DATABASE \`${name}\`;`;
  },

  dropDatabase: (name: string): string => {
    return `DROP DATABASE \`${name}\`;`;
  },

  // Table Operations
  createTable: (state: CreateTableFormState): string => {
    const columns = state.columns.map(col => {
      let def = `  \`${col.name}\` ${col.type}`;
      
      if (col.length) {
        def += `(${col.length})`;
      }
      
      if (col.unsigned) {
        def += ' UNSIGNED';
      }
      
      if (!col.nullable) {
        def += ' NOT NULL';
      }
      
      if (col.autoIncrement) {
        def += ' AUTO_INCREMENT';
      }
      
      if (col.defaultValue !== undefined && col.defaultValue !== '') {
        def += ` DEFAULT ${col.defaultValue}`;
      }
      
      if (col.unique) {
        def += ' UNIQUE';
      }
      
      return def;
    }).join(',\n');

    let sql = `CREATE TABLE \`${state.tableName}\` (\n${columns}`;

    if (state.primaryKey && state.primaryKey.length > 0) {
      const pkCols = state.primaryKey.map(c => `\`${c}\``).join(', ');
      sql += `,\n  PRIMARY KEY (${pkCols})`;
    }

    if (state.indexes && state.indexes.length > 0) {
      state.indexes.forEach(idx => {
        const idxCols = idx.columns.map(c => `\`${c}\``).join(', ');
        const unique = idx.unique ? 'UNIQUE ' : '';
        sql += `,\n  ${unique}INDEX \`${idx.name}\` (${idxCols})`;
      });
    }

    if (state.foreignKeys && state.foreignKeys.length > 0) {
      state.foreignKeys.forEach(fk => {
        sql += `,\n  CONSTRAINT \`${fk.name}\` FOREIGN KEY (\`${fk.column}\`) REFERENCES \`${fk.referenceTable}\`(\`${fk.referenceColumn}\`)`;
        if (fk.onDelete) sql += ` ON DELETE ${fk.onDelete}`;
        if (fk.onUpdate) sql += ` ON UPDATE ${fk.onUpdate}`;
      });
    }

    sql += '\n);';
    return sql;
  },

  dropTable: (tableName: string): string => {
    return `DROP TABLE \`${tableName}\`;`;
  },

  alterTable: (state: AlterTableFormState): string => {
    const table = `\`${state.tableName}\``;
    
    switch (state.operation) {
      case 'ADD_COLUMN': {
        if (!state.columnDef) return '';
        const col = state.columnDef;
        let def = `${col.type}`;
        if (col.length) def += `(${col.length})`;
        if (col.unsigned) def += ' UNSIGNED';
        if (!col.nullable) def += ' NOT NULL';
        if (col.defaultValue) def += ` DEFAULT ${col.defaultValue}`;
        if (col.unique) def += ' UNIQUE';
        return `ALTER TABLE ${table} ADD COLUMN \`${col.name}\` ${def};`;
      }
      
      case 'DROP_COLUMN':
        return `ALTER TABLE ${table} DROP COLUMN \`${state.columnDef?.name}\`;`;
      
      case 'MODIFY_COLUMN': {
        if (!state.columnDef) return '';
        const col = state.columnDef;
        let def = `${col.type}`;
        if (col.length) def += `(${col.length})`;
        if (col.unsigned) def += ' UNSIGNED';
        if (!col.nullable) def += ' NOT NULL';
        if (col.defaultValue) def += ` DEFAULT ${col.defaultValue}`;
        return `ALTER TABLE ${table} MODIFY COLUMN \`${col.name}\` ${def};`;
      }
      
      case 'CHANGE_COLUMN': {
        if (!state.columnDef || !state.oldColumnName) return '';
        const col = state.columnDef;
        let def = `${col.type}`;
        if (col.length) def += `(${col.length})`;
        if (!col.nullable) def += ' NOT NULL';
        return `ALTER TABLE ${table} CHANGE COLUMN \`${state.oldColumnName}\` \`${col.name}\` ${def};`;
      }
      
      case 'RENAME_TABLE':
        return `ALTER TABLE ${table} RENAME TO \`${state.newTableName}\`;`;
      
      case 'ADD_PRIMARY_KEY': {
        const cols = state.primaryKeyColumns?.map(c => `\`${c}\``).join(', ');
        return `ALTER TABLE ${table} ADD PRIMARY KEY (${cols});`;
      }
      
      case 'DROP_PRIMARY_KEY':
        return `ALTER TABLE ${table} DROP PRIMARY KEY;`;
      
      case 'ADD_INDEX': {
        if (!state.indexDef) return '';
        const cols = state.indexDef.columns.map(c => `\`${c}\``).join(', ');
        const unique = state.indexDef.unique ? 'UNIQUE ' : '';
        return `ALTER TABLE ${table} ADD ${unique}INDEX \`${state.indexDef.name}\` (${cols});`;
      }
      
      case 'DROP_INDEX':
        return `ALTER TABLE ${table} DROP INDEX \`${state.indexDef?.name}\`;`;
      
      case 'ADD_FOREIGN_KEY': {
        if (!state.foreignKeyDef) return '';
        const fk = state.foreignKeyDef;
        let sql = `ALTER TABLE ${table} ADD CONSTRAINT \`${fk.name}\` FOREIGN KEY (\`${fk.column}\`) REFERENCES \`${fk.referenceTable}\`(\`${fk.referenceColumn}\`)`;
        if (fk.onDelete) sql += ` ON DELETE ${fk.onDelete}`;
        if (fk.onUpdate) sql += ` ON UPDATE ${fk.onUpdate}`;
        return sql + ';';
      }
      
      default:
        return '';
    }
  },

  // Data Operations
  select: (state: SelectFormState): string => {
    const cols = state.columns.length > 0 ? state.columns.map(c => `\`${c}\``).join(', ') : '*';
    let sql = `SELECT ${cols} FROM \`${state.table}\``;
    
    if (state.joins && state.joins.length > 0) {
      state.joins.forEach(join => {
        if (join.type === 'CROSS') {
          // CROSS JOIN ไม่ต้องมี ON
          sql += ` CROSS JOIN \`${join.table}\``;
        } else if (join.type === 'SELF') {
          // Self Join ต้องมี alias
          const alias = join.alias || `${join.table}_2`;
          sql += ` INNER JOIN \`${join.table}\` AS \`${alias}\` ON ${join.on}`;
        } else {
          // INNER, LEFT, RIGHT JOIN
          sql += ` ${join.type} JOIN \`${join.table}\` ON ${join.on}`;
        }
      });
    }
    
    if (state.where) {
      sql += ` WHERE ${state.where}`;
    }
    
    if (state.groupBy) {
      sql += ` GROUP BY ${state.groupBy}`;
    }
    
    if (state.having) {
      sql += ` HAVING ${state.having}`;
    }
    
    if (state.orderBy) {
      sql += ` ORDER BY ${state.orderBy}`;
    }
    
    if (state.limit) {
      sql += ` LIMIT ${state.limit}`;
    }
    
    return sql + ';';
  },

  insert: (state: InsertFormState): string => {
    const cols = state.columns.map(c => `\`${c.name}\``).join(', ');
    const vals = state.columns.map(c => c.value).join(', ');
    return `INSERT INTO \`${state.table}\` (${cols}) VALUES (${vals});`;
  },

  update: (state: UpdateFormState): string => {
    const sets = state.sets.map(s => `\`${s.column}\` = ${s.value}`).join(', ');
    let sql = `UPDATE \`${state.table}\` SET ${sets}`;
    
    if (state.where) {
      sql += ` WHERE ${state.where}`;
    }
    
    return sql + ';';
  },

  delete: (state: DeleteFormState): string => {
    let sql = `DELETE FROM \`${state.table}\``;
    
    if (state.where) {
      sql += ` WHERE ${state.where}`;
    }
    
    return sql + ';';
  },
};

// Validation helpers
export const validateSQL = {
  isDangerousOperation: (sql: string): boolean => {
    const dangerous = /^(DROP|DELETE|UPDATE)\s/i;
    return dangerous.test(sql.trim());
  },

  isFullTableOperation: (sql: string): boolean => {
    const fullTable = /^(DELETE|UPDATE)\s.*(?!WHERE)/i;
    return fullTable.test(sql.trim());
  },

  hasWhereClause: (sql: string): boolean => {
    return /WHERE/i.test(sql);
  },
};
