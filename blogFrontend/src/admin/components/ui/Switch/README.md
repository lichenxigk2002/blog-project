# Switch 组件

一个可复用的开关组件，支持不同尺寸和禁用状态。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| checked | boolean | - | 开关状态 |
| onChange | (checked: boolean) => void | - | 状态改变回调 |
| disabled | boolean | false | 是否禁用 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 开关尺寸 |
| className | string | '' | 自定义样式类名 |

## 使用示例

```tsx
import Switch from '../ui/Switch/Switch';

<Switch
  checked={isEnabled}
  onChange={setIsEnabled}
  size="medium"
/>
```

## 尺寸说明

- `small`: 32x16px
- `medium`: 44x22px  
- `large`: 56x28px 