import React from 'react';
import styles from './StatsCard.module.scss';

export interface StatItem {
  title: string;
  value: number | string;
  unit?: string;
  extra?: React.ReactNode;
}

interface StatsCardProps {
  stats: StatItem[];
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats, className }) => {
  return (
    <div className={`${styles.stats} ${className || ''}`}>
      {stats.map((stat, index) => (
        <div key={index} className={styles.statCard}>
          <div className={styles.statTitle}>{stat.title}</div>
          <div className={styles.statValue}>
            {stat.value}
            {stat.unit && <span className={styles.statUnit}>{stat.unit}</span>}
            {stat.extra}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard; 