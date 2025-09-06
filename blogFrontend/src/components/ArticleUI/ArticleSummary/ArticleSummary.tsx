import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './ArticleSummary.module.scss';
import { summaryConfig } from '@/config/AISummary';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import Typerwriter from '../../Typewriter/Typewriter';

// 配色方案配置
const colorThemes = [
  { name: '蓝色', bg: 'rgba(0,231,255, 0.03)', border: 'rgba(0,231,255, 0.2)', icon: 'rgba(0,231,255,0.6)' },
  { name: '红色', bg: 'rgba(239, 68, 68, 0.03)', border: 'rgba(239, 68, 68, 0.2)', icon: 'rgba(239, 68, 68, 0.6)' },
  { name: '紫色', bg: 'rgba(147, 51, 234, 0.03)', border: 'rgba(147, 51, 234, 0.2)', icon: 'rgba(147, 51, 234, 0.6)' },
  { name: '粉色', bg: 'rgba(236, 72, 153, 0.03)', border: 'rgba(236, 72, 153, 0.2)', icon: 'rgba(236, 72, 153, 0.6)' },
  { name: '橙色', bg: 'rgba(249, 115, 22, 0.03)', border: 'rgba(249, 115, 22, 0.2)', icon: 'rgba(249, 115, 22, 0.6)' },
  { name: '绿色', bg: 'rgba(34, 197, 94, 0.03)', border: 'rgba(34, 197, 94, 0.2)', icon: 'rgba(34, 197, 94, 0.6)' }
];

// 本地存储键名
const COLOR_THEME_STORAGE_KEY = 'articleSummary_colorTheme';
const SUMMARY_MODE_STORAGE_KEY = 'articleSummary_summaryMode';

// 获取本地存储的配色方案索引
const getStoredColorThemeIndex = (): number => {
  if (typeof window === 'undefined') return 0; // SSR 兼容

  try {
    const stored = localStorage.getItem(COLOR_THEME_STORAGE_KEY);
    if (stored !== null) {
      const index = parseInt(stored, 10);
      // 验证索引是否有效
      if (index >= 0 && index < colorThemes.length) {
        return index;
      }
    }
  } catch (error) {
    console.warn('Failed to load color theme from localStorage:', error);
  }

  return 0; // 默认返回第一个配色
};

// 保存配色方案索引到本地存储
const saveColorThemeIndex = (index: number): void => {
  if (typeof window === 'undefined') return; // SSR 兼容

  try {
    localStorage.setItem(COLOR_THEME_STORAGE_KEY, index.toString());
  } catch (error) {
    console.warn('Failed to save color theme to localStorage:', error);
  }
};

