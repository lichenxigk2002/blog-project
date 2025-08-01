# SearchBar 搜索栏组件

## 功能描述

SearchBar 是一个可复用的搜索栏组件，包含搜索输入框和搜索按钮，支持键盘回车搜索。

## 接口定义

```typescript
interface SearchBarProps {
  placeholder?: string;        // 输入框占位符文本
  onSearch: (searchText: string) => void;  // 搜索回调函数
  className?: string;          // 自定义样式类名
  initialValue?: string;       // 初始搜索值
}
```

## 使用示例

```tsx
import SearchBar from '@/admin/components/ui/SearchBar/SearchBar';

const handleSearch = (searchText: string) => {
  console.log('搜索:', searchText);
  // 执行搜索逻辑
};

<SearchBar 
  placeholder="搜索文章标题..."
  onSearch={handleSearch}
  initialValue=""
/>
```

## 功能特性

- **键盘支持**：按回车键触发搜索
- **响应式设计**：在小屏幕上自动调整为垂直布局
- **主题一致**：使用与整体设计一致的颜色和字体
- **焦点效果**：输入框获得焦点时有高亮边框效果
- **悬停效果**：鼠标悬停时边框颜色变化

## 样式特性

- 使用 Comic Sans MS 字体保持一致性
- 主题色边框和焦点效果
- 响应式布局适配移动端
- 平滑的过渡动画效果 