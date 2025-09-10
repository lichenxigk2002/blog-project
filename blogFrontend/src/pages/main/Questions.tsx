import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiClock, FiEye, FiThumbsUp } from 'react-icons/fi';
import styles from './Questions/Questions.module.scss';
import Head from 'next/head';
import { useLoading } from '@/hooks/useLoading';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { useDebounce } from '@/hooks/useDebounce';
import { QuestionsAPI } from '@/api/QuestionsAPI';
import { Question, QuestionListResponse } from '@/types/Question';
import QuestionModal from '@/components/QuestionModal/QuestionModal';
import PageHeader from '../../components/PageHeader/PageHeader';

// 新增：定义props类型
interface QuestionsPageProps {
  initialQuestions: Question[];
}

// 更新难度等级为英文
const DIFFICULTY_LEVELS = [
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' }
];

// 添加排序选项
const SORT_OPTIONS = [
  { value: 'newest', label: '最新' },
  { value: 'oldest', label: '最早' },
  { value: 'mostViewed', label: '最多浏览' },
  { value: 'mostLiked', label: '最多点赞' }
];

const Questions: React.FC<QuestionsPageProps> = ({ initialQuestions }) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const { isLoading, withLoading } = useLoading();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  // 获取面试题列表
  useEffect(() => {
    // SSG兜底：如果props有数据则不再请求
    if (initialQuestions && initialQuestions.length > 0) return;
    const fetchQuestions = async () => {
      try {
        const response = await QuestionsAPI.getQuestions({
          page: 1,
          size: 50
        });
        if (response && response.data) {
          const { records } = response.data as unknown as QuestionListResponse;
          if (Array.isArray(records)) {
            setQuestions(records);
          } else {
            setQuestions([]);
          }
        } else {
          setQuestions([]);
        }
      } catch (error) {
        setQuestions([]);
      }
    };
    fetchQuestions();
  }, [initialQuestions]);

  // 使用 useMemo 优化过滤和排序逻辑
  const filteredAndSortedQuestions = useMemo(() => {
    let result = [...questions];

    // 本地搜索过滤
    if (localSearchQuery) {
      const query = localSearchQuery.toLowerCase();
      result = result.filter(question =>
        question.title.toLowerCase().includes(query) ||
        question.content.toLowerCase().includes(query)
      );
    }

    // 难度等级过滤
    if (selectedDifficulty) {
      result = result.filter(question =>
        question.difficulty === selectedDifficulty
      );
    }

    // 排序
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
        break;
      case 'mostViewed':
        result.sort((a, b) => b.views - a.views);
        break;
      case 'mostLiked':
        result.sort((a, b) => b.likes - a.likes);
        break;
    }

    return result;
  }, [questions, localSearchQuery, selectedDifficulty, sortBy]);

  // 修改搜索处理函数
  const handleSearch = (value: string) => {
    setLocalSearchQuery(value);
    setSearchQuery(value); // 仍然保留 API 搜索
  };

  // 清除筛选时同时清除本地搜索
  const handleClearFilters = () => {
    setSearchQuery('');
    setLocalSearchQuery('');
    setSelectedDifficulty('');
    setSortBy('newest');
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 获取难度等级颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#52c41a';
      case 'medium':
        return '#faad14';
      case 'hard':
        return '#f5222d';
      default:
        return '#666';
    }
  };

  // 获取难度等级中文标签
  const getDifficultyLabel = (difficulty: string) => {
    return DIFFICULTY_LEVELS.find(d => d.value === difficulty)?.label || difficulty;
  };

  // 处理问题卡片点击
  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question);
  };

  // 处理模态框关闭
  const handleModalClose = () => {
    setSelectedQuestion(null);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>纸上的逻辑，心上的算法</title>
      </Head>

      <div className={styles.headerWrapper}>
        <PageHeader
          headerText="面试集"
          introText="每一场面试，都是一次与自己对话的旅程。问题如雨滴落下，有的湿润了思路，有的击穿了信心。而这里，是我收集的露珠——折射过晨光的算法，凝结过深夜的思考。愿它们成为你的路标，而非枷锁。"
          englishTitle="Questions"
        />
      </div>

      <div className={styles.searchSortContainer}>
        <div className={styles.searchBox}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="搜索面试题..."
            value={localSearchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button
            className={styles.filterButton}
            onClick={() => setShowFilters(!showFilters)}
            aria-label="筛选"
          >
            <FiFilter />
          </button>
        </div>
        <div className={styles.sortOptions}>
          {SORT_OPTIONS.map(option => (
            <button
              key={option.value}
              className={`${styles.sortOption} ${sortBy === option.value ? styles.active : ''}`}
              onClick={() => setSortBy(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            className={styles.filters}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className={styles.filterSection}>
              <h3>难度等级</h3>
              <div className={styles.filterOptions}>
                {DIFFICULTY_LEVELS.map(level => (
                  <button
                    key={level.value}
                    className={`${styles.filterOption} ${selectedDifficulty === level.value ? styles.active : ''}`}
                    onClick={() => setSelectedDifficulty(level.value === selectedDifficulty ? '' : level.value)}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {(selectedDifficulty || searchQuery) && (
              <button
                className={styles.clearFilters}
                onClick={handleClearFilters}
              >
                清除筛选
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
          </div>
        ) : (
          <motion.div
            className={styles.questionsGrid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filteredAndSortedQuestions.length > 0 ? (
              filteredAndSortedQuestions.map((question) => (
                <motion.div
                  key={question.id}
                  className={styles.questionCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleQuestionClick(question)}
                >
                  <div className={styles.questionHeader}>
                    <span className={styles.difficulty} data-difficulty={question.difficulty}>
                      {getDifficultyLabel(question.difficulty)}
                    </span>
                  </div>
                  <h3 className={styles.questionTitle}>{question.title}</h3>
                  <p className={styles.questionContent}>
                    {question.content.length > 150
                      ? `${question.content.slice(0, 150)}...`
                      : question.content}
                  </p>
                  <div className={styles.questionMeta}>
                    <span className={styles.metaItem}>
                      <FiClock className={styles.metaIcon} />
                      {formatDate(question.updatedAt)}
                    </span>
                    <span className={styles.metaItem}>
                      <FiEye className={styles.metaIcon} />
                      {question.views}
                    </span>
                    <span className={styles.metaItem}>
                      <FiThumbsUp className={styles.metaIcon} />
                      {question.likes}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className={styles.noResults}>
                <p>没有找到相关面试题</p>
                <p className={styles.noResultsTip}>试试其他关键词或筛选条件？</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <QuestionModal
        question={selectedQuestion}
        onClose={handleModalClose}
      />
    </div>
  );
};

// 新增：getStaticProps实现SSG+ISR
import { GetStaticProps } from 'next';
export const getStaticProps: GetStaticProps = async () => {
  try {
    const response = await QuestionsAPI.getQuestions({ page: 1, size: 50 });
    if (response && response.data) {
      const { records } = response.data as unknown as QuestionListResponse;
      return {
        props: {
          initialQuestions: Array.isArray(records) ? records : []
        },
        revalidate: 600 // ISR: 每10分钟自动更新
      };
    }
    return {
      props: {
        initialQuestions: []
      },
      revalidate: 600
    };
  } catch (err) {
    return {
      props: {
        initialQuestions: []
      },
      revalidate: 600
    };
  }
};

export default Questions; 