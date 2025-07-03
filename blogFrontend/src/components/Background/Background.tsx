// Background.tsx
import React from 'react';
import styles from './Background.module.scss';
import { useTheme } from '@/hooks/useTheme';

const Background: React.FC = () => {
    const { isDarkMode } = useTheme();

    return (
        <>
            {/* 新增背景层 */}
            <div className={`${styles.backgroundBase} ${isDarkMode ? styles.dark : ''}`}></div>

            {/* 原有容器 */}
            <div className={styles.backgroundBlocks}>
                {/* 所有几何元素保持原样 */}
                <div className={`${styles.bgBlock} ${styles.circle} ${styles.block1}`}></div>
                <div className={`${styles.bgBlock} ${styles.triangle} ${styles.block2}`}></div>
                <div className={`${styles.bgBlock} ${styles.circle} ${styles.block3}`}></div>
                <div className={`${styles.bgBlock} ${styles.waveLine} ${styles.block4}`}></div>
                <div className={`${styles.bgBlock} ${styles.pentagram} ${styles.block5}`}></div>
                <div className={`${styles.bgBlock} ${styles.circle2} ${styles.block6}`}></div>

                {/* 网格添加主题类名 */}
                <div className={`${styles.dynamicGrid} ${isDarkMode ? styles.darkGrid : ''}`}></div>
            </div>
        </>
    );
};

export default Background;