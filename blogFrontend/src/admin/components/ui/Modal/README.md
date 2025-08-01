# Modal 模态框组件

## 功能描述

Modal 是一个通用的模态框组件，包含标题和关闭按钮，用于包装表单或其他内容。

## 接口定义

```typescript
interface ModalProps {
  open: boolean;                    // 是否显示模态框
  onClose: () => void;              // 关闭回调函数
  title: string;                    // 模态框标题
  children: React.ReactNode;        // 模态框内容
  className?: string;               // 自定义样式类名
  size?: 'small' | 'medium' | 'large';  // 模态框尺寸
  closeOnOverlayClick?: boolean;    // 点击遮罩层是否关闭
  closeOnEscape?: boolean;          // 按ESC键是否关闭
}
```

## 使用示例

### 基础用法

```tsx
import Modal from '@/admin/components/ui/Modal/Modal';

const [isModalOpen, setIsModalOpen] = useState(false);

<Modal
  open={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="编辑文章"
>
  <ArticleForm
    allTags={allTags}
    initialValues={editingArticle}
    onSubmit={handleSubmit}
  />
</Modal>
```

### 不同尺寸

```tsx
// 小尺寸
<Modal
  open={isOpen}
  onClose={handleClose}
  title="确认删除"
  size="small"
>
  <p>确定要删除这篇文章吗？</p>
</Modal>

// 大尺寸
<Modal
  open={isOpen}
  onClose={handleClose}
  title="文章详情"
  size="large"
>
  <ArticleDetail article={article} />
</Modal>
```

### 自定义关闭行为

```tsx
<Modal
  open={isOpen}
  onClose={handleClose}
  title="重要操作"
  closeOnOverlayClick={false}  // 禁止点击遮罩层关闭
  closeOnEscape={false}        // 禁止按ESC关闭
>
  <ImportantForm onSubmit={handleSubmit} />
</Modal>
```

## 功能特性

- **标题栏**：包含标题和关闭按钮
- **多种尺寸**：支持 small、medium、large 三种尺寸
- **关闭方式**：支持点击遮罩层、按ESC键、点击关闭按钮关闭
- **动画效果**：淡入淡出和滑入动画
- **响应式设计**：适配移动端
- **无障碍支持**：完整的键盘导航和ARIA标签
- **滚动处理**：自动处理内容溢出滚动

## 样式特性

- 半透明遮罩层，带模糊效果
- 圆角设计，与整体风格一致
- 标题栏带底部边框
- 关闭按钮悬停效果
- 平滑的动画过渡
- 移动端优化布局

## 尺寸规格

- **small**: 400px 宽度
- **medium**: 600px 宽度（默认）
- **large**: 800px 宽度 