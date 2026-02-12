// MySQL Shell Command Types
export type MySQLShellCommand = 
  | 'connect'
  | 'sql'
  | 'use'
  | 'status'
  | 'exit'
  | 'quit';

// SQL Operation Types
export type SQLOperation =
  | 'CREATE_DATABASE'
  | 'DROP_DATABASE'
  | 'CREATE_TABLE'
  | 'DROP_TABLE'
  | 'ALTER_TABLE'
  | 'INSERT'
  | 'UPDATE'
  | 'DELETE'
  | 'SELECT'
  | 'SELECT_JOIN';

// ALTER TABLE Sub-operations
export type AlterTableOperation =
  | 'ADD_COLUMN'
  | 'DROP_COLUMN'
  | 'MODIFY_COLUMN'
  | 'CHANGE_COLUMN'
  | 'RENAME_TABLE'
  | 'ADD_PRIMARY_KEY'
  | 'DROP_PRIMARY_KEY'
  | 'ADD_INDEX'
  | 'DROP_INDEX'
  | 'ADD_FOREIGN_KEY';

// Data Types
export type MySQLDataType =
  | 'INT'
  | 'BIGINT'
  | 'VARCHAR'
  | 'TEXT'
  | 'DATE'
  | 'DATETIME'
  | 'TIMESTAMP'
  | 'BOOLEAN'
  | 'DECIMAL'
  | 'FLOAT'
  | 'DOUBLE'
  | 'JSON'
  | 'ENUM';

// Column Definition
export interface ColumnDefinition {
  name: string;
  type: MySQLDataType;
  length?: number;
  nullable: boolean;
  defaultValue?: string;
  autoIncrement?: boolean;
  unsigned?: boolean;
  unique?: boolean;
}

// Connection Info
export interface ConnectionInfo {
  user: string;
  host: string;
  port?: number;
  database?: string;
}

// Command History
export interface CommandHistory {
  id: string;
  timestamp: Date;
  command: string;
  type: SQLOperation | MySQLShellCommand;
  success?: boolean;
}

// Form State for different operations
export interface SelectFormState {
  table: string;
  columns: string[];
  where?: string;
  orderBy?: string;
  limit?: number;
  groupBy?: string;
  having?: string;
  joins?: JoinClause[];
}

export interface JoinClause {
  type: 'INNER' | 'LEFT' | 'RIGHT' | 'CROSS' | 'SELF';
  table: string;
  alias?: string;
  on?: string;
}

export interface InsertFormState {
  table: string;
  columns: { name: string; value: string }[];
}

export interface UpdateFormState {
  table: string;
  sets: { column: string; value: string }[];
  where?: string;
}

export interface DeleteFormState {
  table: string;
  where?: string;
}

export interface CreateTableFormState {
  tableName: string;
  columns: ColumnDefinition[];
  primaryKey?: string[];
  indexes?: IndexDefinition[];
  foreignKeys?: ForeignKeyDefinition[];
}

export interface IndexDefinition {
  name: string;
  columns: string[];
  unique?: boolean;
}

export interface ForeignKeyDefinition {
  name: string;
  column: string;
  referenceTable: string;
  referenceColumn: string;
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
}

export interface AlterTableFormState {
  tableName: string;
  operation: AlterTableOperation;
  columnDef?: ColumnDefinition;
  oldColumnName?: string;
  newTableName?: string;
  indexDef?: IndexDefinition;
  foreignKeyDef?: ForeignKeyDefinition;
  primaryKeyColumns?: string[];
}
