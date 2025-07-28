# AIChat 组件技术文档

## 1. 主要类型、状态定义

AIChat 组件围绕“会话-消息-输入”三大核心数据结构展开，采用 TypeScript 明确类型约束，所有状态均用 React Hooks 管理，保证数据流清晰、类型安全。

### 1.1 关键类型定义

- `Message`：定义单条消息的数据结构，包括 id、内容、类型（用户/AI）、时间戳。
- `CodeBlockProps`：用于 Markdown 代码块渲染的属性类型。

```ts
// 消息类型
export interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
}

// 代码块渲染属性
interface CodeBlockProps {
  className?: string;
  children?: React.ReactNode;
  inline?: boolean;
  [key: string]: any;
}
```

### 1.2 组件状态与引用

- `messages`：当前会话的消息列表。
- `input`：输入框内容。
- `isLoading`：AI回复进行中。
- `error`：错误提示。
- `streamingMessage`：流式输出中的AI消息。
- `showSessionList`：是否显示历史会话列表。
- `messagesEndRef`、`inputRef`、`messagesContainerRef`：用于滚动、输入框自适应等 DOM 操作。

```tsx
// 主要状态
const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [streamingMessage, setStreamingMessage] = useState<string>('');
const [showSessionList, setShowSessionList] = useState(false);

// 引用
const messagesEndRef = useRef<HTMLDivElement>(null);
const inputRef = useRef<HTMLTextAreaElement>(null);
const messagesContainerRef = useRef<HTMLDivElement>(null);
const isInitialMount = useRef(true);
```

### 1.3 关键副作用

组件通过 useEffect 实现副作用管理，包括消息同步、错误处理、自动滚动、输入框自适应等，提升用户体验和交互流畅性。

```tsx
// 同步 hook 消息到本地状态
useEffect(() => {
  if (hookMessages.length > 0) {
    setMessages(hookMessages);
  } else {
    setMessages([]);
  }
}, [hookMessages]);

// 处理 API 错误
useEffect(() => {
  if (apiError) {
    setError(apiError);
  }
}, [apiError]);

// 消息变化自动滚动到底部
useEffect(() => {
  if (messages.length > 0) {
    scrollToBottom();
  }
}, [messages]);

// 标记初次挂载
useEffect(() => {
  isInitialMount.current = false;
}, []);

// 输入框高度自适应
useEffect(() => {
  if (inputRef.current) {
    inputRef.current.style.height = 'auto';
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
  }
}, [input]);
```

---

## 2. 会话管理逻辑

AIChat 支持多会话管理，用户可新建对话、切换历史会话，所有会话和消息均与后端同步，保证数据持久化和多端一致。

### 2.1 新建会话

- 调用 `createNewSession` 创建新会话，清空本地消息，关闭会话列表。

```tsx
const handleNewChat = async () => {
  try {
    const newSession = await createNewSession();
    if (newSession) {
      setShowSessionList(false);
      setError(null);
      setMessages([]); // 清空本地消息
    }
  } catch (err) {
    setError('创建新会话失败');
  }
};
```

### 2.2 切换历史会话

- 选择历史会话时，调用 `selectSession`，自动同步消息和状态。

```tsx
const handleSelectSession = async (sessionId: number) => {
  try {
    await selectSession(sessionId);
    setShowSessionList(false);
    setError(null);
  } catch (err) {
    setError('选择会话失败');
  }
};
```

### 2.3 会话列表渲染

- 会话列表通过条件渲染显示，支持高亮当前会话、无历史会话时显示提示。

```tsx
{showSessionList && (
  <div className={styles.sessionList}>
    <div className={styles.sessionListHeader}>
      <h3>历史会话 ({sessions.length})</h3>
      <button
        className={styles.closeButton}
        onClick={() => setShowSessionList(false)}
      >✕</button>
    </div>
    <div className={styles.sessionItems}>
      {sessions.map(session => (
        <div
          key={session.id}
          className={`${styles.sessionItem} ${currentSession?.id === session.id ? styles.activeSession : ''}`}
          onClick={() => handleSelectSession(session.id)}
        >
          <div className={styles.sessionTitle}>{session.title}</div>
          <div className={styles.sessionTime}>{new Date(session.updatedAt).toLocaleDateString()}</div>
        </div>
      ))}
      {sessions.length === 0 && (
        <div className={styles.emptySessions}>暂无历史会话</div>
      )}
    </div>
  </div>
)}
```

---

## 3. 消息流与流式响应

AIChat 支持流式对话体验，用户消息和 AI 回复均实时渲染，AI 回复采用流式读取，边生成边展示，极大提升交互体验。

### 3.1 消息发送与流式读取

- 用户提交消息后，先保存到后端，再发起流式请求，边读边渲染 AI 回复，流结束后归档为正式消息。

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!input.trim() || isLoading) return;
  // ...（省略会话创建与标题更新）
  // 构造用户消息
  const userMessage: Message = {
    id: Date.now().toString(),
    content: input.trim(),
    type: 'user',
    timestamp: new Date(),
  };
  // 先保存用户消息到后端
  await saveMessage(userMessage);
  setMessages(prev => [...prev, userMessage]);
  setInput('');
  setIsLoading(true);
  setError(null);
  setStreamingMessage('');
  // 请求 deepseek 的流式接口
  const response = await fetch(apiEndpoint, { ... });
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let finalContent = '';
  while (true) {
    const { done, value: contentValue } = await reader.read();
    if (done) break;
    buffer += decoder.decode(contentValue, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') {
          // 流结束，归档为正式 AI 消息
          const finalMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: finalContent,
            type: 'ai',
            timestamp: new Date(),
          };
          await saveMessage(finalMessage);
          setMessages(prev => [...prev, finalMessage]);
          setStreamingMessage('');
          break;
        }
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0]?.delta?.content || '';
          if (content) {
            finalContent += content;
            setStreamingMessage(finalContent);
          }
        } catch (e) {
          // 解析异常
        }
      }
    }
  }
  setIsLoading(false);
};
```

### 3.2 消息渲染

- 消息列表通过 map 渲染，区分用户消息和 AI 消息，AI 消息支持 Markdown 格式化和代码高亮。
- 流式输出中的 AI 消息实时渲染，提升交互体验。

```tsx
{/* 渲染历史消息 */}
{messages.map((message, index) => (
  <motion.div
    key={message.id}
    className={message.type === 'user' ? styles.userMessageContainer : styles.aiMessageContainer}
    // ...动画属性省略
  >
    <motion.div
      className={`${styles.message} ${message.type === 'user' ? styles.userMessage : styles.aiMessage}`}
    >
      <div className={styles.messageContent}>
        {message.type === 'ai' ? (
          renderMarkdown(message.content)
        ) : (
          message.content
        )}
      </div>
    </motion.div>
    <motion.div className={styles.messageTime}>
      {message.timestamp.toLocaleTimeString()}
    </motion.div>
  </motion.div>
))}

{/* 流式输出中的消息实时渲染 */}
{isLoading && streamingMessage && (
  <motion.div className={styles.aiMessageContainer}>
    <motion.div className={`${styles.message} ${styles.aiMessage}`}>
      <div className={styles.messageContent}>
        {renderMarkdown(streamingMessage)}
      </div>
    </motion.div>
  </motion.div>
)}
```

---

## 4. 主要知识点

- TypeScript 类型系统、接口定义
- React Hooks（useState/useRef/useEffect）
- 受控组件、流式数据处理
- 会话管理与状态同步
- 流式响应与异步处理
- 条件渲染与动画（framer-motion）
- Markdown/代码高亮渲染

---

## 5. 示例

```tsx
<AIChat />
``` 