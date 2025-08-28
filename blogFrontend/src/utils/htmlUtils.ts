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