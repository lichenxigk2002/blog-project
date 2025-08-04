// src/admin/components/AdminRouteGuard/AdminRouteGuard.tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { checkTokenExpiry } from '@/redux/adminAuthSlice';
import { isTokenExpired } from '@/utils/jwtUtils';
import UnauthorizedAccess from "@/admin/components/UnauthorizedAccess/UnauthorizedAccess";

const AdminRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch();
    const { isAuthenticated, loading, token } = useSelector((state: RootState) => state.adminAuth);

    // 检查token是否过期
    useEffect(() => {
        if (token && isTokenExpired(token)) {
            dispatch(checkTokenExpiry());
        }
    }, [token, dispatch]);

    // 如果正在加载，显示加载状态
    if (loading) {
        return (
            <div>
                <div>加载中...</div>
            </div>
        );
    }

    // 如果未认证或token已过期，显示未授权访问页面
    if (!isAuthenticated || (token && isTokenExpired(token))) {
        return <UnauthorizedAccess />;
    }

    // 已认证且token有效，显示子组件
    return <>{children}</>;
};

export default AdminRouteGuard;