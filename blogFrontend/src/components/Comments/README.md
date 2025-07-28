# Comments 组件技术文档

## 1. 用途与功能概述

Comments 组件为文章详情页提供完整的评论系统，支持评论、回复、点赞、删除、登录校验、XSS 防护等功能。适用于博客、社区等需要用户互动的场景。

**设计思路与模块划分：**
- 采用“主评论-回复-递归渲染”结构，支持多级评论树，便于扩展和维护。
- 业务逻辑与 UI 交互解耦，表单、评论项、评论列表、全局提示等均为独立子组件。
- 权限、校验、安全、体验等均有专门处理，保证健壮性和用户友好。

**主要功能：**
- 支持多级评论与回复（递归渲染）
- 点赞、删除、登录校验
- 评论发布/删除/点赞异步处理与提示
- DOMPurify 防御 XSS 攻击
- 登录弹窗与全局提示弹窗

---

## 2. 主要 props/类型定义

```ts
interface CommentsProps {
  articleId: number;
  previewCommentsEnabled?: boolean;
}
```

- 通过 articleId 关联评论与文章，支持多文章复用
- 预览模式下可灵活控制评论区显示

---

## 3. 关键状态与交互逻辑

- comments：当前评论列表
- loading：评论加载/操作中
- error：错误提示
- replyingTo：当前正在回复的评论
- tipOpen/tipMessage/tipType：全局操作提示弹窗
- isLoggedIn：登录状态

```tsx
const [comments, setComments] = useState<Comment[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
const [tipOpen, setTipOpen] = useState(false);
const [tipMessage, setTipMessage] = useState('');
const [tipType, setTipType] = useState<'success' | 'error' | 'info' | 'warning'>('error');
const user = useAppSelector(state => state.auth.user);
const isLoggedIn = !!user;
```

- useEffect 加载评论：
```tsx
useEffect(() => {
  fetchComments();
}, [articleId]);
```

**业务流程说明：**
- 文章切换时自动加载对应评论，保证数据一致性
- 评论发布、删除、点赞、回复、登录弹窗、全局提示弹窗等均有独立的异步处理和状态管理
- 所有操作均有 loading 状态和全局提示，提升用户感知
- 未登录用户操作自动弹出登录弹窗，防止未授权操作

---

## 4. 主要子组件与结构

### 4.1 评论表单（CommentForm）
- **职责**：负责主评论和回复的内容输入、表单校验、emoji 选择、登录校验
- **交互流程**：
  1. 未登录时显示“请登录”提示和按钮
  2. 输入内容，支持 emoji 选择
  3. 校验非空，发布后自动清空/收起
- **设计权衡**：表单复用，主评论和回复共用一套逻辑，提升一致性

```tsx
<CommentForm
  onSubmit={handleSubmit}
  loading={loading}
  parentId={replyingTo?.id}
  onCancel={replyingTo ? () => setReplyingTo(null) : undefined}
  placeholder={replyingTo ? `回复 ${replyingTo.username}...` : undefined}
  isLoggedIn={isLoggedIn}
/>
```

### 4.2 单条评论（CommentItem）
- **职责**：展示单条评论内容、头像、用户名、时间、操作按钮（回复/点赞/删除），递归渲染 replies
- **交互流程**：
  1. 支持多级嵌套，递归渲染所有子回复
  2. 操作按钮根据权限和状态动态显示（如仅本人可见删除）
  3. 点赞/删除/回复均有独立处理逻辑
- **设计权衡**：递归渲染，保证多级评论结构清晰，便于扩展
- **安全说明**：内容渲染前用 DOMPurify.sanitize 过滤，防止 XSS

```tsx
<CommentItem
  comment={comment}
  onReply={onReply}
  onDelete={onDelete}
  onLike={onLike}
  isLiked={false}
  isOwner={user?.id === comment.userId}
  isLoggedIn={isLoggedIn}
  allComments={comments}
/>
```

### 4.3 评论列表（CommentList）
- **职责**：渲染所有评论，支持 loading/empty 状态
- **设计说明**：分离列表与单项，便于 loading/empty 管理和递归渲染

```tsx
<CommentList
  comments={comments}
  onDelete={handleDeleteComment}
  onLike={handleLike}
  loading={loading}
  onReply={handleReply}
  isLoggedIn={isLoggedIn}
/>
```

### 4.4 操作提示弹窗（OperationTipModal）
- **职责**：全局操作反馈，支持多种类型（成功/失败/警告/信息）
- **设计说明**：所有异步操作均有反馈，提升用户体验

```tsx
<OperationTipModal
  open={tipOpen}
  onClose={() => setTipOpen(false)}
  message={tipMessage}
  type={tipType}
/>
```

---

## 5. 安全与体验优化

- **XSS 防护**：评论内容渲染前用 DOMPurify.sanitize 过滤，防止恶意脚本注入
- **登录校验**：未登录用户操作自动弹出登录弹窗，防止未授权操作
- **异步 loading**：评论加载、发布、删除、点赞均有 loading 状态，防止重复提交
- **错误与成功提示**：所有操作均有全局弹窗反馈，提升用户感知
- **表单校验**：内容不能为空，按钮禁用，防止无效提交
- **递归渲染**：多级评论通过递归组件实现，结构清晰，便于维护

---

## 6. 主要知识点

- React useState/useEffect/useRef 管理业务状态
- 递归组件渲染多级评论
- Redux 全局用户/设置状态
- DOMPurify 防御 XSS
- 异步操作与全局提示弹窗
- 登录弹窗与权限校验
