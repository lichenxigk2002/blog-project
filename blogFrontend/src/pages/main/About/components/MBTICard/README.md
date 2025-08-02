# MBTI Card Component

## 描述
MBTI卡片组件，用于显示个人MBTI性格类型信息和特征分析。

## 功能特性
- 显示MBTI类型（ENTJ-A Commander）
- 展示5个性格维度的百分比进度条
- 包含外部链接到16personalities网站
- GSAP动画效果
- 鼠标悬浮交互效果

## 使用方法
```tsx
import MBTICard from '@/components/MBTICard/MBTICard';

// 在Grid布局中使用
<div className={styles.container}>
  {/* 其他卡片 */}
  <MBTICard />
  {/* 其他卡片 */}
</div>
```

## 样式说明
- 使用CSS Grid布局，占据 `grid-column: 5/11; grid-row: 6/8;` 位置
- 内部使用7列4行的Grid布局
- 响应式设计，适配不同屏幕尺寸

## 依赖
- React
- GSAP (动画库)
- Next.js Image组件
- SCSS模块化样式 