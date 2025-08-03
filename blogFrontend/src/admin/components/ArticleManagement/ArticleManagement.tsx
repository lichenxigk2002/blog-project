import React, { useState, useEffect } from 'react';
import { ArticlesAPI } from '@/api/ArticlesAPI';
import { TagsAPI } from '@/api/TagsAPI';
import { CopyrightAPI } from '@/api/CopyrightAPI';
import ArticleForm from './ArticleForm';
import type { Article } from '@/types/Article';
import styles from './ArticleManagement.module.scss';
import Pagination from "@/admin/components/ui/Pagination/Pagination";
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';
import { buildArticleData } from "@/utils/articleUtils";
import Button from '../ui/Button/Button';
import StatsCard from '../ui/StatsCard/StatsCard';
import SearchBar from '../ui/SearchBar/SearchBar';
import FormModal from '../ui/FormModal/FormModal';
import { PlusIcon, EditIcon, DeleteIcon, DragIcon } from '../ui/Icons/Icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


const ArticleManagement: React.FC = () => {
  const [paginatedArticles, setPaginatedArticles] = useState<Article[]>([]); // 存储当前页评论
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]); // 存储过滤后的标签
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);
  const [allTags, setAllTags] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [tipModal, setTipModal] = useState<{ open: boolean, message: string, type: 'success' | 'error' | 'info' | 'warning' | 'loading' }>({ open: false, message: '', type: 'success' });
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 需要移动8px才开始拖拽
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setPaginatedArticles(filteredArticles.slice(start, end) as Article[]);
  }, [currentPage, pageSize, allArticles]);

  useEffect(() => {
    fetchArticles();
    fetchTags();
  }, [currentPage, pageSize]);

  const fetchArticles = async (title = '') => {
    setLoading(true);
    try {
      const response = await ArticlesAPI.getArticles();
      if (!response || 'error' in response) {
        throw new Error(typeof response?.error === 'string' ? response.error : '获取文章列表失败');
      }
      const data = response.data as unknown as Article[];

      // 根据搜索关键词过滤文章
      const filteredData = title
        ? data.filter(article =>
          article.title.toLowerCase().includes(title.toLowerCase())
        )
        : data;

      // 对文章进行排序：置顶文章优先，然后按排序值排序，最后按发布时间排序
      const sortedData = [...filteredData].sort((a, b) => {
        // 首先按置顶状态排序（置顶的排在前面）
        if (a.isTop && !b.isTop) return -1;
        if (!a.isTop && b.isTop) return 1;

        // 如果都是置顶文章，按排序值排序
        if (a.isTop && b.isTop) {
          const aSortOrder = a.sortOrder ?? 0;
          const bSortOrder = b.sortOrder ?? 0;
          if (aSortOrder !== bSortOrder) {
            return bSortOrder - aSortOrder; // 数值大的排在前面
          }
          // 如果排序值相同，按发布时间排序（新文章在前）
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        }

        // 如果都是非置顶文章，按排序值排序
        if (!a.isTop && !b.isTop) {
          const aSortOrder = a.sortOrder ?? 0;
          const bSortOrder = b.sortOrder ?? 0;
          if (aSortOrder !== bSortOrder) {
            return bSortOrder - aSortOrder; // 数值大的排在前面
          }
          // 如果排序值相同，按发布时间排序（新文章在前）
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        }

        return 0;
      });

      setAllArticles(sortedData);
      setFilteredArticles(sortedData);
      setTotal(sortedData.length);
    } catch (error: any) {
      console.error('Failed to fetch articles:', error);
      setTipModal({ open: true, message: (error instanceof Error ? error.message : '获取文章列表失败'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await TagsAPI.getTags();
      setAllTags(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      setAllTags([]);
    }
  };

  const openModal = (article?: Article) => {
    setEditingArticle(article || null);
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const data = buildArticleData(values, editingArticle);

      if (editingArticle && editingArticle.id) {
        data.id = editingArticle.id;
        await ArticlesAPI.updateArticle(editingArticle.id, data);
        setTipModal({ open: true, message: '更新成功', type: 'success' });
      } else {
        // 创建新文章
        const response = await ArticlesAPI.createArticle(data);
        setTipModal({ open: true, message: '创建成功', type: 'success' });

        // 为新文章自动创建"无版权"的版权信息
        if (response && response.data && response.data.id) {
          try {
            await CopyrightAPI.createOrUpdateCopyright(
              response.data.id,
              '无版权',
              '无版权'
            );
            console.log('版权信息创建成功');
          } catch (copyrightError) {
            console.error('版权信息创建失败:', copyrightError);
            // 版权创建失败不影响文章创建，只记录日志
          }
        }
      }
      setModalVisible(false);
      fetchArticles();
    } catch (e: any) {
      console.error('操作失败:', e);
      setTipModal({ open: true, message: e.message || '操作失败', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deletingArticle) return;

    try {
      setLoading(true);
      if (deletingArticle.id) {
        await ArticlesAPI.deleteArticle(deletingArticle.id);
      }
      setTipModal({ open: true, message: '删除成功', type: 'success' });
      setDeleteModalVisible(false);
      setDeletingArticle(null);
      await fetchArticles();
    } catch (error: any) {
      setTipModal({ open: true, message: error.message || '删除失败', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: '文章总数', value: allArticles.length },
    { title: '已发布', value: allArticles.filter(a => a.status === 'published').length },
    { title: '总浏览量', value: allArticles.reduce((sum, article) => sum + (article.viewCount || 0), 0) },
    { title: '总点赞数', value: allArticles.reduce((sum, article) => sum + (article.likeCount || 0), 0) }
  ];



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

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = paginatedArticles.findIndex(item => item.id === Number(active.id));
    const newIndex = paginatedArticles.findIndex(item => item.id === Number(over.id));

    if (oldIndex === -1 || newIndex === -1) return;

    const draggedArticle = paginatedArticles[oldIndex];

    // 如果拖拽的是置顶文章，自动取消置顶
    if (draggedArticle.isTop) {
      try {
        await ArticlesAPI.updateArticle(Number(active.id), { isTop: false });
      } catch (error) {
        console.error('取消置顶失败:', error);
        return;
      }
    }

    // 重新排列文章
    const newItems = arrayMove(paginatedArticles, oldIndex, newIndex);

    // 计算新的排序值
    const sortData = newItems
      .filter(article => article.id !== undefined)
      .map((article, index) => ({
        id: article.id!,
        sortOrder: (newItems.length - index) * 10
      }));

    try {
      await ArticlesAPI.batchUpdateSort(sortData);

      // 直接更新本地状态，不重新获取数据
      const updatedItems = newItems.map((article, index) => ({
        ...article,
        sortOrder: (newItems.length - index) * 10,
        // 如果拖拽的是置顶文章，更新其置顶状态
        isTop: article.id === Number(active.id) ? false : article.isTop
      }));

      // 重新排序（置顶优先，然后按排序值，最后按发布时间）
      const finalSortedItems = [...updatedItems].sort((a, b) => {
        if (a.isTop && !b.isTop) return -1;
        if (!a.isTop && b.isTop) return 1;

        if (a.isTop && b.isTop) {
          const aSortOrder = a.sortOrder ?? 0;
          const bSortOrder = b.sortOrder ?? 0;
          if (aSortOrder !== bSortOrder) {
            return bSortOrder - aSortOrder; // 数值大的排在前面
          }
          // 如果排序值相同，按发布时间排序（新文章在前）
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        }

        if (!a.isTop && !b.isTop) {
          const aSortOrder = a.sortOrder ?? 0;
          const bSortOrder = b.sortOrder ?? 0;
          if (aSortOrder !== bSortOrder) {
            return bSortOrder - aSortOrder; // 数值大的排在前面
          }
          // 如果排序值相同，按发布时间排序（新文章在前）
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        }

        return 0;
      });

      setPaginatedArticles(finalSortedItems);
      setFilteredArticles(finalSortedItems);
      setAllArticles(finalSortedItems);

    } catch (error) {
      console.error('更新排序失败:', error);
      // 如果失败，重新获取数据
      await fetchArticles();
    }
  };

  // 可拖拽的表格行组件
  const SortableTableRow = ({ article, index }: { article: Article; index: number }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: article.id!.toString() });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={styles.tableRow}
      >
        <div className={styles.tableCell} style={{ fontWeight: 500 }}>
          {article.title}
          {article.isTop && <span style={{ color: '#ffd700', marginLeft: '8px' }}>⭐</span>}
        </div>
        <div className={styles.tableCell}>
          {article.publishedAt ? new Date(article.publishedAt).toLocaleString() : '-'}
        </div>
        <div className={styles.tableCell}>
          <span className={`${styles.statusTag} ${article.status === 'published'
            ? styles.published
            : article.status === 'archived'
              ? styles.archived
              : styles.draft
            }`}>
            {article.status === 'published'
              ? '已发布'
              : article.status === 'archived'
                ? '已归档'
                : '草稿'}
          </span>
        </div>
        <div className={styles.tableCell}>{article.readingTime} 分钟</div>
        <div className={styles.tableCell}>{article.viewCount}</div>
        <div className={styles.tableCell}>{article.likeCount}</div>
        <div className={styles.tableCell}>
          <div className={styles.actionButtons}>
            <Button
              variant="primary"
              onClick={() => openModal(article)}
              icon={<EditIcon />}
            >编辑</Button>
            <Button
              variant="danger"
              onClick={() => {
                setDeletingArticle(article);
                setDeleteModalVisible(true);
              }}
              icon={<DeleteIcon />}
            >删除</Button>
          </div>
        </div>
        <div
          className={styles.tableCell}
          style={{ width: '50px', cursor: 'grab', textAlign: 'center' }}
          {...attributes}
          {...listeners}
        >
          <DragIcon size={16} color="#666" />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>文章管理</h1>
        <Button variant="primary" onClick={() => openModal()} icon={<PlusIcon />}>新建文章</Button>
      </div>

      <StatsCard stats={stats} />

      <SearchBar
        placeholder="搜索文章标题..."
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
            onClick={() => handleSort('publishedAt')}
          >
            发布时间
            {sortField === 'publishedAt' && (
              <span className={styles.sortIcon}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </div>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortable}`}
            onClick={() => handleSort('status')}
          >
            状态
            {sortField === 'status' && (
              <span className={styles.sortIcon}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </div>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortable}`}
            onClick={() => handleSort('readingTime')}
          >
            阅读时长
            {sortField === 'readingTime' && (
              <span className={styles.sortIcon}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </div>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortable}`}
            onClick={() => handleSort('viewCount')}
          >
            浏览量
            {sortField === 'viewCount' && (
              <span className={styles.sortIcon}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </div>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortable}`}
            onClick={() => handleSort('likeCount')}
          >
            点赞数
            {sortField === 'likeCount' && (
              <span className={styles.sortIcon}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </div>
          <div className={styles.tableHeaderCell}>操作</div>
          <div className={styles.tableHeaderCell}>拖拽</div>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={paginatedArticles.map(item => item.id!.toString())}
            strategy={verticalListSortingStrategy}
          >
            <div className={styles.tableBody}>
              {paginatedArticles.map((article, index) => (
                <SortableTableRow key={article.id} article={article} index={index} />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <div className={styles.dragOverlay}>
                <div className={styles.tableCell} style={{ fontWeight: 500 }}>
                  {paginatedArticles.find(item => item.id?.toString() === activeId)?.title}
                </div>
                <div className={styles.tableCell}>
                  {paginatedArticles.find(item => item.id?.toString() === activeId)?.publishedAt ?
                    new Date(paginatedArticles.find(item => item.id?.toString() === activeId)!.publishedAt!).toLocaleString() : '-'}
                </div>
                <div className={styles.tableCell}>
                  <span className={`${styles.statusTag} ${paginatedArticles.find(item => item.id?.toString() === activeId)?.status === 'published'
                    ? styles.published
                    : paginatedArticles.find(item => item.id?.toString() === activeId)?.status === 'archived'
                      ? styles.archived
                      : styles.draft
                    }`}>
                    {paginatedArticles.find(item => item.id?.toString() === activeId)?.status === 'published'
                      ? '已发布'
                      : paginatedArticles.find(item => item.id?.toString() === activeId)?.status === 'archived'
                        ? '已归档'
                        : '草稿'}
                  </span>
                </div>
                <div className={styles.tableCell}>{paginatedArticles.find(item => item.id?.toString() === activeId)?.readingTime} 分钟</div>
                <div className={styles.tableCell}>{paginatedArticles.find(item => item.id?.toString() === activeId)?.viewCount}</div>
                <div className={styles.tableCell}>{paginatedArticles.find(item => item.id?.toString() === activeId)?.likeCount}</div>
                <div className={styles.tableCell}>
                  <div className={styles.actionButtons}>
                    <Button
                      variant="primary"
                      onClick={() => { }}
                      icon={<EditIcon />}
                    >编辑</Button>
                    <Button
                      variant="danger"
                      onClick={() => { }}
                      icon={<DeleteIcon />}
                    >删除</Button>
                  </div>
                </div>
                <div className={styles.tableCell} style={{ width: '50px', textAlign: 'center' }}>
                  <DragIcon size={16} color="#666" />
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
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

      <FormModal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        title={editingArticle ? '编辑文章' : '新建文章'}
        size="large"
      >
        <ArticleForm
          allTags={allTags}
          initialValues={editingArticle ? {
            ...editingArticle,
            status: editingArticle.status as 'draft' | 'published',
            postType: editingArticle.postType as 'post' | 'page',
            tags: editingArticle.tags?.map(tag => tag.id) || []
          } : undefined}
          onSubmit={handleSubmit}
        />
      </FormModal>

      <FormModal
        open={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        title="确认删除"
        size="small"
      >
        <p>确定要删除文章 "{deletingArticle?.title}" 吗？此操作不可恢复。</p>
        <div className={styles.modalFooter}>
          <Button
            className={styles.button}
            onClick={() => setDeleteModalVisible(false)}
          >取消</Button>
          <Button
            variant="danger"
            onClick={handleDelete}
          >确认删除</Button>
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

export default ArticleManagement; 