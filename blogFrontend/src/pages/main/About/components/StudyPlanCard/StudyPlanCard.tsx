import React from 'react';
import styles from './StudyPlanCard.module.scss';

interface StudyItem {
  id: number;
  title: string;
  progress: number;
  status: 'learning' | 'planned' | 'completed';
  icon: string;
}

const StudyPlanCard: React.FC = () => {
  const studyItems: StudyItem[] = [
    {
      id: 1,
      title: "鸿蒙",
      progress: 30,
      status: 'learning',
      icon: "/technologyStack/鸿蒙.png"
    },
    {
      id: 2,
      title: "Expo",
      progress: 60,
      status: 'learning',
      icon: "/technologyStack/expo.png"
    },
    {
      id: 3,
      title: "Spring Boot",
      progress: 80,
      status: 'learning',
      icon: "/technologyStack/spring.png"
    },
    {
      id: 4,
      title: "Docker",
      progress: 25,
      status: 'planned',
      icon: "/technologyStack/docker.png"
    }
  ];

  const getStatusColor = (status: string, progress: number) => {
    if (status === 'completed' || progress === 100) {
      return '#4caf50'; // 绿色
    } else if (status === 'learning') {
      return '#4facfe'; // 蓝色
    } else {
      return '#ffa726'; // 橙色
    }
  };

  return (
    <div className={styles.studyPlanContainer}>
      <h1>学习计划</h1>

      <div className={styles.studyGrid}>
        {studyItems.map((item) => (
          <div
            key={item.id}
            className={styles.studySquare}
          >
            <div className={styles.iconContainer}>
              <img src={item.icon} alt={item.title} />
            </div>
            <div
              className={styles.studyProgress}
              style={{ color: getStatusColor(item.status, item.progress) }}
            >
              {item.progress}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyPlanCard; 