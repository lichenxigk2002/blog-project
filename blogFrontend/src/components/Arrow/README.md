# Arrow 组件技术文档

## 1. 组件用途

Arrow 组件用于页面底部的引导提示，展示两行智慧语录，并配有一个下箭头图标。点击箭头可触发自定义 onClick 事件或默认平滑滚动，常用于首页、分区切换等场景，提升用户引导体验。

---

## 2. Props 类型定义

组件通过 props 接收两行文案和点击事件回调，类型定义如下：

```ts
interface WisdomProps {
  text1: string; // 第一行文案
  text2: string; // 第二行文案
  onClick?: () => void; // 可选，点击箭头时的回调
}
```

---

## 3. 关键状态与交互逻辑

- 组件内部通过 useRef 获取底部 DOM 元素，实现默认滚动行为。
- handleClick 支持自定义 onClick 或默认滚动。

```tsx
const wisdomRef = useRef<HTMLDivElement>(null);

const handleClick = () => {
  if (onClick) {
    onClick();
  } else {
    // 默认滚动到组件底部
    if (wisdomRef.current) {
      const wisdomBottom = wisdomRef.current.offsetTop + wisdomRef.current.offsetHeight;
      window.scrollTo({
        top: wisdomBottom,
        behavior: 'smooth'
      });
    }
  }
};
```

---

## 4. 主要渲染结构

- 组件结构简洁，包含两行文案和一个下箭头图标。
- 下箭头使用 react-icons 的 FaChevronDown，支持点击。

```tsx
return (
  <div ref={wisdomRef} className={styles.showBottom}>
    <p className={styles.wisdom1}>{text1}</p>
    <p className={styles.wisdom2}>{text2}</p>
    <p>
      <FaChevronDown style={{color:'var(--text)'}} onClick={handleClick}/>
    </p>
  </div>
);
```

---

## 5. 关键样式与动画

- 采用 SCSS 模块化，支持变量、嵌套、动画。
- 下箭头有浮动动画，提升引导感。

```scss
// 关键样式片段
.wisdom1 {
  font-family: 'YouYuan', serif;
  color: var(--text);
}

.wisdom2 {
  font-family: 'AgencyFB', serif;
  color: var(--text);
}

.Arrow {
  width: 20px;
  height: 20px;
  animation: float 2s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.showBottom {
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

---

## 6. 主要知识点

- TypeScript 类型定义与 props 约束
- React useRef 获取 DOM
- 条件回调与默认行为
- 受控动画与交互
- SCSS 模块化、变量、动画
- 响应式与可访问性设计

---

## 7. 示例

```tsx
<Arrow text1="钥在锁先，行胜于言" text2="Prepare the solution before the problem; action speaks louder." />
``` 