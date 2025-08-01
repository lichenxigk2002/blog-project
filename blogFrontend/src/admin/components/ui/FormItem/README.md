# FormItem 表单项包装组件

## 功能描述

FormItem 是一个通用的表单项包装组件，用于统一表单中各个表单项的布局和样式。

## 接口定义

```typescript
interface FormItemProps {
  children: React.ReactNode;    // 子元素
  className?: string;            // 自定义样式类名
  style?: React.CSSProperties;   // 自定义内联样式
}
```

## 使用示例

### 基础用法

```tsx
import FormItem from '@/admin/components/ui/FormItem/FormItem';

<FormItem>
  <FormInput
    type="text"
    name="title"
    value={formData.title}
    onChange={handleInputChange}
    placeholder="请输入标题"
    label="标题"
    required
  />
</FormItem>
```

### 带自定义样式

```tsx
<FormItem className={styles.customFormItem}>
  <Select
    value={formData.status}
    options={statusOptions}
    onChange={(value) => handleSelectChange('status', value as string)}
    placeholder="请选择状态"
    layout="vertical"
    label="状态"
  />
</FormItem>
```

### 带内联样式

```tsx
<FormItem style={{ marginBottom: '16px' }}>
  <Checkbox
    checked={formData.shouldNotify}
    onChange={(checked) => handleCheckboxChange('shouldNotify', checked)}
    label="推送邮件通知"
  />
</FormItem>
```

## 功能特性

- **统一样式**：为所有表单项提供一致的布局和间距
- **灵活配置**：支持自定义样式类名和内联样式
- **响应式设计**：适配不同屏幕尺寸
- **语义化**：提供清晰的组件结构

## 样式特性

- 统一的底部间距（32px）
- 相对定位，支持内部元素的绝对定位
- 100% 宽度，适配容器
- 与整体设计风格保持一致 