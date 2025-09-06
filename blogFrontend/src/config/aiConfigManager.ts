/**
 * AI配置管理器
 * 支持动态切换不同的AI助手配置
 */

import { generateSystemPrompt } from './aiAssistant';
import { generateHutaoSystemPrompt } from './aiHuTaoAssistant';
import { generateYoimiyaSystemPrompt } from './aiYoimiyaAssistant';

export type AIAssistantType = 'xiaoxi' | 'hutao' | 'yoimiya';

export interface AIAssistantInfo {
  id: AIAssistantType;
  name: string;
  description: string;
  generatePrompt: () => string;
}

export const AI_ASSISTANTS: Record<AIAssistantType, AIAssistantInfo> = {
  xiaoxi: {
    id: 'xiaoxi',
    name: '小熙',
    description: '活泼可爱的技术助手，温暖贴心 ✨',
    generatePrompt: generateSystemPrompt
  },
  hutao: {
    id: 'hutao',
    name: '胡桃',
    description: '往生堂第77代堂主，原神世界专家 🔥',
    generatePrompt: generateHutaoSystemPrompt
  },
  yoimiya: {
    id: 'yoimiya',
    name: '宵宫',
    description: '长野原烟火店店主，稻妻节庆专家 🎆',
    generatePrompt: generateYoimiyaSystemPrompt
  }
};

/**
 * AI配置管理器类
 */
export class AIConfigManager {
  private static instance: AIConfigManager;
  private currentAssistant: AIAssistantType = 'xiaoxi'; // 默认使用小熙

  private constructor() { }

  public static getInstance(): AIConfigManager {
    if (!AIConfigManager.instance) {
      AIConfigManager.instance = new AIConfigManager();
    }
    return AIConfigManager.instance;
  }

  /**
   * 获取当前助手类型
   */
  getCurrentAssistant(): AIAssistantType {
    return this.currentAssistant;
  }

  /**
   * 获取当前助手信息
   */
  getCurrentAssistantInfo(): AIAssistantInfo {
    return AI_ASSISTANTS[this.currentAssistant];
  }

  /**
   * 切换助手
   */
  switchAssistant(type: AIAssistantType): void {
    this.currentAssistant = type;
  }

  /**
   * 获取当前系统提示词
   */
  getCurrentSystemPrompt(): string {
    return AI_ASSISTANTS[this.currentAssistant].generatePrompt();
  }

  /**
   * 获取所有可用助手列表
   */
  getAvailableAssistants(): AIAssistantInfo[] {
    return Object.values(AI_ASSISTANTS);
  }
} 