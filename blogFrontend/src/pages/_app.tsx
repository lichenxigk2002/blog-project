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
import localFont from 'next/font/local';

// 字体配置
const ziHun = localFont({
    src: '../../public/fonts/ZiHun.woff2',
    display: 'swap',
});
const youYuan = localFont({
    src: '../../public/fonts/幼圆.woff2',
    display: 'swap',
});
const agencyFB = localFont({
    src: '../../public/fonts/AgencyFB.woff2',
    display: 'swap',
});
const comicSansMS = localFont({
    src: '../../public/fonts/ComicSansMS.woff2',
    display: 'swap',
});
const ShouZhang = localFont({
    src: '../../public/fonts/ShouZhang.woff2',
    display: 'swap',
});

export { ShouZhang };

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
                ziHun.className,
                youYuan.className,
                agencyFB.className,
                comicSansMS.className,
            ].join(' ')}>
                <AppContent {...props} />
            </div>
        </Provider>
    );
};

export default MyApp;