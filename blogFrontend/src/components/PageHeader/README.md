 # PageHeader 组件技术文档

## 1. 组件用途

`PageHeader` 是页面顶部的标题与简介展示组件，支持主标题、副标题（英文大字）、简介说明。常用于各内容页、频道页、专题页等，统一页面风格，提升品牌感和可读性。

---

## 2. Props/类型定义

```ts
interface PageHeaderProps {
  headerText: string;      // 主标题
  introText: string;       // 简介说明
  englishTitle?: string;   // 可选，英文大字背景
}
```
- `headerText`：主标题，必填。
- `introText`：简介说明，必填。
- `englishTitle`：英文大字，作为背景装饰，选填。

---

## 3. 关键渲染与逻辑

- 使用 `framer-motion` 实现标题淡入下滑动画，提升页面动感。
- `englishTitle` 作为绝对定位的浅色大字背景，主标题和简介内容居中叠加。
- 简介说明支持多行文本，居中显示。

```tsx
<motion.h1
  className={styles.header}
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  {englishTitle && <span className={styles.englishTitle}>{englishTitle}</span>}
  {headerText}
  <div className={styles.introText}>{introText}</div>
</motion.h1>
```

---

## 4. 关键样式与布局

- 采用 SCSS 模块化，支持主题色、响应式。
- 主标题大号加粗，居中。
- 英文大字绝对定位、超大号、低透明度，作为视觉装饰。
- 简介说明居中、浅色、斜体，最大宽度自适应。

```scss
.header {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text);
  text-align: center;
  position: relative;
  .englishTitle {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-size: 4rem;
    font-weight: 800;
    opacity: 0.05;
    z-index: 0;
    pointer-events: none;
  }
}
.introText {
  max-width: 800px;
  margin: 0 auto 1.5rem;
  color: var(--text);
  opacity: 0.7;
  font-size: 0.95rem;
  line-height: 1.6;
  font-style: italic;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  font-weight: lighter;
  position: relative;
  z-index: 1;
}
```

---

## 5. 主要知识点

- **动画与动效**：framer-motion 实现标题淡入下滑。
- **装饰性大字**：英文大字绝对定位、低透明度，提升品牌感。
- **SCSS 模块化**：变量、嵌套、响应式、主题色。
- **可复用性**：统一页面头部风格，便于多页面复用。

---

## 6. 示例

```tsx
import PageHeader from '@/components/PageHeader/PageHeader';

<PageHeader
  headerText="标签"
  introText="这里汇聚了所有内容的标签，帮你快速发现感兴趣的话题。"
  englishTitle="Tags"
/>
```
