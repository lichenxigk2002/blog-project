import React, { useState } from 'react';
import styles from './SearchBar.module.scss';
import Button from '../Button/Button';

export interface SearchBarProps {
  placeholder?: string;
  onSearch: (searchText: string) => void;
  className?: string;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "搜索...",
  onSearch,
  className,
  initialValue = ""
}) => {
  const [searchText, setSearchText] = useState(initialValue);

  const handleSearch = () => {
    onSearch(searchText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`${styles.searchBar} ${className || ''}`}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button
        variant="search"
        size="small"
        onClick={handleSearch}
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        }
      >
        搜索
      </Button>
    </div>
  );
};

export default SearchBar; 