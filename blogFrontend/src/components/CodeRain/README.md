 # CodeRain 组件技术文档

## 1. 用途与功能概述

CodeRain 组件用于在页面渲染全屏“代码雨”特效，灵感源自《黑客帝国》，通过 canvas 动画实现字符下落、拖尾、变色等效果。适合作为背景装饰，提升科技感和视觉吸引力。
- 全屏 canvas 动画，性能高效
- 随机字符、随机颜色、拖尾渐隐
- 响应式自适应屏幕尺寸

---

## 2. 主要结构与渲染

组件仅渲染一个全屏 canvas，固定定位于页面底层。

```tsx
return (
  <canvas
    ref={canvasRef}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
    }}
  />
);
```
- canvasRef：用于绘制代码雨动画
- z-index: -1，确保在内容下方

---

## 3. 关键动画与实现逻辑

### 3.1 初始化与自适应
- useEffect 初始化 canvas 尺寸，适配高分屏（devicePixelRatio）
- 计算列数、每列字符位置

```ts
const width = window.innerWidth * window.devicePixelRatio;
const height = window.innerHeight * window.devicePixelRatio;
canvas.width = width;
canvas.height = height;
const fontSize = 20 * window.devicePixelRatio;
const columnWidth = fontSize;
const columnCount = Math.floor(width / columnWidth);
const nextChars = Array.from({ length: columnCount }, () => Math.floor(Math.random() * (height / fontSize)));
```

### 3.2 字符与颜色生成
- getRandomChar 随机生成字母/数字字符
- getRandomColor 随机生成 16 进制颜色

```ts
const getRandomChar = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return chars[Math.floor(Math.random() * chars.length)];
};
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
```

### 3.3 动画主循环
- setInterval 每 50ms 绘制一帧
- 先用半透明黑色填充画布，形成拖尾渐隐
- 每列绘制一个字符，随机颜色，y 坐标递增
- 超出底部概率重置到顶部，形成循环

```ts
const draw = () => {
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
  for (let i = 0; i < columnCount; i++) {
    const char = getRandomChar();
    const color = getRandomColor();
    const x = i * columnWidth;
    const y = nextChars[i] * fontSize;
    ctx.textBaseline = 'top';
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px Roboto Mono`;
    ctx.fillText(char, x, y);
    if (y > height && Math.random() > 0.975) {
      nextChars[i] = 0;
    } else {
      nextChars[i]++;
    }
  }
};
const intervalId = setInterval(draw, 50);
```

---

## 4. 性能与适配优化

- 高分屏适配（canvas 尺寸 * devicePixelRatio）
- 全屏自适应，随窗口变化自动填充
- z-index: -1，确保不遮挡内容
- useEffect 清理定时器，防止内存泄漏

---

## 5. 主要知识点

- React useRef/useEffect 管理 canvas 和动画
- setInterval 实现逐帧动画
- 随机字符/颜色生成、拖尾渐隐
- 高分屏适配、全屏 canvas、z-index 管理
