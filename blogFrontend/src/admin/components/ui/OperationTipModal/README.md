# OperationTipModal 组件

一个可复用的操作提示模态框组件，用于显示操作结果反馈。

## 功能特性

- 🎯 多种提示类型：成功、错误、信息、警告、加载
- ⏰ 自动关闭功能
- 🎨 自定义图标和样式
- 📍 多种位置显示
- 🔄 平滑的进入/离开动画
- 🖱️ 点击遮罩关闭
- ❌ 可选的关闭按钮

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| open | boolean | - | 是否显示模态框 |
| onClose | () => void | - | 关闭回调函数 |
| message | string | - | 提示消息内容 |
| type | 'success' \| 'error' \| 'info' \| 'warning' \| 'loading' | 'success' | 提示类型 |
| width | number | 280 | 模态框宽度（px） |
| iconSize | number | 128 | 图标大小（px） |
| icon | string | - | 自定义图标路径 |
| autoClose | boolean | true | 是否自动关闭 |
| autoCloseDelay | number | 1500 | 自动关闭延迟（ms） |
| clickOverlayToClose | boolean | true | 点击遮罩是否关闭 |
| showCloseButton | boolean | false | 是否显示关闭按钮 |
| position | 'center' \| 'top' \| 'bottom' | 'center' | 显示位置 |
| className | string | '' | 自定义样式类名 |

## 使用示例

### 基础用法
```tsx
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';

const [tipModal, setTipModal] = useState({
  open: false,
  message: '',
  type: 'success' as const
});

<OperationTipModal
  open={tipModal.open}
  message={tipModal.message}
  type={tipModal.type}
  onClose={() => setTipModal({ ...tipModal, open: false })}
/>
```

### 自定义配置
```tsx
<OperationTipModal
  open={true}
  message="操作成功！"
  type="success"
  width={320}
  iconSize={96}
  autoClose={true}
  autoCloseDelay={2000}
  position="top"
  showCloseButton={true}
  onClose={() => {}}
/>
```

### 错误提示
```tsx
<OperationTipModal
  open={true}
  message="操作失败，请重试"
  type="error"
  autoClose={false}
  showCloseButton={true}
  onClose={() => {}}
/>
```

## 图标映射

组件内置了以下图标映射：

- `success`: `/images/success.png`
- `error`: `/images/failure.png`
- `info`: `/images/info.png`
- `warning`: `/images/warning.png`
- `loading`: `/images/loading.png`

## 动画效果

- **进入动画**: 从下方滑入，带有淡入效果
- **离开动画**: 向上滑出，带有淡出效果
- **动画时长**: 350ms

## 样式定制

组件支持通过 `className` 属性添加自定义样式，也可以通过修改 SCSS 文件来调整样式。 