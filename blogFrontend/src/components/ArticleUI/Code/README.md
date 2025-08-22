# CodeBlock 组件技术文档

## 1. 用途与功能概述

CodeBlock 组件用于渲染带有高亮、行号、复制、折叠/展开等交互的代码块，适用于博客、文档、演示等场景。支持多语言高亮、主题适配、响应式设计，提升代码阅读体验。
- 代码高亮（Prism）
- 行号显示
- 一键复制代码
- 自动折叠/展开长代码
- 主题色适配

---

## 2. 主要 props/类型定义

```ts
interface CodeBlockProps {
  language: string; // 代码语言
  value: string;    // 代码内容
}
```

---

## 3. 关键状态与交互逻辑

- copied：复制按钮状态，1.5s 后自动恢复
- isExpanded：是否展开全部代码
- shouldShowExpand：是否显示“展开/收起”按钮（根据内容高度自动判断）
- useRef 获取代码内容高度，useEffect 判断是否需要折叠

```tsx
const [copied, setCopied] = useState(false);
const [isExpanded, setIsExpanded] = useState(false);
const [shouldShowExpand, setShouldShowExpand] = useState(false);
const codeContentRef = useRef<HTMLDivElement>(null);
const MAX_HEIGHT = '300px';

useEffect(() => {
  if (codeContentRef.current) {
    const contentHeight = codeContentRef.current.scrollHeight;
    const maxHeightPx = parseInt(MAX_HEIGHT, 10);
    setShouldShowExpand(contentHeight > maxHeightPx);
  }
}, [value]);

const handleCopy = async () => {
  await navigator.clipboard.writeText(value);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
};

const toggleExpand = () => {
  setIsExpanded(!isExpanded);
};
```

---

## 4. 主要渲染结构

- 头部显示语言、复制按钮、展开/收起按钮
- 内容区为高亮代码，支持折叠动画

```tsx
return (
  <div className={styles.codeBlock}>
    <div className={styles.codeHeader}>
      <span className={`${styles.language} ${styles[`language-${language.toLowerCase()}`]}`}>{(language || 'text').toLowerCase()}</span>
      <div className={styles.buttonGroup}>
        <button className={styles.copyButton} onClick={handleCopy}>
          {copied ? '已复制' : '复制'}
        </button>
        {shouldShowExpand ? (
          <button className={styles.expandButton} onClick={toggleExpand}>
            {isExpanded ? '收起' : '展开'}
          </button>
        ) : null}
      </div>
    </div>
    <div
      ref={codeContentRef}
      className={styles.codeContent}
      style={{
        maxHeight: isExpanded ? 'none' : MAX_HEIGHT,
        overflow: isExpanded ? 'visible' : 'auto'
      }}
    >
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={true}
        wrapLines={true}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 8px 8px',
          padding: '1rem',
          background: 'var(--code-block-bg)'
        }}
        lineNumberStyle={{
          minWidth: '1.5em',
          paddingRight: '0.5em',
          userSelect: 'none',
          borderRight: '1px solid rgba(234,234,234,0.4)',
          marginRight: '0.8em'
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  </div>
);
```

---

## 5. 关键样式与动画

- SCSS 变量统一圆角、间距、阴影、按钮等
- Mixin 封装按钮样式，hover 动画
- 语言标签支持多语言色彩
- 折叠/展开动画平滑

```scss
$border-radius: 8px;
$header-padding: 0.5rem 1rem;
$button-radius: 4px;
$button-padding: 0.25rem 0.75rem;
$button-font-size: 0.9rem;
$button-gap: 0.5rem;
$box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

@mixin code-btn {
  padding: $button-padding;
  border: 1px solid var(--code-border);
  border-radius: $button-radius;
  background: var(--code-header-bg);
  color: var(--code-text);
  font-size: $button-font-size;
  cursor: pointer;
  transition: all 0.2s ease;
}

.codeBlock {
  position: relative;
  margin: 1rem 0;
  border-radius: $border-radius;
  background: var(--code-block-bg);
  box-shadow: $box-shadow;
  .codeHeader { ... }
  .codeContent { transition: max-height 0.3s ease-out; }
}
.language-javascript { --lang-color: #f7df1e; color: black; }
.language-typescript { --lang-color: #3178c6; }
// ...多语言色彩
```

---

## 6. 主要知识点

- React useState/useRef/useEffect 管理交互与 DOM
- Prism 代码高亮与行号
- 复制 API、折叠动画、按钮交互
- SCSS 变量、mixin、主题适配、语言色彩
- 响应式与可访问性设计
