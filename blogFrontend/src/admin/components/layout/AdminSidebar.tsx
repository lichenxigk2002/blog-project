'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { adminRoutes } from '@/routes/admin-routes';
import { getSidebarIcon } from '@/admin/components/ui/Icons/SidebarIcons';
import styles from './AdminSidebar.module.scss';

interface AdminSidebarProps {
  collapsed: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed }) => {
  const router = useRouter();
  const pathname = router.pathname;

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
        <h1>{collapsed ? 'B' : 'Blog Admin'}</h1>
        <img
          src="/images/avatar_20250520_215057_01.png"
          alt="管理员头像"
          className={styles.avatar}
        />
      </div>

      <nav className={styles.nav}>
        <ul>
          {adminRoutes.map((route) => (
            <li
              key={route.id}
              className={`${styles.navItem} ${pathname === route.path ? styles.active : ''}`}
            >
              <Link
                href={route.path}
                className={styles.navLink}
              >
                {getSidebarIcon(route.path)}
                <span>{route.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar; 