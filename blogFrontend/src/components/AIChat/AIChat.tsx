import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import styles from './AIChat.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import { generateSystemPrompt } from '@/config/aiAssistant';
import { useAIChat } from '@/hooks/useAIChat';
import { useAuth } from '@/hooks/useAuth';
import { Message } from '@/types/AIChat';
import { AIChatAPI } from '@/api/AIChatAPI';
import OperationTipModal from '@/components/OperationTipModal/OperationTipModal';
import AIChatCodeBlock from '@/components/Code/AIChatCodeBlock';
import { AI_MODELS, AIMessage } from '@/config/aiModels';


// 代码块渲染属性定义
interface CodeBlockProps {
  className?: string;
  children?: React.ReactNode;
  inline?: boolean;
  [key: string]: any;
}

const AIChat: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || 1; // 默认用户ID，实际应该从登录状态获取
  // 使用AI聊天Hook
  const {
    sessions,
    currentSession,
    messages: hookMessages,
    isLoading: isApiLoading,
    error: apiError,
    createNewSession,
    selectSession,
    saveMessage,
    saveMessagesBatch
  } = useAIChat({ userId });
  // 本地状态

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [showSessionList, setShowSessionList] = useState(false);
  const [selectedModelKey, setSelectedModelKey] = useState('deepseek');
  const currentModel = AI_MODELS.find(m => m.key === selectedModelKey) || AI_MODELS[0];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tipModal, setTipModal] = useState({
    open: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info' | 'warning' | 'loading'
  });

  // 各种 ref 用于滚动、输入框自适应等
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // 动态获取API Key
  let apiKey = '';
  if (currentModel.key === 'ark') {
    apiKey = process.env.NEXT_PUBLIC_ARK_API_KEY || '';
  } else if (currentModel.key === 'deepseek') {
    apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || '';
  }

  // 同步Hook中的消息到本地状态
  useEffect(() => {
    if (hookMessages.length > 0) {
      setMessages(hookMessages);
    } else {
      setMessages([]);
    }
  }, [hookMessages]);

  // 处理API错误
  useEffect(() => {
    if (apiError) {
      setError(apiError);
    }
  }, [apiError]);

  // 滚动到底部，保证用户看到最新消息
  const scrollToBottom = () => {
    if (messagesContainerRef.current && !isInitialMount.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  // 每次消息变化自动滚动到底部
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

  // 创建新会话
  const handleNewChat = async () => {
    if (
        !currentSession ||
        (!currentSession.title || currentSession.title === '新对话') && messages.length === 0
    ) {
      setTipModal({
        open: true,
        message: '已经是新对话，无需重复创建',
        type: 'info'
      });
      return;
    }

    try {
      const newSession = await createNewSession();
      if (newSession) {
        setShowSessionList(false);
        setError(null);
        setMessages([]); // 清空本地消息
      }
    } catch (err) {
      setTipModal({
        open: true,
        message: '创建新会话失败，请稍后再试',
        type: 'error'
      });
    }
  };

  // 选择历史会话
  const handleSelectSession = async (sessionId: number) => {
    try {
      await selectSession(sessionId);
      setShowSessionList(false);
      setError(null);
    } catch (err) {
      setError('选择会话失败');
    }
  };

  // 处理消息发送和流式响应
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    let newSessionId: number | null = null;
    // 如果没有当前会话，先创建一个
    if (!currentSession) {
      const newSession = await createNewSession();
      if (!newSession) {
        setError('创建会话失败');
        return;
      }
      newSessionId = newSession.id;
      // 这里 currentSession 还没更新，等 selectSession 后再更新标题
      const title = input.trim().slice(0, 10) || '新对话';
      try {
        await AIChatAPI.updateSessionTitle(newSession.id, { title });
        // 更新后立即获取最新会话信息并刷新
        if (typeof selectSession === 'function') {
          await selectSession(newSession.id);
        }
      } catch (err) {
        // 标题更新失败不影响主流程
        console.error('更新会话标题失败:', err);
      }
    }

    // 构造用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      type: 'user',
      timestamp: new Date(),
    };

    // 先保存用户消息到后端
    try {
      await saveMessage(userMessage);
    } catch (err) {
      console.error('保存用户消息失败:', err);
      // 继续执行，不阻塞对话流程
    }

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    setStreamingMessage('');

    // 动态组装请求体
    const systemPrompt = generateSystemPrompt();
    const aiMessages: AIMessage[] = messages.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
    const responseBody = currentModel.buildRequestBody(aiMessages, systemPrompt, userMessage.content);

    try {
      // 请求当前模型的流式接口
      const response = await fetch(currentModel.endpoint, {
        method: 'POST',
        headers: currentModel.getHeaders(apiKey),
        body: JSON.stringify(responseBody)
      });

      if (!response || !response.ok) {
        const status = response?.status || 'unknown';
        const errorText = await response?.text().catch(() => '无法读取错误详情');
        console.error('API请求失败:', {
          status,
          errorText,
          endpoint: currentModel.endpoint,
          hasApiKey: !!apiKey
        });
        throw new Error(`API请求失败 (${status}): ${errorText}`);
      }

      // 读取流式响应
      const reader = response.body?.getReader(); //响应体是ReadableStream
      const decoder = new TextDecoder();
      let buffer = '';
      let finalContent = '';

      if (!reader) {
        throw new Error('No reader available');
      }

      while (true) {
        const { done, value: contentValue } = await reader.read();
        if (done) break;

        buffer += decoder.decode(contentValue, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const parsed = currentModel.parseStream(line);
          if (parsed?.done) {
            // 流结束，归档为正式 AI 消息
            const finalMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: finalContent
                .replace(/\r\n/g, '\n')
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .join('\n'),
              type: 'ai',
              timestamp: new Date(),
            };
            // 保存AI回复到后端
            try {
              await saveMessage(finalMessage);
            } catch (err) {
              console.error('保存AI消息失败:', err);
            }
            setMessages(prev => [...prev, finalMessage]);
            setStreamingMessage('');
            break;
          }
          if (parsed?.content) {
            finalContent += parsed.content;
            setStreamingMessage(finalContent
              .replace(/\r\n/g, '\n')
              .split('\n')
              .map(line => line.trim())
              .filter(line => line.length > 0)
              .join('\n'));
          }
        }
      }
    } catch (error) {
      console.error('AI response error:', error);
      setError('发生错误，请稍后再试');
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '抱歉，发生了一些错误。请稍后再试。',
        type: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理回车发送、Shift+Enter 换行
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // 渲染 markdown 内容，支持代码高亮
  const renderMarkdown = (content: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, inline, ...props }: CodeBlockProps) {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : 'text';
            if (inline|| !lang || lang === 'text') {
              return (
                <code
                  style={{
                    background: 'rgba(247,248,250,0.11)',
                    borderRadius: '4px',
                    padding: '0.1em 0.4em',
                    fontSize: '0.92em',
                    color: 'var(--text-color)',
                  }}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <AIChatCodeBlock language={lang} value={Array.isArray(children) ? children.join('') : String(children)} />
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  // @ts-ignore
  return (
    <div className={styles.chatContainer}>

      {/* 会话管理头部 */}
      <div className={styles.chatHeader}>
        <div className={styles.sessionInfo}>
          <span className={styles.currentSessionTitle}>
            {currentSession?.title || '新对话'}
          </span>
          {currentSession && (
            <span className={styles.sessionTime}>
              {new Date(currentSession.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className={styles.sessionActions}>
          <button
            className={styles.sessionButton}
            onClick={() => setShowSessionList(!showSessionList)}
            title="历史会话"
          >
            🕙
          </button>
          <button
            className={styles.sessionButton}
            onClick={handleNewChat}
            title="新对话"
          >
            🌟
          </button>
        </div>
      </div>

      {/* 会话列表 */}
      {showSessionList && (
        <div className={styles.sessionList}>
          <div className={styles.sessionListHeader}>
            <h3>历史会话 ({sessions.length})</h3>
            <button
              className={styles.closeButton}
              onClick={() => setShowSessionList(false)}
            >
              ✕
            </button>
          </div>
          <div className={styles.sessionItems}>
            {sessions.map(session => (
              <div
                key={session.id}
                className={`${styles.sessionItem} ${currentSession?.id === session.id ? styles.activeSession : ''
                  }`}
                onClick={() => handleSelectSession(session.id)}
              >
                <div className={styles.sessionTitle}>{session.title}</div>
                <div className={styles.sessionTime}>
                  {new Date(session.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className={styles.emptySessions}>
                暂无历史会话
              </div>
            )}
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {/* 消息列表区域，支持动画 */}
      <motion.div
        className={styles.messagesContainer}
        ref={messagesContainerRef}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.1
            }
          }
        }}
      >
        {/* 欢迎语 */}
        {messages.length === 0 && (
          <motion.div
            className={styles.welcomeMessage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <span>你好！欢迎来到孤芳不自赏的博客，我是小熙，有什么不懂的可以问我！</span>😊
          </motion.div>
        )}

        {/* 渲染历史消息 */}
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1
            }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className={message.type === 'user' ? styles.userMessageContainer : styles.aiMessageContainer}
          >
            <motion.div
              className={`${styles.message} ${message.type === 'user' ? styles.userMessage : styles.aiMessage}`}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.messageContent}>
                {message.type === 'ai' ? (
                  renderMarkdown(message.content)
                ) : (
                  message.content
                )}
              </div>
            </motion.div>
            <motion.div
              className={styles.messageTime}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {message.timestamp.toLocaleTimeString()}
            </motion.div>
          </motion.div>
        ))}

        {/* 流式输出中的消息实时渲染 */}
        {isLoading && streamingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.aiMessageContainer}
          >
            <motion.div
              className={`${styles.message} ${styles.aiMessage}`}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.messageContent}>
                {renderMarkdown(streamingMessage)}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* AI 正在思考时的 loading 动画 */}
        {isLoading && !streamingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${styles.message} ${styles.aiMessage}`}
          >
            <div className={styles.loadingDots}>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >.</motion.span>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              >.</motion.span>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
              >.</motion.span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </motion.div>
      {/* 模型切换下拉框 */}
      <div className={styles.modelSelectorCustom}>
        <div
            className={styles.modelSelectorSelected}
            onClick={() => setDropdownOpen(v => !v)}
            tabIndex={0}
            onBlur={() => setDropdownOpen(false)}
        >
          <img className={styles.modelIcon} src={currentModel.icon} alt={currentModel.name} />
          <span>{currentModel.name}</span>
        </div>
        <AnimatePresence>
          {dropdownOpen && (
              <motion.div
                  className={styles.modelSelectorDropdown}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
              >
                {AI_MODELS.map(model => (
                    <div
                        key={model.key}
                        className={`${styles.modelSelectorOption} ${selectedModelKey === model.key ? styles.selected : ''}`}
                        onClick={() => {
                          setSelectedModelKey(model.key);
                          setDropdownOpen(false);
                        }}
                    >
                      <img className={styles.modelIcon} src={model.icon} alt={model.name} />
                      <span>{model.name}</span>
                    </div>
                ))}
              </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* 输入区域 */}
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="快告诉我你的疑惑吧~😁 (按 Enter 发送，Shift + Enter 换行)"
          className={styles.input}
          disabled={isLoading || isApiLoading}
          rows={1}
        />
        <button type="submit" className={styles.sendButton} disabled={isLoading || isApiLoading}>
          发送
        </button>
      </form>
      <OperationTipModal
          open={tipModal.open}
          onClose={() => setTipModal(prev => ({ ...prev, open: false }))}
          message={tipModal.message}
          type={tipModal.type}
      />
    </div>
  );
};

export default AIChat;