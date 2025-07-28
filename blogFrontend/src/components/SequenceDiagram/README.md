 # SequenceDiagram 组件技术文档

## 1. 组件用途

`SequenceDiagram` 组件用于在页面中渲染时序图（如流程、交互、API 调用等），支持 Mermaid 语法输入，自动生成 SVG 图像。集成源码/图片切换、下载、加载动画、错误提示等功能，适合技术文档、开发者博客、API 说明等场景。

---

## 2. Props/类型定义

```ts
interface SequenceDiagramProps {
  diagram: string; // Mermaid 时序图内容（不含 sequenceDiagram 声明）
}
```
- `diagram`：必填，Mermaid 时序图内容（只需主体部分，组件自动补全 sequenceDiagram 声明）。

---

## 3. 关键渲染与逻辑

### 3.1 Mermaid 异步渲染
- 组件挂载/diagram 变化时，动态 import `mermaid`，初始化配置后调用 `mermaid.render` 生成 SVG。
- 渲染过程为异步，渲染前显示 loading 动画，渲染后插入 SVG。
- 支持自定义 Mermaid 主题、宽高、间距等参数。

### 3.2 源码/图片切换
- 支持“源码/图片”切换，源码模式下高亮显示 Mermaid 源码，图片模式下显示 SVG。
- 切换按钮带动画和状态提示。

### 3.3 下载功能
- 支持一键下载当前 SVG 图片，自动生成 Blob 并触发下载。

### 3.4 错误处理
- Mermaid 渲染失败时，显示错误提示和源码，便于排查问题。
- 错误信息友好，支持多种异常场景。

### 3.5 加载动画
- 渲染 SVG 期间显示三点弹跳 loading 动画和提示文案。

---

## 4. 关键样式与布局

- 采用 SCSS 模块化，支持主题变量、圆角、阴影、响应式。
- 头部操作区、源码区、SVG 区、错误区均有独立样式。
- 主要样式片段：

```scss
.diagramContainer {
  width: 100%;
  margin: 2rem 0;
  background-color: var(--code-block-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.diagramHeader { display: flex; justify-content: flex-end; padding: 0.5rem 1rem; }
.actionButton { border-radius: 4px; background: var(--code-header-bg); cursor: pointer; }
.sourceCode { background: var(--code-block-bg); font-family: monospace; }
.diagram { display: flex; justify-content: center; align-items: center; }
.loading { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
.loadingDot { width: 8px; height: 8px; border-radius: 50%; animation: bounce 0.5s infinite alternate; }
.errorContainer { background: var(--error-background); color: var(--error-text); }
```
- 支持 loading、错误、源码、SVG 四种状态切换

---

## 5. 主要知识点

- **Mermaid 动态渲染**：异步 import、初始化、渲染 SVG
- **React Hooks**：useEffect 管理副作用，useRef 操作 DOM，useState 管理多状态
- **错误处理**：try/catch 捕获渲染异常，友好提示
- **下载功能**：Blob+URL.createObjectURL 实现 SVG 下载
- **动画与交互**：loading 动画、按钮切换、状态反馈
- **SCSS 模块化**：变量、嵌套、响应式、主题色
- **可扩展性**：便于扩展更多 Mermaid 图类型、导出格式、主题切换等

---

## 6. 示例

```tsx
import SequenceDiagram from '@/components/SequenceDiagram/SequenceDiagram';

<SequenceDiagram diagram={`
  Alice->>Bob: Hello Bob, how are you?
  Bob-->>Alice: I am good thanks!
`} />
```

---

## 7. 典型交互流程

1. 传入 Mermaid 时序图内容，组件自动渲染 SVG
2. 渲染中显示 loading 动画，渲染失败显示错误提示
3. 可切换查看源码或图片，可一键下载 SVG
4. 支持多次切换、动态更新 diagram 内容
