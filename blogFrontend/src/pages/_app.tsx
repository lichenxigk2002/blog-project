import type { AppProps } from 'next/app';
import AppLayout from '@/client/components/layout/AppLayout';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import '@/styles/globals.scss';
import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import Login from '@/components/Login/Login';
import { useRouter } from "next/router";
import { LoginModalProvider, LoginModalContext } from '@/context/LoginModalContext';
import AdminLogin from '@/components/AdminLogin/AdminLogin';
import AdminRouteGuard from '@/admin/components/AdminRouteGuard/AdminRouteGuard';

// 创建主题包装组件
function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const { isDarkMode } = useTheme();

    React.useEffect(() => {
        // 动态更新 HTML 的 data-theme 属性
        document.documentElement.setAttribute(
            'data-theme',
            isDarkMode ? 'dark' : 'light'
        );

        // 同步更新 body 类名
        document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
    }, [isDarkMode]);

    return <>{children}</>;
}

// 创建一个内部组件来处理需要 Redux 的逻辑
function AppContent({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const isAdminPage = router.pathname.startsWith('/admin');

    return (
        <LoginModalProvider>
            <ThemeWrapper>
                {isAdminPage ? (
                    <AdminRouteGuard>
                        <Component {...pageProps} />
                        // </AdminRouteGuard>
                ) : (
                    <AppLayout>
                        <Component {...pageProps} />
                    </AppLayout>
                )}
                <LoginModalContext.Consumer>
                    {({ showLogin, showAdminLogin }) => (
                        <>
                            {showLogin && <Login />}
                            {showAdminLogin && <AdminLogin />}
                        </>
                    )}
                </LoginModalContext.Consumer>
            </ThemeWrapper>
        </LoginModalProvider>
    );
}

// 主应用组件
const MyApp: React.FC<AppProps> = (props) => {
    return (
        <Provider store={store}>
            <div className={[
                // 字体配置
                // 已移除 localFont 加载，统一用全局 SCSS 变量管理字体
            ].join(' ')}>
                <AppContent {...props} />
            </div>
        </Provider>
    );
};

export default MyApp;