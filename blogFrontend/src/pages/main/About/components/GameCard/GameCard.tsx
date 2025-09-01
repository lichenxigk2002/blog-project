import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './GameCard.module.scss';

interface Game {
  id: number;
  name: string;
  image: string;
  description: string;
  color?: string; // 游戏主题色
  officialUrl: string; // 官网链接
}

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
} as const;

const GameCard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLUListElement>(null);

  const [seqWidth, setSeqWidth] = useState<number>(0);
  const [copyCount, setCopyCount] = useState<number>(ANIMATION_CONFIG.MIN_COPIES);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // 游戏数据 - 优化了图片链接和添加了主题色、官网链接
  const games: Game[] = [
    {
      id: 1,
      name: "原神",
      image: "https://images-1359353257.cos.ap-beijing.myqcloud.com/images/bebabb9f-9258-432b-a4e2-0476e60e25df.jpg",
      description: "开放世界冒险RPG",
      color: "#4FC3F7",
      officialUrl: "https://ys.mihoyo.com/"
    },
    {
      id: 2,
      name: "植物大战僵尸2",
      image: "https://images-1359353257.cos.ap-beijing.myqcloud.com/images/6afbad15-cae1-4b80-bdab-0905e81fb8f4.png",
      description: "策略塔防游戏",
      color: "#4CAF50",
      officialUrl: "https://game.talkweb.com.cn/"
    },
    {
      id: 3,
      name: "英雄联盟",
      image: "https://images-1359353257.cos.ap-beijing.myqcloud.com/images/180c97e7-cea9-4a2b-bf43-82e09ef96501.png",
      description: "5v5竞技MOBA",
      color: "#C89B3C",
      officialUrl: "https://www.leagueoflegends.com/"
    },
    {
      id: 4,
      name: "无畏契约",
      image: "https://images-1359353257.cos.ap-beijing.myqcloud.com/images/32b39e76-faa5-4d8d-9baa-976436667a1e.png",
      description: "战术射击游戏",
      color: "#FF4655",
      officialUrl: "https://val.qq.com/"
    },
    {
      id: 5,
      name: "CS2",
      image: "https://images-1359353257.cos.ap-beijing.myqcloud.com/images/82979bb6-28fc-40c5-93fa-5666f687d451.png",
      description: "竞技射击游戏",
      color: "#F99E1A",
      officialUrl: "https://www.counter-strike.net/"
    },
    {
      id: 6,
      name: "明日方舟",
      image: "https://images-1359353257.cos.ap-beijing.myqcloud.com/images/5847d781-e945-4684-a999-2fb6ad313795.png",
      description: "策略塔防RPG",
      color: "#0099FF",
      officialUrl: "https://ak.hypergryph.com/"
    },
    {
      id: 7,
      name: "我的世界",
      image: "https://images-1359353257.cos.ap-beijing.myqcloud.com/images/b8e66473-2030-4d28-ac17-1926b29f8914.jpg",
      description: "沙盒建造游戏",
      color: "#62B47A",
      officialUrl: "https://www.minecraft.net/"
    },
    {
      id: 8,
      name: "部落冲突",
      image: "https://images-1359353257.cos.ap-beijing.myqcloud.com/images/65c65d3c-b0fa-4727-bc77-35427810227f.jpg",
      description: "策略战争游戏",
      color: "#FFC107",
      officialUrl: "https://clashofclans.com/"
    }, {
      id: 9,
      name: "三角洲行动",
      image: "https://images-1359353257.cos.ap-beijing.myqcloud.com/images/21585115-e07d-4137-90d3-aab4ff2e772d.png",
      description: "战术射击游戏",
      color: "#FF4655",
      officialUrl: "https://df.qq.com/"
    }
  ];

  const speed = 25;
  const pauseOnHover = true;
  const hoverSpeedRatio = 0.2; // 悬浮时速度降为20%

  const targetVelocity = speed; // 向左滚动

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const sequenceWidth = seqRef.current?.getBoundingClientRect?.()?.width ?? 0;

    if (sequenceWidth > 0) setSeqWidth(Math.ceil(sequenceWidth));

    const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
    setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
  }, []);

  // 创建动画循环
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (seqWidth > 0) {
      offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      // 悬浮时减速而不是停止
      const target = isHovered && pauseOnHover
        ? targetVelocity * hoverSpeedRatio
        : targetVelocity;

      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (seqWidth > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % seqWidth) + seqWidth) % seqWidth;
        offsetRef.current = nextOffset;

        const translateX = -offsetRef.current;
        track.style.transform = `translate3d(${translateX}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimestampRef.current = null;
    };
  }, [seqWidth, isHovered, pauseOnHover]);

  // 监听尺寸变化
  useEffect(() => {
    const handleResize = () => updateDimensions();
    window.addEventListener('resize', handleResize);
    updateDimensions();
    return () => window.removeEventListener('resize', handleResize);
  }, [updateDimensions]);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsHovered(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsHovered(false);
  }, [pauseOnHover]);

  const handleGameClick = useCallback((game: Game) => {
    // 在新标签页中打开游戏官网
    window.open(game.officialUrl, '_blank', 'noopener,noreferrer');
  }, []);

  const renderGameItem = useCallback((game: Game, key: React.Key) => (
    <li className={styles.gameItem} key={key}>
      <div
        className={styles.gameContent}
        onClick={() => handleGameClick(game)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleGameClick(game);
          }
        }}
        style={{
          '--game-color': game.color || '#6b5b4a'
        } as React.CSSProperties}
      >
        <div className={styles.gameCard}>
          <img
            src={game.image}
            alt={game.name}
            className={styles.gameImage}
            draggable={false}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDE4MCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxODAiIGhlaWdodD0iMTIwIiByeD0iMTIiIGZpbGw9IiMzMzMzMzMiLz4KPHR4dCB4PSI5MCIgeT0iNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+5ri45oiPPC90ZXh0Pgo8L3N2Zz4K';
            }}
          />
        </div>
        <span className={styles.gameName}>{game.name}</span>
      </div>
    </li>
  ), [handleGameClick]);

  const createGameLists = useCallback(() =>
    Array.from({ length: copyCount }, (_, copyIndex) => (
      <ul
        className={styles.gameList}
        key={`copy-${copyIndex}`}
        ref={copyIndex === 0 ? seqRef : undefined}
      >
        {games.map((game, gameIndex) =>
          renderGameItem(game, `${copyIndex}-${gameIndex}`)
        )}
      </ul>
    )),
    [copyCount, renderGameItem]
  );

  const gameLists = useMemo(() => createGameLists(), [createGameLists]);

  return (
    <div className={styles.gameCardContainer}>
      <h1>玩过的游戏</h1>

      <div
        ref={containerRef}
        className={styles.gameCarousel}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.gameTrack} ref={trackRef}>
          {gameLists}
        </div>
      </div>
    </div>
  );
};

export default GameCard; 