 # LoadingSpinner 组件技术文档

## 1. 组件用途

`LoadingSpinner` 是一个全屏居中的加载动画组件，常用于页面或数据加载等待时的友好提示。通过彩色弹跳圆点和温馨文案，提升用户等待体验，适用于全局或局部加载场景。

---

## 2. 主要 Props/类型定义

```ts
// 无需 props，直接调用即可
const LoadingSpinner: React.FC = () => ...
```
- 该组件为无状态纯展示组件，无需传递任何 props。

---

## 3. 关键渲染与逻辑

- 渲染三颗彩色圆点，依次弹跳形成节奏感。
- 下方显示一行温馨提示文案。
- 组件始终居中覆盖全屏，适合全局 loading 场景。

```tsx
return (
  <div className={styles.loadingWrapper}>
    <div className={styles.dots}>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
    <div className={styles.loadingText}>正在加载你的想法，就像等待一杯好咖啡一样值得☕...</div>
  </div>
);
```

---

## 4. 关键样式与布局

- 采用 SCSS 模块化，支持主题色和响应式。
- 三颗圆点分别为黄色、蓝色、粉色渐变，带有阴影和弹跳动画。
- 全屏居中，z-index 保证遮罩优先级。
- 主要样式片段：

```scss
.loadingWrapper {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  z-index: 1000;
}
.dots { display: flex; gap: 12px; margin-bottom: 18px; }
.dot {
  width: 18px; height: 18px; border-radius: 50%;
  background: linear-gradient(135deg, #ffb347 0%, #ffcc33 100%);
  animation: bounce 1.2s infinite;
  box-shadow: 0 2px 12px 0 rgba(255, 204, 51, 0.25);
  &:nth-child(2) { background: linear-gradient(135deg, #3a8dde 0%, #6dd5ed 100%); animation-delay: 0.2s; }
  &:nth-child(3) { background: linear-gradient(135deg, #ff6a88 0%, #ffccf1 100%); animation-delay: 0.4s; }
}
@keyframes bounce { 0%,80%,100% { transform: translateY(0) scale(1); } 40% { transform: translateY(-18px) scale(1.2); } }
.loadingText {
  color: var(--text, #333); font-size: 16px; letter-spacing: 2px;
  opacity: 0.85; font-weight: 500; text-shadow: 0 2px 8px rgba(255,204,51,0.12);
}
```

---

## 5. 主要知识点

- **无状态纯展示组件**：无需 props，易于全局复用。
- **CSS3 动画**：弹跳动画、渐变色、阴影，提升视觉动感。
- **SCSS 模块化**：样式隔离、主题变量、响应式。
- **全屏居中**：flex 布局与 fixed 定位，适配各种屏幕。

---

## 6. 示例

```tsx
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

// 页面/模块加载时直接使用
<LoadingSpinner />
```
