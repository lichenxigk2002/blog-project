# OperationTipModal 组件技术文档

## 1. 组件用途与功能

OperationTipModal 是一个通用的操作提示模态框组件，支持多种提示类型（成功、错误、信息、警告、加载），具备自动关闭、动画、响应式、可自定义图标和样式等特性，适用于全局操作反馈、表单提交、异步处理等场景。

---

## 2. 主要 props/类型定义

组件 props 类型定义如下，支持丰富的自定义能力：

```ts
interface OperationTipModalProps {
  open: boolean; // 是否显示模态框
  onClose: () => void; // 关闭回调
  message: string; // 提示信息
  type?: 'success' | 'error' | 'info' | 'warning' | 'loading';
  width?: number;
  iconSize?: number;
  icon?: string;
  theme?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
  clickOverlayToClose?: boolean;
  showCloseButton?: boolean;
  position?: 'center' | 'top' | 'bottom';
  className?: string;
}
```

---

## 3. 关键状态与交互逻辑

- 组件内部通过 useState 管理显示/离开动画状态。
- 支持自动关闭（autoClose），可配置延迟时间。
- 支持点击遮罩关闭（clickOverlayToClose）和手动关闭按钮（showCloseButton）。
- 动画分为淡入（fadeInUp）和淡出（fadeOutDown），离开动画结束后自动卸载。

```tsx
const [show, setShow] = useState(open);
const [leaving, setLeaving] = useState(false);
const leaveTimer = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  if (open) {
    setShow(true);
    setLeaving(false);
    if (autoClose) {
      leaveTimer.current = setTimeout(() => {
        setLeaving(true);
        setTimeout(() => {
          setShow(false);
          setLeaving(false);
          onClose();
        }, 500); // 离开动画时长
      }, autoCloseDelay);
    }
  } else if (show) {
    setLeaving(true);
    leaveTimer.current = setTimeout(() => {
      setShow(false);
      setLeaving(false);
    }, 350); // 动画时长
  }
  return () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  };
}, [open, autoClose, autoCloseDelay, onClose, show]);

const handleOverlayClick = () => {
  if (!leaving && clickOverlayToClose) {
    onClose();
  }
};
```

---

## 4. 主要渲染结构

- 组件由遮罩层（overlay）和内容卡片（card）组成。
- 支持自定义图标、宽度、位置、关闭按钮。

```tsx
if (!show) return null;

return (
  <div className={styles.overlay} onClick={handleOverlayClick}>
    <div
      className={cardClassName}
      style={{ width }}
      onClick={handleCardClick}
    >
      <Image
        src={icon || iconMap[type] || iconMap.success}
        alt={type}
        className={styles.icon}
        width={iconSize}
        height={iconSize}
        priority
        quality={60}
        placeholder="blur"
        blurDataURL="/images/placeholder.png"
      />
      <div className={styles.message}>{message}</div>
      {showCloseButton && (
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="关闭"
        >
          ×
        </button>
      )}
    </div>
  </div>
);
```

---

## 5. 关键样式与动画

- 使用 SCSS 模块化，支持毛玻璃、圆角、阴影、响应式。
- 动画分为淡入（fadeInUp）和淡出（fadeOutDown），z-index 9999，适配多种位置。

```scss
.overlay {
  position: fixed;
  z-index: 9999;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(1.25rem);
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(162, 89, 255, 0.12), 0 1.5px 6px rgba(0, 0, 0, 0.06);
  padding: 32px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 180px;
  position: relative;
  animation: fadeInUp 0.35s cubic-bezier(.23, 1.01, .32, 1) both;
}

.card-leave {
  animation: fadeOutDown 1s cubic-bezier(.23, 1.01, .32, 1) both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(32px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOutDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(32px);
  }
}
```

---

## 6. 主要知识点

- TypeScript 类型定义与 props 约束
- React useState/useEffect/useRef 状态与副作用管理
- 条件渲染与动画控制
- 遮罩点击、关闭按钮、自动关闭等交互
- SCSS 模块化、毛玻璃、动画、响应式
- 可访问性（aria-label）、自定义样式扩展

---

## 7. 示例

```tsx
<OperationTipModal
  open={showModal}
  onClose={() => setShowModal(false)}
  message="操作成功！"
  type="success"
/>
``` 