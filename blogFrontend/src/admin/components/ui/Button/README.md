# Button 组件

一个可复用的按钮组件，支持多种样式变体、尺寸和图标。

## 功能特性

- 🎨 多种样式变体：primary、danger、default、search、success、warning
- 📏 三种尺寸：small、medium、large
- 🎯 图标支持
- ♿ 完整的 HTML 按钮属性支持
- 🎨 悬停和焦点状态
- 📱 响应式设计

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | 'primary' \| 'danger' \| 'default' \| 'search' \| 'success' \| 'warning' | 'default' | 按钮样式变体 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 按钮尺寸 |
| icon | React.ReactNode | - | 按钮图标 |
| children | React.ReactNode | - | 按钮内容 |
| className | string | '' | 自定义样式类名 |
| ...rest | HTMLButtonElement | - | 所有原生按钮属性 |

## 使用示例

### 基础用法
```tsx
import Button from '../ui/Button/Button';

<Button onClick={() => console.log('clicked')}>
  点击我
</Button>
```

### 不同变体
```tsx
<Button variant="primary">主要按钮</Button>
<Button variant="danger">危险按钮</Button>
<Button variant="default">默认按钮</Button>
<Button variant="search">搜索按钮</Button>
<Button variant="success">成功按钮</Button>
<Button variant="warning">警告按钮</Button>
```

### 不同尺寸
```tsx
<Button size="small">小按钮</Button>
<Button size="medium">中等按钮</Button>
<Button size="large">大按钮</Button>
```

### 带图标
```tsx
import { PlusIcon, DeleteIcon } from '../ui/Icons/Icons';

<Button variant="primary" icon={<PlusIcon />}>
  添加项目
</Button>

<Button variant="danger" icon={<DeleteIcon />}>
  删除
</Button>
```

### 仅图标按钮
```tsx
<Button variant="danger" icon={<DeleteIcon />} />
```

### 禁用状态
```tsx
<Button variant="primary" disabled>
  禁用按钮
</Button>
```

### 表单按钮
```tsx
<Button type="submit" variant="primary">
  提交表单
</Button>

<Button type="reset" variant="default">
  重置
</Button>
```

## 变体说明

### primary
- 主要操作按钮
- 渐变背景色
- 悬停时有动画效果

### danger
- 危险操作按钮
- 红色主题
- 用于删除等危险操作

### default
- 默认按钮
- 边框样式
- 适合次要操作

### search
- 搜索按钮
- 紧凑设计
- 适合搜索框旁边

### success
- 成功状态按钮
- 绿色主题
- 用于确认操作

### warning
- 警告按钮
- 橙色主题
- 用于警告操作

## 尺寸说明

### small
- 高度：32px
- 字体大小：12px
- 适合紧凑布局

### medium
- 高度：40px
- 字体大小：14px
- 默认尺寸

### large
- 高度：48px
- 字体大小：16px
- 适合重要操作

## 图标支持

- 支持任何 React 节点作为图标
- 图标会自动调整大小
- 仅图标按钮会自动调整样式
- 图标和文字组合时会有适当间距

## 状态样式

### 正常状态
- 基础样式
- 可点击

### 悬停状态
- 颜色变化
- 阴影效果
- 轻微动画

### 焦点状态
- 轮廓高亮
- 键盘导航支持

### 禁用状态
- 灰色样式
- 不可点击
- 鼠标指针变化

## 样式定制

组件使用 SCSS 模块化样式，主要类名：

- `.button`: 基础按钮样式
- `.primary`: 主要按钮样式
- `.danger`: 危险按钮样式
- `.default`: 默认按钮样式
- `.search`: 搜索按钮样式
- `.success`: 成功按钮样式
- `.warning`: 警告按钮样式
- `.small`, `.medium`, `.large`: 尺寸样式
- `.iconOnly`: 仅图标样式

## 无障碍支持

- 支持所有原生按钮属性
- 键盘导航支持
- 屏幕阅读器友好
- 焦点管理
