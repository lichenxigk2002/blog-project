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
import { EditIcon } from '../ui/Icons/Icons';
import CopyrightForm from './CopyrightForm';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tipModal, setTipModal] = useState<{ open: boolean, message: string, type: 'success' | 'error' }>({ open: false, message: '', type: 'success' });

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

      // 获取每篇文章的版权信息
      const copyrightsWithArticles: CopyrightWithArticle[] = [];
      for (const article of articles) {
        try {
          const copyrightResponse = await CopyrightAPI.getArticleCopyright(article.id!);
          if (copyrightResponse && !('error' in copyrightResponse)) {
            copyrightsWithArticles.push({
              ...copyrightResponse,
              article: article
            });
          } else {
            // 如果没有版权信息，创建一个默认的（表示无版权）
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
        } catch (error: any) {
          // 静默处理404错误，因为新文章没有版权信息是正常的
          if (error.message && error.message.includes('资源未找到')) {
            // 没有版权信息，创建一个默认的（表示无版权）
            copyrightsWithArticles.push({
              id: 0,
              articleId: article.id!,
              licenseType: '无版权',
              copyrightHolder: '无版权',
              createdAt: article.createdAt,
              updatedAt: article.updatedAt,
              article: article
            });
          } else {
            // 其他错误才打印日志
            console.error(`获取文章 ${article.id} 版权信息失败:`, error);
          }
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
    }
  ];

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



      {/* 操作提示弹窗 */}
      <OperationTipModal
        open={tipModal.open}
        onClose={() => setTipModal({ ...tipModal, open: false })}
        message={tipModal.message}
        type={tipModal.type}
      />

      {loading && (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
        </div>
      )}
    </div>
  );
};



export default CopyrightManagement; 