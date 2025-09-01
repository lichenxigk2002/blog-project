import React, { useState } from 'react';
import styles from './MusicCard.module.scss';

interface Music {
  id: number;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: string;
  isPlaying?: boolean;
  url?: string;
}

const MusicCard: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const currentMusic: Music = {
    id: 1,
    title: "倒数",
    artist: "邓紫棋",
    album: "新的心跳",
    cover: "https://images-1359353257.cos.ap-beijing.myqcloud.com/images/4395c9c7-fd61-4154-a62b-74a19f3139ff.webp",
    duration: "3:49",
    url: "https://y.qq.com/n/yqq/mv/m/011rEod72CWYBn.html"
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    // 延迟跳转，让用户看到播放状态变化
    setTimeout(() => {
      if (currentMusic.url) {
        window.open(currentMusic.url, '_blank');
      }
    }, 300);
  };

  return (
    <div className={styles.musicCardContainer}>
      <h1>最近在听</h1>

      <div className={styles.musicContent}>
        <div className={styles.musicCover}>
          <img src={currentMusic.cover} alt={currentMusic.title} />
          <div
            className={`${styles.playButton} ${isPlaying ? styles.playing : ''}`}
            onClick={handlePlay}
          >
            <span className={styles.playIcon}>
              {isPlaying ? '⏸' : '▶'}
            </span>
          </div>
        </div>

        <div className={styles.musicInfo}>
          <div className={styles.musicTitle}>{currentMusic.title}</div>
          <div className={styles.musicArtist}>{currentMusic.artist}</div>
          <div className={styles.musicAlbum}>{currentMusic.album}</div>
          <div className={styles.musicDuration}>{currentMusic.duration}</div>
        </div>
      </div>
    </div>
  );
};

export default MusicCard; 