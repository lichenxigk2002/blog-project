 # TagCloudBackground 组件技术文档

## 1. 组件用途

`TagCloudBackground` 是一个全屏动态标签云背景组件，常用于频道页、标签页、首页等，营造科技感和内容氛围。标签以徽章形式分行漂浮，支持多种图标、颜色、3D 动画和交互特效，提升页面视觉层次和品牌感。

---

## 2. Props/类型定义

```ts
interface TagItem {
  name: string;
  color?: string;
}

interface TagCloudBackgroundProps {
  tags: TagItem[]; // 标签数组
}
```
- `tags`：必填，标签对象数组（可自定义颜色）。

---

## 3. 关键渲染与逻辑

### 3.1 标签与图标
- 每个标签随机分配一个 Lucide 图标，支持编程、文件、工具、设计、书籍等多类图标。
- 标签内容和颜色可自定义，未传递时有默认标签。

### 3.2 动态行与漂浮动画
- 根据窗口高度自适应生成多行，每行 8 个标签，左右交错排列。
- 每个标签徽章使用 framer-motion 实现左右漂浮、缩放、3D 旋转等动画，动画参数随机，循环往复。
- 鼠标悬停徽章时，徽章放大并有 3D 旋转和闪烁特效（sparkle）。

### 3.3 响应式与性能
- 监听窗口 resize，动态调整行数，适配不同屏幕。
- 所有动画为 GPU 加速，性能友好。

---

## 4. 关键样式与布局

- 采用 SCSS 模块化，支持主题变量、圆角、阴影、毛玻璃、3D 效果。
- `.container` 固定全屏，pointer-events:none，保证内容可交互。
- `.badge` 徽章圆角、毛玻璃、阴影、渐变、hover 高亮。
- `.row` 左右交错排列，间距自适应。
- `.sparkle` 闪烁动画，提升交互感。

```scss
.container {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  overflow: hidden; pointer-events: none; z-index: -1;
}
.tagItem { pointer-events: auto; cursor: pointer; }
.badge {
  display: inline-flex; align-items: center; gap: 0.5rem;
  border-radius: 9999px; background: var(--tag-background-color);
  color: var(--tag-color); backdrop-filter: blur(4px);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: all 0.3s ease;
  &.badgeHovered { background: var(--tag-background-color-hover); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
}
.sparkle { position: absolute; top: 50%; left: 50%; animation: sparkle 1s infinite; }
.row { display: flex; margin: 2rem 0; }
```

---

## 5. 主要知识点

- **动态标签云**：标签、图标、颜色、动画均可自定义，适配多内容场景。
- **framer-motion 动画**：实现漂浮、缩放、3D 旋转、悬停特效。
- **SCSS 模块化**：变量、嵌套、响应式、毛玻璃、阴影、3D 效果。
- **性能优化**：动画 GPU 加速，resize 监听自适应。
- **可扩展性**：支持扩展更多图标、动画、交互逻辑。

---

## 6. 示例

```tsx
import TagCloudBackground from '@/components/TagCloudBackground/TagCloudBackground';

<TagCloudBackground tags={[
  { name: 'React', color: '#61dafb' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'CSS', color: '#563d7c' },
  // ...更多标签
]} />
```
