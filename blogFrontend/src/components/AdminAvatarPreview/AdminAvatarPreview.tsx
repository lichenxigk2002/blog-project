import React from 'react';
import Image from 'next/image';
import styles from './AdminAvatarPreview.module.scss'; // 你可以复制NavbarLeft的相关样式到这里

interface AdminAvatarPreviewProps {
    showAdminLoginEntry: boolean;
}

const AdminAvatarPreview: React.FC<AdminAvatarPreviewProps> = ({ showAdminLoginEntry }) => (
    <div className={styles.avatarContainer}>
        <Image
            src="/images/avatar_20250520_215057.png"
            alt="管理员入口"
            className={styles.avatar}
            width={40}
            height={40}
            priority
            placeholder="blur"
            blurDataURL="/images/avatar_blur.png"
            title={showAdminLoginEntry ? '孤芳不自赏在线哦' : '孤芳不自赏离开了~'}
        />
        <span
            className={styles.onlineDot}
            style={{ background: showAdminLoginEntry ? '#4eff56' : '#ff4646' }}
        /></div>
);

export default AdminAvatarPreview;