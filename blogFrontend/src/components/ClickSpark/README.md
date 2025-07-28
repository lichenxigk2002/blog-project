 # ClickSpark 组件技术文档

## 1. 用途与功能概述

ClickSpark 组件为页面提供全局点击火花特效，用户每次点击页面时，当前位置会绽放 8 条射线状火花，增强交互趣味性和视觉反馈。该组件无侵入性，自动适配主题色，适合用于博客、展示页等提升用户体验的场景。
- 全局监听点击，任意位置均可触发特效
- 纯 canvas 动画，性能高效
- 自动适配主题色（跟随 CSS 变量 --text）
- pointer-events: none，不影响页面交互

---

## 2. 主要结构与渲染

组件仅渲染一个全屏 canvas，绝对定位于父容器之上。

```tsx
return (
  <canvas
    ref={canvasRef}
    className="absolute inset-0 pointer-events-none"
    style={{ zIndex: 1 }}
  />
);
```
- canvasRef：用于绘制火花动画
- pointer-events: none，确保不遮挡页面交互
- z-index: 1，位于内容层之上但低于弹窗等

---

## 3. 关键状态与动画逻辑

### 3.1 火花数据结构与管理
- 每个火花包含 x/y 坐标、角度、起始时间
- useRef 管理火花数组，避免频繁 re-render

```ts
interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}
const sparksRef = useRef<Spark[]>([]);
```

### 3.2 动画主循环
- 使用 requestAnimationFrame 实现高性能逐帧动画
- 每帧清空画布，遍历所有火花，计算位置、透明度、长度，绘制射线
- 火花 400ms 后自动消亡

```ts
const draw = (timestamp: number) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const textColor = getTextColor();
  sparksRef.current = sparksRef.current.filter((spark) => {
    const elapsed = timestamp - spark.startTime;
    if (elapsed >= 400) return false;
    const progress = elapsed / 400;
    const distance = progress * 15;
    const lineLength = 10 * (1 - progress);
    const x1 = spark.x + distance * Math.cos(spark.angle);
    const y1 = spark.y + distance * Math.sin(spark.angle);
    const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
    const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    return true;
  });
  requestAnimationFrame(draw);
};
```

### 3.3 全局点击监听与火花生成
- 监听 document 的 click 事件，计算点击相对父容器的坐标
- 每次点击生成 8 个不同角度的火花，推入 sparksRef

```ts
const handleGlobalClick = (e: MouseEvent) => {
  const parent = canvas.parentElement;
  if (!parent) return;
  const rect = parent.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;
  const now = performance.now();
  const newSparks = Array.from({ length: 8 }, (_, i) => ({
    x, y, angle: (2 * Math.PI * i) / 8, startTime: now,
  }));
  sparksRef.current.push(...newSparks);
};
document.addEventListener('click', handleGlobalClick);
```

---

## 4. 主题适配与性能优化

- 火花颜色通过 getComputedStyle(canvas).getPropertyValue('--text') 动态获取，自动适配明暗主题
- canvas 大小随父容器自适应，监听 resize 事件
- pointer-events: none，z-index: 1，确保不影响页面交互和层级
- useRef 管理动画和数据，避免不必要的 re-render

---

## 5. 主要知识点

- React useRef/useEffect 管理 canvas 和动画
- requestAnimationFrame 高性能逐帧动画
- 全局事件监听与坐标换算
- 主题适配与 CSS 变量动态读取
- pointer-events、z-index、无侵入特效设计
