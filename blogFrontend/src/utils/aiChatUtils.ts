import { Message } from '@/types/AIChat';
import { AiChatMessage } from '@/types/AIChat';

/**
 * 将后端消息格式转换为前端消息格式
 */
export const convertBackendMessageToFrontend = (backendMessage: AiChatMessage): Message => {
    return {
        id: backendMessage.id.toString(),
        content: backendMessage.content,
        type: backendMessage.role === 'user' ? 'user' : 'ai',
        timestamp: new Date(backendMessage.createdAt)
    };
};

/**
 * 将前端消息格式转换为后端消息格式
 */
export const convertFrontendMessageToBackend = (
    frontendMessage: Message,
    sessionId: number
): { sessionId: number; role: 'user' | 'assistant'; content: string } =>
{
    return {
        sessionId,
        role: frontendMessage.type === 'user' ? 'user' : 'assistant',
        content: frontendMessage.content
    };
};

/**
 * 批量转换后端消息为前端消息
 */
export const convertBackendMessagesToFrontend = (backendMessages: AiChatMessage[]): Message[] => {
    return backendMessages.map(convertBackendMessageToFrontend);
};

/**
 * 批量转换前端消息为后端消息
 */
export const convertFrontendMessagesToBackend = (
    frontendMessages: Message[],
    sessionId: number
): { sessionId: number; role: 'user' | 'assistant'; content: string }[] => {
    return frontendMessages.map(msg => convertFrontendMessageToBackend(msg, sessionId));
};

/**
 * 生成会话标题（基于第一条用户消息）
 */
export const generateSessionTitle = (firstUserMessage: string): string => {
    if (!firstUserMessage) return '新对话';

    // 取前20个字符作为标题，如果超过则加省略号
    const title = firstUserMessage.trim();
    if (title.length <= 20) {
        return title;
    }
    return title.substring(0, 20) + '...';
};

/**
 * 格式化时间显示
 */
export const formatMessageTime = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();

    // 小于1分钟
    if (diff < 60000) {
        return '刚刚';
    }

    // 小于1小时
    if (diff < 3600000) {
        return `${Math.floor(diff / 60000)}分钟前`;
    }

    // 小于24小时
    if (diff < 86400000) {
        return `${Math.floor(diff / 3600000)}小时前`;
    }

    // 超过24小时，显示具体日期
    return timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
};