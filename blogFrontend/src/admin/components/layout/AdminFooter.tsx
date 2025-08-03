'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import styles from './AdminFooter.module.scss';

const AdminFooter: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const version = useSelector((state: RootState) => state.settings.systemInfo.version);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.left}>
          <p>© 孤芳不自赏的博客管理系统 | 技术支持：Next.js + TypeScript</p>
        </div>
        <div className={styles.right}>
          <span className={styles.item}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12,6 12,12 16,14"></polyline>
            </svg>
            当前时间: {currentTime.toLocaleString()}
          </span>
          <span className={styles.item}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            版本: v{version}
          </span>
          <span className={styles.item}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            响应时间: {performance.now().toFixed(0)}ms
          </span>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter; 