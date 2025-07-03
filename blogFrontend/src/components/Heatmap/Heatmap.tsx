import React, { useEffect, useState } from 'react';
import { ArticlesAPI } from '@/api/ArticlesAPI';
import styles from './Heatmap.module.scss';

interface HeatmapProps {
  data?: boolean[];
}

interface ApiResponse {
  data: Article[];
  error?: string;
}

interface Article {
  id: number;
  title: string;
  publishedAt: string;
  // 其他文章属性...
}

const Heatmap: React.FC<HeatmapProps> = ({ data: propData }) => {
  const [heatmapData, setHeatmapData] = useState<boolean[]>(Array(365).fill(false));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ArticlesAPI.getArticles() as ApiResponse;
        if (response && Array.isArray(response.data)) {
          const newHeatmapData = Array(365).fill(false);
          response.data.forEach((article: Article) => {
            const date = new Date(article.publishedAt);
            const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
            newHeatmapData[dayOfYear] = true;
          });
          setHeatmapData(newHeatmapData);
        }
      } catch (error) {
        console.error('获取文章数据失败:', error);
      }
    };

    if (!propData) {
      fetchData();
    }
  }, [propData]);

  const displayData = propData || heatmapData;

  return (
    <div className={styles.heatmap}>
      {displayData.map((active, index) => (
        <div
          key={index}
          className={`${styles.heatmapDot} ${active ? styles.active : ''}`}
        />
      ))}
    </div>
  );
};

export default Heatmap; 