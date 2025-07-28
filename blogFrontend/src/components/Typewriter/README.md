 # Typewriter 组件技术文档

## 1. 组件用途

`Typewriter` 是一个打字机动画文本组件，逐字显示文本内容并带有闪烁光标，常用于页面标题、引导语、欢迎语等场景，提升页面动感和交互体验。

---

## 2. Props/类型定义

```ts
interface TyperwriterProps {
  text: string;           // 要显示的完整文本
  delay?: number;         // 每个字符出现的间隔（ms），默认 300
  className?: string;     // 自定义样式类名
  cursorChar?: string;    // 光标字符，默认 "_"
}
```
- `text`：必填，完整要显示的文本。
- `delay`：可选，打字间隔，单位 ms，默认 300。
- `className`：可选，外部自定义样式。
- `cursorChar`：可选，光标字符，默认 "_"。

---

## 3. 关键渲染与逻辑

- 通过 useState/useEffect 管理当前已显示文本、索引和完成状态。
- 每隔 delay 毫秒追加一个字符，直到全部显示完毕。
- 文本变化时自动重置动画。
- 未完成时显示闪烁光标，完成后光标消失。

```tsx
const [currentText, setCurrentText] = useState('');
const [currentIndex, setCurrentIndex] = useState(0);
const [isCompleted, setIsCompleted] = useState(false);

useEffect(() => {
  setCurrentText(''); setCurrentIndex(0); setIsCompleted(false);
}, [text]);

useEffect(() => {
  if (currentIndex >= text.length) { setIsCompleted(true); return; }
  const timer = setTimeout(() => {
    setCurrentText(prev => prev + text[currentIndex]);
    setCurrentIndex(prev => prev + 1);
  }, delay);
  return () => clearTimeout(timer);
}, [currentIndex, text, delay]);
```

---

## 4. 关键样式与动画

- 采用 SCSS 模块化，支持主题色、响应式。
- `.typewriter` 支持自定义字体、颜色、大小，inline-block 布局。
- `.cursor` 为闪烁动画，颜色可自定义。

```scss
.typewriter {
  font-size: 1.2rem;
  line-height: 1.5;
  color: var(--text-color, #333);
  display: inline-block;
  position: relative;
  transition: color 0.3s;
}
.cursor {
  animation: blink 1s infinite;
  margin-left: 0.125rem;
  color: var(--cursor-color, currentColor);
}
@keyframes blink {
  0%,100% { opacity: 1; }
  50% { opacity: 0; }
}
```
- 支持移动端字体缩放，适配多端场景。

---

## 5. 主要知识点

- **打字机动画**：逐字渲染文本，提升引导感和动效体验。
- **React Hooks**：useState/useEffect 管理动画状态。
- **SCSS 模块化**：变量、嵌套、响应式、动画。
- **可扩展性**：支持自定义光标、样式、速度。
- **健壮性**：文本变化自动重置，防止动画错乱。

---

## 6. 示例

```tsx
import Typewriter from '@/components/Typewriter/Typewriter';

<Typewriter text="欢迎来到我的博客！" delay={120} />
```
