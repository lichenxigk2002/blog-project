'use client';

import React from 'react';
import { MenuIcon, MenuCollapsedIcon, LogoutIcon } from '@/admin/components/ui/Icons/SidebarIcons';
import styles from './AdminHeader.module.scss';

interface AdminHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ collapsed, onToggleCollapse }) => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          className={styles.toggleBtn}
          onClick={onToggleCollapse}
          title={collapsed ? "展开菜单" : "收起菜单"}
        >
          {collapsed ? <MenuIcon /> : <MenuCollapsedIcon />}
        </button>
      </div>

      <div className={styles.right}>
        <div className={styles.userInfo}>
          <img
            src="/images/avatar_20250520_215057_01.png"
            alt="管理员头像"
            className={styles.avatar}
          />
          <span className={styles.username}>管理员</span>
        </div>

        <button
          className={styles.logoutBtn}
          onClick={() => window.location.href = '/main/Home'}
        >
          <LogoutIcon />
          <span>退出</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader; 