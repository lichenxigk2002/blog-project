# Checkbox 复选框组件

## 功能描述

Checkbox 是一个通用的复选框组件，提供统一的样式和交互体验，支持自定义标签和禁用状态。

## 接口定义

```typescript
interface CheckboxProps {
  checked: boolean;                    // 是否选中
  onChange: (checked: boolean) => void;  // 变化回调
  label?: string;                      // 标签文本
  disabled?: boolean;                  // 是否禁用
  name?: string;                       // 字段名
  className?: string;                  // 自定义样式类名
  children?: React.ReactNode;          // 子元素（替代 label）
}
```

## 使用示例

### 基础用法

```tsx
import Checkbox from '@/admin/components/ui/Checkbox/Checkbox';

<Checkbox
  checked={formData.shouldNotify}
  onChange={(checked) => handleCheckboxChange('shouldNotify', checked)}
  label="推送邮件通知"
/>
```

### 使用 children

```tsx
<Checkbox
  checked={formData.agree}
  onChange={(checked) => setFormData(prev => ({ ...prev, agree: checked }))}
>
  我已阅读并同意用户协议
</Checkbox>
```

### 禁用状态

```tsx
<Checkbox
  checked={formData.shouldNotify}
  onChange={(checked) => handleCheckboxChange('shouldNotify', checked)}
  label="推送邮件通知"
  disabled={!newArticleNotification}
/>
```

### 带字段名

```tsx
<Checkbox
  name="shouldNotify"
  checked={formData.shouldNotify}
  onChange={(checked) => handleCheckboxChange('shouldNotify', checked)}
  label="推送邮件通知"
/>
```

## 功能特性

- **统一样式**：与整体设计风格保持一致
- **自定义标签**：支持 label 属性或 children 内容
- **状态管理**：支持选中、未选中、禁用状态
- **无障碍支持**：完整的 label 和 name 属性
- **交互反馈**：悬停和焦点状态的视觉反馈
- **自定义样式**：支持 className 属性

## 样式特性

- 使用 Comic Sans MS 字体保持一致性
- 主题色边框和选中效果
- 平滑的过渡动画
- 悬停和焦点状态的视觉反馈
- 禁用状态的视觉提示
- 自定义的勾选图标 