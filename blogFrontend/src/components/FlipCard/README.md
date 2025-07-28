# FlipCard & FlipClock 组件技术文档

## 1. 组件用途

- **FlipCard**：实现数字翻牌动画的基础组件，支持上下翻转，常用于数字时钟、计数器等场景。
- **FlipClock**：基于多个 FlipCard 组合实现的数字翻牌时钟，展示当前时分秒，具有强烈的动态视觉效果。

---

## 2. 主要 Props/类型定义

### FlipCard
```ts
export interface FlipCardPropsInterface {
  initFrontText?: string | number; // 初始正面数字
  initBackText?: string | number;  // 初始背面数字
  duration?: number;               // 翻牌动画时长（ms）
}

export interface FlipCardHandleInterface {
  flipDown: (newFrontText: string | number, newBackText: string | number) => void;
  flipUp: (newFrontText: string | number, newBackText: string | number) => void;
}
```
- 支持通过 ref 暴露 `flipDown`/`flipUp` 方法，外部可控制翻牌。

### FlipClock
- 无 props，内部自动获取当前时间并驱动各 FlipCard。

---

## 3. 关键渲染与逻辑

### 3.1 FlipCard 动画控制
- 通过 `useImperativeHandle` 暴露翻牌方法，支持外部驱动。
- 翻牌时切换 `isFlipping` 和 `flipType`，触发 CSS 动画，动画结束后更新数字。

```tsx
const flip = ({ type, newFrontText, newBackText }) => {
  if (isFlipping) return false;
  setFrontText(newFrontText);
  setBackText(newBackText);
  setFlipType(type);
  setIsFlipping(true);
  setTimeout(() => {
    setFrontText(newBackText);
    setIsFlipping(false);
  }, duration);
};
```

### 3.2 FlipClock 组合与驱动
- 通过 6 个 FlipCard 组件分别渲染时分秒的每一位。
- 使用 `setInterval` 每秒更新时间，只有数字变化时才触发对应 FlipCard 的翻牌动画。

```tsx
const flipCards = [hour1, hour2, minute1, minute2, second1, second2];
// ...
setInterval(() => {
  // 计算当前与上一秒的各位数字
  for (let i = 0; i < flipCards.length; i++) {
    if (nowTimeStr[i] !== nextTimeStr[i]) {
      flipCards[i].current?.flipDown(nowTimeStr[i], nextTimeStr[i]);
    }
  }
}, 1000);
```

---

## 4. 关键样式与动画

- **核心动画全部依赖 CSS3**，通过 `transform: perspective(...) rotateX(...)` 实现数字上下翻转。
- 支持下翻（down）和上翻（up）两种动画，分别对应不同的关键帧。
- 卡片样式、数字样式、阴影、响应式适配均通过 SCSS 变量和嵌套实现。

### FlipCard 主要样式片段：
```scss
.flipCard {
  position: relative;
  width: 60px;
  height: 100px;
  border-radius: 12px;
  background: var(--background-color);
  font-size: 66px;
  // ...
  &.down.go .front:before {
    animation: frontFlipDown 0.6s both;
  }
  &.down.go .back:after {
    animation: backFlipDown 0.6s both;
  }
  &.up.go .front:after {
    animation: frontFlipUp 0.6s both;
  }
  &.up.go .back:before {
    animation: backFlipUp 0.6s both;
  }
}
@keyframes frontFlipDown { 0% { transform: ... } 100% { transform: ... } }
@keyframes backFlipDown  { ... }
@keyframes frontFlipUp   { ... }
@keyframes backFlipUp    { ... }
```
- 响应式适配移动端，卡片尺寸、字体自动缩放。

### FlipClock 主要样式片段：
```scss
.clock {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'ZiHun', sans-serif;
}
.clock em {
  font-size: 66px;
  color: var(--text);
  // ...
}
```

---

## 5. 主要知识点

- **React forwardRef/useImperativeHandle**：实现组件方法暴露与外部控制。
- **CSS3 3D 动画**：核心翻牌效果全部由 CSS3 transform/animation 实现，性能高、流畅。
- **组合式组件设计**：FlipClock 通过组合多个 FlipCard 实现复杂时钟。
- **响应式设计**：SCSS 嵌套与变量，适配多端。
- **性能优化**：仅在数字变化时触发动画，避免无效重绘。

---

## 6. 示例

```tsx
import FlipClock from './FlipClock';

<FlipClock />
```

```tsx
// 单独使用 FlipCard
import FlipCard, { FlipCardHandleInterface } from './FlipCard';
const ref = useRef<FlipCardHandleInterface>(null);
<FlipCard ref={ref} initFrontText={0} initBackText={1} />
// 通过 ref.current?.flipDown/flipUp 控制翻牌
```
