// AI 多模型配置
export interface AIMessage {
  role: string;
  content: string;
}

export const AI_MODELS = [
  {
    key: 'deepseek',
    name: 'Deepseek',
    icon: '/images/deepseek.png',
    endpoint: process.env.NEXT_PUBLIC_DEEPSEEK_API_ENDPOINT || 'https://api.deepseek.com/v1/chat/completions',
    getHeaders: (apiKey: string) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    }),
    buildRequestBody: (
      messages: AIMessage[],
      systemPrompt: string,
      userInput: string
    ) => ({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
        { role: 'user', content: userInput }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      stream: true
    }),
    parseStream: (line: string) => {
      // Deepseek流式解析逻辑（可在AIChat.tsx中完善）
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return { done: true };
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || '';
          return { content };
        } catch {
          return {};
        }
      }
      return {};
    }
  },
  {
    key: 'ark',
    name: '豆包',
    icon: '/images/doubao.png',
    endpoint: process.env.NEXT_PUBLIC_ARK_API_ENDPOINT || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    getHeaders: (apiKey: string) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    }),
    buildRequestBody: (
      messages: AIMessage[],
      systemPrompt: string,
      userInput: string
    ) => ({
      model: 'doubao-seed-1-6-250615',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
        { role: 'user', content: userInput }
      ],
      stream: true
    }),
    parseStream: (line: string) => {
      // Ark/豆包流式解析逻辑
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return { done: true };
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || '';
          return { content };
        } catch {
          return {};
        }
      }
      return {};
    }
  }
]; 