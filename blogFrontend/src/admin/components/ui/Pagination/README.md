# Pagination 组件

一个可复用的分页组件，支持页码导航和每页条数选择。

## 功能特性

- 📄 页码导航（上一页/下一页）
- 📊 每页条数选择
- 📈 总记录数显示
- 🎯 当前页码显示
- 🔄 自动计算总页数
- 🎨 响应式设计

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| total | number | - | 总记录数 |
| currentPage | number | - | 当前页码 |
| pageSize | number | - | 每页条数 |
| onPageChange | (page: number) => void | - | 页码改变回调 |
| onPageSizeChange | (size: number) => void | - | 每页条数改变回调 |

## 使用示例

### 基础用法
```tsx
import Pagination from '../ui/Pagination/Pagination';

const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const total = 100;

<Pagination
  total={total}
  currentPage={currentPage}
  pageSize={pageSize}
  onPageChange={setCurrentPage}
  onPageSizeChange={setPageSize}
/>
```

### 与数据表格结合
```tsx
const [data, setData] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [total, setTotal] = useState(0);

// 获取分页数据
const fetchData = async (page: number, size: number) => {
  const response = await api.getData({ page, size });
  setData(response.data);
  setTotal(response.total);
};

useEffect(() => {
  fetchData(currentPage, pageSize);
}, [currentPage, pageSize]);

return (
  <div>
    <DataTable data={data} />
    <Pagination
      total={total}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
    />
  </div>
);
```

## 每页条数选项

组件内置了以下每页条数选项：

- 5条/页
- 10条/页
- 20条/页
- 50条/页

## 组件结构

```
Pagination
├── 分页信息 (共 X 条记录)
└── 分页控制
    ├── 每页条数选择器
    ├── 上一页按钮
    ├── 当前页码显示
    └── 下一页按钮
```

## 状态管理

组件会自动处理以下状态：

- **禁用状态**: 当在第一页时，上一页按钮会被禁用
- **禁用状态**: 当在最后一页时，下一页按钮会被禁用
- **页码计算**: 自动计算总页数
- **条数选择**: 切换每页条数时会重置到第一页

## 样式定制

组件使用 SCSS 模块化样式，可以通过修改以下类名来自定义样式：

- `.pagination`: 主容器
- `.paginationInfo`: 分页信息
- `.paginationControls`: 分页控制区域
- `.paginationButton`: 分页按钮
- `.paginationCurrent`: 当前页码显示
- `.select`: 每页条数选择器

## 响应式设计

组件在不同屏幕尺寸下会自动调整布局：

- **桌面端**: 完整显示所有元素
- **平板端**: 优化按钮间距
- **移动端**: 简化显示内容 