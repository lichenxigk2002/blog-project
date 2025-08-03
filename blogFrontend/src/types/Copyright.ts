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