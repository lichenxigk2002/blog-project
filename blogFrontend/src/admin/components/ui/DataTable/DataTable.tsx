import React from 'react';
import styles from './DataTable.module.scss';
import Button from '../Button/Button';

export interface TableColumn<T = any> {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string;
}

export interface TableAction<T = any> {
  key: string;
  label: string;
  variant?: 'primary' | 'danger' | 'success' | 'search' | 'default' | 'warning';
  icon?: React.ReactNode;
  onClick: (record: T) => void;
  disabled?: (record: T) => boolean;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  loading?: boolean;
  className?: string;
  rowKey?: string | ((record: T) => string);
  emptyText?: string;
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  sortField,
  sortOrder = 'asc',
  onSort,
  loading = false,
  className,
  rowKey = 'id',
  emptyText = '暂无数据'
}: DataTableProps<T>) => {
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] || index.toString();
  };

  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  const renderCell = (column: TableColumn<T>, record: T) => {
    const value = record[column.key];

    if (column.render) {
      return column.render(value, record);
    }

    return value;
  };

  if (loading) {
    return (
      <div className={`${styles.table} ${className || ''}`}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
          <div className={styles.loadingText}>加载中...</div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`${styles.table} ${className || ''}`}>
        <div className={styles.empty}>
          <div className={styles.emptyText}>{emptyText}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.table} ${className || ''}`}>
      <div
        className={styles.tableHeader}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns.length + (actions.length > 0 ? 1 : 0)}, 1fr)`
        }}
      >
        {columns.map((column) => (
          <div
            key={column.key}
            className={`${styles.tableHeaderCell} ${column.sortable ? styles.sortable : ''}`}
            style={{ width: column.width }}
            onClick={() => column.sortable && handleSort(column.key)}
          >
            {column.title}
            {column.sortable && sortField === column.key && (
              <span className={styles.sortIcon}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </div>
        ))}
        {actions.length > 0 && (
          <div className={styles.tableHeaderCell} style={{ minWidth: '120px' }}>操作</div>
        )}
      </div>
      <div className={styles.tableBody}>
        {data.map((record, index) => (
          <div
            key={getRowKey(record, index)}
            className={styles.tableRow}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns.length + (actions.length > 0 ? 1 : 0)}, 1fr)`
            }}
          >
            {columns.map((column) => (
              <div
                key={column.key}
                className={styles.tableCell}
                style={{ width: column.width }}
              >
                {renderCell(column, record)}
              </div>
            ))}
            {actions.length > 0 && (
              <div className={styles.tableCell}>
                <div className={styles.actionButtons}>
                  {actions.map((action) => {
                    const isDisabled = action.disabled ? action.disabled(record) : false;
                    return (
                      <Button
                        key={action.key}
                        variant={action.variant || 'primary'}
                        onClick={() => action.onClick(record)}
                        disabled={isDisabled}
                        icon={action.icon}
                      >
                        {action.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataTable; 