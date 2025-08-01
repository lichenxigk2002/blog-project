# FormInput 表单输入组件

## 功能描述

FormInput 是一个通用的表单输入组件，支持 input 和 textarea 类型，提供统一的样式和交互体验。

## 接口定义

```typescript
interface FormInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'textarea';  // 输入类型
  name: string;                    // 字段名
  value: string | number;          // 输入值
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;  // 变化回调
  placeholder?: string;            // 占位符文本
  label?: string;                  // 标签文本
  required?: boolean;              // 是否必填
  disabled?: boolean;              // 是否禁用
  layout?: 'horizontal' | 'vertical';  // 布局方式
  className?: string;              // 自定义样式类名
  rows?: number;                   // textarea 行数
  maxLength?: number;              // 最大长度
  minLength?: number;              // 最小长度
  pattern?: string;                // 正则表达式
  title?: string;                  // 提示文本
}
```

## 使用示例

### 基础用法

```tsx
import FormInput from '@/admin/components/ui/FormInput/FormInput';

<FormInput
  type="text"
  name="title"
  value={formData.title}
  onChange={handleInputChange}
  placeholder="请输入标题"
  label="标题"
  required
/>
```

### 文本域

```tsx
<FormInput
  type="textarea"
  name="content"
  value={formData.content}
  onChange={handleInputChange}
  placeholder="请输入内容"
  label="内容"
  rows={5}
/>
```

### 水平布局

```tsx
<FormInput
  type="text"
  name="email"
  value={formData.email}
  onChange={handleInputChange}
  label="邮箱"
  layout="horizontal"
/>
```

### 带验证

```tsx
<FormInput
  type="email"
  name="email"
  value={formData.email}
  onChange={handleInputChange}
  label="邮箱"
  required
  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
  title="请输入有效的邮箱地址"
/>
```

## 功能特性

- **多种输入类型**：支持 text、email、password、number、url、textarea
- **布局灵活**：支持垂直和水平布局
- **表单验证**：支持 required、pattern、maxLength、minLength 等验证
- **无障碍支持**：完整的 label 和 title 属性
- **状态管理**：支持 disabled 状态
- **样式统一**：与整体设计风格保持一致
- **响应式设计**：适配不同屏幕尺寸

## 样式特性

- 使用 Comic Sans MS 字体保持一致性
- 主题色边框和焦点效果
- 平滑的过渡动画
- 悬停和焦点状态的视觉反馈
- 禁用状态的视觉提示 