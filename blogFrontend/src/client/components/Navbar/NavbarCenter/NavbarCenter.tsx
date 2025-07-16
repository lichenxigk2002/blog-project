import React, { useEffect, useState, useRef } from 'react';
import Link from "next/link";
import styles from './NavbarCenter.module.scss';
import { navRoutesItem } from "@/routes/nav-routes";
import { usePathname, useParams } from 'next/navigation';
import { ArticlesAPI } from '@/api/ArticlesAPI';
import { Article } from '@/types/Article';

const NavbarCenter: React.FC = () => {
    const pathname = usePathname();
    const params = useParams();
    const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
    const [showArticleInfo, setShowArticleInfo] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const closeTimerRef = useRef<NodeJS.Timeout>();

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
    const handleMouseEnter = () => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
        }
        setIsMoreOpen(true);
    };

    // 处理鼠标离开
    const handleMouseLeave = () => {
        closeTimerRef.current = setTimeout(() => {
            setIsMoreOpen(false);
        }, 300); // 300ms 延迟关闭
    };

    // 清理定时器
    useEffect(() => {
        return () => {
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
            }
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

    const mainNavItems = navRoutesItem.filter(item => item.showInNav && item.name !== '更多');
    const moreNavItem = navRoutesItem.find(item => item.name === '更多');
    // 否则显示常规导航
    return (
        <ul className={styles.navList}>
            {mainNavItems.map((item) => (
                <li
                    key={item.id}
                    className={styles.navItem}
                >
                    <Link
                        href={item.path}
                        prefetch={true}
                        className={styles.navLink}
                    >
                        {item.name}
                    </Link>
                </li>
            ))}
            {moreNavItem && (
                <li
                    className={`${styles.navItem} ${styles.moreContainer}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Link
                        href={moreNavItem.path}
                        className={`${styles.navLink} ${pathname === moreNavItem.path ? styles.activeLink : ''}`}
                    >
                        更多
                    </Link>
                    {isMoreOpen && moreNavItem.children && (
                        <div className={styles.dropdown}>
                            {moreNavItem.children.map((child) => (
                                <Link
                                    key={child.id}
                                    href={child.path}
                                    className={`${styles.dropdownItem} ${pathname === child.path ? styles.activeLink : ''}`}
                                >
                                    {child.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </li>
            )}
        </ul>
    );
};

export default NavbarCenter;