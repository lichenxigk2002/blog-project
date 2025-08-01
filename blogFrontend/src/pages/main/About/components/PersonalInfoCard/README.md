# PersonalInfoCard Component

## 描述
个人信息卡片组件，用于显示个人介绍信息。

## 功能特性
- 显示个人欢迎语
- 展示个人昵称（带渐变高亮效果）
- 显示职业描述
- 响应式设计
- 美观的渐变文字效果

## 使用方法
```tsx
import PersonalInfoCard from '@/pages/main/About/components/PersonalInfoCard/PersonalInfoCard';

// 在Grid布局中使用
<PersonalInfoCard />
```

## 样式说明
- 使用CSS Grid布局，占据 `grid-column: 1/6` 位置
- 居中对齐的文本布局
- 渐变文字效果用于高亮显示
- 响应式字体大小

## 内容
- 欢迎语："你好！欢迎来到我的博客！"
- 个人昵称："我是孤芳不自赏"
- 职业描述："一个热爱技术的全栈开发工程师" 