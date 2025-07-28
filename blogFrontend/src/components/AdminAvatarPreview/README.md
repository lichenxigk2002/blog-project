# AdminAvatarPreview 组件技术文档

## 1. 组件用途

`AdminAvatarPreview` 用于在页面中展示管理员头像，并通过头像旁的状态点实时反映管理员是否在线（或入口是否开放）。常用于后台入口、导航栏等位置，提升用户体验和可用性。

---

## 2. Props 说明

```ts
// props 类型定义
interface AdminAvatarPreviewProps {
    showAdminLoginEntry: boolean; // 是否显示管理员在线（绿色）或离线（红色）状态
}
```
- `showAdminLoginEntry`：控制头像旁状态点的颜色和提示文案。

---

## 3. 组件结构与渲染逻辑

核心 JSX 结构如下：

```tsx
const AdminAvatarPreview: React.FC<AdminAvatarPreviewProps> = ({ showAdminLoginEntry }) => (
    <div className={styles.avatarContainer}>
        <Image
            src="/images/avatar_20250520_215057.png"
            alt="管理员入口"
            className={styles.avatar}
            width={40}
            height={40}
            priority
            placeholder="blur"
            blurDataURL="/images/avatar_blur.png"
            title={showAdminLoginEntry ? '孤芳不自赏在线哦' : '孤芳不自赏离开了~'}
        />
        <span
            className={styles.onlineDot}
            style={{ background: showAdminLoginEntry ? '#4eff56' : '#ff4646' }}
        />
    </div>
);
```
- 头像图片使用 Next.js 的 `Image` 组件，具备图片懒加载、优先加载、模糊占位等优化特性。
- 头像右下角的圆点（`.onlineDot`）根据 `showAdminLoginEntry` 状态切换颜色：
  - 在线（true）：绿色 `#4eff56`
  - 离线（false）：红色 `#ff4646`
- 鼠标悬浮头像有缩放动画，提升交互体验。
- 头像图片和状态点均通过 SCSS 模块化样式隔离，保证样式独立。

---

## 4. 关键样式与布局

部分 SCSS 代码片段如下：

```scss
.avatarContainer {
  position: relative;
  width: 40px;
  height: 40px;
  display: inline-block;
}

.avatar {
  margin: auto;
  width: 40px;
  height: 40px;
  border-radius: 30%;
  object-fit: cover;
  border: 2px solid var(--border);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.1);
  }
}

.onlineDot {
  position: absolute;
  right: -7px;
  bottom: -5px;
  width: 10px;
  height: 10px;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
  z-index: 2;
}
```
- 头像容器 `.avatarContainer` 采用 `position: relative`，便于状态点绝对定位。
- 头像 `.avatar` 使用 `border-radius` 实现圆角，`object-fit: cover` 保证图片不变形。
- 状态点 `.onlineDot` 绝对定位于头像右下角，带白色描边和阴影，提升可见性。
- 响应式适配：宽高固定 40px，适合导航栏、卡片等多种场景。

---

## 5. 主要知识点

- **TypeScript 类型定义**：props 明确类型约束，提升代码可维护性。
- **React 函数组件**：采用函数式声明，props 解构，简洁高效。
- **条件渲染**：根据 `showAdminLoginEntry` 动态切换状态点颜色和图片 title。
- **Next.js Image 优化**：支持图片懒加载、优先加载、模糊占位符，提升首屏体验。
- **SCSS 模块化**：变量、嵌套、过渡动画、box-shadow 等现代 CSS3 技巧，样式隔离防止污染。
- **响应式与交互动画**：hover 缩放、阴影、圆角等提升视觉和交互体验。

---

## 6. 示例

```tsx
<AdminAvatarPreview showAdminLoginEntry={true} />
``` 