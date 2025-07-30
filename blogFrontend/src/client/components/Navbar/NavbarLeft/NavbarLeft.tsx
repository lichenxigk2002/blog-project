import React, { useContext } from 'react';
import { LoginModalContext } from '@/context/LoginModalContext';
import styles from './NavbarLeft.module.scss';
import Image from "next/image";
import { useAppSelector } from '@/redux/store';
import AdminAvatarPreview from "@/components/AdminAvatarPreview/AdminAvatarPreview";

const NavbarLeft: React.FC = () => {
    const { setShowAdminLogin } = useContext(LoginModalContext);
    const showAdminLoginEntry = useAppSelector((state) => state.settings.notificationSettings.showAdminLoginEntry)

    // const handleAvatarClick = () => {
    //     setShowAdminLogin(true);
    // };

    return (
        <div
            className={styles.avatarContainer}
            // onClick={handleAvatarClick}
            style={{ cursor: 'pointer' }}
        >
            <AdminAvatarPreview showAdminLoginEntry={showAdminLoginEntry}/>
        </div>
    );
};

export default NavbarLeft;