import { useState, useEffect } from 'react';

/**
 * 移动端检测hook
 * @param breakpoint 断点值，默认768px
 * @returns { isMobile: boolean } 是否为移动端
 */
export const useMobile = (breakpoint: number = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // 初始检查
    checkIsMobile();

    // 添加窗口大小变化监听
    window.addEventListener('resize', checkIsMobile);

    // 清理监听器
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [breakpoint]);

  return { isMobile };
}; 