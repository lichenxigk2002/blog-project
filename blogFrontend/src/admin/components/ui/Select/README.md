# Select 组件

一个功能丰富的下拉选择组件，支持单选、多选、搜索、自定义布局等功能。

## 功能特性

- 🎯 单选和多选模式
- 🔍 搜索过滤功能
- 📱 响应式设计
- 🎨 多种尺寸和布局
- ♿ 支持禁用状态
- 🔄 自定义选项渲染
- 📍 垂直和水平布局

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | string \| number \| (string \| number)[] | - | 当前选中值 |
| options | SelectOption[] | - | 选项数组 |
| placeholder | string | '请选择' | 占位符文本 |
| onChange | (value: string \| number \| (string \| number)[]) => void | - | 值改变回调 |
| disabled | boolean | false | 是否禁用 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 组件尺寸 |
| width | string | 'auto' | 组件宽度 |
| className | string | '' | 自定义样式类名 |
| searchable | boolean | false | 是否可搜索 |
| multiple | boolean | false | 是否多选 |
| maxHeight | string | '200px' | 下拉框最大高度 |
| layout | 'horizontal' \| 'vertical' | 'horizontal' | 布局方式 |
| label | string | - | 标签文本（垂直布局时显示） |

## SelectOption 接口

```typescript
interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}
```

## 使用示例

### 基础单选
```tsx
import Select from '../ui/Select/Select';

const [value, setValue] = useState('');

const options = [
  { value: 'option1', label: '选项1' },
  { value: 'option2', label: '选项2' },
  { value: 'option3', label: '选项3' }
];

<Select
  value={value}
  options={options}
  onChange={setValue}
  placeholder="请选择一个选项"
/>
```

### 多选模式
```tsx
const [selectedValues, setSelectedValues] = useState<string[]>([]);

<Select
  value={selectedValues}
  options={options}
  multiple={true}
  onChange={(values) => setSelectedValues(values as string[])}
  placeholder="请选择多个选项"
/>
```

### 可搜索
```tsx
<Select
  value={value}
  options={options}
  searchable={true}
  onChange={setValue}
  placeholder="搜索并选择..."
/>
```

### 垂直布局
```tsx
<Select
  value={value}
  options={options}
  layout="vertical"
  label="选择类型"
  onChange={setValue}
/>
```

### 不同尺寸
```tsx
<Select
  value={value}
  options={options}
  size="small"
  onChange={setValue}
/>

<Select
  value={value}
  options={options}
  size="large"
  onChange={setValue}
/>
```

### 自定义宽度
```tsx
<Select
  value={value}
  options={options}
  width="300px"
  onChange={setValue}
/>
```

## 尺寸说明

- **small**: 紧凑型，适合表单中
- **medium**: 标准尺寸，默认使用
- **large**: 大型，适合重要操作

## 布局模式

### 水平布局 (horizontal)
- 标签和选择器在同一行
- 适合紧凑的表单布局

### 垂直布局 (vertical)
- 标签在选择器上方
- 适合需要清晰标签的场景

## 搜索功能

当 `searchable={true}` 时：

- 下拉框顶部会显示搜索输入框
- 支持实时过滤选项
- 搜索不区分大小写
- 支持中文搜索

## 多选功能

当 `multiple={true}` 时：

- 每个选项前会显示复选框
- 支持选择多个选项
- 显示已选择的数量
- 支持取消选择

## 禁用状态

- **组件禁用**: 整个选择器不可点击
- **选项禁用**: 单个选项不可选择
- 禁用状态下会显示灰色样式

## 样式定制

组件使用 SCSS 模块化样式，主要类名：

- `.select`: 主容器
- `.selectSelector`: 选择器触发器
- `.selectDropdown`: 下拉框
- `.selectOption`: 选项项
- `.searchContainer`: 搜索容器
- `.searchInput`: 搜索输入框

## 键盘导航

- **Enter**: 打开/关闭下拉框
- **Escape**: 关闭下拉框
- **Arrow Up/Down**: 在选项中导航
- **Space**: 选择当前选项 