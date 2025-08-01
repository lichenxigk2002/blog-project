// 创建新文件：blogFrontend/src/admin/components/Pagination/Pagination.tsx
import React, { useState } from 'react';
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
    const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);

    const pageSizeOptions = [
        { value: 5, label: '5条/页' },
        { value: 10, label: '10条/页' },
        { value: 20, label: '20条/页' },
        { value: 50, label: '50条/页' }
    ];

    const handlePageSizeSelect = (size: number) => {
        onPageSizeChange(size);
        setIsPageSizeOpen(false);
    };

    return (
        <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
                共 {total} 条记录
            </div>
            <div className={styles.paginationControls}>
                <div className={styles.select}>
                    <div
                        className={styles.selectSelector}
                        onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
                    >
                        {pageSizeOptions.find(option => option.value === pageSize)?.label}
                    </div>
                    {isPageSizeOpen && (
                        <div className={styles.selectDropdown}>
                            {pageSizeOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={`${styles.selectOption} ${pageSize === option.value ? styles.selected : ''}`}
                                    onClick={() => handlePageSizeSelect(option.value)}
                                >
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
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