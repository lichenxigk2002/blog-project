# MultiSelect 多选下拉组件

## 功能描述

MultiSelect 是一个多选下拉组件，支持上面标题下面框子的布局，提供全选功能和统一的样式体验。

## 接口定义

```typescript
interface MultiSelectOption {
  id: number;
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];           // 选项列表
  selectedIds: number[];                  // 已选择的ID列表
  onSelectionChange: (selectedIds: number[]) => void;  // 选择变化回调
  label?: string;                         // 标签文本
  placeholder?: string;                   // 占位符文本
  loading?: boolean;                      // 是否加载中
  disabled?: boolean;                     // 是否禁用
  className?: string;                     // 自定义样式类名
  showSelectAll?: boolean;                // 是否显示全选选项
  selectAllLabel?: string;                // 全选标签文本
  mode?: 'dropdown' | 'buttons';         // 显示模式：下拉列表或按钮组
  dropdownPosition?: 'top' | 'bottom';   // 下拉菜单位置：上方或下方
}
```

## 使用示例

### 基础用法

```tsx
import MultiSelect from '@/admin/components/ui/MultiSelect/MultiSelect';

const options = [
  { id: 1, label: '用户A', value: 'user_a' },
  { id: 2, label: '用户B', value: 'user_b' },
  { id: 3, label: '用户C', value: 'user_c' }
];

<MultiSelect
  options={options}
  selectedIds={selectedUserIds}
  onSelectionChange={setSelectedUserIds}
  label="推送用户"
  placeholder="请选择用户"
/>
```

### 带加载状态

```tsx
<MultiSelect
  options={subscribers}
  selectedIds={formData.notifyUserIds}
  onSelectionChange={(ids) => setFormData(prev => ({ ...prev, notifyUserIds: ids }))}
  label="推送用户"
  loading={loadingSubscribers}
  placeholder="推送给所有订阅用户"
/>
```

### 禁用状态

```tsx
<MultiSelect
  options={options}
  selectedIds={selectedIds}
  onSelectionChange={setSelectedIds}
  label="选择标签"
  disabled={!isEditing}
/>
```

### 自定义全选标签

```tsx
<MultiSelect
  options={options}
  selectedIds={selectedIds}
  onSelectionChange={setSelectedIds}
  label="选择项目"
  selectAllLabel="选择所有项目"
/>
```

### 隐藏全选选项

```tsx
<MultiSelect
  options={options}
  selectedIds={selectedIds}
  onSelectionChange={setSelectedIds}
  label="选择项目"
  showSelectAll={false}
/>
```

### 按钮模式（适合标签选择）

```tsx
<MultiSelect
  options={allTags.map(tag => ({
    id: tag.id,
    label: tag.name,
    value: tag.name
  }))}
  selectedIds={formData.tags}
  onSelectionChange={(ids) => setFormData(prev => ({ ...prev, tags: ids }))}
  label="标签"
  mode="buttons"
/>
```

按钮模式的特点：
- 点击输入框弹出按钮菜单
- 在菜单中点击按钮进行选择
- 输入框内显示已选择的按钮标签
- 适合标签、分类等多选场景

### 下拉菜单位置

```tsx
// 默认在下方显示
<MultiSelect
  options={options}
  selectedIds={selectedIds}
  onSelectionChange={setSelectedIds}
  label="选择项目"
  dropdownPosition="bottom"
/>

// 在上方显示（适合底部空间不足的情况）
<MultiSelect
  options={options}
  selectedIds={selectedIds}
  onSelectionChange={setSelectedIds}
  label="选择项目"
  dropdownPosition="top"
/>
```

## 功能特性

- **多选支持**：支持选择多个选项
- **双模式显示**：支持下拉列表模式和按钮组模式
- **全选功能**：提供全选/取消全选功能（下拉模式）
- **加载状态**：支持加载中的显示
- **禁用状态**：支持禁用状态
- **统一样式**：与整体设计风格保持一致
- **布局一致**：上面标题下面框子的布局
- **交互反馈**：悬停和焦点状态的视觉反馈
- **无障碍支持**：完整的 label 属性

## 样式特性

- 使用 Comic Sans MS 字体保持一致性
- 主题色边框和焦点效果
- 平滑的过渡动画
- 悬停和焦点状态的视觉反馈
- 禁用状态的视觉提示
- 下拉箭头动画效果
- 滚动条自定义样式 