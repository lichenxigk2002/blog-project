import { useState, useCallback } from 'react';

interface UseVirtualScrollProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
}

interface UseVirtualScrollReturn {
  virtualItems: any[];
  totalHeight: number;
  offsetY: number;
  startIndex: number;
  endIndex: number;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

export const useVirtualScroll = ({
  items,
  itemHeight,
  containerHeight
}: UseVirtualScrollProps): UseVirtualScrollReturn => {
  const [scrollTop, setScrollTop] = useState(0);

  // 核心计算逻辑
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);
  const offsetY = startIndex * itemHeight;

  // 只返回可视区域内的元素
  const virtualItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    virtualItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    handleScroll
  };
}; 