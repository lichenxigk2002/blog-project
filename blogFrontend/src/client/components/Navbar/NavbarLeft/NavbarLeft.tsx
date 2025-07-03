import React, { useContext } from 'react';
import { LoginModalContext } from '@/context/LoginModalContext';
import styles from './NavbarLeft.module.scss';

const NavbarLeft: React.FC = () => {
    const { setShowAdminLogin } = useContext(LoginModalContext);

    const handleAvatarClick = () => {
        setShowAdminLogin(true);
    };

    return (
        <div
            className={styles.avatarContainer}
            onClick={handleAvatarClick}
            style={{ cursor: 'pointer' }}
            title="管理员入口"
        >
            <img
                src="/images/avatar_20250520_215057.png"
                alt="管理员入口"
                className={styles.avatar}
            />
        </div>
    );
};

export default NavbarLeft;