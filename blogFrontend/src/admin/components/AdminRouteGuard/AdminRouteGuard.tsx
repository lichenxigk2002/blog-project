// src/admin/components/AdminRouteGuard/AdminRouteGuard.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import styles from './AdminRouteGuard.module.scss';
import UnauthorizedAccess from "@/admin/components/UnauthorizedAccess/UnauthorizedAccess";

const AdminRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useSelector((state: RootState) => state.adminAuth);

    // 如果正在加载，显示加载状态
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <div className={styles.loadingText}>加载中...</div>
            </div>
        );
    }

    // 如果未认证，显示未授权访问页面
    if (!isAuthenticated) {
        return <UnauthorizedAccess />;
    }

    // 已认证，显示子组件
    return <>{children}</>;
};

export default AdminRouteGuard;