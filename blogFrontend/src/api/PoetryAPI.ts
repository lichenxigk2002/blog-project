// 诗词API接口类型定义
export interface PoetryData {
  content: string;
  author: string;
}

export interface PoetryResponse {
  status: string;
  code: number;
  data: PoetryData;
  meta: {
    requestId: string;
    timestamp: string;
    degraded: boolean;
    copyright: string;
  };
}

// 使用XMLHttpRequest绕过拦截器
function ajaxRequest(url: string): Promise<PoetryResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch (error) {
            reject(new Error('解析响应数据失败'));
          }
        } else {
          reject(new Error(`HTTP错误: ${xhr.status}`));
        }
      }
    };

    xhr.onerror = function () {
      reject(new Error('网络请求失败'));
    };

    xhr.ontimeout = function () {
      reject(new Error('请求超时'));
    };

    // 设置超时时间（可选）
    xhr.timeout = 10000; // 10秒

    xhr.send();
  });
}

// 获取随机诗词
export async function fetchRandomPoetry(): Promise<PoetryData> {
  try {
    const data = await ajaxRequest('https://api.kamyang.com/onepoem/v1');

    if (data.status === 'success' && data.code === 200) {
      return data.data;
    } else {
      throw new Error('API返回数据异常');
    }
  } catch (error) {
    console.error('API请求错误:', error);
    // 返回默认诗词作为fallback
    return {
      content: '山重水复疑无路，柳暗花明又一村。',
      author: '陆游《游山西村》'
    };
  }
}
