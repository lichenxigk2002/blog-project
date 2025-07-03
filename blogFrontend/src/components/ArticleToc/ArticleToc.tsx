import React, { useState, useEffect, useRef } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import {FaArrowLeft, FaList} from 'react-icons/fa';
import styles from './ArticleToc.module.scss';
import {useRouter} from "next/router";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface ArticleTocProps {
  headings: Heading[];
  title: string;
  contentHeight: number;
  contentTop: number;
}

const ArticleToc: React.FC<ArticleTocProps> = ({ headings, contentHeight, contentTop }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeId, setActiveId] = useState('');
  const [readingProgress, setReadingProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const routerBack = useRouter();

  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 处理拖动
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isMobile) return;

    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    dragStartPos.current = {
      x: clientX - position.x,
      y: clientY - position.y
    };
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !isMobile) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const newX = clientX - dragStartPos.current.x;
    const newY = clientY - dragStartPos.current.y;

    // 限制在视口范围内
    const maxX = window.innerWidth - (tocRef.current?.offsetWidth || 0);
    const maxY = window.innerHeight - (tocRef.current?.offsetHeight || 0);

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      // 计算阅读进度
      const calculateProgress = () => {
        if (contentHeight <= viewportHeight) {
          return 100; // 如果文章不超过视口高度，直接返回100%
        }

        // 考虑顶部导航栏的高度
        const nav = document.querySelector('nav') as HTMLElement;
        const navHeight = nav?.offsetHeight || 0;
        const adjustedScrollTop = scrollTop - navHeight;
        const adjustedContentTop = contentTop - navHeight;

        const progress = ((adjustedScrollTop - adjustedContentTop) / (contentHeight - viewportHeight)) * 100;
        return Math.min(100, Math.max(0, progress));
      };

      setReadingProgress(calculateProgress());

      // 检测当前激活的标题
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let currentActiveId = '';
      let minDistance = Infinity;

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        const distance = Math.abs(rect.top - 100); // 距离视口顶部的距离

        if (rect.top <= 100 && distance < minDistance) {
          minDistance = distance;
          currentActiveId = heading.id;
        }
      });


      setActiveId(currentActiveId);
    };

    // 添加滚动和调整大小事件监听
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    // 初始计算一次
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [contentHeight, contentTop]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const nav = document.querySelector('nav') as HTMLElement;
      const navHeight = nav?.offsetHeight || 60;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      if (isMobile) {
        setIsExpanded(false);
      }
    }
  };

  return (
    <div
      ref={tocRef}
      className={`${styles.tocContainer} ${isExpanded ? styles.expanded : ''} ${isMobile ? styles.mobile : ''}`}
      style={isMobile ? {
        transform: 'none',
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab'
      } : undefined}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      <div className={styles.tocHeader}>
        {isMobile ? (
          <button
            className={styles.mobileToggleButton}
            onClick={handleToggle}
            aria-label={isExpanded ? '收起目录' : '展开目录'}
          >
            <FaList className={styles.mobileToggleIcon} />
            {isExpanded && <span className={styles.progressText}>{Math.round(readingProgress)}%</span>}
            {isExpanded && <div
                onClick={() => routerBack.back()}
                className={styles.progressText}
            >
              <FaArrowLeft style={{ color: "var(--text)" }} />
            </div>}

          </button>
        ) : (
          <>
            <div className={styles.tocTitle}>
              <span className={styles.progressText}>{Math.round(readingProgress)}%</span>
              <span className={styles.progressText}>目录</span>
            </div>
            <button
              className={styles.toggleButton}
              onClick={handleToggle}
              aria-label={isExpanded ? '收起目录' : '展开目录'}
            >
              <IoIosArrowDown className={styles.toggleIcon} />
            </button>
          </>
        )}
      </div>
      <div className={styles.toc}>
        <ul className={styles.tocList}>
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`${styles.tocItem} ${styles[`level${heading.level}`]} ${activeId === heading.id ? styles.active : ''}`}
            >
              <a
                href={`#${heading.id}`}
                className={styles.tocLink}
                onClick={(e) => handleLinkClick(e, heading.id)}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ArticleToc;