import React from 'react';
import styles from './LoadingMore.module.scss';

const LoadingMore: React.FC = () => {
  return (
    <div className={styles.loadingMore}>
      <div className={styles.loadingDot}></div>
      <div className={styles.loadingDot}></div>
      <div className={styles.loadingDot}></div>
    </div>
  );
};

export default LoadingMore; 