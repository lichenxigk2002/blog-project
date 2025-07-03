import React from "react";
import { Article } from "@/types/Article";
import styles from "./ContributionCalendar.module.scss";

const WEEK_LABELS = ["Mon", "Wed", "Fri"];
const WEEK_LABEL_INDEXES = [1, 3, 5]; // 星期一、三、五在 grid 的行号
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getColor(count: number) {
    if (!count) return "var(--calendar-empty)";
    if (count === 1) return "var(--calendar-level-1)";
    if (count === 2) return "var(--calendar-level-2)";
    if (count >= 3) return "var(--calendar-level-3)";
}

function getDateKey(date: Date) {
    return date.toISOString().slice(0, 10);
}

function getStartOfCalendar(weeks: number) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    now.setDate(now.getDate() - now.getDay());
    now.setDate(now.getDate() - (weeks - 1) * 7);
    return now;
}

interface Props {
    articles: Article[];
    weeks?: number;
}

const ContributionCalendar: React.FC<Props> = ({ articles, weeks = 52 }) => {
    // 统计每天的文章数量
    const countByDate: Record<string, number> = {};
    articles.forEach((a) => {
        if (a.status === "published" && a.publishedAt) {
            const date = a.publishedAt.slice(0, 10);
            countByDate[date] = (countByDate[date] || 0) + 1;
        }
    });

    // 生成日历格子（按列：一周一列）
    const days: { date: string; count: number; month: number; year: number }[] = [];
    let startDate = getStartOfCalendar(weeks);
    for (let d = 0; d < 7; d++) {
        let date = new Date(startDate);
        date.setDate(date.getDate() + d);
        for (let w = 0; w < weeks; w++) {
            const key = getDateKey(date);
            days.push({ date: key, count: countByDate[key] || 0, month: date.getMonth(), year: date.getFullYear() });
            date.setDate(date.getDate() + 7);
        }
    }

    // 计算每列的第一个格子的月份
    const monthLabels: string[] = [];
    let lastMonth = -1;
    for (let w = 0; w < weeks; w++) {
        const idx = w; // 每列的第一个格子
        const day = days[idx];
        if (day.month !== lastMonth) {
            monthLabels.push(MONTHS[day.month]);
            lastMonth = day.month;
        } else {
            monthLabels.push("");
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.monthLabels}>
                {monthLabels.map((label, i) => (
                    <div key={i} className={styles.monthLabel}>{label}</div>
                ))}
            </div>
            <div className={styles.calendarWrapper}>
                <div className={styles.weekLabels}>
                    {Array.from({ length: 7 }).map((_, i) =>
                        WEEK_LABEL_INDEXES.includes(i) ? (
                            <div key={i} className={styles.weekLabel}>
                                {WEEK_LABELS[WEEK_LABEL_INDEXES.indexOf(i)]}
                            </div>
                        ) : (
                            <div key={i} className={styles.weekLabel} />
                        )
                    )}
                </div>
                <div className={styles.calendar}>
                    {days.map((day, i) => (
                        <div
                            key={i}
                            className={styles.calendarDay}
                            title={`${day.date}: ${day.count} 篇文章`}
                            style={{
                                background: getColor(day.count),
                                animationDelay: `${i * 0.01}s`
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContributionCalendar;

