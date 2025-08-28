import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './RecentArticles.module.scss';
import { Article } from '@/types/Article';
import { ArticlesAPI } from '@/api/ArticlesAPI';
import { useLoading } from "@/hooks/useLoading";
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const RecentArticles: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const { isLoading, withLoading } = useLoading();
    const router = useRouter();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await withLoading(ArticlesAPI.getArticles());
                const data = response.data as unknown as Article[];
                // 只取最新发布的5篇文章
                const latestArticles = data
                    .filter((item: any) => item.status === 'published')
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5);
                setArticles(latestArticles);
            } catch (error) {
                console.error('获取文章列表失败:', error);
            }
        };

        fetchArticles();
    }, [withLoading]);

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>近期文章</h2>
            <div className={styles.articleList}>
                {articles.length === 0 ? (
                    <div className={styles.noArticles}>暂无推荐文章</div>
                ) : (
                    articles.map((article) => (
                        <div
                            key={article.id}
                            className={styles.boxGrip}
                            onClick={() => router.push(`/main/Articles/${article.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className={styles.imageBox}>
                                {article.coverImage ? (
                                    <img
                                        src={article.coverImage}
                                        alt={article.title}
                                        className={styles.articleImage}
                                    />
                                ) : (
                                    <div className={styles.noImage}>
                                        <img
                                            src="/images/loading.png"
                                            alt="暂无图片"
                                            className={styles.placeholderImage}
                                        />
                                        <span className={styles.noImageText}>这篇文章没有配图，但内容依然精彩~</span>
                                    </div>
                                )}
                            </div>
                            <div className={styles.contentBox}>
                                <div className={styles.tagBox}>{article.title}</div>
                                <div className={styles.tagBox}>{new Date(article.createdAt).toLocaleDateString()}</div>
                                <div className={styles.tagBox}>预计阅读时间: {article.readingTime}分钟</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentArticles;