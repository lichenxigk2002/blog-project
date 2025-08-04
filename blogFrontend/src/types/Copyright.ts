// 文章版权信息类型
export interface ArticleCopyright {
  id: number;
  articleId: number;
  licenseType: string;
  copyrightHolder: string;
  ipfsHash?: string;
  blockchainTxHash?: string;
  blockchainContractAddress?: string;
  noteId?: string;
  createdAt: string;
  updatedAt: string;
}

// 许可协议类型
export interface LicenseType {
  id: number;
  name: string;
  code: string;
  description?: string;
  url?: string;
  isActive: boolean;
  createdAt: string;
}

// 区块链交易记录类型
export interface BlockchainTransaction {
  id: number;
  articleId: number;
  transactionType: 'REGISTER' | 'UPDATE' | 'VERIFY';
  txHash: string;
  blockNumber?: number;
  gasUsed?: number;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  errorMessage?: string;
  createdAt: string;
  confirmedAt?: string;
}

// ========== Crossbell 区块链相关类型 ==========

// Crossbell 发布请求类型
export interface CrossbellPublishRequest {
  articleId: number;
  licenseType: string;
  copyrightHolder: string;
  author: string;
  publishTime?: string;
}

// Crossbell 发布结果类型
export interface CrossbellPublishResult {
  success: boolean;
  transactionHash?: string;
  noteId?: string;
  errorMessage?: string;
  publishTime?: string;
  crossbellUrl?: string;
}

// Crossbell 交易状态类型
export type CrossbellTransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'ERROR';

// Crossbell Note 元数据类型
export interface CrossbellNoteMetadata {
  title: string;
  content: string;
  tags: string[];
  sources: string[];
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
} 