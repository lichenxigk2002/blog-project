import React, { useState, useRef, useEffect } from 'react';
import styles from './MultiSelect.module.scss';
import Checkbox from '../Checkbox/Checkbox';

export interface MultiSelectOption {
  id: number;
  label: string;
  value: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  selectedIds: number[];
  onSelectionChange: (selectedIds: number[]) => void;
  label?: string;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  showSelectAll?: boolean;
  selectAllLabel?: string;
  mode?: 'dropdown' | 'buttons';  // 新增模式选择
  dropdownPosition?: 'top' | 'bottom';  // 下拉菜单位置
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedIds,
  onSelectionChange,
  label,
  placeholder = '请选择',
  loading = false,
  disabled = false,
  className = '',
  showSelectAll = true,
  selectAllLabel = '全选',
  mode = 'dropdown',
  dropdownPosition = 'bottom'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === 0) {
      // 全选
      onSelectionChange(options.map(option => option.id));
    } else {
      // 取消全选
      onSelectionChange([]);
    }
  };

  const handleOptionChange = (optionId: number, checked: boolean) => {
    const newSelectedIds = checked
      ? [...selectedIds, optionId]
      : selectedIds.filter(id => id !== optionId);
    onSelectionChange(newSelectedIds);
  };

  const getDisplayText = () => {
    if (selectedIds.length === 0) {
      return placeholder;
    }
    if (selectedIds.length === options.length) {
      return `已选择全部 (${selectedIds.length})`;
    }
    return `已选择 ${selectedIds.length} 项`;
  };

  return (
    <div className={`${styles.multiSelect} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      {mode === 'dropdown' ? (
        <div className={styles.selectContainer} ref={dropdownRef}>
          <div
            className={`${styles.selector} ${disabled ? styles.disabled : ''}`}
            onClick={handleToggle}
          >
            <span className={styles.selectorText}>{getDisplayText()}</span>
            <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`}>▼</span>
          </div>
          {isOpen && (
            <div className={`${styles.dropdown} ${styles[dropdownPosition]}`}>
              {loading ? (
                <div className={styles.loadingText}>加载中...</div>
              ) : (
                <>
                  {showSelectAll && (
                    <>
                      <div className={styles.option}>
                        <Checkbox
                          checked={selectedIds.length === options.length && options.length > 0}
                          onChange={handleSelectAll}
                          label={selectAllLabel}
                        />
                      </div>
                      {options.length > 0 && <div className={styles.divider}></div>}
                    </>
                  )}
                  {options.map(option => (
                    <div key={option.id} className={styles.option}>
                      <Checkbox
                        checked={selectedIds.includes(option.id)}
                        onChange={(checked) => handleOptionChange(option.id, checked)}
                        label={option.label}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.selectContainer} ref={dropdownRef}>
          <div
            className={`${styles.selector} ${disabled ? styles.disabled : ''}`}
            onClick={handleToggle}
          >
            <span className={styles.selectorText}>
              {selectedIds.length > 0
                ? selectedIds.map(id => options.find(opt => opt.id === id)?.label).join(', ')
                : placeholder}
            </span>
            <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`}>▼</span>
          </div>
          {isOpen && (
            <div className={`${styles.buttonDropdown} ${styles[dropdownPosition]}`}>
              {loading ? (
                <div className={styles.loadingText}>加载中...</div>
              ) : (
                <div className={styles.buttonGroup}>
                  {options.map(option => (
                    <button
                      key={option.id}
                      type="button"
                      className={`${styles.button} ${selectedIds.includes(option.id) ? styles.selected : ''}`}
                      onClick={() => handleOptionChange(option.id, !selectedIds.includes(option.id))}
                      disabled={disabled}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect; 