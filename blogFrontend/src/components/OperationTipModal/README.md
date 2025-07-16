# OperationTipModal 组件

一个通用的操作提示模态框组件，支持多种类型、动画效果和自定义配置。

## 功能特性

- ✅ 多种提示类型：success、error、info、warning、loading
- ✅ 自动关闭功能（可配置）
- ✅ 平滑的淡入淡出动画
- ✅ 可自定义图标、大小、位置
- ✅ 支持点击遮罩关闭
- ✅ 可选的手动关闭按钮
- ✅ 响应式设计
- ✅ TypeScript 支持

## 基本用法

```tsx
import OperationTipModal from '@/components/OperationTipModal/OperationTipModal';

// 基本使用
<OperationTipModal
  open={showModal}
  onClose={() => setShowModal(false)}
  message="操作成功！"
  type="success"
/>
```

## 高级用法

```tsx
// 自定义配置
<OperationTipModal
  open={showModal}
  onClose={() => setShowModal(false)}
  message="这是一个自定义的提示信息"
  type="warning"
  width={320}
  iconSize={96}
  autoClose={false}
  showCloseButton={true}
  position="top"
  clickOverlayToClose={false}
/>
```

## Props 说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `open` | `boolean` | - | 是否显示模态框（必需） |
| `onClose` | `() => void` | - | 关闭回调函数（必需） |
| `message` | `string` | - | 提示信息（必需） |
| `type` | `'success' \| 'error' \| 'info' \| 'warning' \| 'loading'` | `'success'` | 提示类型 |
| `width` | `number` | `280` | 模态框宽度（像素） |
| `iconSize` | `number` | `128` | 图标大小（像素） |
| `icon` | `string` | - | 自定义图标路径 |
| `theme` | `string` | - | 主题（预留，暂未使用） |
| `autoClose` | `boolean` | `true` | 是否自动关闭 |
| `autoCloseDelay` | `number` | `1500` | 自动关闭延迟（毫秒） |
| `clickOverlayToClose` | `boolean` | `true` | 是否允许点击遮罩关闭 |
| `showCloseButton` | `boolean` | `false` | 是否显示关闭按钮 |
| `position` | `'center' \| 'top' \| 'bottom'` | `'center'` | 模态框位置 |
| `className` | `string` | `''` | 自定义 CSS 类名 |

## 使用场景示例

### 1. 成功提示
```tsx
<OperationTipModal
  open={showSuccess}
  onClose={() => setShowSuccess(false)}
  message="保存成功！"
  type="success"
/>
```

### 2. 错误提示（不自动关闭）
```tsx
<OperationTipModal
  open={showError}
  onClose={() => setShowError(false)}
  message="操作失败，请重试"
  type="error"
  autoClose={false}
  showCloseButton={true}
/>
```

### 3. 加载提示
```tsx
<OperationTipModal
  open={isLoading}
  onClose={() => setIsLoading(false)}
  message="正在处理中..."
  type="loading"
  autoClose={false}
  clickOverlayToClose={false}
/>
```

### 4. 顶部提示
```tsx
<OperationTipModal
  open={showTopTip}
  onClose={() => setShowTopTip(false)}
  message="有新消息"
  type="info"
  position="top"
  width={200}
  iconSize={64}
/>
```

## 注意事项

1. **图标映射**：`error` 类型使用 `failure.png` 图标
2. **动画时长**：淡入动画 0.35s，淡出动画 0.5s
3. **z-index**：模态框层级为 9999
4. **响应式**：组件会自动适应不同屏幕尺寸
5. **无障碍**：关闭按钮包含 `aria-label` 属性

## 样式自定义

可以通过 `className` 属性传入自定义样式类：

```tsx
<OperationTipModal
  open={showModal}
  onClose={() => setShowModal(false)}
  message="自定义样式"
  className="my-custom-modal"
/>
```

然后在你的 CSS 中定义：

```css
.my-custom-modal {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: 2px solid #fff;
}
``` 