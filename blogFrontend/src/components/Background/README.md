# Background 组件技术文档

## 1. 用途与功能概述

Background 组件用于为页面提供动态、柔和的视觉背景，包含多种几何色块、动态网格和主题适配。其设计目标是提升整体 UI 氛围感、增强品牌辨识度，并兼顾性能与响应式体验。
- 支持明暗主题切换，自动适配
- 多层次几何色块、动态网格、毛玻璃等视觉效果
- 纯 CSS 动画，无额外性能负担
- 响应式适配各类屏幕

---

## 2. 主要结构与渲染

组件结构分为基础背景层、几何色块层和动态网格层。

```tsx
return (
  <>
    {/* 基础背景层，支持明暗主题 */}
    <div className={`${styles.backgroundBase} ${isDarkMode ? styles.dark : ''}`}></div>
    {/* 几何色块与网格层 */}
    <div className={styles.backgroundBlocks}>
      <div className={`${styles.bgBlock} ${styles.circle} ${styles.block1}`}></div>
      <div className={`${styles.bgBlock} ${styles.triangle} ${styles.block2}`}></div>
      <div className={`${styles.bgBlock} ${styles.circle} ${styles.block3}`}></div>
      <div className={`${styles.bgBlock} ${styles.waveLine} ${styles.block4}`}></div>
      <div className={`${styles.bgBlock} ${styles.pentagram} ${styles.block5}`}></div>
      <div className={`${styles.bgBlock} ${styles.circle2} ${styles.block6}`}></div>
      {/* 动态网格，支持主题切换 */}
      <div className={`${styles.dynamicGrid} ${isDarkMode ? styles.darkGrid : ''}`}></div>
    </div>
  </>
);
```
- backgroundBase：基础色层，明暗主题切换
- backgroundBlocks：几何色块、动态网格容器
- bgBlock：不同形状/位置的色块，纯 CSS 渲染
- dynamicGrid：动态网格，动画渐变

---

## 3. 关键样式与动画

### 3.1 变量与 Mixin
- 统一色彩、尺寸、z-index、模糊等变量，便于主题和风格调整
- Mixin 封装浮动动画、形状生成、滚动网格等

```scss
$white: #ffffff;
$night-bg: #1a1a1a;
$morandi-pink: #ffcccc;
$morandi-blue: #15c0fa;
$morandi-lightblue: #f3daff;
$beige: #de9b20;
$green: #00f603;
$blur: 0.9375rem;
$block-size: 12.5rem;
$triangle-size: 9.375rem;
$pentagram-size: 9.375rem;
$spot-size: 18.75rem;
$z-bg: -2;

@mixin float-anim {
  animation: float 25s infinite linear;
}

@mixin block-shape($shape) {
  @if $shape ==circle { ... }
  @else if $shape ==triangle { ... }
  // 省略，详见源码
}
```

### 3.2 几何色块与动画
- 多种形状（圆、三角、五角星等）通过 clip-path、border-radius、background 生成
- 位置、颜色、透明度、模糊、混合模式等细致调控
- 浮动动画（float）、旋转动画（rotate）增强动感

```scss
.backgroundBlocks {
  position: fixed;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: -2;
  .bgBlock { position: absolute; opacity: 0.1; filter: blur($blur); mix-blend-mode: multiply; }
  .circle { @include block-shape(circle); }
  .triangle { @include block-shape(triangle); }
  .pentagram { @include block-shape(pentagram); }
  // ...不同 blockN 定位
}
@keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-1.875rem);} }
```

### 3.3 动态网格与主题切换
- 网格通过多重 linear-gradient 生成，支持明暗主题切换
- 网格缓慢平移动画，提升科技感

```scss
.dynamicGrid {
  position: absolute;
  width: 100%; height: 100%;
  background-image:
    linear-gradient(rgba(200,200,200,0.1) 0.0625rem, transparent 0.0625rem),
    linear-gradient(90deg, rgba(200,200,200,0.1) 0.0625rem, transparent 0.0625rem);
  background-size: 1.875rem 1.875rem;
  animation: gridMove 60s linear infinite;
  &.darkGrid {
    background-image:
      linear-gradient(rgba(100,100,100,0.15) 0.0625rem, transparent 0.0625rem),
      linear-gradient(90deg, rgba(100,100,100,0.15) 0.0625rem, transparent 0.0625rem);
  }
}
@keyframes gridMove { from {background-position:0 0;} to {background-position:6.25rem 6.25rem;} }
```

### 3.4 响应式与性能优化
- pointer-events: none，避免遮挡交互
- z-index: -2，确保背景层级
- 纯 CSS 动画，性能友好

---

## 4. 主要知识点

- SCSS 变量、mixin、clip-path、渐变、动画
- 主题切换与响应式适配
- 纯 CSS 动画与性能优化
- 视觉层级与无障碍设计
