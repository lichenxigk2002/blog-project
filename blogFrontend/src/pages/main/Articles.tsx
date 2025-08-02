import Link from 'next/link';
import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from './Articles/Articles.module.scss';
import { motion } from 'framer-motion';
import Head from "next/head";
import { FiClock, FiEye, FiHeart, FiTag, FiSearch, FiArrowUp, FiArrowDown, FiStar } from 'react-icons/fi';
import { useLoading } from '@/hooks/useLoading';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import LoadingMore from '@/components/LoadingMore/LoadingMore';
import { Article, ArticleListItem } from '@/types/Article';
import { ArticlesAPI } from '@/api/ArticlesAPI';
import PageHeader from '../../components/PageHeader/PageHeader';
import { useGlobalTip } from '@/hooks/useGlobalTip';
import { httpError } from '@/http/core/error';

// 新增：定义props类型
interface ArticlesProps {
    initialArticles: ArticleListItem[];
}

const ITEMS_PER_PAGE = 10; // 每次加载的文章数量

const Articles: React.FC<ArticlesProps> = ({ initialArticles }) => {
    const [articles, setArticles] = useState<ArticleListItem[]>(initialArticles || []);
    const [filteredArticles, setFilteredArticles] = useState<ArticleListItem[]>(initialArticles || []);
    const { isLoading, withLoading } = useLoading();
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [visibleArticles, setVisibleArticles] = useState<ArticleListItem[]>(initialArticles.slice(0, ITEMS_PER_PAGE) || []);
    const [hasMore, setHasMore] = useState(initialArticles.length > ITEMS_PER_PAGE);
    const observer = useRef<IntersectionObserver | null>(null);
    const loadingRef = useRef<HTMLDivElement>(null);
    const { showTip } = useGlobalTip();

    // 添加一个函数来处理文章摘要
    const getExcerpt = (content: string) => {
        // 移除 Markdown 语法，只保留纯文本
        const plainText = content
            .replace(/```[\s\S]*?```/g, '') // 移除代码块
            .replace(/#{1,6}\s.*?\n/g, '') // 移除标题
            .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
            .replace(/\*\*.*?\*\*/g, '') // 移除粗体
            .replace(/\*.*?\*/g, '') // 移除斜体
            .replace(/\n/g, ' ') // 将换行替换为空格
            .trim();
        return plainText.slice(0, 200) + (plainText.length > 200 ? '...' : '');
    };

    // useEffect兜底，防止props为空时依然能获取数据
    useEffect(() => {
        if (initialArticles && initialArticles.length > 0) return;
        const fetchArticles = async () => {
            try {
                const response = await withLoading(ArticlesAPI.getArticlesSimple());
                if (!response) {
                    throw new Error('Empty response from server');
                }
                if (!Array.isArray(response.data)) {
                    throw new Error(`Invalid data format: ${JSON.stringify(response)}`);
                }
                // 处理文章数据
                const processedData = response.data
                    .filter((item: any) => item.status === 'published')
                    .map((item: any) => ({
                        ...item,
                        slug: item.slug || `article-${item.id}`,
                        excerpt: item.excerpt || '',
                        coverImage: item.coverImage || '',
                        createdAt: item.createdAt || new Date().toISOString(),
                        updatedAt: item.updatedAt || new Date().toISOString(),
                        publishedAt: item.publishedAt || new Date().toISOString(),
                        viewCount: item.viewCount || 0,
                        likeCount: item.likeCount || 0,
                        readingTime: item.readingTime || 5,
                        authorId: item.authorId || 0,
                        status: item.status || 'published',
                        postType: item.postType || 'article',
                        isTop: item.isTop || false,
                        sortOrder: item.sortOrder || 0
                    }));

                setArticles(processedData);
                setFilteredArticles(processedData);
                setVisibleArticles(processedData.slice(0, ITEMS_PER_PAGE));
                setHasMore(processedData.length > ITEMS_PER_PAGE);
            } catch (err) {
                console.error('Fetch error:', err);
                if (err instanceof httpError) {
                    showTip(err.message, 'error');
                } else {
                    showTip('加载文章失败，请稍后重试', 'error');
                }
            }
        };
        fetchArticles();
    }, [initialArticles]);

    // 处理搜索和排序
    useEffect(() => {
        let result = [...articles];
        // 搜索过滤
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(article =>
                article.title.toLowerCase().includes(query)
            );
        }
        // 排序：置顶文章优先，然后按排序值排序
        result.sort((a, b) => {
            // 首先按置顶状态排序（置顶的排在前面）
            if (a.isTop && !b.isTop) return -1;
            if (!a.isTop && b.isTop) return 1;

            // 如果置顶状态相同，按排序值排序（数值大的排在前面）
            const aSortOrder = a.sortOrder ?? 0;
            const bSortOrder = b.sortOrder ?? 0;
            if (aSortOrder !== bSortOrder) {
                return bSortOrder - aSortOrder;
            }

            // 如果排序值相同，按发布时间排序
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setFilteredArticles(result);
        setVisibleArticles(result.slice(0, ITEMS_PER_PAGE));
        setHasMore(result.length > ITEMS_PER_PAGE);
    }, [searchQuery, sortOrder, articles]);

    // 加载更多文章
    const loadMore = useCallback(() => {
        if (!hasMore) return;
        const currentLength = visibleArticles.length;
        const nextArticles = filteredArticles.slice(currentLength, currentLength + ITEMS_PER_PAGE);
        setVisibleArticles(prev => [...prev, ...nextArticles]);
        setHasMore(currentLength + ITEMS_PER_PAGE < filteredArticles.length);
    }, [filteredArticles, hasMore, visibleArticles.length]);

    // 设置 Intersection Observer
    useEffect(() => {
        if (observer.current) {
            observer.current.disconnect();
        }
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMore();
            }
        });
        if (loadingRef.current) {
            observer.current.observe(loadingRef.current);
        }
        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [loadMore, hasMore]);

    // 处理输入框变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    // 处理搜索按钮点击
    const handleSearch = () => {
        setSearchQuery(searchInput);
    };

    // 处理回车键
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // 处理排序
    const handleSort = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    // 添加点赞处理函数
    const handleLike = async (articleId: number, e: React.MouseEvent) => {
        e.preventDefault(); // 阻止链接跳转
        e.stopPropagation(); // 阻止事件冒泡

        try {
            const response = await ArticlesAPI.likeArticle(Number(articleId));

            if (!response) {
                throw new Error('点赞失败');
            }

            // 更新文章列表中的点赞数
            setArticles(prevArticles =>
                prevArticles.map(article =>
                    article.id === articleId
                        ? { ...article, likeCount: response.data?.likeCount ?? article.likeCount }
                        : article
                )
            );

            // 同时更新可见文章列表
            setVisibleArticles(prevArticles =>
                prevArticles.map(article =>
                    article.id === articleId
                        ? { ...article, likeCount: response.data?.likeCount ?? article.likeCount }
                        : article
                )
            );
        } catch (error) {
            console.error('点赞失败:', error);
        }
    };

    // 添加处理文章点击的函数
    const handleArticleClick = async (articleId: number) => {
        try {
            await ArticlesAPI.incrementViewCount(articleId);
            // 更新本地文章列表中的浏览量
            setArticles(prevArticles =>
                prevArticles.map(article =>
                    article.id === articleId
                        ? { ...article, viewCount: article.viewCount + 1 }
                        : article
                )
            );
            // 同时更新可见文章列表
            setVisibleArticles(prevArticles =>
                prevArticles.map(article =>
                    article.id === articleId
                        ? { ...article, viewCount: article.viewCount + 1 }
                        : article
                )
            );
        } catch (error) {
            console.error('更新浏览量失败:', error);
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>文章集锦 | 分享技术思考与生活感悟</title>
                <meta name="description" content="记录技术探索的足迹，分享生活中的点滴感悟，这里是思想的碰撞与交流" />
            </Head>
            <PageHeader
                headerText="文章列表"
                introText="每一篇文章，都是一次思想的沉淀。在这里，技术不再是冰冷的代码，而是流淌的文字；生活不再是琐碎的日常，而是诗意的记录。愿这些文字能成为你探索路上的灯塔，照亮前行的方向。"
                englishTitle="Articles"
            />

            {/* 添加搜索和排序区域 */}
            <motion.div
                className={styles.searchSortContainer}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                <div className={styles.searchBox}>
                    <FiSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="搜索文章标题..."
                        value={searchInput}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className={styles.searchInput}
                    />
                    <motion.button
                        className={styles.searchButton}
                        onClick={handleSearch}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        搜索
                    </motion.button>
                </div>
                <motion.button
                    className={styles.sortButton}
                    onClick={handleSort}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
                    <span>按发布时间{sortOrder === 'asc' ? '升序' : '降序'}</span>
                </motion.button>
            </motion.div>

            {isLoading && <LoadingSpinner />}

            <div className={styles.articleList}>
                {visibleArticles.map((article, index) => (
                    <motion.div
                        key={article.id}
                        className={styles.articleItem}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.6,
                            delay: index * 0.1
                        }}
                        whileHover={{
                            y: -5,
                            transition: { duration: 0.2 }
                        }}
                    >
                        <Link
                            href={`/main/Articles/${article.id}`}
                            className={styles.articleLink}
                            onClick={() => handleArticleClick(article.id)}
                        >
                            <div>
                                <h1 className={styles.articleTitle}>
                                    {article.title}
                                    {article.isTop && <FiStar className={styles.topArticleIcon} />}
                                </h1>
                                <div className={styles.articleMeta}>
                                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                </div>
                                <div className={styles.articleExcerpt}>
                                    {article.excerpt}
                                </div>
                                <div className={styles.metaContainer}>
                                    {article.tags && article.tags.length > 0 && (
                                        <div className={styles.tags} >
                                            {article.tags.map(tag => (
                                                <span key={tag.id} className={styles.tag} style={{
                                                    backgroundColor: `${tag.color}40`,
                                                }}>
                                                    <FiTag style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                                    {tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {article && (
                                        <div className={styles.metaInfo}>
                                            {/* Views */}
                                            <span className={styles.metaItem}>
                                                <FiEye style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                                {article.viewCount}
                                            </span>

                                            {/* Likes */}
                                            <motion.div
                                                className={styles.metaItem}
                                                onClick={(e) => handleLike(article.id, e)}
                                                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FiHeart style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                                {article.likeCount}
                                            </motion.div>

                                            {/* Reading Time */}
                                            <span className={styles.metaItem}>
                                                <FiClock style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                                预计阅读时间：{article.readingTime}分钟
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* 加载更多触发器 */}
            <div ref={loadingRef}>
                {hasMore && <LoadingMore />}
            </div>
        </div>
    );
}

// 新增：getStaticProps实现SSG+ISR
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
    let initialArticles: ArticleListItem[] = [];
    // 这里的getExcerpt逻辑与组件内一致
    const getExcerpt = (content: string) => {
        const plainText = content
            .replace(/```[\s\S]*?```/g, '')
            .replace(/#{1,6}\s.*?\n/g, '')
            .replace(/\[.*?\]\(.*?\)/g, '')
            .replace(/\*\*.*?\*\*/g, '')
            .replace(/\*.*?\*/g, '')
            .replace(/\n/g, ' ')
            .trim();
        return plainText.slice(0, 200) + (plainText.length > 200 ? '...' : '');
    };
    try {
        const response = await ArticlesAPI.getArticlesSimple();
        if (response && Array.isArray(response.data)) {
            initialArticles = response.data
                .filter((item: any) => item.status === 'published')
                .map((item: any) => ({
                    ...item,
                    slug: item.slug || `article-${item.id}`,
                    excerpt: item.excerpt || '',
                    coverImage: item.coverImage || '',
                    createdAt: item.createdAt || new Date().toISOString(),
                    updatedAt: item.updatedAt || new Date().toISOString(),
                    publishedAt: item.publishedAt || new Date().toISOString(),
                    viewCount: item.viewCount || 0,
                    likeCount: item.likeCount || 0,
                    readingTime: item.readingTime || 5,
                    authorId: item.authorId || 0,
                    status: item.status || 'published',
                    postType: item.postType || 'article',
                    isTop: item.isTop || false,
                    sortOrder: item.sortOrder || 0
                }));
        }
    } catch (e) {
        // 忽略错误
    }
    return {
        props: {
            initialArticles
        },
        revalidate: 600 // ISR: 每10分钟自动更新一次
    };
};

export default Articles;