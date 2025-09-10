import React, { useState } from 'react';
import NavbarCenter from "@/client/components/Navbar/NavbarCenter/NavbarCenter";
import NavbarLeft from "@/client/components/Navbar/NavbarLeft/NavbarLeft";
import NavbarRight from "@/client/components/Navbar/NavbarRight/NavbarRight";
import styles from './Navbar.module.scss';
import { FiMenu, FiX } from 'react-icons/fi';
import { useMobile } from '@/hooks/useMobile';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isMobile } = useMobile();

    // 切换菜单开关
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className={styles.navbar}>
            <div className={styles.navbarContainer}>
                {/* 左侧导航 - 移动端隐藏 */}
                {!isMobile && <NavbarLeft />}

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
                <div className={styles.mobileMenu}>
                    <div className={styles.mobileMenuContent}>
                        <NavbarRight />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;