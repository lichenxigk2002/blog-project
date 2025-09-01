/**
 * HTML工具函数
 */

/**
 * 清理HTML标记，返回纯文本内容
 * @param html HTML字符串
 * @returns 清理后的纯文本
 */
export const stripHtml = (html: string): string => {
  if (!html) return '';

  // 创建一个临时的DOM元素来解析HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // 获取纯文本内容
  return tempDiv.textContent || tempDiv.innerText || '';
};

/**
 * 清理HTML标记，保留换行符
 * @param html HTML字符串
 * @returns 清理后的文本，保留换行
 */
export const stripHtmlKeepNewlines = (html: string): string => {
  if (!html) return '';

  // 先替换<br>、</p>等标签为换行符
  let text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n');

  // 然后清理所有HTML标签
  text = stripHtml(text);

  // 清理多余的换行符和空格
  text = text
    .replace(/\n\s*\n/g, '\n') // 多个连续换行符合并为一个
    .replace(/^\s+|\s+$/g, '') // 去除首尾空格
    .trim();

  return text;
};

/**
 * 清理HTML标记，限制文本长度
 * @param html HTML字符串
 * @param maxLength 最大长度
 * @param suffix 超出长度时的后缀，默认为"..."
 * @returns 清理后的文本
 */
export const stripHtmlWithLimit = (html: string, maxLength: number, suffix: string = '...'): string => {
  const text = stripHtml(html);

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + suffix;
};

/**
 * 移除特定的HTML标签（如img标签）
 * @param html HTML字符串
 * @param tags 要移除的标签名数组，默认为['img']
 * @returns 移除指定标签后的HTML
 */
export const removeHtmlTags = (html: string, tags: string[] = ['img']): string => {
  if (!html) return '';

  let result = html;
  tags.forEach(tag => {
    const regex = new RegExp(`<${tag}[^>]*>.*?<\/${tag}>|<${tag}[^>]*\/?>`, 'gi');
    result = result.replace(regex, '');
  });

  return result;
};

/**
 * 清理所有HTML标签，保留文本内容
 * @param html HTML字符串
 * @returns 清理后的文本，保留内容但去掉所有标签
 */
export const cleanHtmlTags = (html: string): string => {
  if (!html) return '';

  // 使用正则表达式移除所有HTML标签
  return html.replace(/<[^>]*>/g, '');
};

/**
 * 清理HTML标签并限制长度
 * @param html HTML字符串
 * @param maxLength 最大长度
 * @param suffix 超出长度时的后缀，默认为"..."
 * @returns 清理标签后的文本
 */
export const cleanHtmlTagsWithLimit = (html: string, maxLength: number, suffix: string = '...'): string => {
  const text = cleanHtmlTags(html);

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + suffix;
};

/**
 * 清理Markdown语法和HTML标签，返回纯文本
 * @param text 包含Markdown语法和HTML标签的文本
 * @returns 清理后的纯文本
 */
export const cleanMarkdownAndHtml = (text: string): string => {
  if (!text) return '';

  let cleanText = text;

  // 1. 清理Markdown语法
  cleanText = cleanText
    // 移除标题语法 (# ## ### 等)
    .replace(/^#{1,6}\s+/gm, '')
    // 移除粗体和斜体语法 (**text** *text* __text__ _text_)
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // 移除删除线语法 (~~text~~)
    .replace(/~~(.*?)~~/g, '$1')
    // 移除行内代码语法 (`code`)
    .replace(/`([^`]+)`/g, '$1')
    // 移除代码块语法 (```lang ... ```)
    .replace(/```[\s\S]*?```/g, '')
    // 移除链接语法 [text](url) 保留text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 移除图片语法 ![alt](url)
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    // 移除引用语法 (> text)
    .replace(/^>\s+/gm, '')
    // 移除列表语法 (- * + 1. 等)
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // 移除水平分割线 (--- *** ___)
    .replace(/^[-*_]{3,}$/gm, '')
    // 移除表格语法中的管道符
    .replace(/\|/g, ' ');

  // 2. 清理HTML标签
  cleanText = cleanHtmlTags(cleanText);

  // 3. 清理HTML实体和特殊符号
  cleanText = cleanText
    // 清理常见的HTML实体
    .replace(/&emsp;/g, ' ')    // 全角空格
    .replace(/&ensp;/g, ' ')    // 半角空格
    .replace(/&nbsp;/g, ' ')    // 不间断空格
    .replace(/&ldquo;/g, '"')   // 左双引号
    .replace(/&rdquo;/g, '"')   // 右双引号
    .replace(/&lsquo;/g, "'")   // 左单引号
    .replace(/&rsquo;/g, "'")   // 右单引号
    .replace(/&mdash;/g, '—')   // 长破折号
    .replace(/&ndash;/g, '–')   // 短破折号
    .replace(/&amp;/g, '&')     // &符号
    .replace(/&lt;/g, '<')      // 小于号
    .replace(/&gt;/g, '>')      // 大于号
    .replace(/&quot;/g, '"')    // 双引号
    // 清理其他常见HTML实体（通用模式）
    .replace(/&#?\w+;/g, ' ');

  // 4. 清理多余的空白字符
  cleanText = cleanText
    // 替换多个连续空格为单个空格
    .replace(/\s+/g, ' ')
    // 移除行首尾空格
    .replace(/^\s+|\s+$/gm, '')
    // 移除多个连续换行
    .replace(/\n\s*\n/g, '\n')
    .trim();

  return cleanText;
}; 