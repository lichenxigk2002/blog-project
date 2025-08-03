import React, { useState, useEffect } from 'react';
import { CopyrightAPI } from '../../../api/CopyrightAPI';
import { ArticlesAPI } from '../../../api/ArticlesAPI';
import styles from './CrossbellManagement.module.scss';
import Pagination from "../ui/Pagination/Pagination";
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';
import Button from '../ui/Button/Button';
import StatsCard from '../ui/StatsCard/StatsCard';
import SearchBar from '../ui/SearchBar/SearchBar';
import FormModal from '../ui/FormModal/FormModal';
import { useConnectModal, usePostNote } from '@crossbell/connect-kit';
import { useAccount, useDisconnect } from 'wagmi';

interface ArticleCopyrightWithInfo {
  id: number;
  articleId: number;
  title?: string;
  licenseType: string;
  copyrightHolder: string;
  blockchainTxHash?: string;
  noteId?: string;
  content?: string;
}

export const CrossbellManagement: React.FC = () => {
  const [paginatedArticles, setPaginatedArticles] = useState<ArticleCopyrightWithInfo[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<ArticleCopyrightWithInfo[]>([]);
  const [allArticles, setAllArticles] = useState<ArticleCopyrightWithInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [tipModal, setTipModal] = useState<{ open: boolean, message: string, type: 'success' | 'error' | 'info' | 'warning' | 'loading' }>({ open: false, message: '', type: 'success' });
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  // 使用 Crossbell Connect Kit 和 wagmi
  const { show: showConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { mutateAsync: postNote } = usePostNote();

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setPaginatedArticles(filteredArticles.slice(start, end));
  }, [currentPage, pageSize, filteredArticles]);

  useEffect(() => {
    fetchArticles();
  }, [currentPage, pageSize]);

  const connectWallet = async () => {
    try {
      showConnectModal();
    } catch (error) {
      setTipModal({ open: true, message: '连接钱包失败', type: 'error' });
    }
  };

  const disconnectWallet = async () => {
    try {
      disconnect();
      setTipModal({ open: true, message: '钱包已断开连接', type: 'success' });
    } catch (error) {
      setTipModal({ open: true, message: '断开连接失败', type: 'error' });
    }
  };

  const fetchArticles = async (searchTerm = '') => {
    setLoading(true);
    try {
      const response = await CopyrightAPI.getAllCopyrights();
      const copyrights = response || [];

      const articlesResponse = await ArticlesAPI.getArticles();
      const articlesData = articlesResponse?.data || [];

      const enrichedCopyrights = copyrights.map(copyright => {
        const article = articlesData.find(a => a.id === copyright.articleId);
        return {
          ...copyright,
          title: article?.title || `文章 ${copyright.articleId}`,
          content: article?.content || ''
        };
      });

      const filteredData = searchTerm
        ? enrichedCopyrights.filter(article =>
          article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.copyrightHolder.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.licenseType.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : enrichedCopyrights;

      setAllArticles(filteredData);
      setFilteredArticles(filteredData);
      setTotal(filteredData.length);
    } catch (error: any) {
      console.error('获取文章列表失败:', error);
      setTipModal({ open: true, message: error.message || '获取文章列表失败', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToBlockchain = async (article: ArticleCopyrightWithInfo) => {
    if (!isConnected || !address) {
      setTipModal({ open: true, message: '请先连接钱包', type: 'error' });
      return;
    }

    try {
      setTipModal({ open: true, message: '正在发布到区块链...', type: 'loading' });

      // 构建发布内容
      const metadata = {
        title: article.title || `文章 ${article.articleId}`,
        content: article.content || '',
        tags: ['blog', 'copyright', article.licenseType],
        sources: ['blog-admin'],
        attributes: [
          {
            trait_type: '版权所有者',
            value: article.copyrightHolder
          },
          {
            trait_type: '许可协议',
            value: article.licenseType
          },
          {
            trait_type: '文章ID',
            value: article.articleId.toString()
          }
        ]
      };

      // 发布到 Crossbell
      const result = await postNote({
        metadata,
        characterId: undefined // 让系统自动选择character
      });

      if (result && result.noteId && result.transactionHash) {
        // 获取真实的交易哈希和Note ID
        const realTxHash = result.transactionHash;
        const realNoteId = `${result.noteId}`;

        // 更新数据库
        await CopyrightAPI.updateBlockchainInfo(
          article.articleId,
          realTxHash,
          realNoteId
        );

        setTipModal({ open: true, message: '成功发布到 Crossbell 区块链！', type: 'success' });
        fetchArticles();
      } else {
        throw new Error('发布失败，未获取到交易结果');
      }
    } catch (error: any) {
      console.error('发布失败:', error);
      setTipModal({ open: true, message: error.message || '发布到区块链失败', type: 'error' });
    }
  };

  const handleRemoveFromBlockchain = async (article: ArticleCopyrightWithInfo) => {
    setConfirmMessage(`确定要从区块链移除文章"${article.title}"吗？\n\n注意：这将清除区块链信息，但不会影响文章本身。`);
    setConfirmAction(() => async () => {
      if (!isConnected || !address) {
        setTipModal({ open: true, message: '请先连接钱包', type: 'error' });
        return;
      }

      try {
        setTipModal({ open: true, message: '正在从区块链移除...', type: 'loading' });

        // 清除区块链信息（设置为空字符串）
        await CopyrightAPI.updateBlockchainInfo(
          article.articleId,
          '',
          ''
        );

        setTipModal({ open: true, message: '成功从区块链移除！', type: 'success' });
        fetchArticles();
      } catch (error: any) {
        console.error('移除失败:', error);
        setTipModal({ open: true, message: error.message || '从区块链移除失败', type: 'error' });
      }
    });
    setConfirmModalVisible(true);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }

    const sortedArticles = [...filteredArticles].sort((a: any, b: any) => {
      const aValue = a[field];
      const bValue = b[field];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue === null || bValue === null) {
        return aValue === null ? -1 : 1;
      }

      return sortOrder === 'asc'
        ? (aValue || 0) - (bValue || 0)
        : (bValue || 0) - (aValue || 0);
    });

    setFilteredArticles(sortedArticles);
    setAllArticles(sortedArticles);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const stats = [
    { title: '总文章数', value: allArticles.length },
    { title: '已上链', value: allArticles.filter(a => a.blockchainTxHash).length },
    { title: '未上链', value: allArticles.filter(a => !a.blockchainTxHash).length },
    { title: '上链率', value: `${total > 0 ? Math.round((allArticles.filter(a => a.blockchainTxHash).length / total) * 100) : 0}%` }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Crossbell 区块链管理</h1>
        <div className={styles.walletInfo}>
          {isConnected && address ? (
            <div className={styles.walletStatus}>
              <span className={styles.connected}>✅ 已连接</span>
              <span className={styles.address}>{formatAddress(address)}</span>
              <Button variant="default" onClick={disconnectWallet} size="small">断开</Button>
            </div>
          ) : (
            <Button variant="primary" onClick={connectWallet}>连接 Crossbell 钱包</Button>
          )}
        </div>
      </div>

      {!isConnected ? (
        <div className={styles.notConnectedMessage}>
          <p>请先连接 Crossbell 钱包以管理区块链功能</p>
          <Button variant="primary" onClick={connectWallet}>连接钱包</Button>
        </div>
      ) : (
        <>
          <StatsCard stats={stats} />

          <SearchBar
            placeholder="搜索文章标题、版权所有者或许可协议..."
            onSearch={(searchText) => {
              setCurrentPage(1);
              fetchArticles(searchText);
            }}
          />

          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div
                className={`${styles.tableHeaderCell} ${styles.sortable}`}
                onClick={() => handleSort('title')}
              >
                文章标题
                {sortField === 'title' && (
                  <span className={styles.sortIcon}>
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
              <div
                className={`${styles.tableHeaderCell} ${styles.sortable}`}
                onClick={() => handleSort('licenseType')}
              >
                许可协议
                {sortField === 'licenseType' && (
                  <span className={styles.sortIcon}>
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
              <div
                className={`${styles.tableHeaderCell} ${styles.sortable}`}
                onClick={() => handleSort('copyrightHolder')}
              >
                版权所有者
                {sortField === 'copyrightHolder' && (
                  <span className={styles.sortIcon}>
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
              <div className={styles.tableHeaderCell}>区块链状态</div>
              <div className={styles.tableHeaderCell}>操作</div>
            </div>
            <div className={styles.tableBody}>
              {paginatedArticles.map((article) => (
                <div key={article.id} className={styles.tableRow}>
                  <div className={styles.tableCell} style={{ fontWeight: 500 }}>
                    <div className={styles.titleCell}>
                      <div className={styles.articletitle}>{article.title || `文章 ${article.articleId}`}</div>
                      <div className={styles.subtitle}>ID: {article.articleId}</div>
                    </div>
                  </div>
                  <div className={styles.tableCell}>
                    <span className={styles.licenseType}>
                      {article.licenseType}
                    </span>
                  </div>
                  <div className={styles.tableCell}>
                    {article.copyrightHolder}
                  </div>
                  <div className={styles.tableCell}>
                    {article.blockchainTxHash ? (
                      <div className={styles.blockchainInfo}>
                        <span className={styles.statusSuccess}>✅ 已上链</span>
                        <div className={styles.txHash}>Tx: {formatHash(article.blockchainTxHash)}</div>
                        {article.noteId && <div className={styles.noteId}>Note: {article.noteId}</div>}
                      </div>
                    ) : (
                      <span className={styles.statusPending}>⏳ 未上链</span>
                    )}
                  </div>
                  <div className={styles.tableCell}>
                    <div className={styles.actionButtons}>
                      <Button
                        variant="primary"
                        onClick={() => handlePublishToBlockchain(article)}
                      >
                        发布到区块链
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveFromBlockchain(article)}
                        disabled={!article.blockchainTxHash}
                      >
                        从区块链移除
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Pagination
            total={total}
            currentPage={currentPage || 1}
            pageSize={pageSize || 10}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </>
      )}

      <FormModal
        open={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
        title="确认操作"
        size="small"
      >
        <p>{confirmMessage}</p>
        <div className={styles.modalFooter}>
          <Button
            className={styles.button}
            onClick={() => setConfirmModalVisible(false)}
          >
            取消
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (confirmAction) {
                confirmAction();
              }
              setConfirmModalVisible(false);
            }}
          >
            确认移除
          </Button>
        </div>
      </FormModal>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
        </div>
      )}

      <OperationTipModal
        open={tipModal.open}
        onClose={() => setTipModal({ ...tipModal, open: false })}
        message={tipModal.message}
        type={tipModal.type}
      />
    </div>
  );
};
