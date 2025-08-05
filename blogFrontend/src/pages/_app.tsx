import type { AppProps } from 'next/app';
import AppLayout from '@/client/components/layout/AppLayout';
import { Provider, useDispatch } from 'react-redux';
import store from '@/redux/store';
import '@/styles/globals.scss';
import React, { useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { useTheme } from '@/hooks/useTheme';
import Login from '@/components/Login/Login';
import { useRouter } from "next/router";
import { LoginModalProvider, LoginModalContext } from '@/context/LoginModalContext';
import AdminLogin from '@/components/AdminLogin/AdminLogin';
import AdminRouteGuard from '@/admin/components/AdminRouteGuard/AdminRouteGuard';
import OperationTipModal from '@/components/OperationTipModal/OperationTipModal';
import { SystemSettingsAPI } from "@/api/SystemSettingsAPI";
import { modifyAllSettings } from "@/redux/systemSettingsSlice";
import { useAppDispatch } from '@/redux/store';
import { flatToGroupedSettings } from "@/utils/settingTransform";
import { adminLoginFromStorage, checkTokenExpiry } from '@/redux/adminAuthSlice';
import { GlobalTipProvider } from "@/context/GlobalTipContext";

// 错误边界组件
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error?: Error }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h1>应用出现错误</h1>
                    <p>错误信息: {this.state.error?.message}</p>
                    <button onClick={() => window.location.reload()}>
                        刷新页面
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// 创建主题包装组件
function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const { isDarkMode } = useTheme();

    useEffect(() => {
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
    const { isDarkMode } = useTheme();
    const [showThemeModal, setShowThemeModal] = React.useState(false);
    const [themeModalInfo, setThemeModalInfo] = React.useState({ message: '', type: 'info', icon: '/images/daytime.png' });
    const [prevDarkMode, setPrevDarkMode] = React.useState(isDarkMode);
    const dispatch = useAppDispatch();

    useEffect(() => {
        // 只在客户端执行
        const token = localStorage.getItem('admin_token');

        if (token) {
            dispatch(adminLoginFromStorage({ token }));
        }
    }, [dispatch]);

    // 定期检查token是否过期（每分钟检查一次）
    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(checkTokenExpiry());
        }, 60000); // 60秒检查一次

        return () => clearInterval(interval);
    }, [dispatch]);

    useEffect(() => {
        // 首次挂载只记录，不弹窗
        if (prevDarkMode === isDarkMode) return;

        // 主题切换时弹窗
        setShowThemeModal(true);
        setThemeModalInfo({
            message: isDarkMode ? '已切换为夜间模式' : '已切换为日间模式',
            type: 'info',
            icon: isDarkMode ? '/images/night.png' : '/images/daytime.png',
        });
        setPrevDarkMode(isDarkMode);
    }, [isDarkMode]);

    useEffect(() => {
        SystemSettingsAPI.getSettings().then(setting => {
            dispatch(modifyAllSettings(flatToGroupedSettings(setting)))
        })
    }, [dispatch]);

    return (
        <GlobalTipProvider>
            <LoginModalProvider>
                <ThemeWrapper>
                    <OperationTipModal
                        open={showThemeModal}
                        onClose={() => setShowThemeModal(false)}
                        message={themeModalInfo.message}
                        type={themeModalInfo.type as any}
                        // @ts-ignore
                        icon={themeModalInfo.icon}
                    />
                    {isAdminPage ? (
                        <AdminRouteGuard>
                            <Component {...pageProps} />
                        </AdminRouteGuard>
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
        </GlobalTipProvider>
    );
}

// 主应用组件
const MyApp: React.FC<AppProps> = (props) => {
    return (
        <ErrorBoundary>
            <Provider store={store}>
                <div className={[
                    // 字体配置
                    // 已移除 localFont 加载，统一用全局 SCSS 变量管理字体
                ].join(' ')}>
                    <AppContent {...props} />
                </div>
            </Provider>
        </ErrorBoundary>
    );
};

export default MyApp;