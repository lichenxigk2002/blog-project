# AdminLogin 组件技术文档

## 1. 组件用途

`AdminLogin` 组件用于实现后台管理员登录弹窗，支持账号密码登录、错误提示、登录中状态反馈等功能。常用于后台入口的权限校验和安全登录场景。

---

## 2. 主要状态与交互

核心状态定义：

```tsx
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');
const { showAdminLogin, setShowAdminLogin } = useContext(LoginModalContext);
```
- `username`、`password`：受控表单输入，分别绑定用户名和密码。
- `isLoading`：登录请求进行中时为 true，按钮禁用并显示 loading 动画。
- `error`：登录失败时显示错误提示。
- `showAdminLogin`：通过 `LoginModalContext` 控制弹窗显示/隐藏。

---

## 3. 关键渲染逻辑与流程

表单受控与登录流程核心代码：

```tsx
<form onSubmit={handleSubmit} className={styles.form}>
  <div className={styles.inputGroup}>
    <label className={styles.label}>用户名</label>
    <input
      type="text"
      value={username}
      onChange={e => setUsername(e.target.value)}
      className={styles.input}
      disabled={isLoading}
    />
  </div>
  <div className={styles.inputGroup}>
    <label className={styles.label}>密码</label>
    <input
      type="password"
      value={password}
      onChange={e => setPassword(e.target.value)}
      className={styles.input}
      disabled={isLoading}
    />
  </div>
  {error && <div className={styles.error}>{error}</div>}
  <div className={styles.buttonGroup}>
    <button
      type="submit"
      className={`${styles.button} ${styles.loginButton} ${isLoading ? styles.loading : ''}`}
      disabled={isLoading}
    >
      登录
    </button>
    <button
      type="button"
      onClick={() => setShowAdminLogin(false)}
      className={`${styles.button} ${styles.cancelButton}`}
      disabled={isLoading}
    >
      取消
    </button>
  </div>
</form>
```

登录处理流程：

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);
  try {
    const resultAction = await dispatch(adminLogin({ username, password }));
    if (adminLogin.fulfilled.match(resultAction)) {
      setShowAdminLogin(false);
      router.push('/admin');
    } else if (adminLogin.rejected.match(resultAction)) {
      setError(resultAction.payload || '登录失败，请检查账号密码');
    }
  } catch (error: any) {
    setError(error.message || '登录失败，请重试');
  } finally {
    setIsLoading(false);
  }
};
```

---

## 4. 关键样式与布局

部分 SCSS 代码片段如下：

```scss
.loginCard {
  position: relative;
  width: 320px;
  padding: 1.5rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  z-index: 10000;
  animation: slideUp 0.3s ease;
}

.input {
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  color: var(--text);
  font-size: 0.875rem;
  width: 100%;
  transition: all 0.2s ease;
}

.buttonGroup {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.loginButton {
  background: var(--primary-color);
  color: var(--text);
  &:hover {
    background: var(--primary-color-dark);
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
}
```
- 弹窗和卡片采用 SCSS 模块化样式，带有淡入、上滑等动画效果。
- 响应式适配移动端，宽度自适应。

---

## 5. 主要知识点

- **React 函数组件与 Hooks**：`useState` 管理表单和 loading 状态，`useContext` 控制弹窗显示。
- **Redux Toolkit**：通过 `useAppDispatch` 和 `adminLogin` 实现异步登录。
- **受控表单**：输入框 value/onChange 受控，保证数据同步。
- **条件渲染**：弹窗显示/隐藏、错误提示、按钮 loading 状态等均为条件渲染。
- **SCSS 模块化**：变量、嵌套、动画、响应式等现代 CSS3 技巧，样式隔离。
- **动画与交互**：弹窗淡入、卡片上滑、按钮 hover/disabled/loading 动画，提升用户体验。
- **响应式设计**：移动端宽度自适应，适配多端场景。

---

## 6. 示例

```tsx
<AdminLogin />
// 由上层通过 LoginModalContext 控制显示/隐藏
``` 