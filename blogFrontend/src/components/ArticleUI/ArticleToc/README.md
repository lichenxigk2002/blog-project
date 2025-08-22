# ArticleToc 组件技术文档

## 1. 用途与功能概述

ArticleToc（文章目录）组件为长文档页面提供智能目录导航，具备以下核心功能：
- 实时阅读进度追踪（进度条/百分比）
- 智能标题高亮（自动标记当前阅读位置）
- 多级导航支持（h1-h6 层级缩进）
- 响应式设计（桌面端侧边栏，移动端底部弹窗）
- 平滑滚动跳转与自适应展开/收起

---

## 2. 主要 props/类型定义

```ts
interface Heading {
  id: string;    // 标题唯一标识符
  text: string;  // 标题文本内容
  level: number; // 标题层级（1-6）
}

interface ArticleTocProps {
  headings: Heading[];     // 文章标题列表
  title: string;           // 文章标题
  contentHeight: number;   // 文章内容高度
  contentTop: number;      // 文章内容顶部位置
}
```

---

## 3. 关键状态与副作用

组件通过 useState/useEffect 管理展开状态、当前高亮标题、阅读进度、响应式等。

```tsx
const [isExpanded, setIsExpanded] = useState(false); // 目录展开/收起
const [activeId, setActiveId] = useState('');        // 当前高亮标题ID
const [readingProgress, setReadingProgress] = useState(0); // 阅读进度百分比
const [isMobile, setIsMobile] = useState(false);     // 移动端检测
const tocRef = useRef<HTMLDivElement>(null);
```

- useEffect 监听窗口大小，动态切换移动端/桌面端模式：

```tsx
useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);
```

---

## 4. 滚动监听与高亮算法

组件核心逻辑是监听滚动，动态计算阅读进度和当前高亮标题。

```tsx
useEffect(() => {
  const handleScroll = () => {
    const viewportHeight = window.innerHeight;
    const scrollTop = window.scrollY;
    // 计算阅读进度
    const calculateProgress = () => {
      if (contentHeight <= viewportHeight) return 100;
      const nav = document.querySelector('nav') as HTMLElement;
      const navHeight = nav?.offsetHeight || 0;
      const adjustedScrollTop = scrollTop - navHeight;
      const adjustedContentTop = contentTop - navHeight;
      const progress = ((adjustedScrollTop - adjustedContentTop) / (contentHeight - viewportHeight)) * 100;
      return Math.min(100, Math.max(0, progress));
    };
    setReadingProgress(calculateProgress());
    // 智能标题高亮
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let currentActiveId = '';
    let minDistance = Infinity;
    headings.forEach((heading) => {
      const rect = heading.getBoundingClientRect();
      const distance = Math.abs(rect.top - 100);
      if (rect.top <= 100 && distance < minDistance) {
        minDistance = distance;
        currentActiveId = heading.id;
      }
    });
    setActiveId(currentActiveId);
  };
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleScroll);
  handleScroll();
  return () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleScroll);
  };
}, [contentHeight, contentTop]);
```

- 算法说明：
  - 阅读进度：根据滚动距离、内容高度、视口高度、导航栏高度动态计算百分比。
  - 高亮标题：遍历所有 h1~h6，找到距离视口顶部最近且已进入视口的标题，标记为当前高亮。

---

## 5. 目录展开/收起与平滑跳转

- 目录展开/收起通过 isExpanded 控制，移动端/桌面端自适应。
- 点击目录项时，平滑滚动到对应标题，并在移动端自动收起目录。

```tsx
const handleToggle = () => {
  setIsExpanded(!isExpanded);
};

const handleLinkClick = (e: React.MouseEvent, id: string) => {
  e.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    const nav = document.querySelector('nav') as HTMLElement;
    const navHeight = nav?.offsetHeight || 60;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navHeight;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    if (isMobile) {
      setIsExpanded(false);
    }
  }
};
```

---

## 6. 主要渲染结构

- 桌面端为侧边栏浮动目录，移动端为底部弹窗。
- 头部显示进度、展开/收起按钮，内容区多级导航。

```tsx
return (
  <div
    ref={tocRef}
    className={`${styles.tocContainer} ${isExpanded ? styles.expanded : ''} ${isMobile ? styles.mobile : ''}`}
  >
    {/* 头部区域 */}
    <div className={styles.tocHeader}>
      {isMobile ? (
        <button className={styles.mobileToggleButton} onClick={handleToggle} aria-label={isExpanded ? '收起目录' : '展开目录'}>
          <div className={styles.mobileLeft}>
            <FaList className={styles.mobileToggleIcon} />
            <span className={styles.progressText}>目录</span>
          </div>
          <div className={styles.mobileRight}>
            <span className={styles.progressText}>{Math.round(readingProgress)}%</span>
            {/* 移动端返回按钮 */}
            {isExpanded && (
              <div onClick={(e) => { e.stopPropagation(); routerBack.back(); }} className={styles.backButton}>
                <FaArrowLeft />
              </div>
            )}
          </div>
        </button>
      ) : (
        <div className={styles.tocTitleRow}>
          <span className={styles.progressText}>{Math.round(readingProgress)}%</span>
          <span className={styles.progressText}>目录</span>
          <progress className={styles.desktopProgressBar} value={readingProgress} max={100} aria-label="阅读进度" />
          <button className={styles.toggleButton} onClick={handleToggle} aria-label={isExpanded ? '收起目录' : '展开目录'}>
            <IoIosArrowDown className={styles.toggleIcon} />
          </button>
        </div>
      )}
    </div>
    {/* 目录内容区 */}
    <div className={styles.toc}>
      <ul className={styles.tocList}>
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`${styles.tocItem} ${styles[`level${heading.level}`]} ${activeId === heading.id ? styles.active : ''}`}
          >
            <a
              href={`#${heading.id}`}
              className={styles.tocLink}
              onClick={(e) => handleLinkClick(e, heading.id)}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
```

---

## 7. 关键样式与动画

- SCSS 模块化，支持响应式、毛玻璃、圆角、阴影、进度条、层级缩进。
- 目录项多级缩进，当前高亮项加粗/变色。
- 进度条支持渐变色、平滑动画。

```scss
.tocContainer {
  position: fixed;
  left: 3.5rem;
  top: 40%;
  transform: translateY(-50%);
  width: 14.375rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  z-index: 1000;
  overflow: hidden;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  user-select: none;
  &.expanded { height: 20rem; }
  &.mobile { left: 1rem !important; right: 1rem !important; bottom: 1rem !important; width: auto !important; }
}
.tocItem.level1 { font-weight: 600; margin-left: 0; }
.tocItem.level2 { margin-left: 1rem; font-size: 0.9rem; }
.tocItem.level3 { margin-left: 2rem; font-size: 0.85rem; }
.tocItem.level4, .tocItem.level5, .tocItem.level6 { margin-left: 3rem; font-size: 0.8rem; }
.tocItem.active .tocLink { background: var(--bg-tertiary); color: var(--text); font-weight: 500; }
.desktopProgressBar { height: 0.25rem; background: #cfffe5; border-radius: 1rem; }
```

---

## 8. 主要知识点

- TypeScript 类型定义与多级导航结构
- React Hooks 状态管理与副作用
- 滚动监听与 DOM 操作
- 智能高亮算法与进度计算
- 响应式设计与移动端适配
- SCSS 层级缩进、动画、渐变进度条
- 可访问性与交互体验优化 