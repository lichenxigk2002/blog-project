import React, { useState, useEffect, useRef } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { FaArrowLeft, FaList } from 'react-icons/fa';
import styles from './ArticleToc.module.scss';
import { useRouter } from "next/router";

/**
 * 文章标题结构接口
 * 用于定义文章中的标题层级和导航信息
 */
interface Heading {
  id: string;        // 标题的唯一标识符，用于锚点跳转
  text: string;      // 标题文本内容
  level: number;     // 标题层级（1-6，对应h1-h6）
}

/**
 * 文章目录组件属性接口
 * 定义组件接收的props类型
 */
interface ArticleTocProps {
  headings: Heading[];     // 文章标题列表
  title: string;          // 文章标题
  contentHeight: number;  // 文章内容高度，用于计算阅读进度
  contentTop: number;     // 文章内容顶部位置，用于进度计算
}

/**
 * 智能文章目录组件
 * 
 * 功能特性：
 * 1. 实时阅读进度追踪 - 根据滚动位置计算阅读百分比
 * 2. 智能标题高亮 - 自动高亮当前阅读位置的标题
 * 3. 多级导航支持 - 支持h1-h6六级标题的层级显示
 * 4. 响应式设计 - 桌面端固定侧边栏，移动端底部弹窗
 * 5. 平滑滚动跳转 - 点击目录项平滑跳转到对应标题
 * 6. 自适应展开收起 - 桌面端可展开/收起，移动端全屏显示
 */
const ArticleToc: React.FC<ArticleTocProps> = ({ headings, contentHeight, contentTop }) => {
  // 组件展开状态 - 控制目录的显示/隐藏
  const [isExpanded, setIsExpanded] = useState(false);

  // 当前激活的标题ID - 用于高亮当前阅读位置的标题
  const [activeId, setActiveId] = useState('');

  // 阅读进度百分比 - 0-100的数值，表示文章阅读进度
  const [readingProgress, setReadingProgress] = useState(0);

  // 移动端检测状态 - 用于响应式布局切换
  const [isMobile, setIsMobile] = useState(false);

  // 目录容器引用 - 用于DOM操作和样式控制
  const tocRef = useRef<HTMLDivElement>(null);

  // Next.js路由对象 - 用于移动端返回功能
  const routerBack = useRouter();

  /**
   * 移动端检测逻辑
   * 监听窗口大小变化，动态切换移动端/桌面端模式
   */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /**
   * 核心滚动监听逻辑
   * 实现阅读进度追踪和智能标题高亮功能
   */
  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      /**
       * 计算阅读进度百分比
       * 考虑导航栏高度，确保进度计算准确
       */
      const calculateProgress = () => {
        if (contentHeight <= viewportHeight) {
          return 100; // 如果文章不超过视口高度，直接返回100%
        }

        // 获取导航栏高度，用于调整计算基准
        const nav = document.querySelector('nav') as HTMLElement;
        const navHeight = nav?.offsetHeight || 0;

        // 调整滚动位置和内容位置，排除导航栏影响
        const adjustedScrollTop = scrollTop - navHeight;
        const adjustedContentTop = contentTop - navHeight;

        // 计算阅读进度百分比
        const progress = ((adjustedScrollTop - adjustedContentTop) / (contentHeight - viewportHeight)) * 100;
        return Math.min(100, Math.max(0, progress)); // 确保进度在0-100范围内
      };

      setReadingProgress(calculateProgress());

      /**
       * 智能标题高亮算法
       * 找到距离视口顶部最近的标题，并标记为激活状态
       */
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let currentActiveId = '';
      let minDistance = Infinity;

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        const distance = Math.abs(rect.top - 100); // 距离视口顶部100px的距离

        // 选择距离视口顶部最近且已进入视口的标题
        if (rect.top <= 100 && distance < minDistance) {
          minDistance = distance;
          currentActiveId = heading.id;
        }
      });

      setActiveId(currentActiveId);
    };

    // 添加滚动和窗口大小变化监听
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    // 初始化时执行一次计算
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [contentHeight, contentTop]);

  /**
   * 切换目录展开/收起状态
   * 桌面端：展开显示完整目录，收起只显示进度条
   * 移动端：展开显示全屏目录，收起显示底部工具栏
   */
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  /**
   * 目录项点击处理
   * 实现平滑滚动到对应标题位置
   */
  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // 获取导航栏高度，用于调整滚动位置
      const nav = document.querySelector('nav') as HTMLElement;
      const navHeight = nav?.offsetHeight || 60;

      // 计算目标滚动位置，确保标题不被导航栏遮挡
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      // 平滑滚动到目标位置
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // 移动端点击后自动收起目录
      if (isMobile) {
        setIsExpanded(false);
      }
    }
  };

  return (
    <div
      ref={tocRef}
      className={`${styles.tocContainer} ${isExpanded ? styles.expanded : ''} ${isMobile ? styles.mobile : ''}`}
    >
      {/* 目录头部区域 - 显示进度和展开/收起按钮 */}
      <div className={styles.tocHeader}>
        {isMobile ? (
          // 移动端头部布局
          <button
            className={styles.mobileToggleButton}
            onClick={handleToggle}
            aria-label={isExpanded ? '收起目录' : '展开目录'}
          >
            <div className={styles.mobileLeft}>
              <FaList className={styles.mobileToggleIcon} />
              <span className={styles.progressText}>目录</span>
            </div>
            <div className={styles.mobileRight}>
              <span className={styles.progressText}>{Math.round(readingProgress)}%</span>
              {/* 移动端返回按钮 - 仅在展开状态显示 */}
              {isExpanded && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    routerBack.back();
                  }}
                  className={styles.backButton}
                >
                  <FaArrowLeft />
                </div>
              )}
            </div>
          </button>
        ) : (
          // 桌面端头部布局
          <div className={styles.tocTitleRow}>
            <span className={styles.progressText}>{Math.round(readingProgress)}%</span>
            <span className={styles.progressText}>目录</span>
            {/* 桌面端进度条 */}
            <progress
              className={styles.desktopProgressBar}
              value={readingProgress}
              max={100}
              aria-label="阅读进度"
            />
            {/* 展开/收起按钮 */}
            <button
              className={styles.toggleButton}
              onClick={handleToggle}
              aria-label={isExpanded ? '收起目录' : '展开目录'}
            >
              <IoIosArrowDown className={styles.toggleIcon} />
            </button>
          </div>
        )}
      </div>

      {/* 目录内容区域 - 显示多级标题导航 */}
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