# FormModal 组件

专门用于表单的模态框组件，提供简洁的标题栏和内容区域。

## 功能特点

- 简洁的标题栏设计（左上角标题，右上角关闭按钮）
- 支持不同尺寸（small、medium、large）
- 支持点击遮罩层关闭
- 支持 ESC 键关闭
- 响应式设计，适配移动端
- 平滑的动画效果

## 使用方法

```tsx
import FormModal from '@/admin/components/ui/FormModal/FormModal';

// 基本使用
<FormModal
  open={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="编辑文章"
>
  <ArticleForm />
</FormModal>

// 指定尺寸
<FormModal
  open={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="新建文章"
  size="large"
>
  <ArticleForm />
</FormModal>

// 禁用点击遮罩层关闭
<FormModal
  open={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="确认删除"
  closeOnOverlayClick={false}
>
  <p>确定要删除这篇文章吗？</p>
</FormModal>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| open | boolean | - | 是否显示模态框 |
| onClose | () => void | - | 关闭模态框的回调函数 |
| title | string | - | 模态框标题 |
| children | React.ReactNode | - | 模态框内容 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 模态框尺寸 |
| closeOnOverlayClick | boolean | true | 是否允许点击遮罩层关闭 |
| closeOnEscape | boolean | true | 是否允许按 ESC 键关闭 |

## 尺寸说明

- `small`: 500px 宽度
- `medium`: 800px 宽度  
- `large`: 1000px 宽度

## 样式特点

- 白色背景，圆角设计
- 浅灰色标题栏背景
- 简洁的关闭按钮
- 可滚动的内容区域
- 响应式设计，移动端全屏显示 