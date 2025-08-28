import { AI_MODELS } from '@/config/aiModels';
import { generateTaobaoSummaryPrompt, generateAISummaryPrompt } from '@/config/AISummary';

// 摘要生成请求接口
export interface GenerateSummaryRequest {
  title: string;
  content: string;
}

// 摘要生成响应接口
export interface GenerateSummaryResponse {
  success: boolean;
  data: {
    summary: string;
  };
  message: string;
}

export const AIArticleSummaryAPI = {
  /**
   * 生成桃宝风格摘要
   * 直接发送给Deepseek API，使用胡桃的俏皮可爱风格
   */
  generateTaobaoSummary: async (data: GenerateSummaryRequest): Promise<GenerateSummaryResponse> => {
    const deepseekModel = AI_MODELS.find(model => model.key === 'deepseek');
    if (!deepseekModel) {
      throw new Error('Deepseek模型配置未找到');
    }

    const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error('Deepseek API Key未配置');
    }

    const systemPrompt = generateTaobaoSummaryPrompt(data.title, data.content);

    try {
      const response = await fetch(deepseekModel.endpoint, {
        method: 'POST',
        headers: deepseekModel.getHeaders(apiKey),
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: '请生成胡桃风格的活泼可爱摘要' }
          ],
          temperature: 0.8,
          max_tokens: 500,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Deepseek API请求失败: ${response.status}`);
      }

      const result = await response.json();
      const summary = result.choices?.[0]?.message?.content || '';

      return {
        success: true,
        data: { summary },
        message: '桃宝风格摘要生成成功'
      };
    } catch (error) {
      return {
        success: false,
        data: { summary: '' },
        message: `桃宝风格摘要生成失败: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  },

  /**
   * 生成标准AI摘要
   * 直接发送给豆包大模型，使用专业客观的风格
   */
  generateAISummary: async (data: GenerateSummaryRequest): Promise<GenerateSummaryResponse> => {
    const doubaoModel = AI_MODELS.find(model => model.key === 'ark');
    if (!doubaoModel) {
      throw new Error('豆包模型配置未找到');
    }

    const apiKey = process.env.NEXT_PUBLIC_ARK_API_KEY;
    if (!apiKey) {
      throw new Error('豆包 API Key未配置');
    }

    const systemPrompt = generateAISummaryPrompt(data.title, data.content);

    try {
      const response = await fetch(doubaoModel.endpoint, {
        method: 'POST',
        headers: doubaoModel.getHeaders(apiKey),
        body: JSON.stringify({
          model: 'doubao-seed-1-6-250615',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: '请生成AI摘要' }
          ],
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`豆包API请求失败: ${response.status}`);
      }

      const result = await response.json();
      const summary = result.choices?.[0]?.message?.content || '';

      return {
        success: true,
        data: { summary },
        message: 'AI摘要生成成功'
      };
    } catch (error) {
      return {
        success: false,
        data: { summary: '' },
        message: `AI摘要生成失败: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  },
}; 