# DataTable 数据表格组件

## 功能描述

DataTable 是一个高度可配置的数据表格组件，支持排序、操作按钮、自定义渲染、加载状态和空数据状态。

## 接口定义

```typescript
interface TableColumn<T = any> {
  key: string;                    // 列字段名
  title: string;                  // 列标题
  sortable?: boolean;             // 是否可排序
  render?: (value: any, record: T) => React.ReactNode;  // 自定义渲染函数
  width?: string;                 // 列宽度
}

interface TableAction<T = any> {
  key: string;                    // 操作唯一标识
  label: string;                  // 操作按钮文本
  variant?: 'primary' | 'danger' | 'success' | 'search' | 'default' | 'warning';  // 按钮样式
  icon?: React.ReactNode;         // 按钮图标
  onClick: (record: T) => void;   // 点击回调
  disabled?: (record: T) => boolean;  // 禁用条件
}

interface DataTableProps<T = any> {
  data: T[];                      // 表格数据
  columns: TableColumn<T>[];      // 列配置
  actions?: TableAction<T>[];     // 操作按钮配置
  sortField?: string;             // 当前排序字段
  sortOrder?: 'asc' | 'desc';     // 排序方向
  onSort?: (field: string) => void;  // 排序回调
  loading?: boolean;              // 加载状态
  className?: string;             // 自定义样式类名
  rowKey?: string | ((record: T) => string);  // 行键值
  emptyText?: string;             // 空数据提示文本
}
```

## 使用示例

### 基础用法

```tsx
import DataTable from '@/admin/components/ui/DataTable/DataTable';

const columns = [
  { key: 'title', title: '标题', sortable: true },
  { key: 'status', title: '状态', sortable: true },
  { key: 'createdAt', title: '创建时间' }
];

const actions = [
  {
    key: 'edit',
    label: '编辑',
    variant: 'primary',
    onClick: (record) => console.log('编辑', record)
  },
  {
    key: 'delete',
    label: '删除',
    variant: 'danger',
    onClick: (record) => console.log('删除', record)
  }
];

<DataTable
  data={articles}
  columns={columns}
  actions={actions}
  sortField={sortField}
  sortOrder={sortOrder}
  onSort={handleSort}
  loading={loading}
/>
```

### 自定义渲染

```tsx
const columns = [
  { 
    key: 'status', 
    title: '状态',
    render: (value, record) => (
      <span className={`status-tag ${value}`}>
        {value === 'published' ? '已发布' : '草稿'}
      </span>
    )
  },
  {
    key: 'createdAt',
    title: '创建时间',
    render: (value) => new Date(value).toLocaleString()
  }
];
```

### 条件操作按钮

```tsx
const actions = [
  {
    key: 'edit',
    label: '编辑',
    variant: 'primary',
    onClick: (record) => handleEdit(record),
    disabled: (record) => record.status === 'archived'
  }
];
```

## 功能特性

- **类型安全**：使用 TypeScript 泛型支持任意数据类型
- **高度可配置**：支持自定义列渲染、操作按钮、排序等
- **响应式设计**：在不同屏幕尺寸下自动调整布局
- **加载状态**：内置加载动画和空数据状态
- **排序功能**：支持多列排序，带排序图标
- **操作按钮**：支持多种样式的操作按钮，可条件禁用
- **自定义渲染**：支持自定义单元格内容渲染
- **动画效果**：行悬停效果和排序图标动画

## 样式特性

- 使用 Comic Sans MS 字体保持一致性
- 主题色设计和渐变效果
- 响应式布局适配移动端
- 平滑的过渡动画效果
- 加载和空状态的友好提示 