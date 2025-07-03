import React, { useContext, useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './NavbarRight.module.scss';
import ThemeToggleButton from '@/components/ThemeToggleButton/ThemeToggleButton';
import { useTheme } from '@/hooks/useTheme';
import { LoginModalContext } from '@/context/LoginModalContext';
import { RiGithubFill, RiUser3Line, RiSunLine, RiMoonLine } from "react-icons/ri";
import { FaChevronUp } from "react-icons/fa";

const NavbarRight: React.FC = () => {
    const { isDarkMode } = useTheme();
    // 获取登录模态框的控制函数
    const { setShowLogin } = useContext(LoginModalContext);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const themeIcons = {
        themeDay: (<RiSunLine style={{ color: 'var(--text)', fontSize: '1rem' }} />),
        themeNight: (<RiMoonLine style={{ color: 'var(--text)', fontSize: '1rem' }} />)
    }

    // 处理登录按钮点击
    const handleUserClick = () => {
        setShowLogin(true);
    };

    // 处理回到顶部
    const handleScrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // 监听滚动事件
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={styles.navRight}>
            {/* 1. 回到顶部按钮 */}
            {showScrollTop && (
                <button
                    className={styles.iconButton}
                    onClick={handleScrollTop}
                    title="回到顶部"
                >
                    <FaChevronUp style={{ color: 'var(--text)', fontSize: '1rem' }} />
                </button>
            )}

            {/* 2. GitHub按钮 */}
            <button className={styles.iconButton}>
                <a href='https://github.com/lichenxigk2002'>
                    <RiGithubFill style={{ color: 'var(--text)', fontSize: '1rem' }} />
                </a>
            </button>

            {/* 3. 主题切换按钮 */}
            <ThemeToggleButton icons={themeIcons} />

            {/* 4. 登录按钮 */}
            <button
                className={styles.iconButton}
                onClick={handleUserClick}
            >
                <RiUser3Line style={{ color: 'var(--text)', fontSize: '1rem' }} />
            </button>
        </div>
    );
};

export default NavbarRight;