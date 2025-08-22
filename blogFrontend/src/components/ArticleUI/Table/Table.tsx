import React from 'react';
import styles from './Table.module.scss';

export const Table = React.forwardRef<HTMLTableElement, React.HTMLProps<HTMLTableElement>>((props, ref) => (
  <div className={styles.tableContainer}>
    <table ref={ref} className={styles.table} {...props} />
  </div>
));
Table.displayName = 'Table';

export const Thead = (props: React.HTMLProps<HTMLTableSectionElement>) => (
  <thead className={styles.tableHead} {...props} />
);
export const Tbody = (props: React.HTMLProps<HTMLTableSectionElement>) => (
  <tbody className={styles.tableBody} {...props} />
);
export const Tr = (props: React.HTMLProps<HTMLTableRowElement>) => (
  <tr className={styles.tableRow} {...props} />
);
export const Th = (props: React.HTMLProps<HTMLTableHeaderCellElement>) => (
  <th className={styles.tableHeader} {...props} />
);
export const Td = (props: React.HTMLProps<HTMLTableDataCellElement>) => (
  <td className={styles.tableCell} {...props} />
); 