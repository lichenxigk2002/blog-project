import { http } from '@/http/request';

export const MarkdownImageAPI = {
  /**
   * 上传图片到后端 /markdownImage/upload
   * @param file 图片文件
   * @returns Promise<{ url: string }>
   */
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    // 注意这里用绝对路径，确保请求发到后端
    return await http.post<{ url: string }>('/markdownImage/upload', formData);
  }
}; 