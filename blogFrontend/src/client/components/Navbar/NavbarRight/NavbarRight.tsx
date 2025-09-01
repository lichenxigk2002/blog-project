import React, { useContext, useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './NavbarRight.module.scss';
import ThemeToggleButton from '@/components/ThemeToggleButton/ThemeToggleButton';
import { useTheme } from '@/hooks/useTheme';
import { LoginModalContext } from '@/context/LoginModalContext';
import { RiGithubFill, RiUser3Line, RiSunLine, RiMoonLine, RiLogoutBoxRLine, RiLoginBoxLine } from "react-icons/ri";
import { FaChevronUp } from "react-icons/fa";
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/authSlice';

const NavbarRight: React.FC = () => {
    const { isDarkMode } = useTheme();
    // 获取登录模态框的控制函数
    const { setShowLogin } = useContext(LoginModalContext);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuTimer = React.useRef<NodeJS.Timeout | null>(null);
    const dispatch = useDispatch();

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

    // 处理个人信息跳转
    const handleProfileClick = () => {
        setShowUserMenu(false);
        router.push('/main/Profile');
    };
    // 处理登出
    const handleLogoutClick = () => {
        setShowUserMenu(false);
        dispatch(logout() as unknown as any);
        router.push('/main/Home');
    };

    // 悬浮进入菜单区，显示菜单并清除关闭定时器
    const handleUserMenuEnter = () => {
        if (userMenuTimer.current) {
            clearTimeout(userMenuTimer.current);
            userMenuTimer.current = null;
        }
        setShowUserMenu(true);
    };
    // 悬浮离开菜单区，延迟1秒关闭
    const handleUserMenuLeave = () => {
        userMenuTimer.current = setTimeout(() => {
            setShowUserMenu(false);
        }, 1000);
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
            <button
                className={`${styles.iconButton} ${styles.scrollTopButton} ${showScrollTop ? styles.show : styles.hide}`}
                onClick={handleScrollTop}
                title="回到顶部"
            >
                <FaChevronUp style={{ color: 'var(--text)', fontSize: '1rem' }} />
            </button>

            {/* 2. GitHub按钮 */}
            <button className={styles.iconButton}>
                <a href='https://github.com/lichenxigk2002'>
                    <RiGithubFill style={{ color: 'var(--text)', fontSize: '1rem' }} />
                </a>
            </button>

            {/* 3. 主题切换按钮 */}
            <ThemeToggleButton icons={themeIcons} />

            {/* 4. 用户按钮及悬浮菜单 */}
            <div
                style={{ position: 'relative', display: 'inline-block' }}
                onMouseEnter={handleUserMenuEnter}
                onMouseLeave={handleUserMenuLeave}
            >
                <button
                    className={styles.iconButton}
                // onClick={handleUserClick}
                >
                    <RiUser3Line style={{ color: 'var(--text)', fontSize: '1rem' }} />
                </button>
                {showUserMenu && isAuthenticated && user && (
                    <div className={styles.userMenuCard}>
                        <div className={styles.userMenuItem} onClick={handleProfileClick}>
                            <RiUser3Line style={{ marginRight: 8, verticalAlign: 'middle', fontSize: '1rem' }} />
                            个人信息
                        </div>
                        <div className={styles.userMenuItem} onClick={handleLogoutClick}>
                            <RiLogoutBoxRLine style={{ marginRight: 8, verticalAlign: 'middle', fontSize: '1rem' }} />
                            退出登录
                        </div>
                    </div>
                )}
                {showUserMenu && (!isAuthenticated || !user) && (
                    <div className={styles.userMenuCard}>
                        <div className={styles.userMenuItem} onClick={handleUserClick}>
                            <RiLoginBoxLine style={{ marginRight: 8, verticalAlign: 'middle', fontSize: '1rem' }} />
                            登录/注册
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NavbarRight;