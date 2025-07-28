# ArticleSidebar 组件技术文档

## 1. 组件用途与结构概述

ArticleSidebar 是文章详情页的侧边栏组件，内部组合了全文搜索（ArticleSearch）和阅读辅助工具（ReadingTools）两大功能模块。通过分层解耦设计，提升了功能复用性和维护性。

- **ArticleSidebar**：侧边栏容器，负责组合和布局
  - **ArticleSearch**：支持全文搜索、定位和高亮
  - **ReadingTools**：支持字体大小、主题切换、阅读时间、导出/分享等阅读辅助功能

---

## 2. 主要 props/类型定义

ArticleSidebar 通过 props 向子组件传递文章内容、字体调整、阅读时间、导出、定位等能力。

```ts
// ArticleSidebar props 类型
interface ArticleSidebarProps {
  articleContent: string;
  onFontSizeChange: (size: number) => void;
  readingTime: number;
  onExportOutline: (format: 'markdown' | 'pdf') => void;
  onResultClick: (index: number) => void;
  contentRef: React.RefObject<HTMLDivElement>;
}

// ArticleSearch props 类型
interface ArticleSearchProps {
  content: string;
  onResultClick: (index: number) => void;
}

// ReadingTools props 类型
interface ReadingToolsProps {
  onFontSizeChange: (size: number) => void;
  readingTime: number;
  articleContent: string;
  contentRef: React.RefObject<HTMLDivElement>;
}
```

---

## 3. 关键渲染结构与父子通信

ArticleSidebar 通过组合子组件实现功能分层，props 传递实现父子通信。

```tsx
// ArticleSidebar 主要结构
return (
  <aside className={styles.sidebar}>
    <ArticleSearch
      content={articleContent}
      onResultClick={onResultClick}
    />
    <ReadingTools
      onFontSizeChange={onFontSizeChange}
      readingTime={readingTime}
      articleContent={articleContent}
      contentRef={contentRef}
    />
  </aside>
);
```
- 文章内容、回调等通过 props 传递给子组件，实现解耦和复用。

---

## 4. ArticleSearch 主要功能与实现

ArticleSearch 支持全文搜索、定位和高亮，提升长文档的可读性和检索效率。

- 输入关键词后，按段落分割内容，查找所有匹配项，支持高亮和定位。
- 点击搜索结果可平滑滚动到对应段落，并临时高亮。

```tsx
// 搜索逻辑片段
const handleSearch = (term: string) => {
  setSearchTerm(term);
  if (!term.trim()) {
    setResults([]);
    return;
  }
  // ...分段、正则查找、结果组装
  setResults(searchResults);
};

// 定位并高亮段落
const handleResultClick = (paraId: string) => {
  const element = document.getElementById(paraId);
  if (element) {
    // 滚动到段落
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.pageYOffset - 60,
      behavior: 'smooth'
    });
    // 高亮
    element.classList.add('search-highlight');
    setTimeout(() => {
      element.classList.remove('search-highlight');
    }, 2000);
    onResultClick(paraId as any);
  }
};
```

---

## 5. ReadingTools 主要功能与实现

ReadingTools 提供多种阅读辅助功能，包括字体大小调节、主题切换、阅读时间展示、导出/分享等。

- 字体大小通过 range input 调节，实时回调父组件。
- 主题切换调用全局 Redux 状态。
- 支持一键复制链接、导出 Markdown。

```tsx
// 字体大小调节
<input
  type="range"
  min="12"
  max="24"
  value={fontSize}
  onChange={handleFontSizeChange}
/>

// 主题切换
const handleThemeToggle = () => {
  dispatch(toggleTheme());
};

// 分享文章链接
const handleShareClick = () => {
  navigator.clipboard.writeText(window.location.href);
  setIsCopied(true);
  setTimeout(() => setIsCopied(false), 2000);
};

// 导出 Markdown
const handleExportMarkdown = () => {
  const blob = new Blob([articleContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'article.md';
  a.click();
  URL.revokeObjectURL(url);
};
```

---

## 6. 主要知识点

- 组合式组件设计与分层解耦
- TypeScript 类型定义与 props 传递
- React Hooks 状态管理与副作用
- 受控组件、事件回调、父子通信
- DOM 操作与平滑滚动、高亮
- Redux 全局状态管理（主题切换）
- 文件导出、剪贴板操作、响应式设计

---

## 7. 示例

```tsx
<ArticleSidebar
  articleContent={articleContent}
  onFontSizeChange={setFontSize}
  readingTime={readingTime}
  onExportOutline={handleExport}
  onResultClick={handleResultClick}
  contentRef={contentRef}
/>
``` 