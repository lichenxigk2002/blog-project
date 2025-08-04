import { http } from '@/http/request';
import {
  ArticleCopyright,
  LicenseType,
  BlockchainTransaction,
  CrossbellPublishRequest,
  CrossbellPublishResult
} from '@/types/Copyright';

export const CopyrightAPI = {
  // 获取文章版权信息
  getArticleCopyright: (articleId: number) =>
    http.get<ArticleCopyright>(`/api/copyright/article/${articleId}`),

  // 创建或更新文章版权信息
  createOrUpdateCopyright: (articleId: number, licenseType: string, copyrightHolder: string) =>
    http.post<ArticleCopyright>(`/api/copyright/article/${articleId}`, {
      licenseType,
      copyrightHolder
    }),

  // 更新IPFS哈希
  updateIpfsHash: (articleId: number, ipfsHash: string) =>
    http.put(`/api/copyright/article/${articleId}/ipfs`, null, {
      params: { ipfsHash }
    }),

  // 更新区块链信息
  updateBlockchainInfo: (articleId: number, txHash: string, noteId: string) =>
    http.put(`/api/copyright/article/${articleId}/blockchain`, null, {
      params: { txHash, noteId }
    }),

  // 获取所有版权信息
  getAllCopyrights: () =>
    http.get<ArticleCopyright[]>('/api/copyright/all'),

  // 获取所有启用的许可协议
  getActiveLicenses: () =>
    http.get<LicenseType[]>('/api/license/active'),

  // 根据代码获取许可协议
  getLicenseByCode: (code: string) =>
    http.get<LicenseType>(`/api/license/code/${code}`),

  // ========== Crossbell 区块链功能 ==========

  /**
   * 发布文章到 Crossbell 区块链
   */
  publishToCrossbell: async (request: CrossbellPublishRequest): Promise<CrossbellPublishResult> => {
    const response = await http.post<CrossbellPublishResult>('/api/crossbell/publish', request, {
      timeout: 120000 // 2分钟超时，适合区块链交易
    });
    return response;
  },

  /**
   * 验证文章是否已上链
   */
  verifyOnCrossbell: async (noteId: string): Promise<boolean> => {
    const response = await http.get<boolean>(`/api/crossbell/verify/${noteId}`, undefined, {
      timeout: 30000 // 30秒超时
    });
    return response;
  },

  /**
   * 获取 Crossbell 链接
   */
  getCrossbellUrl: async (noteId: string): Promise<string> => {
    const response = await http.get<string>(`/api/crossbell/url/${noteId}`, undefined, {
      timeout: 30000 // 30秒超时
    });
    return response;
  },

  /**
   * 获取交易状态
   */
  getTransactionStatus: async (txHash: string): Promise<string> => {
    const response = await http.get<string>(`/api/crossbell/transaction/${txHash}`, undefined, {
      timeout: 30000 // 30秒超时
    });
    return response;
  },

  /**
   * Crossbell 服务健康检查
   */
  checkCrossbellHealth: async (): Promise<string> => {
    const response = await http.get<string>('/api/crossbell/health', undefined, {
      timeout: 10000 // 10秒超时
    });
    return response;
  }
}; 