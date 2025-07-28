 # Essay 组件技术文档

## 1. 组件用途

`Essay` 组件用于以卡片列表形式展示一组文章摘要，支持文章封面、标题、元信息、摘要、图片画廊等内容，并带有滚动进入动画效果。常用于博客首页、专栏、随笔流等场景，提升内容可视化和用户体验。

---

## 2. 主要 Props/类型定义

```ts
import { Article } from '@/types/Article';

interface EssayProps {
  articles: Article[];
}

// Article 类型主要字段
export interface Article {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  images: string[]; // 后端返回为字符串需解析
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  readingTime: number;
  // ...其余字段略
}
```
- `articles`：文章对象数组，包含标题、封面、摘要、图片、发布时间、阅读数、点赞数等信息。

---

## 3. 关键渲染与逻辑

### 3.1 卡片渲染结构

- 每篇文章渲染为独立卡片，包含封面、标题、元信息、摘要和图片画廊。
- 支持无封面、无图片的兼容渲染。

```tsx
return (
  <div className={styles.container}>
    {articles.map((article, index) => {
      const images = parseImages(article.images);
      return (
        <div
          key={article.id}
          ref={el => (componentRefs.current[index] = el)}
          className={styles.card}
        >
          {article.coverImage && (
            <img src={article.coverImage} alt={article.title} className={styles.coverImage} />
          )}
          <h2 className={styles.cardHeader}>{article.title}</h2>
          <div className={styles.metaInfo}>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            <span>👁️ {article.viewCount}</span>
            <span>❤️ {article.likeCount}</span>
            <span>⏱️ {article.readingTime}分钟</span>
          </div>
          <p className={styles.excerpt}>{article.excerpt}</p>
          {images.length > 0 && (
            <div className={styles.imageGallery}>
              {images.map((img, i) => (
                <img key={i} src={img} alt="" className={styles.thumbnail} />
              ))}
            </div>
          )}
        </div>
      );
    })}
  </div>
);
```

### 3.2 图片数组解析

- 由于后端返回的 images 字段为字符串，需在前端解析为数组。

```ts
const parseImages = (imagesString: string[]): string[] => {
  try {
    // @ts-ignore
    return JSON.parse(imagesString);
  } catch {
    return [];
  }
};
```

### 3.3 滚动进入动画

- 使用 IntersectionObserver 监听卡片进入视口，添加动画 class 实现渐入效果。

```ts
useEffect(() => {
  const observers: IntersectionObserver[] = [];
  componentRefs.current.forEach((el) => {
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.animateIn);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    observers.push(observer);
  });
  return () => observers.forEach(obs => obs.disconnect());
}, [articles]);
```

---

## 4. 关键样式与布局

- 采用 SCSS 模块化，支持卡片、封面、元信息、图片画廊等结构化样式。
- 主题色通过 CSS 变量控制，支持暗色/亮色切换。
- 关键样式片段：

```scss
.cardHeader,
.cardContent,
.cardFooter {
  color: var(--text);
}
```
- 支持卡片圆角、阴影、动画等视觉效果（可在 animateIn 类中自定义动画）。

---

## 5. 主要知识点

- **React Hooks**：`useEffect` 管理副作用，`useRef` 管理 DOM 引用。
- **IntersectionObserver**：实现滚动进入动画，提升用户体验。
- **类型约束**：TypeScript 明确 Article 结构，保证数据安全。
- **SCSS 模块化**：样式隔离、主题变量、动画扩展。
- **健壮性处理**：图片数组解析异常兜底。

---

## 6. 示例

```tsx
import Essay from './Essay';
import { articles } from '@/mock/articles';

<Essay articles={articles} />
```
