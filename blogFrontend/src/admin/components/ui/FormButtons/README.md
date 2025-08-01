# FormButtons 组件

一个可复用的表单按钮组组件，包含取消和确定按钮。

## 功能特点

- 取消和确定按钮组合
- 支持自定义按钮文本
- 支持不同的按钮变体
- 支持禁用和加载状态
- 响应式设计
- 统一的样式风格

## 使用方法

```tsx
import FormButtons from '@/admin/components/ui/FormButtons/FormButtons';

// 基本使用
<FormButtons
  onCancel={() => setModalVisible(false)}
  onSubmit={handleSubmit}
  submitText="保存"
  cancelText="取消"
/>

// 删除确认
<FormButtons
  onCancel={() => setDeleteModalVisible(false)}
  onSubmit={handleDelete}
  submitText="确认删除"
  submitVariant="danger"
  cancelText="取消"
/>

// 加载状态
<FormButtons
  onCancel={() => setModalVisible(false)}
  onSubmit={handleSubmit}
  loading={true}
  disabled={true}
/>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| onCancel | () => void | - | 取消按钮的回调函数 |
| onSubmit | () => void | - | 确定按钮的回调函数 |
| submitText | string | '确定' | 确定按钮文本 |
| cancelText | string | '取消' | 取消按钮文本 |
| submitVariant | 'primary' \| 'danger' \| 'success' | 'primary' | 确定按钮样式 |
| cancelVariant | 'default' \| 'danger' | 'default' | 取消按钮样式 |
| disabled | boolean | false | 是否禁用 |
| loading | boolean | false | 是否显示加载状态 |
| className | string | '' | 自定义样式类名 |

## 样式特点

- 右对齐布局
- 12px 间距
- 顶部边框分割线
- 移动端垂直布局
- 最小宽度 80px 