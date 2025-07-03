import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArticlesAPI } from '@/api/ArticlesAPI';
import { Article } from '@/types/Article';
import styles from './Archive/Archive.module.scss';
import { useLoading } from '@/hooks/useLoading';
import Head from "next/head";
import RecentArticles from "@/components/RecentArticles/RecentArticles";
import PageHeader from '../../components/PageHeader/PageHeader';

// 类型定义
interface GroupedArticles {
    [year: string]: {
        [month: string]: Article[];
    };
}

interface ApiResponse {
    data: Article[];
    error?: string;
}

// 工具函数
const getExcerpt = (content: string): string => {
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

const getArticleTypeText = (postType: string): string => {
    const typeMap: Record<string, string> = {
        post: '文章',
        page: '笔记',
        thought: '想法',
        diary: '日记'
    };
    return typeMap[postType] || '文章';
};

const processArticleData = (data: any[]): Article[] => {
    return data
        .filter((item: any) => item.status === 'archived')
        .map((item: any) => ({
            ...item,
            slug: item.slug || `article-${item.id}`,
            htmlContent: item.htmlContent || item.content,
            excerpt: item.excerpt || getExcerpt(item.content),
            coverImage: item.coverImage || '',
            images: Array.isArray(item.images) ? item.images : [],
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: item.updatedAt || new Date().toISOString(),
            publishedAt: item.publishedAt || new Date().toISOString(),
            viewCount: item.viewCount || 0,
            likeCount: item.likeCount || 0,
            readingTime: item.readingTime || 5,
            authorId: item.authorId || 0,
            status: item.status || 'draft',
            postType: item.postType || 'post'
        }));
};

const groupArticlesByDate = (articles: Article[]): GroupedArticles => {
    const grouped = articles.reduce((acc: GroupedArticles, article: Article) => {
        const date = new Date(article.publishedAt);
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');

        if (!acc[year]) {
            acc[year] = {};
        }
        if (!acc[year][month]) {
            acc[year][month] = [];
        }

        acc[year][month].push(article);
        return acc;
    }, {});

    // 对每个月的文章按日期排序
    Object.keys(grouped).forEach(year => {
        Object.keys(grouped[year]).forEach(month => {
            grouped[year][month].sort((a: Article, b: Article) =>
                new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
            );
        });
    });

    return grouped;
};

// 动画配置
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
};

const yearVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

const monthVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5 }
    }
};

const articleVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5 }
    },
    hover: {
        x: 10,
        transition: {
            type: "spring",
            stiffness: 300
        }
    }
};

const Archive: React.FC = () => {
    const [groupedArticles, setGroupedArticles] = useState<GroupedArticles>({});
    const [error, setError] = useState<string | null>(null);
    const { isLoading, withLoading } = useLoading();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setError(null);
                const response = await withLoading(ArticlesAPI.getArticles()) as ApiResponse;

                if (!response) {
                    throw new Error('Empty response from server');
                }

                if (response.error) {
                    throw new Error(response.error);
                }

                if (!Array.isArray(response.data)) {
                    throw new Error(`Invalid data format: ${JSON.stringify(response)}`);
                }

                const processedData = processArticleData(response.data);
                const grouped = groupArticlesByDate(processedData);
                setGroupedArticles(grouped);
            } catch (err) {
                console.error('获取文章失败:', err);
                setError('加载文章失败，请稍后重试');
            }
        };

        fetchArticles();
    }, [withLoading]);

    if (error) {
        return (
            <div className={styles.error}>
                <p>{error}</p>
                <Link href="/main/Articles" className={styles.backLink}>
                    返回文章列表
                </Link>
            </div>
        );
    }

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Head>
                <title>归档记录 | 记录过往的思考与随笔</title>
                <meta name="description" />
            </Head>

            <div className={styles.archiveContent}>
                <PageHeader
                    headerText="归档记录"
                    introText="时光流转，岁月沉淀。在这里，每一篇文章都被精心收藏，每一段文字都被妥善保存。让我们以时间为序，以记忆为笔，共同翻阅这些珍贵的篇章，重温那些值得铭记的瞬间。"
                    englishTitle="Archive"
                />

                <motion.div
                    className={styles.timeline}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatePresence>
                        {Object.keys(groupedArticles)
                            .sort((a, b) => Number(b) - Number(a))
                            .map(year => (
                                <motion.div
                                    key={year}
                                    className={styles.yearGroup}
                                    variants={yearVariants}
                                >
                                    <h2 className={styles.year}>{year}</h2>
                                    {Object.keys(groupedArticles[year])
                                        .sort((a, b) => Number(b) - Number(a))
                                        .map(month => (
                                            <motion.div
                                                key={`${year}-${month}`}
                                                className={styles.monthGroup}
                                                variants={monthVariants}
                                            >
                                                <h3 className={styles.month}>{month}月</h3>
                                                <ul className={styles.articleList}>
                                                    <AnimatePresence>
                                                        {groupedArticles[year][month].map(article => (
                                                            <motion.li
                                                                key={article.id}
                                                                className={styles.articleItem}
                                                                variants={articleVariants}
                                                                whileHover="hover"
                                                            >
                                                                <div className={styles.dateContainer}>
                                                                    <span className={styles.articleDate}>
                                                                        {new Date(article.publishedAt).toLocaleDateString()}
                                                                    </span>
                                                                </div>

                                                                <div className={styles.cardContainer}>
                                                                    <span className={styles.dot}></span>
                                                                    <Link
                                                                        href={`/main/Articles/${article.id}`}
                                                                        className={styles.articleLink}
                                                                    >
                                                                        <span className={styles.articleTitle}>
                                                                            {article.title}
                                                                        </span>
                                                                        <span className={styles.articleType}>
                                                                            {getArticleTypeText(article.postType)}
                                                                        </span>
                                                                    </Link>
                                                                </div>
                                                            </motion.li>
                                                        ))}
                                                    </AnimatePresence>
                                                </ul>
                                            </motion.div>
                                        ))}
                                </motion.div>
                            ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            <RecentArticles />
        </motion.div>
    );
};

export default Archive;