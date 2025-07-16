import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './Tags/Tags.module.scss';
import Head from "next/head";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useLoading } from '@/hooks/useLoading';
import { TagsAPI } from '@/api/TagsAPI';
import { Tag } from "@/types/Tags";
import PageHeader from '../../components/PageHeader/PageHeader';
import TagCloudBackground from "@/components/TagCloudBackground/TagCloudBackground";
import { motion } from 'framer-motion';

// 常量
const MAX_TAGS = 100;
const ANIMATION_DELAY = 0.1;

// 动画配置
const tagVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.8,
        rotate: -5
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        rotate: 0
    },
    hover: {
        scale: 1.05,
        rotate: 2,
        transition: { duration: 0.2 }
    }
};

// 新增：定义props类型
interface TagsProps {
    initialTags: Tag[];
}

const Tags: React.FC<TagsProps> = ({ initialTags }) => {
    const router = useRouter();
    const [tags, setTags] = useState<Tag[]>(initialTags || []);
    const [error, setError] = useState<string | null>(null);
    const { isLoading, withLoading } = useLoading();

    // 处理标签点击
    const handleTagClick = (tag: Tag) => {
        router.push(`/main/Articles/tag/${tag.id}`);
    };

    // 获取标签背景色
    const getTagBackgroundColor = (tagColor: string) => {
        return `color-mix(in srgb, var(--tag-background) 90%, ${tagColor})`;
    };

    useEffect(() => {
        // 如果props有数据则不再请求
        if (initialTags && initialTags.length > 0) return;
        const fetchTags = async () => {
            try {
                const data = await withLoading(TagsAPI.getTags()) as Tag[];
                setTags(data.slice(0, MAX_TAGS));
            } catch (err) {
                console.error('Error fetching tags:', err);
                setError('加载标签失败，请稍后重试');
            }
        };
        fetchTags();
    }, [withLoading, initialTags]);

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>标签云 | 探索知识的无限可能</title>
                <meta name="description" content="通过标签探索文章，发现更多精彩内容，让知识触手可及" />
            </Head>

            <PageHeader
                headerText="标签云"
                introText="知识如繁星点点，标签似云卷云舒。在这里，每一个标签都是一扇门，打开它，就能遇见一片新的天地。让我们在标签的海洋中遨游，探索知识的无限可能。"
                englishTitle="Tags"
            />

            {isLoading && <LoadingSpinner />}

            <div className={styles.tagsGrid}>
                {tags.map((tag, index) => (
                    <motion.div
                        key={tag.id}
                        initial={tagVariants.initial}
                        animate={tagVariants.animate}
                        whileHover={tagVariants.hover}
                        transition={{
                            delay: index * ANIMATION_DELAY,
                            duration: 0.5,
                            ease: [0.34, 1.56, 0.64, 1]
                        }}
                    >
                        <div
                            className={styles.tag}
                            onClick={() => handleTagClick(tag)}
                            style={{
                                borderColor: tag.color,
                                color: tag.color,
                                backgroundColor: getTagBackgroundColor(tag.color)
                            }}
                            title={tag.name}
                        >
                            {tag.name}
                            {tag.count !== undefined && tag.count > 0 && (
                                <span className={styles.tagCount} style={{ color: tag.color }}>
                                    {tag.count}
                                </span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            <TagCloudBackground
                tags={tags.map(({ name, color }) => ({ name, color }))}
            />
        </div>
    );
};

// 新增：getStaticProps实现SSG+ISR
import { GetStaticProps } from 'next';
export const getStaticProps: GetStaticProps = async () => {
    try {
        const data = await TagsAPI.getTags();
        return {
            props: {
                initialTags: (data as Tag[]).slice(0, MAX_TAGS)
            },
            revalidate: 600 // ISR: 每10分钟自动更新
        };
    } catch (err) {
        return {
            props: {
                initialTags: []
            },
            revalidate: 600
        };
    }
};

export default Tags;