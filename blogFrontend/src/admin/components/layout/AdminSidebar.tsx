'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { adminRoutes } from '@/routes/admin-routes';
import { getSidebarIcon } from '@/admin/components/ui/Icons/SidebarIcons';
import { ChevronDownIcon, ChevronRightIcon } from '@/admin/components/ui/Icons/Icons';
import styles from './AdminSidebar.module.scss';

interface AdminSidebarProps {
  collapsed: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed }) => {
  const router = useRouter();
  const pathname = router.pathname;
  const [expandedMenus, setExpandedMenus] = useState<Set<number>>(new Set());

  const toggleMenu = (menuId: number) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedMenus(newExpanded);
  };

  const isMenuExpanded = (menuId: number) => expandedMenus.has(menuId);
  const isActiveRoute = (path: string) => pathname === path;
  const isActiveMenu = (route: any) => {
    if (isActiveRoute(route.path)) return true;
    if (route.children) {
      return route.children.some((child: any) => isActiveRoute(child.path));
    }
    return false;
  };

  const renderMenuItem = (route: any, level: number = 0) => {
    const hasChildren = route.children && route.children.length > 0;
    const isExpanded = isMenuExpanded(route.id);
    const isActive = isActiveMenu(route);

    return (
      <li
        key={route.id}
        className={`${styles.navItem} ${isActive ? styles.active : ''} ${level > 0 ? styles.subItem : ''}`}
      >
        {hasChildren ? (
          <>
            <div
              className={`${styles.navLink} ${styles.hasChildren}`}
              onClick={() => toggleMenu(route.id)}
            >
              {getSidebarIcon(route.path)}
              <span>{route.name}</span>
              {collapsed ? null : (
                isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />
              )}
            </div>
            {hasChildren && !collapsed && (
              <ul className={`${styles.subMenu} ${isExpanded ? styles.expanded : ''}`}>
                {route.children.map((child: any) => renderMenuItem(child, level + 1))}
              </ul>
            )}
          </>
        ) : (
          <Link
            href={route.path}
            className={styles.navLink}
          >
            {getSidebarIcon(route.path)}
            <span>{route.name}</span>
          </Link>
        )}
      </li>
    );
  };

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
          {adminRoutes.map((route) => renderMenuItem(route))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar; 