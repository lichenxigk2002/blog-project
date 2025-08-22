import React, { useState, useEffect } from 'react';
import { CopyrightAPI } from '@/api/CopyrightAPI';
import { ArticlesAPI } from '@/api/ArticlesAPI';
import type { ArticleCopyright } from '@/types/Copyright';
import type { Article } from '@/types/Article';
import styles from './CopyrightManagement.module.scss';
import Pagination from "@/admin/components/ui/Pagination/Pagination";
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';
import Button from '../ui/Button/Button';
import StatsCard from '../ui/StatsCard/StatsCard';
import SearchBar from '../ui/SearchBar/SearchBar';
import DataTable from '../ui/DataTable/DataTable';
import FormModal from '../ui/FormModal/FormModal';
import { EditIcon, HashIcon } from '../ui/Icons/Icons';
import CopyrightForm from './CopyrightForm';
import HashEvidenceForm from './HashEvidenceForm';

interface CopyrightWithArticle extends ArticleCopyright {
  article?: Article;
}

const CopyrightManagement: React.FC = () => {
  const [paginatedCopyrights, setPaginatedCopyrights] = useState<CopyrightWithArticle[]>([]);
  const [filteredCopyrights, setFilteredCopyrights] = useState<CopyrightWithArticle[]>([]);
  const [allCopyrights, setAllCopyrights] = useState<CopyrightWithArticle[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCopyright, setEditingCopyright] = useState<CopyrightWithArticle | null>(null);
  const [hashEvidenceModalVisible, setHashEvidenceModalVisible] = useState(false);
  const [selectedCopyright, setSelectedCopyright] = useState<CopyrightWithArticle | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tipModal, setTipModal] = useState<{ open: boolean, message: string, type: 'success' | 'error' }>({ open: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState<{ open: boolean, copyright: CopyrightWithArticle | null }>({ open: false, copyright: null });

  // 根据许可协议类型获取颜色配置
  const getLicenseColor = (licenseType: string) => {
    switch (licenseType) {
      case 'PUBLIC DOMAIN':
        return {
          backgroundColor: '#28a74520',
          borderColor: '#28a745',
          color: '#28a745'
        };
      case 'CC BY 4.0':
        return {
          backgroundColor: '#17a2b820',
          borderColor: '#17a2b8',
          color: '#17a2b8'
        };
      case 'CC BY-NC-SA 4.0':
        return {
          backgroundColor: '#ffc10720',
          borderColor: '#ffc107',
          color: '#856404'
        };
      case 'CC BY-NC-ND 4.0':
        return {
          backgroundColor: '#fd7e1420',
          borderColor: '#fd7e14',
          color: '#fd7e14'
        };
      case 'ALL RIGHTS RESERVED':
        return {
          backgroundColor: '#dc354520',
          borderColor: '#dc3545',
          color: '#dc3545'
        };
      case '无版权':
        return {
          backgroundColor: '#6c757d20',
          borderColor: '#6c757d',
          color: '#6c757d'
        };
      default:
        return {
          backgroundColor: '#007bff20',
          borderColor: '#007bff',
          color: '#007bff'
        };
    }
  };

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setPaginatedCopyrights(filteredCopyrights.slice(start, end));
  }, [currentPage, pageSize, filteredCopyrights]);

  useEffect(() => {
    fetchCopyrights();
  }, []);

  const fetchCopyrights = async (searchText = '') => {
    setLoading(true);
    try {
      // 使用已有的文章列表，如果没有则获取
      let articles = allArticles;
      if (articles.length === 0) {
        const articlesResponse = await ArticlesAPI.getArticles();
        if (!articlesResponse || 'error' in articlesResponse) {
          throw new Error('获取文章列表失败');
        }
        articles = articlesResponse.data as unknown as Article[];
        setAllArticles(articles);
      }

      // 一次性获取所有版权信息
      const allCopyrightsResponse = await CopyrightAPI.getAllCopyrights();
      if (!allCopyrightsResponse || 'error' in allCopyrightsResponse) {
        throw new Error('获取版权信息失败');
      }

      const allCopyrightsData = allCopyrightsResponse as ArticleCopyright[];

      // 将版权信息与文章信息合并
      const copyrightsWithArticles: CopyrightWithArticle[] = [];

      // 为每篇文章创建版权信息
      for (const article of articles) {
        // 查找对应的版权信息
        const copyright = allCopyrightsData.find(c => c.articleId === article.id);

        if (copyright) {
          // 有版权信息
          copyrightsWithArticles.push({
            ...copyright,
            article: article
          });
        } else {
          // 没有版权信息，创建默认的
          copyrightsWithArticles.push({
            id: 0,
            articleId: article.id!,
            licenseType: '无版权',
            copyrightHolder: '无版权',
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            article: article
          });
        }
      }

      // 根据搜索关键词过滤
      const filteredData = searchText
        ? copyrightsWithArticles.filter(copyright =>
          copyright.article?.title.toLowerCase().includes(searchText.toLowerCase()) ||
          copyright.copyrightHolder.toLowerCase().includes(searchText.toLowerCase()) ||
          copyright.licenseType.toLowerCase().includes(searchText.toLowerCase())
        )
        : copyrightsWithArticles;

      setAllCopyrights(copyrightsWithArticles);
      setFilteredCopyrights(filteredData);
      setTotal(filteredData.length);
    } catch (error: any) {
      console.error('获取版权信息失败:', error);
      setTipModal({ open: true, message: error.message || '获取版权信息失败', type: 'error' });
    } finally {
      setLoading(false);
    }
  };



  const openModal = (copyright?: CopyrightWithArticle) => {
    setEditingCopyright(copyright || null);
    setModalVisible(true);
  };

  const openHashEvidenceModal = (copyright: CopyrightWithArticle) => {
    setSelectedCopyright(copyright);
    setHashEvidenceModalVisible(true);
  };



  const handleSubmit = async (values: any) => {
    if (!editingCopyright) return;

    try {
      const copyrightData = {
        licenseType: values.licenseType,
        copyrightHolder: values.copyrightHolder
      };

      // 编辑现有版权
      await CopyrightAPI.createOrUpdateCopyright(
        editingCopyright.articleId,
        copyrightData.licenseType,
        copyrightData.copyrightHolder
      );
      setTipModal({ open: true, message: '更新成功', type: 'success' });
      setModalVisible(false);
      fetchCopyrights();
    } catch (e: any) {
      console.error('操作失败:', e);
      setTipModal({ open: true, message: e.message || '操作失败', type: 'error' });
    }
  };



  const handleSearch = (searchText: string) => {
    setCurrentPage(1);
    fetchCopyrights(searchText);
  };

  const stats = {
    totalCopyrights: allCopyrights.length,
    totalArticles: allArticles.length,
    mostUsedLicense: allCopyrights.reduce((acc, copyright) => {
      acc[copyright.licenseType] = (acc[copyright.licenseType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  const mostUsedLicense = Object.entries(stats.mostUsedLicense).sort((a, b) => b[1] - a[1])[0];

  // 定义表格列配置
  const columns = [
    {
      key: 'articleTitle',
      title: '文章标题',
      render: (value: any, record: CopyrightWithArticle) => (
        <span className={styles.articleTitle}>
          {record.article?.title || '未知文章'}
        </span>
      )
    },
    {
      key: 'copyrightHolder',
      title: '版权所有者',
      render: (value: any, record: CopyrightWithArticle) => (
        <span className={styles.copyrightHolder}>
          {record.copyrightHolder}
        </span>
      )
    },
    {
      key: 'licenseType',
      title: '许可协议',
      render: (value: any, record: CopyrightWithArticle) => {
        const colorConfig = getLicenseColor(record.licenseType);
        return (
          <span
            className={styles.licenseTag}
            style={colorConfig}
          >
            {record.licenseType}
          </span>
        );
      }
    },
    {
      key: 'blockchainStatus',
      title: '版权状态',
      render: (value: any, record: CopyrightWithArticle) => (
        <span className={styles.blockchainStatus}>
          {record.id === 0 ? '未设置' : (record.blockchainTxHash ? '已上链' : '未上链')}
        </span>
      )
    },
    {
      key: 'createdAt',
      title: '创建时间',
      render: (value: any, record: CopyrightWithArticle) => (
        <span className={styles.date}>
          {new Date(record.createdAt).toLocaleDateString('zh-CN')}
        </span>
      )
    }
  ];

  // 定义操作按钮
  const actions = [
    {
      key: 'edit',
      label: '编辑',
      variant: 'primary' as const,
      icon: <EditIcon />,
      onClick: (copyright: CopyrightWithArticle) => openModal(copyright)
    },
    {
      key: 'hashEvidence',
      label: '存证',
      variant: 'default' as const,
      onClick: (copyright: CopyrightWithArticle) => openHashEvidenceModal(copyright)
    },
    {
      key: 'publish',
      label: '发布',
      variant: 'success' as const,
      onClick: (copyright: CopyrightWithArticle) => handlePublishClick(copyright),
      disabled: (copyright: CopyrightWithArticle) => !copyright.article?.id
    }
  ];

  // 处理发布按钮点击
  const handlePublishClick = (copyright: CopyrightWithArticle) => {
    // 如果已上链，显示确认弹窗
    if (copyright.noteId) {
      setConfirmModal({ open: true, copyright });
    } else {
      // 未上链，直接发布
      handlePublishToCrossbell(copyright);
    }
  };

  // 确认重新发布
  const handleConfirmRepublish = () => {
    if (confirmModal.copyright) {
      handlePublishToCrossbell(confirmModal.copyright);
      setConfirmModal({ open: false, copyright: null });
    }
  };

  // 取消重新发布
  const handleCancelRepublish = () => {
    setConfirmModal({ open: false, copyright: null });
  };

  // 发布到 Crossbell
  const handlePublishToCrossbell = async (copyright: CopyrightWithArticle) => {
    if (!copyright.article?.id) {
      setTipModal({
        open: true,
        message: '无法获取文章信息',
        type: 'error'
      });
      return;
    }

    try {
      setLoading(true);

      const response = await CopyrightAPI.publishToCrossbell({
        articleId: copyright.article.id,
        licenseType: copyright.licenseType,
        copyrightHolder: copyright.copyrightHolder,
        author: copyright.copyrightHolder
      });

      if (response.success) {
        const shortHash = response.transactionHash ?
          `${response.transactionHash.slice(0, 10)}...${response.transactionHash.slice(-8)}` : '';
        setTipModal({
          open: true,
          message: `存证成功！交易哈希: ${shortHash}`,
          type: 'success'
        });

        // 刷新数据
        await fetchCopyrights();
      } else {
        setTipModal({
          open: true,
          message: `存证失败：${response.errorMessage}`,
          type: 'error'
        });
      }
    } catch (error: any) {
      console.error('存证到 Crossbell 失败:', error);

      let errorMessage = '存证失败，请稍后重试';

      // 检查是否是超时错误
      if (error.name === 'AbortError' || error.message?.includes('timeout') || error.message?.includes('超时')) {
        errorMessage = '发布超时，区块链交易可能需要更长时间，请稍后检查发布状态';
      } else if (error.message) {
        errorMessage = `发布失败：${error.message}`;
      }

      setTipModal({
        open: true,
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>版权管理</h1>
      </div>

      <StatsCard stats={[
        {
          title: '版权总数',
          value: stats.totalCopyrights.toString()
        },
        {
          title: '文章总数',
          value: stats.totalArticles.toString()
        },
        {
          title: '最常用许可协议',
          value: mostUsedLicense ? mostUsedLicense[0] : '-',
          extra: mostUsedLicense && (
            <span style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              backgroundColor: '#007bff',
              borderRadius: '50%',
              marginLeft: '8px'
            }} />
          )
        }
      ]} />

      <SearchBar
        placeholder="搜索文章标题、版权所有者或许可协议..."
        onSearch={handleSearch}
      />

      <DataTable
        data={paginatedCopyrights}
        columns={columns}
        actions={actions}
        loading={loading}
        rowKey="id"
        emptyText="暂无版权数据"
      />

      <Pagination
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      <FormModal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        title={editingCopyright ? '编辑版权信息' : '新建版权信息'}
        size="medium"
      >
        {editingCopyright && (
          <CopyrightForm
            initialValues={{
              licenseType: editingCopyright.licenseType,
              copyrightHolder: editingCopyright.copyrightHolder
            }}
            articleTitle={editingCopyright.article?.title}
            onSubmit={handleSubmit}
            onCancel={() => setModalVisible(false)}
          />
        )}
      </FormModal>

      <FormModal
        open={hashEvidenceModalVisible}
        onClose={() => setHashEvidenceModalVisible(false)}
        title="哈希存证管理"
        size="medium"
      >
        {selectedCopyright && (
          <HashEvidenceForm
            articleId={selectedCopyright.articleId}
            articleTitle={selectedCopyright.article?.title}
            onClose={() => setHashEvidenceModalVisible(false)}
            onSuccess={() => {
              setHashEvidenceModalVisible(false);
              fetchCopyrights(); // 刷新数据
            }}
          />
        )}
      </FormModal>

      {/* 操作提示弹窗 */}
      <OperationTipModal
        open={tipModal.open}
        onClose={() => setTipModal({ ...tipModal, open: false })}
        message={tipModal.message}
        type={tipModal.type}
      />

      {/* 确认重新发布弹窗 */}
      <FormModal
        open={confirmModal.open}
        onClose={handleCancelRepublish}
        title="确认重新发布"
        size="small"
        closeOnOverlayClick={true}
      >
        <div style={{ padding: '20px 0' }}>
          <p style={{ marginBottom: '16px', color: '#a259ff', fontSize: '14px', lineHeight: '1.5' }}>
            该文章已经发布到区块链，重新发布将覆盖之前的记录。
          </p>
          <p style={{ marginBottom: '24px', color: '#a259ff', fontSize: '14px', lineHeight: '1.5' }}>
            确定要继续吗？
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="default" onClick={handleCancelRepublish}>
              取消
            </Button>
            <Button variant="danger" onClick={handleConfirmRepublish}>
              确定
            </Button>
          </div>
        </div>
      </FormModal>

    </div>
  );
};



export default CopyrightManagement; 