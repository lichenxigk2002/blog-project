import React, { useState, useEffect } from 'react';
import { GalleryAPI } from '@/api/GalleryAPI';
import type { Gallery } from '@/types/Gallery';
import GalleryForm from './GalleryForm';
import styles from './GalleryManagement.module.scss';
import Pagination from "@/admin/components/ui/Pagination/Pagination";
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';
import Button from '../ui/Button/Button';
import StatsCard from '../ui/StatsCard/StatsCard';
import SearchBar from '../ui/SearchBar/SearchBar';
import DataTable from '../ui/DataTable/DataTable';
import FormModal from '../ui/FormModal/FormModal';
import { PlusIcon, EditIcon, DeleteIcon } from '../ui/Icons/Icons';

const GalleryManagement: React.FC = () => {
  const [allGalleries, setAllGalleries] = useState<Gallery[]>([]);
  const [paginatedGalleries, setPaginatedGalleries] = useState<Gallery[]>([]); // 存储当前页评论
  const [filteredGalleries, setFilteredGalleries] = useState<Gallery[]>([]); // 存储过滤后的标签
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [deletingGallery, setDeletingGallery] = useState<Gallery | null>(null);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tipModal, setTipModal] = useState<{ open: boolean, message: string, type: 'success' | 'failure' }>({ open: false, message: '', type: 'success' });

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setPaginatedGalleries(filteredGalleries.slice(start, end));
  }, [currentPage, pageSize, filteredGalleries]);

  useEffect(() => {
    fetchGalleries();
  }, [currentPage, pageSize]);

  const fetchGalleries = async (title = '') => {
    setLoading(true);
    try {
      const response = await GalleryAPI.getGalleries();
      let data = response;
      if (title) {
        data = data.filter((item: Gallery) => item.title.includes(title));
      }
      setAllGalleries(data)
      setTotal(data.length);
      setFilteredGalleries(data)
    } catch (error) {
      console.error('获取相册列表失败:', error);
      setTipModal({ open: true, message: '获取相册列表失败', type: 'failure' });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (gallery?: Gallery) => {
    setEditingGallery(gallery || null);
    setModalVisible(true);
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (editingGallery) {
        await GalleryAPI.updateGallery(editingGallery.id, formData);
        setTipModal({ open: true, message: '更新成功', type: 'success' });
      } else {
        await GalleryAPI.addGallery(formData);
        setTipModal({ open: true, message: '创建成功', type: 'success' });
      }
      setModalVisible(false);
      fetchGalleries();
    } catch (e: any) {
      console.error('操作失败:', e);
      setTipModal({ open: true, message: e.message || '操作失败', type: 'failure' });
    }
  };

  const handleDelete = async () => {
    if (!deletingGallery) return;

    try {
      setLoading(true);
      await GalleryAPI.deleteGallery(deletingGallery.id);
      setTipModal({ open: true, message: '删除成功', type: 'success' });
      setDeleteModalVisible(false);
      setDeletingGallery(null);
      await fetchGalleries();
    } catch (error: any) {
      setTipModal({ open: true, message: error.message || '删除失败', type: 'failure' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchText: string) => {
    setCurrentPage(1);
    setSearchText(searchText);
    fetchGalleries(searchText);
  };

  const stats = {
    totalGalleries: allGalleries.length,
    totalCategories: new Set(allGalleries.map(g => g.category)).size,
    mostRecentGallery: allGalleries[0]?.title || '-'
  };

  const columns = [
    {
      key: 'coverImage',
      title: '封面',
      sortable: false,
      width: '15%',
      render: (value: any, record: Gallery) => (
        record.coverImage ? (
          <img
            key={record.id}
            src={record.coverImage}
            alt={record.title}
            className={styles.coverImage}
            onError={(e) => {
              console.error('图片加载失败:', {
                originalPath: record.coverImage,
                error: e
              });
              const target = e.target as HTMLImageElement;
              if (target.src !== '/default-image.jpg') {
                target.src = '/default-image.jpg';
              }
            }}
          />
        ) : (
          <img
            src="/default-image.jpg"
            alt="默认封面"
            className={styles.coverImage}
          />
        )
      )
    },
    {
      key: 'title',
      title: '标题',
      sortable: true,
      width: '20%',
      render: (value: any, record: Gallery) => record.title
    },
    {
      key: 'description',
      title: '描述',
      sortable: false,
      width: '30%',
      render: (value: any, record: Gallery) => record.description
    },
    {
      key: 'category',
      title: '分类',
      sortable: true,
      width: '15%',
      render: (value: any, record: Gallery) => (
        <span className={styles.categoryTag}>
          {record.category}
        </span>
      )
    },
    {
      key: 'date',
      title: '创建时间',
      sortable: true,
      width: '20%',
      render: (value: any, record: Gallery) => new Date(record.date).toLocaleDateString()
    }
  ];

  const actions = [
    {
      key: 'edit',
      label: '编辑',
      variant: 'primary' as const,
      icon: <EditIcon />,
      onClick: (record: Gallery) => openModal(record)
    },
    {
      key: 'delete',
      label: '删除',
      variant: 'danger' as const,
      icon: <DeleteIcon />,
      onClick: (record: Gallery) => {
        setDeletingGallery(record);
        setDeleteModalVisible(true);
      }
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>相册管理</h1>
        <Button variant="primary" onClick={() => openModal()} icon={<PlusIcon />}>新建相册</Button>
      </div>

      <StatsCard stats={[
        { title: '相册总数', value: stats.totalGalleries.toString() },
        { title: '分类总数', value: stats.totalCategories.toString() },
        { title: '最新相册', value: stats.mostRecentGallery }
      ]} />

      <SearchBar
        placeholder="搜索相册标题..."
        onSearch={handleSearch}
        initialValue={searchText}
      />

      <DataTable
        data={paginatedGalleries}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyText="暂无相册数据"
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
        title={editingGallery ? '编辑相册' : '新增相册'}
        size="large"
      >
        <GalleryForm
          initialData={editingGallery || undefined}
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
        <p>确定要删除相册 "{deletingGallery?.title}" 吗？此操作不可恢复。</p>
        <div className={styles.modalFooter}>
          <Button
            className={styles.button}
            onClick={() => {
              setDeleteModalVisible(false);
              setDeletingGallery(null);
            }}
          >取消</Button>
          <Button
            variant="danger"
            onClick={handleDelete}
          >确认删除</Button>
        </div>
      </FormModal>

      {/* 操作提示弹窗 */}
      <OperationTipModal
        open={tipModal.open}
        onClose={() => setTipModal({ ...tipModal, open: false })}
        message={tipModal.message}
        type={tipModal.type}
      />
    </div>
  );
};

export default GalleryManagement; 