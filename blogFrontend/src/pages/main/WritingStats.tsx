import React, { useEffect, useState } from "react";
import { ArticlesAPI } from "@/api/ArticlesAPI";
import ContributionCalendar from "@/components/ContributionCalendar/ContributionCalendar";
import { Article } from "@/types/Article";
import styles from "./WritingStats/WritingStats.module.scss";
import { motion } from "framer-motion";
import { FaBook, FaCalendarAlt, FaFire, FaChartLine, FaPalette } from "react-icons/fa";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import Head from "next/head";
import PageHeader from '../../components/PageHeader/PageHeader';

interface Stats {
    totalArticles: number;
    articlesThisYear: number;
    articlesThisMonth: number;
    mostActiveMonth: string;
    mostActiveDay: string;
    avgArticlesPerMonth: number;
    longestStreak: number;
    currentStreak: number;
    monthlyData: { name: string; value: number }[];
    dailyData: { name: string; value: number }[];
}

// 预定义的主题颜色
const THEME_COLORS = [
    { name: '绿色', value: '#9be9a8' },
    { name: '蓝色', value: '#58a6ff' },
    { name: '紫色', value: '#bc8cff' },
    { name: '橙色', value: '#ffa657' },
    { name: '红色', value: '#ff7b72' },
];
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)'
            }}>
                <p style={{ margin: '0 0 5px 0', color: '#666' }}>{label}</p>
                <p style={{ margin: 0, color: '#333', fontWeight: 'bold' }}>
                    {payload[0].value} 篇文章
                </p>
            </div>
        );
    }
    return null;
};

