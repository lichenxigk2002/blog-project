import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Gallery/Gallery.module.scss';
import Head from "next/head";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useLoading } from '@/hooks/useLoading';
import { GalleryAPI } from '@/api/GalleryAPI';
import { Gallery as GalleryItem } from '@/types/Gallery';
import PageHeader from '../../components/PageHeader/PageHeader';
import Image from 'next/image';
import { useGlobalTip } from '@/hooks/useGlobalTip';
import { httpError } from '@/http/core/error';

// 添加类型定义
interface GroupedGalleries {
    [key: string]: {
        [key: string]: GalleryItem[]; // 月份分组
    };
}

// 新增：定义props类型
interface GalleryProps {
    initialGalleries: GalleryItem[];
}

const Gallery: React.FC<GalleryProps> = ({ initialGalleries }) => {
    const [galleries, setGalleries] = useState<GalleryItem[]>(initialGalleries || []);
    const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('全部');
    const { isLoading, withLoading } = useLoading();
    const { showTip } = useGlobalTip();

    // 添加默认分类
    const defaultCategories = ['全部', '风景', '人物', '美食', '旅行', '生活'];
    const categories = galleries.length > 0
        ? ['全部', ...new Set(galleries.map(gallery => gallery.category))]
        : defaultCategories;

    const filteredGalleries = selectedCategory === '全部'
        ? galleries
        : galleries.filter(gallery => gallery.category === selectedCategory);

    // 添加空状态显示
    const renderEmptyState = () => (
        <div className={styles.emptyState}>
            <LoadingSpinner />
        </div>
    );

    // 添加分组函数
    const groupGalleriesByDate = (galleries: GalleryItem[]) => {
        const grouped: GroupedGalleries = {};

        galleries.forEach(gallery => {
            // 直接使用 date 字符串分割
            const [year, month] = gallery.date.split('-');

            if (!grouped[year]) {
                grouped[year] = {};
            }
            if (!grouped[year][month]) {
                grouped[year][month] = [];
            }
            grouped[year][month].push(gallery);
        });

        // 对每个月份内的图片进行排序
        Object.keys(grouped).forEach(year => {
            Object.keys(grouped[year]).forEach(month => {
                grouped[year][month].sort((a, b) => {
                    // 直接比较日期字符串
                    return b.date.localeCompare(a.date);
                });
            });
        });

        return grouped;
    };

    // 渲染分组后的图片
    const renderGroupedGalleries = () => {
        const groupedGalleries = groupGalleriesByDate(filteredGalleries);

        return Object.keys(groupedGalleries).sort((a, b) => Number(b) - Number(a)).map(year => (
            <div key={year} className={styles.yearGroup}>
                <h2 className={styles.yearTitle}>{year}年</h2>
                {Object.keys(groupedGalleries[year]).sort((a, b) => Number(b) - Number(a)).map(month => (
                    <div key={`${year}-${month}`} className={styles.monthGroup}>
                        <h3 className={styles.monthTitle}>{month}月</h3>
                        <motion.div
                            className={styles.monthGallery}
                            layout
                        >
                            {groupedGalleries[year][month].map((gallery, index) => (
                                <motion.div
                                    key={gallery.id}
                                    className={styles.photoCard}
                                    layoutId={`card-${gallery.id}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1,
                                        layout: { duration: 0.3 }
                                    }}
                                    onClick={() => setSelectedGallery(gallery)}
                                >
                                    <div className={styles.photoContent}>
                                        <Image
                                            src={gallery.coverImage || '/default-image.jpg'}
                                            alt={gallery.title}
                                            width={300}
                                            height={200}
                                            className={styles.coverImage}
                                            placeholder="blur"
                                            blurDataURL="/default-image.jpg"
                                        />
                                        <span className={styles.date}>{gallery.date}</span>
                                        <h3 className={styles.photoTitle}>{gallery.title}</h3>
                                        <p className={styles.category}>{gallery.category}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                ))}
            </div>
        ));
    };

    // 修改选中图片的处理
    const handleGalleryClick = (gallery: GalleryItem) => {
        setSelectedGallery(gallery);
    };

    useEffect(() => {
        // 如果props有数据则不再请求
        if (initialGalleries && initialGalleries.length > 0) return;
        const fetchGalleries = async () => {
            try {
                const data = await GalleryAPI.getGalleries();
                const galleryData = Array.isArray(data) ? data : [];
                const transformedData = galleryData
                    .filter((item: any) => item.category !== '证书')
                    .map((item: any) => ({
                        ...item,
                        date: item.date,
                        coverImage: item.coverImage ? item.coverImage.replace(/\/uploads\/\/uploads\//g, '/uploads/') : '/default-image.jpg'
                    }));
                setGalleries(transformedData);
            } catch (err) {
                if (err instanceof httpError) {
                    showTip(err.message, 'error');
                } else {
                    showTip('加载相册失败，请稍后重试', 'error');
                }
            }
        };

        fetchGalleries();
        const interval = setInterval(fetchGalleries, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [initialGalleries]);

    return (
        <div className={styles.container}>
            <Head>
                <title>时光印记 | 记录生活的美好瞬间</title>
                <meta name="description" content="用照片记录生活，用影像珍藏回忆，这里是属于我们的时光印记" />
            </Head>

            {/* 添加照片瀑布流背景 */}

            <PageHeader
                headerText="记录时光"
                introText="每一张照片，都是时光的碎片。在这里，我们用镜头捕捉生活的瞬间，用影像定格记忆的温度。愿这些画面能唤起你心底的共鸣，让美好的回忆永远鲜活。"
                englishTitle="Gallery"
            />
            <motion.div
                className={styles.header}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className={styles.categories}>
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </motion.div>

            {isLoading && <LoadingSpinner />}

            <motion.div className={styles.gallery} layout>
                {filteredGalleries.length > 0 ? (
                    renderGroupedGalleries()
                ) : (
                    renderEmptyState()
                )}
            </motion.div>

            <AnimatePresence>
                {selectedGallery && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedGallery(null)}
                    >
                        <motion.div
                            className={styles.modalContent}
                            layoutId={`card-${selectedGallery.id}`}
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                className={styles.closeButton}
                                onClick={() => setSelectedGallery(null)}
                            >
                                <span>×</span>
                            </button>
                            <div className={styles.modalImageContainer}>
                                <Image
                                    src={selectedGallery.coverImage || '/default-image.jpg'}
                                    alt={selectedGallery.title}
                                    width={800}
                                    height={600}
                                    className={styles.modalImage}
                                    placeholder="blur"
                                    blurDataURL="/default-image.jpg"
                                />
                            </div>
                            <div className={styles.modalInfo}>
                                <span className={styles.modalDate}>{selectedGallery.date}</span>
                                <h2 className={styles.modalTitle}>{selectedGallery.title}</h2>
                                <p className={styles.modalCategory}>{selectedGallery.category}</p>
                                <p className={styles.modalDescription}>
                                    {selectedGallery.description}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// 新增：getStaticProps实现SSG+ISR
import { GetStaticProps } from 'next';
export const getStaticProps: GetStaticProps = async () => {
    try {
        const data = await GalleryAPI.getGalleries();
        const galleryData = Array.isArray(data) ? data : [];
        const transformedData = galleryData
            .filter((item: any) => item.category !== '证书')
            .map((item: any) => ({
                ...item,
                date: item.date,
                coverImage: item.coverImage ? item.coverImage.replace(/\/uploads\/\/uploads\//g, '/uploads/') : '/default-image.jpg'
            }));
        return {
            props: {
                initialGalleries: transformedData
            },
            revalidate: 600 // ISR: 每10分钟自动更新
        };
    } catch (err) {
        return {
            props: {
                initialGalleries: []
            },
            revalidate: 600
        };
    }
};

export default Gallery;