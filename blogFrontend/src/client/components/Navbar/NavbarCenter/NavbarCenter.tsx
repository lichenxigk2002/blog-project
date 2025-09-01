import React, { useEffect, useState, useRef } from 'react';
import Link from "next/link";
import styles from './NavbarCenter.module.scss';
import { navRoutesItem } from "@/routes/nav-routes";
import { usePathname, useParams } from 'next/navigation';
import { ArticlesAPI } from '@/api/ArticlesAPI';
import { Article } from '@/types/Article';
import NavbarFocus from './NavbarFocus';

const NavbarCenter: React.FC = () => {
    const pathname = usePathname();
    const params = useParams();
    const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
    const [showArticleInfo, setShowArticleInfo] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: number]: boolean }>({});
    const closeTimerRefs = useRef<{ [key: number]: NodeJS.Timeout }>({});
    const navListRef = useRef<HTMLUListElement>(null);
    const navItemRefs = useRef<HTMLElement[]>([]);

    // 监听滚动事件
    useEffect(() => {
        const handleScroll = () => {
            // 只有当前是文章页时才处理滚动
            if (params?.id) {
                setShowArticleInfo(window.scrollY > 500);
            } else {
                setShowArticleInfo(false); // 非文章页强制关闭
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [params?.id]); // 依赖 id 变化

    // 获取文章数据
    useEffect(() => {
        const fetchArticle = async () => {
            if (!pathname || !params?.id) return;

            if (pathname.startsWith('/main/Articles/')) {
                try {
                    const article = await ArticlesAPI.getArticleById(Number(params.id));
                    setCurrentArticle(article);
                } catch (error) {
                    console.error('Error fetching article:', error);
                }
            } else {
                setCurrentArticle(null);
            }
        };
        fetchArticle();
    }, [pathname, params?.id]);

    // 处理鼠标进入
    const handleMouseEnter = (itemId: number) => {
        if (closeTimerRefs.current[itemId]) {
            clearTimeout(closeTimerRefs.current[itemId]);
        }
        setOpenDropdowns(prev => ({ ...prev, [itemId]: true }));
    };

    // 处理鼠标离开
    const handleMouseLeave = (itemId: number) => {
        closeTimerRefs.current[itemId] = setTimeout(() => {
            setOpenDropdowns(prev => ({ ...prev, [itemId]: false }));
        }, 300); // 300ms 延迟关闭
    };

    // 清理定时器
    useEffect(() => {
        return () => {
            Object.values(closeTimerRefs.current).forEach(timer => {
                if (timer) {
                    clearTimeout(timer);
                }
            });
        };
    }, []);

    // 如果是文章详情页面且滚动超过500px，显示文章标题和日期
    if (currentArticle && showArticleInfo) {
        return (
            <div className={styles.articleInfo}>
                <h2 className={styles.articleTitle}>当前文章：{currentArticle.title}</h2>
                {/*<span className={styles.articleDate}>*/}
                {/*    {new Date(currentArticle.publishedAt).toLocaleDateString()}*/}
                {/*</span>*/}
                <span className={styles.articleExcerpt}>{currentArticle.excerpt}</span>
            </div>
        );
    }

    const mainNavItems = navRoutesItem.filter(item => item.showInNav);

    // 找到当前激活的导航项索引
    const activeNavIndex = mainNavItems.findIndex(item => pathname === item.path);

    // 否则显示常规导航
    return (
        <div style={{ position: 'relative' }}>
            <ul className={styles.navList} ref={navListRef}>
                {mainNavItems.map((item, index) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const hasVisibleChildren = hasChildren && item.children!.some(child => child.showInDropdown);
                    const isDropdownOpen = openDropdowns[item.id] || false;

                    return (
                        <li
                            key={item.id}
                            ref={el => {
                                if (el) {
                                    navItemRefs.current[index] = el;
                                }
                            }}
                            className={`${styles.navItem} ${hasVisibleChildren ? styles.dropdownContainer : ''}`}
                            onMouseEnter={hasVisibleChildren ? () => handleMouseEnter(item.id) : undefined}
                            onMouseLeave={hasVisibleChildren ? () => handleMouseLeave(item.id) : undefined}
                        >
                            <Link
                                href={item.path}
                                prefetch={true}
                                className={`${styles.navLink} ${pathname === item.path ? styles.activeLink : ''}`}
                            >
                                {item.name}
                            </Link>
                            {hasVisibleChildren && isDropdownOpen && (
                                <div className={styles.dropdown}>
                                    {item.children!
                                        .filter(child => child.showInDropdown) // 只显示 showInDropdown: true 的子路由
                                        .map((child) => (
                                            child.isExternal ? (
                                                <a
                                                    key={child.id}
                                                    href={child.externalUrl || child.path}
                                                    target={child.target || '_blank'}
                                                    rel="noopener noreferrer"
                                                    className={`${styles.dropdownItem} ${pathname === child.path ? styles.activeLink : ''}`}
                                                >
                                                    {child.name}
                                                </a>
                                            ) : (
                                                <Link
                                                    key={child.id}
                                                    href={child.path}
                                                    className={`${styles.dropdownItem} ${pathname === child.path ? styles.activeLink : ''}`}
                                                >
                                                    {child.name}
                                                </Link>
                                            )
                                        ))}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
            <NavbarFocus
                activeIndex={activeNavIndex}
                navItems={navItemRefs.current}
                containerRef={navListRef}
                animationDuration={0.4}
            />
        </div>
    );
};

export default NavbarCenter;