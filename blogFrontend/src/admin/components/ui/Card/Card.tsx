import React from 'react';
import styles from './Card.module.scss';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  icon,
  children,
  className = '',
  headerActions,
  onClick
}) => {
  return (
    <div className={`${styles.card} ${className}`} onClick={onClick}>
      {(title || icon || headerActions) && (
        <div className={styles.cardHeader}>
          <div className={styles.headerLeft}>
            {icon && <div className={styles.icon}>{icon}</div>}
            <div className={styles.titleSection}>
              {title && <h3 className={styles.title}>{title}</h3>}
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
          </div>
          {headerActions && (
            <div className={styles.headerActions}>
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div className={styles.cardContent}>
        {children}
      </div>
    </div>
  );
};

export default Card; 