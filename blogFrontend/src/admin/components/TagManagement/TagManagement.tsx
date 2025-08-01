import React, { useState, useEffect } from 'react';
import { TagsAPI } from '@/api/TagsAPI';
import type { Tag } from '@/types/Tags';
import TagArticlesModal from './TagArticlesModal';
import styles from './TagManagement.module.scss';
import TagForm from './TagForm';
import Pagination from "@/admin/components/ui/Pagination/Pagination";
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';
import Button from '../ui/Button/Button';
import StatsCard from '../ui/StatsCard/StatsCard';
import SearchBar from '../ui/SearchBar/SearchBar';
import DataTable from '../ui/DataTable/DataTable';
import FormModal from '../ui/FormModal/FormModal';
import { PlusIcon, EditIcon, DeleteIcon } from '../ui/Icons/Icons';


const TagManagement: React.FC = () => {

  const [paginatedTags, setPaginatedTags] = useState<Tag[]>([]); // 存储当前页评论
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]); // 存储过滤后的标签
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [articlesModalVisible, setArticlesModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tipModal, setTipModal] = useState<{ open: boolean, message: string, type: 'success' | 'failure' }>({ open: false, message: '', type: 'success' });

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setPaginatedTags(filteredTags.slice(start, end));
  }, [currentPage, pageSize, filteredTags]);

  useEffect(() => {
    fetchTags();
  }, []);
  const fetchTags = async (name = '') => {
    setLoading(true);
    try {
      const response = await TagsAPI.getTagsWithCount();
      let data = response as Tag[];
      if (name) {
        data = data.filter(tag =>
          tag.name.toLowerCase().includes(name.toLowerCase())
        );
      }
      setAllTags(data);
      setFilteredTags(data); // 初始化过滤后的标签
      setTotal(data.length);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (tag?: Tag) => {
    setEditingTag(tag || null);
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const tagData = {
        name: values.name,
        color: values.color,
        slug: values.slug || values.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };

      if (editingTag) {
        await TagsAPI.updateTag(editingTag.id, tagData);
        setTipModal({ open: true, message: '更新成功', type: 'success' });
      } else {
        await TagsAPI.createTag(tagData);
        setTipModal({ open: true, message: '创建成功', type: 'success' });
      }
      setModalVisible(false);
      fetchTags();
    } catch (e: any) {
      console.error('操作失败:', e);
      setTipModal({ open: true, message: e.message || '操作失败', type: 'failure' });
    }
  };

  const handleDelete = async () => {
    if (!deletingTag) return;

    try {
      setLoading(true);
      await TagsAPI.deleteTag(deletingTag.id);
      setTipModal({ open: true, message: '删除成功', type: 'success' });
      setDeleteModalVisible(false);
      setDeletingTag(null);
      await fetchTags();
    } catch (error: any) {
      setTipModal({ open: true, message: error.message || '删除失败', type: 'failure' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewArticles = async (tag: Tag) => {
    setSelectedTag(tag);
    setArticlesModalVisible(true);
    setArticlesLoading(true);
    try {
      const response = await TagsAPI.getArticlesByTagId(tag.id);
      setArticles(response as any[]);
    } catch (error: any) {
      alert('获取文章列表失败：' + error.message);
    } finally {
      setArticlesLoading(false);
    }
  };

  const handleSearch = (searchText: string) => {
    setCurrentPage(1); // 重置到第一页
    fetchTags(searchText)
  };

  const stats = {
    totalTags: allTags.length,
    totalUsage: allTags.reduce((sum, tag) => sum + (tag.count || 0), 0),
    mostUsedTag: allTags.reduce((max, tag) => (tag.count || 0) > (max.count || 0) ? tag : max, allTags[0])
  };

  // 定义表格列配置
  const columns = [
    {
      key: 'name',
      title: '标签名称',
      render: (value: any, record: Tag) => (
        <span
          className={styles.statusTag}
          style={{
            backgroundColor: record.color + '20',
            borderColor: record.color,
            color: record.color,
            cursor: 'pointer'
          }}
          onClick={() => handleViewArticles(record)}
        >
          {record.name}
        </span>
      )
    },
    {
      key: 'slug',
      title: '别名',
      render: (value: any, record: Tag) => record.slug
    },
    {
      key: 'color',
      title: '颜色',
      render: (value: any, record: Tag) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: record.color,
            borderRadius: '4px',
            border: '1px solid #d9d9d9'
          }} />
          <span>{record.color}</span>
        </div>
      )
    },
    {
      key: 'count',
      title: '使用次数',
      render: (value: any, record: Tag) => record.count || 0
    }
  ];

  // 定义操作按钮
  const actions = [
    {
      key: 'edit',
      label: '编辑',
      variant: 'primary' as const,
      icon: <EditIcon />,
      onClick: (tag: Tag) => openModal(tag)
    },
    {
      key: 'delete',
      label: '删除',
      variant: 'danger' as const,
      icon: <DeleteIcon />,
      onClick: (tag: Tag) => {
        setDeletingTag(tag);
        setDeleteModalVisible(true);
      }
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>标签管理</h1>
        <Button variant="primary" onClick={() => openModal()} icon={<PlusIcon />}>新建标签</Button>
      </div>

      <StatsCard stats={[
        {
          title: '标签总数',
          value: stats.totalTags.toString()
        },
        {
          title: '标签使用总次数',
          value: stats.totalUsage.toString()
        },
        {
          title: '最常用标签',
          value: stats.mostUsedTag?.name || '-',
          extra: stats.mostUsedTag && (
            <span style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              backgroundColor: stats.mostUsedTag.color,
              borderRadius: '50%',
              marginLeft: '8px'
            }} />
          )
        }
      ]} />

      <SearchBar
        placeholder="搜索标签名称..."
        onSearch={handleSearch}
      />

      <DataTable
        data={paginatedTags}
        columns={columns}
        actions={actions}
        loading={loading}
        rowKey="id"
        emptyText="暂无标签数据"
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
        title={editingTag ? '编辑标签' : '新建标签'}
        size="medium"
      >
        <TagForm
          initialValues={editingTag ? {
            name: editingTag.name,
            slug: editingTag.slug,
            color: editingTag.color
          } : undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalVisible(false)}
        />
      </FormModal>

      <FormModal
        open={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        title="确认删除"
        size="small"
      >
        <p>确定要删除标签 "{deletingTag?.name}" 吗？此操作不可恢复。</p>
        {deletingTag?.count && deletingTag.count > 0 && (
          <p style={{ color: '#ff4d4f', marginTop: '8px' }}>
            警告：该标签正在被 {deletingTag.count} 篇文章使用，删除后这些文章将失去此标签！
          </p>
        )}
        <div className={styles.modalFooter}>
          <Button
            onClick={() => setDeleteModalVisible(false)}
            className={styles.button}
          >取消</Button>
          <Button
            variant="danger"
            onClick={handleDelete}
          >确认删除</Button>
        </div>
      </FormModal>

      <TagArticlesModal
        visible={articlesModalVisible}
        tag={selectedTag}
        articles={articles}
        loading={articlesLoading}
        onClose={() => {
          setArticlesModalVisible(false);
          setSelectedTag(null);
          setArticles([]);
        }}
      />

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

export default TagManagement; 