// 创建新文件：blogFrontend/src/admin/components/Pagination/Pagination.tsx
import React from 'react';
import styles from './Pagination.module.scss';

interface PaginationProps {
    total: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
                                                   total,
                                                   currentPage,
                                                   pageSize,
                                                   onPageChange,
                                                   onPageSizeChange
                                               }) => {
    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
                共 {total} 条记录
            </div>
            <div className={styles.paginationControls}>
                <select
                    className={styles.pageSizeSelect}
                    value={pageSize}
                    onChange={(e) => {
                        onPageSizeChange(Number(e.target.value));
                        onPageChange(1); // 切换每页条数时重置到第一页
                    }}
                >
                    <option value={5}>5条/页</option>
                    <option value={10}>10条/页</option>
                    <option value={20}>20条/页</option>
                    <option value={50}>50条/页</option>
                </select>
                <button
                    className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                >
                    上一页
                </button>
                <span className={styles.paginationCurrent}>
                    第 {currentPage} 页
                </span>
                <button
                    className={`${styles.paginationButton} ${currentPage >= totalPages ? styles.disabled : ''}`}
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage >= totalPages}
                >
                    下一页
                </button>
            </div>
        </div>
    );
};

export default Pagination;