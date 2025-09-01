import React from 'react';
import Image from 'next/image';
import styles from './AvatarCard.module.scss';

const AvatarCard: React.FC = () => {

  // 浮动标签数据
  const floatingTags = [
    { text: "💻 全栈开发工程师", delay: 0, tagIndex: 1 },
    { text: "🎮 游戏菜鸟但热爱", delay: 1, tagIndex: 2 },
    { text: "🎯 ENTJ 理性思考者", delay: 2, tagIndex: 3 },
    { text: "⚡ 前端技术狂热者", delay: 3, tagIndex: 4 },
    { text: "🌸 二次元爱好者", delay: 4, tagIndex: 5 },
    { text: "🎵 音乐发烧友", delay: 5, tagIndex: 6 },
    { text: "📸 摄影初学者", delay: 6, tagIndex: 7 },
    { text: "☕ 咖啡重度依赖", delay: 7, tagIndex: 8 }
  ];

  return (
    <div className={styles.avatarCard}>
      {/* 左侧头像区域 */}
      <div className={styles.avatarSection}>
        <Image
          src={'/images/avatar_20250520_215057.png'}
          alt={'avatar'}
          width={224}
          height={224}
          quality={100}
          priority
          unoptimized
          className={styles.avatar}
        />
      </div>

      {/* 右侧标签区域 */}
      <div className={styles.tagsSection}>
        {floatingTags.map((tag, index) => (
          <div
            key={index}
            className={`${styles.floatingTag} ${styles[`tag${tag.tagIndex}`]}`}
            style={{
              animationDelay: `${tag.delay}s`
            }}
          >
            {tag.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvatarCard; 