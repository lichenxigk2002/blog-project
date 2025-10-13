import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'default' | 'search' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'medium',
  icon,
  children,
  className = '',
  ...rest
}) => {
  const isIconOnly = icon && !children;


  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${isIconOnly ? styles.iconOnly : ''} ${className}`}
      {...rest}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button; 