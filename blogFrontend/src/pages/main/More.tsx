import React from 'react';
import styles from './More/More.module.scss';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaComments, FaLink, FaChartBar, FaBook, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import Head from 'next/head';

// 功能数据配置
const features = [
    {
        id: 1,
        title: '留言板',
        description: '在这里留下你的想法和建议',
        icon: <FaComments />,
        path: '/main/BulletinBoard',
        color: '#FF6B6B'
    },
    {
        id: 2,
        title: '友人账',
        description: '交换友情链接，互相支持',
        icon: <FaLink />,
        path: '/main/FriendLinks',
        color: '#4ECDC4'
    },
    {
        id: 3,
        title: '创作统计',
        description: '查看博客的创作数据和统计',
        icon: <FaChartBar />,
        path: '/main/WritingStats',
        color: '#45B7D1'
    },
    {
        id: 4,
        title: '归档',
        description: '按时间线浏览所有文章',
        icon: <FaCalendarAlt />,
        path: '/main/Archive',
        color: '#96CEB4'
    },
    {
        id: 5,
        title: '标签云',
        description: '通过标签快速找到感兴趣的内容',
        icon: <FaBook />,
        path: '/main/Tags',
        color: '#FFEEAD'
    },
    {
        id: 6,
        title: '搜索',
        description: '搜索站内所有内容',
        icon: <FaSearch />,
        path: '/main/Search',
        color: '#D4A5A5'
    }
];

// 动画配置
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5 }
    }
};

// 新增：getStaticProps实现SSG+ISR
import { GetStaticProps } from 'next';
export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {},
        revalidate: 600 // ISR: 每10分钟自动更新
    };
};

const More: React.FC = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>更多功能 - 博客</title>
            </Head>

            <motion.h1
                className={styles.title}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                更多功能
            </motion.h1>

            <motion.div
                className={styles.featuresGrid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {features.map((feature) => (
                    <motion.div
                        key={feature.id}
                        className={styles.featureCard}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Link href={feature.path} className={styles.featureLink}>
                            <div
                                className={styles.iconContainer}
                                style={{ backgroundColor: `${feature.color}20` }}
                            >
                                <span
                                    className={styles.icon}
                                    style={{ color: feature.color }}
                                >
                                    {feature.icon}
                                </span>
                            </div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDescription}>{feature.description}</p>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default More;