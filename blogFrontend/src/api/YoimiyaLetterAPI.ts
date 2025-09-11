// 创建 YoimiyaLetterAPI.ts
import { AI_MODELS } from '@/config/aiModels';
import { generateYoimiyaLetterPrompt } from '@/config/YoimiyaLetter';

// 宵宫信件生成请求接口
export interface GenerateYoimiyaLetterRequest {
  title: string;
  content: string;
}

// 宵宫信件生成响应接口
export interface GenerateYoimiyaLetterResponse {
  success: boolean;
  data: {
    letterContent: string;
  };
  message: string;
}

export const YoimiyaLetterAPI = {
  /**
   * 生成宵宫信件内容
   * 使用Deepseek API，使用宵宫的温柔可爱风格
   */
  generateYoimiyaLetter: async (data: GenerateYoimiyaLetterRequest): Promise<GenerateYoimiyaLetterResponse> => {
    const deepseekModel = AI_MODELS.find(model => model.key === 'deepseek');
    if (!deepseekModel) {
      throw new Error('Deepseek模型配置未找到');
    }

    const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error('Deepseek API Key未配置');
    }

    const systemPrompt = generateYoimiyaLetterPrompt(data.title, data.content);

    try {
      const response = await fetch(deepseekModel.endpoint, {
        method: 'POST',
        headers: deepseekModel.getHeaders(apiKey),
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: '请生成宵宫风格的信件内容' }
          ],
          temperature: 0.8,
          max_tokens: 800,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Deepseek API请求失败: ${response.status}`);
      }

      const result = await response.json();
      const letterContent = result.choices?.[0]?.message?.content || '';

      return {
        success: true,
        data: { letterContent },
        message: '宵宫信件生成成功'
      };
    } catch (error) {
      return {
        success: false,
        data: { letterContent: '' },
        message: `宵宫信件生成失败: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  },
};