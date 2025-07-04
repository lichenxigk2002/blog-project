import React, { useContext } from 'react';
import { LoginModalContext } from '@/context/LoginModalContext';
import styles from './NavbarLeft.module.scss';
import Image from "next/image";

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
            <Image
                src="/images/avatar_20250520_215057.png"
                alt="管理员入口"
                className={styles.avatar}
                width={40}
                height={40}
                priority
                placeholder="blur"
                blurDataURL="/images/avatar_blur.png"
            />
        </div>
    );
};

export default NavbarLeft;