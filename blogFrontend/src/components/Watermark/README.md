 # Watermark 组件技术文档

## 1. 组件用途

`Watermark` 是一个为页面或任意内容添加防篡改水印的高阶组件。支持自定义水印文本、旋转角度、透明度、字体、颜色、间距等，适用于敏感信息、演示环境、后台管理等场景，防止内容被截图或非法传播。

---

## 2. Props/类型定义

```ts
interface WatermarkProps {
  content?: string;         // 水印文本，默认 'Confidential'
  rotate?: number;          // 旋转角度，默认 -25
  opacity?: number;         // 透明度，默认 0.1
  fontSize?: number;        // 字体大小，默认 16
  color?: string;           // 字体颜色，默认 #999
  gap?: [number, number];   // 水印横纵间距，默认 [100, 100]
  children?: React.ReactNode; // 被包裹内容
  debug?: boolean;          // 是否显示调试边框
}
```
- 所有参数均为可选，支持灵活自定义。

---

## 3. 关键渲染与逻辑

### 3.1 水印生成
- 使用 canvas 动态生成带旋转、透明度、颜色、字体的水印图片，转为 base64 作为背景图。
- 支持自定义文本、字体、颜色、透明度、旋转角度、间距。

### 3.2 防篡改机制
- 通过 MutationObserver 监听水印 DOM 是否被移除，若被篡改则自动重建水印层，提升安全性。
- 适合对内容安全有较高要求的场景。

### 3.3 结构与样式
- 外层容器 position: relative，水印层 absolute 覆盖，内容层 relative 保证交互。
- pointer-events: none 保证水印不影响内容交互。
- 支持 debug 模式显示边框。

```tsx
<div ref={containerRef} style={{ position: 'relative' }}>
  <div
    ref={watermarkRef}
    style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      backgroundImage: `url(${bgUrl})`, backgroundRepeat: 'repeat', pointerEvents: 'none', zIndex: 9999
    }}
  />
  <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
</div>
```

---

## 4. 主要知识点

- **canvas 动态水印**：支持多参数自定义，适配各种场景。
- **MutationObserver 防篡改**：监听 DOM 变化，水印被移除时自动重建。
- **高阶组件设计**：可包裹任意内容，children 透传。
- **性能优化**：仅在参数变化时重新生成水印。
- **无侵入交互**：pointer-events: none，保证内容可用性。

---

## 5. 示例

```tsx
import Watermark from '@/components/Watermark/Watermark';

<Watermark content="仅供内部使用" color="#e53e3e" opacity={0.15} fontSize={20} gap={[120, 120]}>
  <div>这里是敏感内容</div>
</Watermark>
```
