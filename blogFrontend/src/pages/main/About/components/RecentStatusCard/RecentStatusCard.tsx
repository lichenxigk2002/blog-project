import React, { useEffect, useState } from 'react';
import styles from './RecentStatusCard.module.scss';
import { ThoughtsAPI } from '@/api/ThoughtsAPI';
import { ThoughtsProps } from '@/types/Thoughts';
import {
  FiHeart, FiSmile, FiZap, FiCoffee, FiBookOpen, FiBriefcase,
  FiHome, FiMapPin, FiTag, FiClock, FiCloud, FiSmartphone
} from 'react-icons/fi';

const RecentStatusCard: React.FC = () => {
  const [latestThought, setLatestThought] = useState<ThoughtsProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestThought = async () => {
      try {
        const thoughts = await ThoughtsAPI.getAllThoughts();
        if (Array.isArray(thoughts) && thoughts.length > 0) {
          // 获取最新的灵感（按创建时间排序）
          const sortedThoughts = thoughts.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setLatestThought(sortedThoughts[0]);
        }
      } catch (error) {
        console.error('获取最新状态失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestThought();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return '刚刚';
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`;
    return `${Math.floor(diffInMinutes / 1440)}天前`;
  };

  const getMoodIcon = (mood: string) => {
    const moodMap: { [key: string]: React.ReactElement } = {
      '开心': <FiSmile />,
      '快乐': <FiSmile />,
      '兴奋': <FiZap />,
      '平静': <FiCoffee />,
      '思考': <FiBookOpen />,
      '专注': <FiBookOpen />,
      '疲惫': <FiHome />,
      '焦虑': <FiBookOpen />,
      '沮丧': <FiBookOpen />,
      '愤怒': <FiZap />,
      '惊喜': <FiZap />,
      '满足': <FiSmile />,
      '期待': <FiHeart />,
      '感激': <FiHeart />,
      '爱': <FiHeart />,
      '创意': <FiZap />,
      '灵感': <FiZap />,
      '学习': <FiBookOpen />,
      '工作': <FiBriefcase />,
      '休息': <FiHome />
    };
    return moodMap[mood] || <FiSmile />;
  };

  return (
    <div className={styles.recentStatusCard}>
      <h1>最近状态</h1>
      <div className={styles.statusContent}>
        {loading ? (
          <div className={styles.statusText}>加载中...</div>
        ) : latestThought ? (
          <>
            <div className={styles.statusHeader}>
              <span className={styles.moodIcon}>
                {getMoodIcon(latestThought.mood)}
              </span>
              <span className={styles.location}>
                <FiMapPin />
                {latestThought.location}
              </span>
            </div>
            <div className={styles.statusText}>
              {latestThought.content.length > 25
                ? `${latestThought.content.substring(0, 25)}...`
                : latestThought.content
              }
            </div>
            <div className={styles.statusFooter}>
              <div className={styles.tags}>
                {latestThought.tags && latestThought.tags.split(',').slice(0, 2).map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    <FiTag />
                    {tag.trim()}
                  </span>
                ))}
              </div>
              <div className={styles.statusTime}>
                <FiClock />
                {formatTime(latestThought.createdAt)}
              </div>
            </div>
            <div className={styles.statusMeta}>
              <span className={styles.weather}>
                {latestThought.weather && (
                  <>
                    <FiCloud />
                    {latestThought.weather}
                  </>
                )}
              </span>
              <span className={styles.device}>
                {latestThought.device && (
                  <>
                    <FiSmartphone />
                    {latestThought.device}
                  </>
                )}
              </span>
            </div>
          </>
        ) : (
          <div className={styles.statusText}>暂无状态</div>
        )}
      </div>
    </div>
  );
};

export default RecentStatusCard; 