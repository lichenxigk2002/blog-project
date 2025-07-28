 # EmojiPicker 组件技术文档

## 1. 组件用途

`EmojiPicker` 是一个弹出式表情选择器，支持动态加载 emoji-mart 资源，适用于评论、聊天、输入框等场景下的表情插入。支持点击外部区域自动关闭，样式美观，兼容多端。

---

## 2. 主要 Props/类型定义

```ts
interface EmojiPickerProps {
  onSelect: (emoji: string) => void; // 选中表情后的回调
  onClose: () => void;               // 关闭选择器的回调
}
```
- `onSelect`：用户选择表情时触发，参数为表情字符。
- `onClose`：点击弹窗外部或需要关闭时触发。

---

## 3. 关键渲染与逻辑

### 3.1 动态加载 emoji-mart

- 组件挂载时，使用 `import()` 动态加载 `@emoji-mart/react` 和 `@emoji-mart/data`，实现首屏优化和包体积减小。

```tsx
useEffect(() => {
  let mounted = true;
  Promise.all([
    import('@emoji-mart/react').then(mod => mod.default),
    import('@emoji-mart/data').then(mod => mod.default),
  ]).then(([PickerComp, emojiData]) => {
    if (mounted) {
      setPicker(() => PickerComp);
      setData(emojiData);
    }
  });
  return () => { mounted = false; };
}, []);
```

### 3.2 外部点击自动关闭

- 监听 `mousedown` 事件，若点击发生在弹窗外部，则自动调用 `onClose` 关闭选择器。

```tsx
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
      onClose();
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [onClose]);
```

### 3.3 表情选择与渲染

- 加载完成后渲染 emoji-mart 的 Picker 组件，选择表情时调用 `onSelect`，并可自定义主题、样式等。

```tsx
if (!Picker || !data) return null; // 可显示 loading

return (
  <div className={styles.emojiPickerContainer} ref={pickerRef}>
    <Picker
      data={data}
      theme="light"
      onEmojiSelect={(emoji: any) => onSelect(emoji.native)}
      previewPosition="none"
      skinTonePosition="search"
      style={{ width: 350, height: 400 }}
    />
  </div>
);
```

---

## 4. 关键样式与布局

- 组件采用 SCSS 模块化，支持自定义弹窗、滚动条、按钮等样式，兼容 emoji-mart 默认样式并做主题覆盖。
- 主要样式片段：

```scss
.emojiPickerContainer {
  position: absolute;
  z-index: 1000;
  margin-top: 5px;
  right: 0;
  // ...覆盖 emoji-mart 主题样式
}

.emojiPicker {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 10px;
  width: 320px;
  max-height: 300px;
  overflow-y: auto;
}
```
- 支持自定义滚动条、按钮 hover/active 效果、弹窗圆角阴影等。

---

## 5. 主要知识点

- **React Hooks**：`useState`、`useRef`、`useEffect` 管理状态、引用和副作用。
- **动态 import**：按需加载 emoji-mart 组件和数据，优化性能。
- **受控弹窗**：外部点击关闭、回调传递。
- **第三方组件集成**：emoji-mart 的二次封装与样式覆盖。
- **SCSS 模块化**：变量、嵌套、主题覆盖、滚动条美化。

---

## 6. 示例

```tsx
<EmojiPicker
  onSelect={emoji => setInput(input + emoji)}
  onClose={() => setShowEmojiPicker(false)}
/>
```