const WritingStats: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalArticles: 0,
        articlesThisYear: 0,
        articlesThisMonth: 0,
        mostActiveMonth: '',
        mostActiveDay: '',
        avgArticlesPerMonth: 0,
        longestStreak: 0,
        currentStreak: 0,
        monthlyData: [],
        dailyData: []
    });
    const [selectedColor, setSelectedColor] = useState(THEME_COLORS[0].value);
    const [showColorPicker, setShowColorPicker] = useState(false);

    useEffect(() => {
        ArticlesAPI.getArticles().then((res) => {
            const publishedArticles = res.data.filter((a: Article) => a.status === "published");
            setArticles(publishedArticles);
            calculateStats(publishedArticles);
        });
    }, []);

    const calculateStats = (articles: Article[]) => {
        const now = new Date();
        const thisYear = now.getFullYear();
        const thisMonth = now.getMonth();

        // 按月份统计文章数量
        const monthlyStats = new Array(12).fill(0);
        // 按星期统计文章数量
        const dailyStats = new Array(7).fill(0);
        // 记录连续发布的天数
        const publishDates = new Set<string>();

        articles.forEach(article => {
            if (article.publishedAt) {
                const date = new Date(article.publishedAt);
                // 验证日期是否有效
                if (!isNaN(date.getTime())) {
                    monthlyStats[date.getMonth()]++;
                    dailyStats[date.getDay()]++;
                    const dateStr = date.toISOString().split('T')[0];
                    publishDates.add(dateStr);
                }
            }
        });

        // 准备图表数据
        const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

        const monthlyData = months.map((month, index) => ({
            name: month,
            value: monthlyStats[index]
        }));

        const dailyData = days.map((day, index) => ({
            name: day,
            value: dailyStats[index]
        }));

        // 计算最活跃的月份和星期
        const mostActiveMonth = months[monthlyStats.indexOf(Math.max(...monthlyStats))];
        const mostActiveDay = days[dailyStats.indexOf(Math.max(...dailyStats))];

        // 计算连续发布天数
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        const sortedDates = Array.from(publishDates).sort();

        for (let i = 0; i < sortedDates.length; i++) {
            const currentDate = new Date(sortedDates[i]);
            const nextDate = i < sortedDates.length - 1 ? new Date(sortedDates[i + 1]) : null;

            if (nextDate && (nextDate.getTime() - currentDate.getTime()) === 86400000) {
                tempStreak++;
            } else {
                if (tempStreak > longestStreak) {
                    longestStreak = tempStreak;
                }
                tempStreak = 0;
            }
        }

        // 计算当前连续发布天数
        const today = new Date().toISOString().split('T')[0];
        let checkDate = new Date();
        while (publishDates.has(checkDate.toISOString().split('T')[0])) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }

        setStats({
            totalArticles: articles.length,
            articlesThisYear: articles.filter(a => a.publishedAt && new Date(a.publishedAt).getFullYear() === thisYear).length,
            articlesThisMonth: articles.filter(a => {
                if (!a.publishedAt) return false;
                const date = new Date(a.publishedAt);
                return !isNaN(date.getTime()) && date.getFullYear() === thisYear && date.getMonth() === thisMonth;
            }).length,
            mostActiveMonth,
            mostActiveDay,
            avgArticlesPerMonth: Number((articles.length / 12).toFixed(1)),
            longestStreak,
            currentStreak,
            monthlyData,
            dailyData
        });
    };

    // 更新 CSS 变量的函数
    const updateThemeColor = (color: string) => {
        document.documentElement.style.setProperty('--calendar-level-1', color);
        document.documentElement.style.setProperty('--calendar-level-2', adjustColor(color, 40));
        document.documentElement.style.setProperty('--calendar-level-3', adjustColor(color, 80));
    };

    // 调整颜色深度的辅助函数
    const adjustColor = (color: string, amount: number) => {
        const hex = color.replace('#', '');
        const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) - amount));
        const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) - amount));
        const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) - amount));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    // 生成图表颜色数组
    const getChartColors = (baseColor: string) => {
        return [
            baseColor,
            adjustColor(baseColor, 30),
            adjustColor(baseColor, 60),
            adjustColor(baseColor, 90),
            adjustColor(baseColor, 120)
        ];
    };

    // 当颜色改变时更新主题
    useEffect(() => {
        updateThemeColor(selectedColor);
    }, [selectedColor]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.container}
        >
            <Head>
                <title>写作足迹</title>
            </Head>
            <PageHeader
                headerText="写作统计"
                introText="时光流转，文字沉淀。在这里，我们用数据记录写作的足迹，用图表展现创作的轨迹。每一篇文章都是一次思想的绽放，每一次记录都是一次成长的见证。"
                englishTitle="Writing Stats"
            />
            <div className={styles.header}>
                <h1 className={styles.title}>写作统计</h1>
                <div className={styles.colorPicker}>
                    <button
                        className={styles.colorPickerButton}
                        onClick={() => setShowColorPicker(!showColorPicker)}
                    >
                        <FaPalette />
                    </button>
                    {showColorPicker && (
                        <div className={styles.colorOptions}>
                            {THEME_COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    className={styles.colorOption}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() => {
                                        setSelectedColor(color.value);
                                        setShowColorPicker(false);
                                    }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <FaBook className={styles.statIcon} />
                    <div className={styles.statContent}>
                        <h3>总文章数</h3>
                        <p>{stats.totalArticles}</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <FaCalendarAlt className={styles.statIcon} />
                    <div className={styles.statContent}>
                        <h3>今年文章</h3>
                        <p>{stats.articlesThisYear}</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <FaFire className={styles.statIcon} />
                    <div className={styles.statContent}>
                        <h3>本月文章</h3>
                        <p>{stats.articlesThisMonth}</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <FaChartLine className={styles.statIcon} />
                    <div className={styles.statContent}>
                        <h3>平均每月</h3>
                        <p>{stats.avgArticlesPerMonth}</p>
                    </div>
                </div>
            </div>

            <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                    <h3>月度文章分布</h3>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={stats.monthlyData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={selectedColor} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={selectedColor} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis
                                    dataKey="name"
                                    stroke="var(--text)"
                                    tick={{ fill: 'var(--text)', fontSize: 12 }}
                                />
                                <YAxis
                                    stroke="var(--text)"
                                    tick={{ fill: 'var(--text)', fontSize: 12 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={selectedColor}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <h3>星期文章分布</h3>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stats.dailyData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill={selectedColor}
                                    dataKey="value"
                                >
                                    {stats.dailyData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={getChartColors(selectedColor)[index % 5]}
                                            style={{
                                                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                                            }}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className={styles.calendarSection}>
                <div style={{ margin: '0 75px' }}>
                    <ContributionCalendar articles={articles} />
                    <div className={styles.legend}>
                        <span>文章频率：</span>
                        <div className={styles.legendItems}>
                            <div className={styles.legendItem}>
                                <div className={styles.legendColor} style={{ backgroundColor: 'var(--calendar-empty)' }}></div>
                                <span>未发布</span>
                            </div>
                            <div className={styles.legendItem}>
                                <div className={styles.legendColor} style={{ backgroundColor: 'var(--calendar-level-1)' }}></div>
                                <span>较少</span>
                            </div>
                            <div className={styles.legendItem}>
                                <div className={styles.legendColor} style={{ backgroundColor: 'var(--calendar-level-2)' }}></div>
                                <span>中等</span>
                            </div>
                            <div className={styles.legendItem}>
                                <div className={styles.legendColor} style={{ backgroundColor: 'var(--calendar-level-3)' }}></div>
                                <span>较多</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.detailsGrid}>
                <div className={styles.detailCard}>
                    <h3>最活跃月份</h3>
                    <p>{stats.mostActiveMonth}</p>
                </div>
                <div className={styles.detailCard}>
                    <h3>最活跃星期</h3>
                    <p>{stats.mostActiveDay}</p>
                </div>
                <div className={styles.detailCard}>
                    <h3>最长连续发布</h3>
                    <p>{stats.longestStreak} 天</p>
                </div>
                <div className={styles.detailCard}>
                    <h3>当前连续发布</h3>
                    <p>{stats.currentStreak} 天</p>
                </div>
            </div>
        </motion.div>
    );
};

export default WritingStats;