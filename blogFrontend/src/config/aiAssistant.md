 # aiAssistant.ts 配置文件说明

## 1. 文件用途

本文件用于集中配置前端 AI 助手“小熙”的人设、行为规范、项目知识和系统提示词生成逻辑。通过统一配置，确保 AI 助手在对话中的风格、知识和行为一致。

---

## 2. 主要配置项

- **name/role/identity**：助手名称、角色定位、自我介绍
- **origin**：出生信息（仅在用户明确询问时回答）
- **personality**：性格特点、说话风格（如常用语气、表情符号等）
- **projectKnowledge**：项目架构、目录结构、主要功能、技术亮点
- **behavior**：技术/非技术问题回答风格、代码生成规则、不确定时的处理方式

---

## 3. 系统提示词生成

- 通过 `generateSystemPrompt()` 方法，将所有设定拼接为系统提示词，供 AI 对话模型初始化时使用。
- 保证 AI 回答风格、内容、行为规范统一。

---

## 4. 典型用法

```ts
import { generateSystemPrompt } from '@/config/aiAssistant';
const prompt = generateSystemPrompt();
// 用于初始化 AI 对话模型
```

---

## 5. 扩展建议

- 如需调整“小熙”的性格、知识或行为，只需修改本文件对应配置项即可。
- 可根据项目需求扩展更多行为规范、知识点或自定义说话风格。
