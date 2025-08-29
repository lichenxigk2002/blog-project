# Galaxy 星空特效组件

一个基于WebGL的交互式星空/银河系背景特效组件，使用OGL库实现。

## 功能特性

- 🌟 **动态星空**：程序生成的星星，支持闪烁效果
- 🖱️ **鼠标交互**：鼠标移动时星星会产生排斥或跟随效果
- 🎨 **高度可定制**：20+个自定义参数
- ⚡ **性能优化**：WebGL渲染，支持透明背景
- 📱 **响应式**：自动适配容器大小
- 🎭 **多种模式**：支持透明背景和实色背景

## 基本用法

```tsx
import Galaxy from '@/components/Galaxy/Galaxy';

// 基础用法
<Galaxy />

// 自定义参数
<Galaxy 
  density={1.5}
  starSpeed={0.8}
  hueShift={200}
  mouseInteraction={true}
  transparent={true}
/>
```

## 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `focal` | `[number, number]` | `[0.5, 0.5]` | 焦点位置 |
| `rotation` | `[number, number]` | `[1.0, 0.0]` | 旋转角度 |
| `starSpeed` | `number` | `0.5` | 星星移动速度 |
| `density` | `number` | `1` | 星星密度 |
| `hueShift` | `number` | `140` | 色相偏移 |
| `speed` | `number` | `1.0` | 整体动画速度 |
| `glowIntensity` | `number` | `0.3` | 发光强度 |
| `saturation` | `number` | `0.0` | 饱和度 |
| `twinkleIntensity` | `number` | `0.3` | 闪烁强度 |
| `rotationSpeed` | `number` | `0.1` | 旋转速度 |
| `mouseInteraction` | `boolean` | `true` | 是否启用鼠标交互 |
| `mouseRepulsion` | `boolean` | `true` | 鼠标排斥效果 |
| `repulsionStrength` | `number` | `2` | 排斥强度 |
| `transparent` | `boolean` | `true` | 是否透明背景 |
| `disableAnimation` | `boolean` | `false` | 禁用动画 |

## 使用场景

### 1. 全屏背景
```tsx
<div className="relative w-full h-screen">
  <Galaxy className="absolute inset-0" />
  <div className="relative z-10">
    {/* 页面内容 */}
  </div>
</div>
```

### 2. 页面装饰
```tsx
<Galaxy 
  density={0.8}
  starSpeed={0.3}
  mouseInteraction={false}
  className="w-full h-64"
/>
```

### 3. 登录页面背景
```tsx
<div className="min-h-screen relative">
  <Galaxy 
    transparent={true}
    mouseRepulsion={true}
    className="absolute inset-0"
  />
  <div className="relative z-10 flex items-center justify-center min-h-screen">
    {/* 登录表单 */}
  </div>
</div>
```

## 性能优化建议

1. **移动端优化**：降低 `density` 和 `speed` 参数
2. **低性能设备**：设置 `mouseInteraction={false}`
3. **静态背景**：设置 `disableAnimation={true}`
4. **减少闪烁**：降低 `twinkleIntensity` 值

## 浏览器兼容性

- Chrome 51+
- Firefox 51+
- Safari 10+
- Edge 79+

需要支持WebGL的现代浏览器。

## 注意事项

1. 组件需要容器有明确的宽高
2. 透明模式下需要父容器支持透明背景
3. 鼠标交互在移动设备上可能不理想
4. 首次加载可能需要一些时间来初始化WebGL上下文 