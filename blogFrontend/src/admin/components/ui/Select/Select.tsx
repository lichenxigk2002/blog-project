import React, { useState, useRef, useEffect } from 'react';
import styles from './Select.module.scss';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  value?: string | number | (string | number)[];
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string | number | (string | number)[]) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  width?: string;
  className?: string;
  searchable?: boolean;
  multiple?: boolean;
  maxHeight?: string;
  layout?: 'horizontal' | 'vertical';
  label?: string;
}

const Select: React.FC<SelectProps> = ({
  value,
  options,
  placeholder = '请选择',
  onChange,
  disabled = false,
  size = 'medium',
  width = 'auto',
  className = '',
  searchable = false,
  multiple = false,
  maxHeight = '200px',
  layout = 'horizontal',
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  // 处理点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchText('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 过滤选项
  const filteredOptions = searchable
    ? options.filter(option =>
      option.label.toLowerCase().includes(searchText.toLowerCase())
    )
    : options;

  // 获取当前选中项的标签
  const getSelectedLabel = () => {
    if (multiple && Array.isArray(value)) {
      const selectedOptions = options.filter(option => value.includes(option.value));
      return selectedOptions.length > 0
        ? `${selectedOptions.length} 项已选择`
        : placeholder;
    }

    const selectedOption = options.find(option => option.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  };

  const handleOptionClick = (optionValue: string | number) => {
    if (multiple) {
      const currentValue = Array.isArray(value) ? value : [];
      const newValue = currentValue.includes(optionValue)
        ? currentValue.filter(v => v !== optionValue)
        : [...currentValue, optionValue];
      onChange?.(newValue);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
      setSearchText('');
    }
  };

  const isOptionSelected = (optionValue: string | number) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <div
      ref={selectRef}
      className={`${styles.select} ${styles[size]} ${styles[layout]} ${disabled ? styles.disabled : ''} ${className}`}
      style={{ width }}
    >
      {layout === 'vertical' && label && (
        <label className={styles.selectLabel}>{label}</label>
      )}
      <div
        className={`${styles.selectSelector} ${isOpen ? styles.open : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={styles.selectValue}>{getSelectedLabel()}</span>
        <span className={styles.selectArrow}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </div>

      {isOpen && (
        <div className={styles.selectDropdown} style={{ maxHeight }}>
          {searchable && (
            <div className={styles.searchContainer}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="搜索..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          )}

          <div className={styles.optionsContainer}>
            {filteredOptions.length === 0 ? (
              <div className={styles.noOptions}>
                暂无选项
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`${styles.selectOption} ${isOptionSelected(option.value) ? styles.selected : ''
                    } ${option.disabled ? styles.disabled : ''}`}
                  onClick={() => !option.disabled && handleOptionClick(option.value)}
                >
                  {multiple && (
                    <input
                      type="checkbox"
                      checked={isOptionSelected(option.value)}
                      readOnly
                      className={styles.checkbox}
                    />
                  )}
                  <span className={styles.optionLabel}>{option.label}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select; 