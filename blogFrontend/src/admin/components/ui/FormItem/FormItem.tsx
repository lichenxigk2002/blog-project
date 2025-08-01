import React from 'react';
import styles from './FormItem.module.scss';

export interface FormItemProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const FormItem: React.FC<FormItemProps> = ({
  children,
  className = '',
  style
}) => {
  return (
    <div className={`${styles.formItem} ${className}`} style={style}>
      {children}
    </div>
  );
};

export default FormItem; 