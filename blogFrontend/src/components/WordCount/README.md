 # WordCount 组件技术文档

## 1. 组件用途

`WordCount` 是一个文本统计组件，实时统计并展示字符数、词数、中文字数、英文单词数。常用于编辑器、文章撰写、评论输入等场景，帮助用户把控内容长度和结构。

---

## 2. Props/类型定义

```ts
interface WordCountProps {
  text: string;         // 要统计的文本内容
  className?: string;  // 可选，自定义样式类名
}
```
- `text`：必填，待统计的文本。
- `className`：可选，外部自定义样式。

---

## 3. 关键渲染与逻辑

- 实时统计以下四项：
  - 字符数（包括空格）
  - 词数（按空格分割）
  - 中文字数（不含空格和标点）
  - 英文单词数（不含标点）
- 统计逻辑：

```ts
const charCount = text.length;
const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
const chineseCharCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
const englishWordCount = (text.match(/[a-zA-Z]+/g) || []).length;
```
- 结果以多项并列方式展示，适配多端。

---

## 4. 关键样式与布局

- 采用 SCSS 模块化，支持主题变量、圆角、响应式。
- `.wordCount` 横向排列，背景色、圆角、间距适配主流编辑器风格。
- `.countItem` 单项统计，`.label` 灰色标签，`.value` 高亮数字。

```scss
.wordCount {
  display: flex; gap: 12px; font-size: 12px; color: #666;
  padding: 4px 8px; background: #f5f5f5; border-radius: 4px;
  align-items: center; height: 12px;
}
.countItem { display: flex; align-items: center; gap: 4px; white-space: nowrap; }
.label { color: #999; }
.value { font-weight: 500; color: #333; }
```
- 支持移动端自适应换行。

---

## 5. 主要知识点

- **文本统计**：正则表达式统计中英文、词数、字符数。
- **React 纯函数组件**：无副作用，适合高频渲染。
- **SCSS 模块化**：变量、嵌套、响应式。
- **可扩展性**：可扩展更多统计项（如段落数、标点数等）。

---

## 6. 示例

```tsx
import WordCount from '@/components/WordCount/WordCount';

<WordCount text={inputValue} />
```
