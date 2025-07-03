import React, { useState, useEffect } from 'react';
import NavbarCenter from "@/client/components/Navbar/NavbarCenter/NavbarCenter";
import NavbarLeft from "@/client/components/Navbar/NavbarLeft/NavbarLeft";
import NavbarRight from "@/client/components/Navbar/NavbarRight/NavbarRight";
import { useTheme } from '@/hooks/useTheme';
import styles from './Navbar.module.scss';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar: React.FC = () => {
    const { isDarkMode } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // 监听窗口大小变化
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // 初始检查
        checkIsMobile();

        // 添加窗口大小变化监听
        window.addEventListener('resize', checkIsMobile);

        // 清理监听器
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    // 切换菜单开关
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className={`${styles.navbar} ${isDarkMode ? styles.dark : styles.light}`}>
            <div className={styles.navbarContainer}>
                {/* 左侧导航 */}
                <NavbarLeft />

                {/* 中间导航，保持居中 */}
                <div className={styles.centerContainer}>
                    <NavbarCenter />
                </div>

                {/* 右侧导航/汉堡菜单 */}
                {isMobile ? (
                    <button
                        className={styles.menuToggle}
                        onClick={toggleMenu}
                        aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
                    >
                        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                ) : (
                    <NavbarRight />
                )}
            </div>

            {/* 移动端展开的菜单 */}
            {isMobile && isMenuOpen && (
                <div className={`${styles.mobileMenu} ${isDarkMode ? styles.dark : styles.light}`}>
                    <div className={styles.mobileMenuContent}>
                        <NavbarRight />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;