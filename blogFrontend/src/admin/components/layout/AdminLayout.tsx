'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Watermark from '@/components/Watermark/Watermark';
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import styles from './AdminLayout.module.scss';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebarCollapsed');
      return savedState ? JSON.parse(savedState) : false;
    }
    return false;
  });

  const showWatermark = useSelector((state: RootState) => state.settings.uiSettings.showWatermark);
  const router = useRouter();
  const pathname = router.pathname;

  const handleToggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  return (
    <div className={styles.layout}>
      <AdminSidebar collapsed={collapsed} />

      <div className={`${styles.main} ${collapsed ? styles.collapsed : ''}`}>
        <AdminHeader
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        <div className={styles.content}>
          {showWatermark ? (
            <Watermark
              content="孤芳不自赏"
              opacity={0.2}
              gap={[150, 150]}
              debug={true}
            >
              {children}
            </Watermark>
          ) : (
            children
          )}
        </div>

        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;