// 获取本地存储的摘要模式
const getStoredSummaryMode = (): 'taobao' | 'ai' => {
  if (typeof window === 'undefined') return 'ai'; // SSR 兼容，默认豆包

  try {
    const stored = localStorage.getItem(SUMMARY_MODE_STORAGE_KEY);
    if (stored === 'taobao' || stored === 'ai') {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to load summary mode from localStorage:', error);
  }

  return 'ai'; // 默认返回豆包模式
};

// 保存摘要模式到本地存储
const saveSummaryMode = (mode: 'taobao' | 'ai'): void => {
  if (typeof window === 'undefined') return; // SSR 兼容

  try {
    localStorage.setItem(SUMMARY_MODE_STORAGE_KEY, mode);
  } catch (error) {
    console.warn('Failed to save summary mode to localStorage:', error);
  }
};

interface ArticleSummaryProps {
  title: string;
  content: string;
  taobaoSummary?: string;
  aiSummary?: string;
}

const ArticleSummary: React.FC<ArticleSummaryProps> = ({ taobaoSummary, aiSummary }) => {
  // 如果没有摘要，不渲染组件
  if (!taobaoSummary && !aiSummary) {
    return null;
  }

  const [currentColorIndex, setCurrentColorIndex] = useState(() => getStoredColorThemeIndex());
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentMode, setCurrentMode] = useState<'taobao' | 'ai'>(() => {
    // 优先使用本地存储的模式，如果没有则根据摘要内容判断
    const storedMode = getStoredSummaryMode();
    if (storedMode === 'taobao' && taobaoSummary) {
      return 'taobao';
    } else if (storedMode === 'ai' && aiSummary) {
      return 'ai';
    }
    // 如果存储的模式没有对应的摘要内容，则根据实际内容判断
    return taobaoSummary ? 'taobao' : 'ai';
  });
  const [isAvatarChanging, setIsAvatarChanging] = useState(false);
  const [isTextChanging, setIsTextChanging] = useState(false);

  const currentTheme = colorThemes[currentColorIndex];

  // 组件挂载时加载本地配色配置
  useEffect(() => {
    const storedIndex = getStoredColorThemeIndex();
    if (storedIndex !== currentColorIndex) {
      setCurrentColorIndex(storedIndex);
    }

    // 加载本地存储的摘要模式
    const storedMode = getStoredSummaryMode();
    if (storedMode !== currentMode) {
      // 检查存储的模式是否有对应的摘要内容
      if ((storedMode === 'taobao' && taobaoSummary) || (storedMode === 'ai' && aiSummary)) {
        setCurrentMode(storedMode);
      }
    }
  }, []);

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // 检查是否按下了 Ctrl (Windows) 或 Cmd (Mac)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault(); // 阻止默认行为

        switch (e.key.toLowerCase()) {
          case 'm': // Ctrl+M 切换摘要模式
            if (!isAvatarChanging && !isTextChanging) {
              toggleMode();
            }
            break;
          case 'c': // Ctrl+C 切换配色
            nextColor();
            break;
        }
      }
    };

    // 添加键盘事件监听器
    document.addEventListener('keydown', handleKeyPress);

    // 清理事件监听器
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isAvatarChanging, isTextChanging]); // 依赖项包含动画状态

  const nextColor = () => {
    const newIndex = (currentColorIndex + 1) % colorThemes.length;
    setCurrentColorIndex(newIndex);
    saveColorThemeIndex(newIndex); // 保存到本地存储
  };

  const toggleMode = () => {
    if (isAvatarChanging || isTextChanging) return; // 防止动画期间重复点击

    setIsAvatarChanging(true);
    setIsTextChanging(true);

    // 延迟切换模式，让动画有时间完成
    setTimeout(() => {
      const newMode = currentMode === 'taobao' ? 'ai' : 'taobao';
      setCurrentMode(newMode);
      saveSummaryMode(newMode); // 保存到本地存储
      // 文字内容更新后，延迟重置动画状态，让新内容淡入
      setTimeout(() => {
        setIsAvatarChanging(false);
        setIsTextChanging(false);
      }, 300); // 给新内容淡入的时间
    }, 300); // 等待淡出动画完成后再切换内容
  };

  return (
    <div
      className={styles.articleSummary}
      style={{
        backgroundColor: currentTheme.bg,
        border: `1px solid ${currentTheme.border}`
      }}
    >
      {/* 摘要头部 */}
      <div className={styles.summaryHeader}>
        <div className={`${styles.summaryIcon} ${isAvatarChanging ? styles.avatarChanging : ''}`}>
          <Image
            src={currentMode === 'taobao' ? "/images/avatar.png" : "/images/R-C.png"}
            alt={currentMode === 'taobao' ? "桃宝AI助手" : "豆包助手"}
            width={28}
            height={28}
            className={styles.avatarImage}
          />
        </div>
        <div className={styles.summaryTitle}>
          <h3 className={isTextChanging ? styles.textChanging : ''}>{summaryConfig[currentMode].name}</h3>
          <p className={isTextChanging ? styles.textChanging : ''}>{summaryConfig[currentMode].description}</p>
        </div>
        <div className={styles.headerButtons}>
          <button
            className={styles.modeToggleBtn}
            onClick={toggleMode}
            disabled={isAvatarChanging || isTextChanging}
            title={`当前：${currentMode === 'taobao' ? '胡桃模式' : '豆包模式'}，点击切换（会自动保存）\n快捷键：Ctrl+M`}
          >
            {currentMode === 'taobao' ? '切换到豆包摘要' : '切换到胡桃摘要'}
          </button>
          <button
            className={`${styles.toggleHeightBtn} ${isExpanded ? styles.expanded : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
            title={`当前：${isExpanded ? '收起' : '展开'}`}
          >
            <FiChevronDown />
          </button>

          <button
            className={styles.colorToggleBtn}
            onClick={nextColor}
            title={`当前：${currentTheme.name}，点击切换（会自动保存）\n快捷键：Ctrl+C`}
          >
            🎨
          </button>
        </div>
      </div>

      {/* 摘要内容 */}
      <div className={styles.summaryContent}>
        <div
          className={`${styles.summaryTextWrapper} ${isExpanded ? styles.expanded : ''}`}
        >
          <Typerwriter
            text={(currentMode === 'taobao' ? taobaoSummary : aiSummary) || ''}
            delay={75}
            className={styles.summaryText}
            cursorChar="_"
          />
        </div>
      </div>

      {/* Powered By 标识 */}
      <div className={styles.poweredBy}>
        <span>Powered By</span>
        <a className={styles.modelName}
          href={currentMode === 'taobao' ? 'https://platform.deepseek.com/usage' : 'https://console.volcengine.com/ark/region:ark+cn-beijing/model/detail?Id=doubao-seed-1-6'}
          target="_blank"
          rel="noopener noreferrer"
        >
          {currentMode === 'taobao' ? 'DeepSeek V1' : 'Doubao-Seed-1.6'}
        </a>
      </div>
    </div>
  );
};

export default ArticleSummary; 