# StatsCard 统计卡片组件

## 功能描述

StatsCard 是一个可复用的统计卡片组件，用于展示各种统计数据。

## 接口定义

```typescript
interface StatItem {
  title: string;      // 统计项标题
  value: number | string;  // 统计值
  unit?: string;      // 单位（可选）
}

interface StatsCardProps {
  stats: StatItem[];  // 统计数据数组
  className?: string; // 自定义样式类名
}
```

## 使用示例

```tsx
import StatsCard from '@/admin/components/ui/StatsCard/StatsCard';

const stats = [
  { title: '文章总数', value: 100 },
  { title: '已发布', value: 80 },
  { title: '总浏览量', value: 5000, unit: '次' },
  { title: '总点赞数', value: 1200, unit: '个' }
];

<StatsCard stats={stats} />
```

## 样式特性

- 响应式布局：在不同屏幕尺寸下自动调整列数
- 悬停效果：鼠标悬停时卡片会向上移动并增强阴影
- 渐变边框：使用主题色的边框设计
- 字体：使用 Comic Sans MS 字体保持一致性 