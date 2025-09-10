import React, { useEffect, useState, useRef } from 'react';
import Head from "next/head";
import Image from 'next/image';
import styles from './Home/Home.module.scss'
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import Arrow from "@/components/Arrow/Arrow";
import Typewriter from '@/components/Typewriter/Typewriter';
import { ArticlesAPI } from '@/api/ArticlesAPI';
import { TagsAPI } from '@/api/TagsAPI';
import { GalleryAPI } from '@/api/GalleryAPI';
import Link from 'next/link';
import type { Tag } from '@/types/Tags';
import { ArticleListItem } from '@/types/Article';
import { Gallery } from '@/types/Gallery';
import dynamic from 'next/dynamic';
import { useMobile } from '@/hooks/useMobile';
const FlipClock = dynamic(() => import('@/components/FlipCard/FlipClock'), { ssr: false });

// 新增：定义props类型
interface HomeProps {
    latestArticles: ArticleListItem[];
    tags: Tag[];
    stats: { articles: number; tags: number; views: number };
    recentPhotos: Gallery[];
}

const Home: React.FC<HomeProps> = ({ latestArticles: initialArticles, tags: initialTags, stats: initialStats, recentPhotos: initialPhotos }) => {
    const [latestArticles, setLatestArticles] = useState<ArticleListItem[]>(initialArticles || []);
    const [tags, setTags] = useState<Tag[]>(initialTags || []);
    const [stats, setStats] = useState(initialStats || { articles: 0, tags: 0, views: 0 });
    const [recentPhotos, setRecentPhotos] = useState<Gallery[]>(initialPhotos || []);
    const [showMainContent, setShowMainContent] = useState(false);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const [visibleArticleIndexes, setVisibleArticleIndexes] = useState<number[]>([]);
    const [visiblePhotoIndexes, setVisiblePhotoIndexes] = useState<number[]>([]);
    const articlesRef = useRef<HTMLDivElement>(null);

    // 使用自定义Hook检测移动端
    const { isMobile } = useMobile();

    // 添加滚动处理函数
    const handleArrowClick = () => {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // useEffect兜底，防止props为空时依然能获取数据
    useEffect(() => {
        if (initialArticles && initialArticles.length > 0) return;
        // 获取最新文章
        const fetchLatestArticles = async () => {
            try {
                const response = await ArticlesAPI.getArticlesSimple();
                if (response && Array.isArray(response.data)) {
                    const publishedArticles = response.data
                        .filter(article => article.status === 'published')
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 5);
                    setLatestArticles(publishedArticles);

                    setStats(prevStats => ({
                        ...prevStats,
                        articles: response.data.filter(article => article.status === 'published').length,
                        views: response.data.reduce((acc, article) => acc + (article.viewCount || 0), 0)
                    }));
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        // 获取最新照片
        const fetchRecentPhotos = async () => {
            try {
                const data = await GalleryAPI.getGalleries();
                const galleryData = Array.isArray(data) ? data : [];
                const transformedData = galleryData
                    .map((item: any) => ({
                        ...item,
                        coverImage: item.coverImage ? item.coverImage.replace(/\/uploads\/\/uploads\//g, '/uploads/') : '/default-image.jpg'
                    }))
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 4);
                setRecentPhotos(transformedData);
            } catch (error) {
                console.error('Error fetching photos:', error);
            }
        };

        // 获取标签
        const fetchTags = async (name = '') => {
            try {
                const response = await TagsAPI.getTagsWithCount();
                let data = response as Tag[];
                if (name) {
                    data = data.filter(tag =>
                        tag.name.toLowerCase().includes(name.toLowerCase())
                    );
                }
                setTags(data);
                setStats(prevStats => ({
                    ...prevStats,
                    tags: data.length
                }));
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchLatestArticles();
        fetchRecentPhotos();
        fetchTags();
    }, [initialArticles, initialTags, initialStats, initialPhotos]);

    useEffect(() => {
        // IntersectionObserver 懒加载 mainContent
        const observer = new window.IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setShowMainContent(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '0px 0px 200px 0px' }
        );
        if (mainContentRef.current) {
            observer.observe(mainContentRef.current);
        }
        return () => observer.disconnect();
    }, []);

    // 依次浮现动画，只监听最新文章区
    useEffect(() => {
        if (!showMainContent) return;

        let observed = false;
        const observer = new window.IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !observed) {
                    observed = true;
                    setVisibleArticleIndexes([]);
                    setVisiblePhotoIndexes([]);
                    latestArticles.forEach((_, idx) => {
                        setTimeout(() => {
                            setVisibleArticleIndexes(prev => [...prev, idx]);
                        }, idx * 120);
                    });
                    recentPhotos.forEach((_, idx) => {
                        setTimeout(() => {
                            setVisiblePhotoIndexes(prev => [...prev, idx]);
                        }, idx * 120);
                    });
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if (articlesRef.current) observer.observe(articlesRef.current);

        return () => observer.disconnect();
    }, [showMainContent, latestArticles, recentPhotos]);

    // 格式化日期
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <div className={styles.bacc}>
            <Head>
                <title>孤芳不自赏知识空间</title>
                <meta name="description" content="记录我的技术思考、设计理念和生活感悟" />
            </Head>

            <div className={styles.container}>
                <div className={styles.showTop}>
                    <div className={styles.box1}>
                        <Typewriter className={styles.typewriter1} text={'这里是孤芳不自赏的Blog'} delay={100} />
                        <br className={styles.typewriter1} />
                        <Typewriter className={styles.typewriter2} text={'日益努力，而后风生水起'} delay={200} cursorChar={'|'} />
                    </div>
                    <div className={styles.box2}>
                        <ProfileCard />
                    </div>
                </div>

                <div className={styles.clockArrowContainer}>
                    <div className={styles.flipClock}>
                        <FlipClock />
                    </div>

                    <div className={styles.arrowWrapper}>
                        <Arrow
                            text1={"钥在锁先，行胜于言"}
                            text2={"Prepare the solution beforethe problem; action speaks louder."}
                            onClick={handleArrowClick}
                        />
                    </div>
                </div>

                <div ref={mainContentRef} id="mainContent" className={styles.mainContentArea}>
                    {showMainContent && (
                        <>
                            <div className={styles.mainContentLeft} ref={articlesRef}>
                                <h2 className={styles.latestArticlesTitle}>最新文章</h2>
                                <div className={styles.articlesGrid}>
                                    {latestArticles.map((article: ArticleListItem, idx) => (
                                        <Link href={`/main/Articles/${article.id}`} key={article.id}>
                                            <div className={`${styles.articleCard} ${visibleArticleIndexes.includes(idx) ? styles.fadeIn : styles.hidden}`}>
                                                <div>
                                                    <h3 className={styles.articleTitle}>{article.title}</h3>
                                                    <p className={styles.articleDescription}>
                                                        {article.excerpt}
                                                    </p>
                                                </div>
                                                <div className={styles.articleMeta}>
                                                    <span className={styles.articleCreatedAt}>{formatDate(article.createdAt)}</span>
                                                    <span className={styles.articleViewCount}>{article.viewCount || 0} 阅读</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.mainContentRight}>
                                <h2 className={styles.latestArticlesTitle}>近期照片</h2>
                                <div className={`${styles.photosGrid} ${isMobile ? styles.photosGridMobile : ''}`}>
                                    {recentPhotos.map((photo, idx) => (
                                        <Link href="/main/Gallery" key={photo.id}>
                                            <div className={`${styles.photoCard} ${visiblePhotoIndexes.includes(idx) ? styles.fadeIn : styles.hidden}`}>
                                                <Image
                                                    src={photo.coverImage || '/default-image.jpg'}
                                                    alt={photo.title}
                                                    width={300}
                                                    height={200}
                                                    className={styles.photoImage}
                                                    placeholder="blur"
                                                    blurDataURL="/default-image.jpg"
                                                    onError={() => {
                                                        // next/image 不支持 onError，但会使用 blurDataURL 作为 fallback
                                                        console.warn(`Failed to load image: ${photo.coverImage}`);
                                                    }}
                                                />
                                                <div className={styles.photoInfo}>
                                                    <h3>{photo.title}</h3>
                                                    <span>{photo.date}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                <section className={styles.stats}>
                                    <h2>博客统计</h2>
                                    <div className={styles.statsGrid}>
                                        <div className={styles.statItem}>
                                            <span>{stats.articles}</span>
                                            <p>文章数</p>
                                        </div>
                                        <div className={styles.statItem}>
                                            <span>{stats.tags}</span>
                                            <p>标签数</p>
                                        </div>
                                        <div className={styles.statItem}>
                                            <span>{stats.views}</span>
                                            <p>文章阅读量</p>
                                        </div>
                                    </div>
                                </section>

                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// 新增：getStaticProps实现SSG
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
    // 获取最新文章
    let latestArticles: ArticleListItem[] = [];
    let stats = { articles: 0, tags: 0, views: 0 };
    try {
        const response = await ArticlesAPI.getArticlesSimple();
        if (response && Array.isArray(response.data)) {
            latestArticles = response.data
                .filter(article => article.status === 'published')
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5);
            stats.articles = response.data.filter(article => article.status === 'published').length;
            stats.views = response.data.reduce((acc, article) => acc + (article.viewCount || 0), 0);
        }
    } catch (e) {
        // 忽略错误，兜底用useEffect
    }

    // 获取标签
    let tags: Tag[] = [];
    try {
        const response = await TagsAPI.getTagsWithCount();
        tags = response as Tag[];
        stats.tags = tags.length;
    } catch (e) {
        // 忽略错误
    }

    // 获取近期照片
    let recentPhotos: Gallery[] = [];
    try {
        const data = await GalleryAPI.getGalleries();
        const galleryData = Array.isArray(data) ? data : [];
        recentPhotos = galleryData
            .map((item: any) => ({
                ...item,
                coverImage: item.coverImage ? item.coverImage.replace(/\/uploads\/\/uploads\//g, '/uploads/') : '/default-image.jpg'
            }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 4);
    } catch (e) {
        // 忽略错误
    }

    return {
        props: {
            latestArticles,
            tags,
            stats,
            recentPhotos
        },
        revalidate: 600 // ISR: 每10分钟自动更新一次
    };
};

export default Home;