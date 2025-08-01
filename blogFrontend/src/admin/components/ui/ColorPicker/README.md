# ColorPicker 组件

一个可复用的颜色选择器组件，包含颜色输入框和预览功能。

## 功能特点

- 颜色输入框和预览
- 支持标签显示
- 支持必填验证
- 支持禁用状态
- 响应式设计
- 平滑的过渡动画

## 使用方法

```tsx
import ColorPicker from '@/admin/components/ui/ColorPicker/ColorPicker';

// 基本使用
<ColorPicker
  value="#a259ff"
  onChange={(color) => setColor(color)}
  label="标签颜色"
  required
/>

// 禁用状态
<ColorPicker
  value="#a259ff"
  onChange={(color) => setColor(color)}
  label="标签颜色"
  disabled
/>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | string | - | 当前选中的颜色值 |
| onChange | (color: string) => void | - | 颜色改变时的回调函数 |
| label | string | - | 标签文本 |
| required | boolean | false | 是否为必填项 |
| disabled | boolean | false | 是否禁用 |
| className | string | '' | 自定义样式类名 |

## 样式特点

- 颜色输入框：48x32px，圆角设计
- 颜色预览：32x32px，带边框和阴影
- 标签样式：14px 字体，紫色主题
- 悬停和聚焦效果
- 禁用状态样式 