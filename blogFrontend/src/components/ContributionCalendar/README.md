# ContributionCalendar 组件技术文档

## 1. 用途与功能概述

ContributionCalendar 组件用于可视化展示用户/文章的活跃度，类似 GitHub 贡献日历。每个格子代表一天，颜色深浅反映当天文章数量，支持横向滚动和响应式自适应，适合博客、知识库等内容活跃度展示。
- 文章活跃度一目了然
- 横向滚动，适配多周数据
- 响应式自适应各类屏幕

---

## 2. 主要 props/类型定义

```ts
interface Props {
  articles: Article[]; // 文章列表，需包含 publishedAt 字段
  weeks?: number;      // 展示周数，默认 52
}
```

---

## 3. 关键数据处理与渲染逻辑

### 3.1 文章统计与日期映射
- 遍历所有已发布文章，统计每天的文章数量

```ts
const countByDate: Record<string, number> = {};
articles.forEach((a) => {
  if (a.status === "published" && a.publishedAt) {
    const date = a.publishedAt.slice(0, 10);
    countByDate[date] = (countByDate[date] || 0) + 1;
  }
});
```

### 3.2 日历格生成
- 以“每周为一列，每列 7 天”生成格子，支持自定义周数
- 每个格子包含日期、文章数、月份、年份

```ts
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
```

### 3.3 月份与周标签
- 计算每列的第一个格子的月份，生成顶部月份标签
- 周标签（Mon/Wed/Fri）固定在左侧

```ts
const monthLabels: string[] = [];
let lastMonth = -1;
for (let w = 0; w < weeks; w++) {
  const idx = w;
  const day = days[idx];
  if (day.month !== lastMonth) {
    monthLabels.push(MONTHS[day.month]);
    lastMonth = day.month;
  } else {
    monthLabels.push("");
  }
}
```

### 3.4 颜色分级
- 根据每日文章数分为 4 个等级，映射不同颜色（通过 CSS 变量控制）

```ts
function getColor(count: number) {
  if (!count) return "var(--calendar-empty)";
  if (count === 1) return "var(--calendar-level-1)";
  if (count === 2) return "var(--calendar-level-2)";
  if (count >= 3) return "var(--calendar-level-3)";
}
```

---

## 4. 主要渲染结构

- 顶部为月份标签，左侧为周标签，右侧为日历格子（横向滚动）
- 每个格子带动画和 title 提示

```tsx
return (
  <div className={styles.container}>
    <div className={styles.monthLabels}>
      {monthLabels.map((label, i) => (
        <div key={i} className={styles.monthLabel}>{label}</div>
      ))}
    </div>
    <div className={styles.calendarWrapper}>
      <div className={styles.weekLabels}>...</div>
      <div className={styles.calendar}>
        {days.map((day, i) => (
          <div
            key={i}
            className={styles.calendarDay}
            title={`${day.date}: ${day.count} 篇文章`}
            style={{ background: getColor(day.count), animationDelay: `${i * 0.01}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);
```

---

## 5. 交互与体验优化

- **动画**：格子淡入动画，提升视觉动感
- **title 提示**：悬浮显示日期与文章数，便于细查
- **响应式**：rem 单位、横向滚动、不同屏幕自适应
- **性能说明**：纯前端渲染，无副作用，适合大数据量

---

## 6. 主要知识点

- React 纯函数式渲染与数据映射
- 日期处理与分组统计
- 横向滚动、响应式布局
- CSS 变量与动画
- 业务数据可视化与交互体验
