// src/admin/components/UnauthorizedAccess/UnauthorizedAccess.tsx
import React, { useContext } from 'react';
import styles from './UnauthorizedAccess.module.scss';
import { useRouter } from 'next/router';
import { LoginModalContext } from '@/context/LoginModalContext';

const UnauthorizedAccess: React.FC = () => {
    const router = useRouter();
    const { setShowAdminLogin } = useContext(LoginModalContext);

    const handleBackToHome = () => {
        router.push('/main/Home');
        setShowAdminLogin(true);
    };

    const handleToHome = () => {
        router.push('/');
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>管理员专属区域</h1>
                <p className={styles.message}>
                    此页面仅限管理员访问。如果您是管理员，请使用管理员账号登录。
                </p>
                <div className={styles.actions}>
                    <button
                        onClick={handleBackToHome}
                        className={styles.loginButton}
                    >
                        返回登录页面
                    </button>
                    <button
                        onClick={handleToHome}
                        className={styles.backButton}
                    >
                        返回首页
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedAccess;