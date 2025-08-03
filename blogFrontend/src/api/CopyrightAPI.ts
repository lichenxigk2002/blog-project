import { http } from '@/http/request';
import { ArticleCopyright, LicenseType, BlockchainTransaction } from '@/types/Copyright';

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
}; 