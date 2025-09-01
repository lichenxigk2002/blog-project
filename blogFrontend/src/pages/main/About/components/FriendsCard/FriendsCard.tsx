import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FriendLinksAPI } from '@/api/FriendLinkAPI';
import { FriendLinks } from '@/types/FriendLinks';
import styles from './FriendsCard.module.scss';

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
} as const;

const FriendsCard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef1 = useRef<HTMLDivElement>(null);
  const trackRef2 = useRef<HTMLDivElement>(null);
  const list1Ref = useRef<HTMLDivElement>(null);
  const list2Ref = useRef<HTMLDivElement>(null);

  const [friendLinks, setFriendLinks] = useState<FriendLinks[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [copyCount, setCopyCount] = useState<number>(ANIMATION_CONFIG.MIN_COPIES);
  const [listHeight1, setListHeight1] = useState<number>(0);
  const [listHeight2, setListHeight2] = useState<number>(0);

  // 滚动动画配置
  const speed = 30; // 滚动速度
  const pauseOnHover = true;
  const hoverSpeedRatio = 0.3; // 悬浮时速度降为30%

  const targetVelocity1 = speed; // 第一列向下滚动
  const targetVelocity2 = -speed; // 第二列向上滚动（反向）

  // 获取友链数据
  useEffect(() => {
    const fetchFriendLinks = async () => {
      try {
        setLoading(true);
        const response = await FriendLinksAPI.getAllFriendLinks();
        if (Array.isArray(response)) {
          // 只显示已批准的友链
          const approvedLinks = response.filter(link => link.status === 'approved');
          setFriendLinks(approvedLinks);
        } else {
          setFriendLinks([]);
        }
      } catch (error) {
        console.error('获取友链失败:', error);
        setFriendLinks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendLinks();
  }, []);

  // 分成两列
  const friendsColumn1: FriendLinks[] = useMemo(() =>
    friendLinks.slice(0, Math.ceil(friendLinks.length / 2)),
    [friendLinks]
  );

  const friendsColumn2: FriendLinks[] = useMemo(() =>
    friendLinks.slice(Math.ceil(friendLinks.length / 2)),
    [friendLinks]
  );

  // 计算需要的复制数量
  const updateDimensions = useCallback(() => {
    const containerHeight = containerRef.current?.clientHeight ?? 0;
    const sequenceHeight1 = list1Ref.current?.getBoundingClientRect?.()?.height ?? 0;
    const sequenceHeight2 = list2Ref.current?.getBoundingClientRect?.()?.height ?? 0;

    if (sequenceHeight1 > 0) setListHeight1(Math.ceil(sequenceHeight1));
    if (sequenceHeight2 > 0) setListHeight2(Math.ceil(sequenceHeight2));

    const minHeight = Math.min(sequenceHeight1, sequenceHeight2);
    if (minHeight > 0) {
      const copiesNeeded = Math.ceil(containerHeight / minHeight) + ANIMATION_CONFIG.COPY_HEADROOM;
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
    }
  }, []);

  // 创建动画循环的通用函数
  const createAnimationLoop = (
    trackRef: React.RefObject<HTMLDivElement>,
    listHeight: number,
    targetVelocity: number,
    offsetRef: React.MutableRefObject<number>,
    velocityRef: React.MutableRefObject<number>,
    rafRef: React.MutableRefObject<number | null>,
    lastTimestampRef: React.MutableRefObject<number | null>
  ) => {
    const track = trackRef.current;
    if (!track) return;

    if (listHeight > 0) {
      offsetRef.current = ((offsetRef.current % listHeight) + listHeight) % listHeight;
      track.style.transform = `translate3d(0, ${-offsetRef.current}px, 0)`;
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

      if (listHeight > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % listHeight) + listHeight) % listHeight;
        offsetRef.current = nextOffset;

        const translateY = -offsetRef.current;
        track.style.transform = `translate3d(0, ${translateY}px, 0)`;
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
  };

  // 第一列动画
  const rafRef1 = useRef<number | null>(null);
  const lastTimestampRef1 = useRef<number | null>(null);
  const offsetRef1 = useRef(0);
  const velocityRef1 = useRef(0);

  useEffect(() => {
    const cleanup = createAnimationLoop(
      trackRef1, listHeight1, targetVelocity1,
      offsetRef1, velocityRef1, rafRef1, lastTimestampRef1
    );
    return cleanup;
  }, [listHeight1, isHovered, pauseOnHover]);

  // 第二列动画
  const rafRef2 = useRef<number | null>(null);
  const lastTimestampRef2 = useRef<number | null>(null);
  const offsetRef2 = useRef(0);
  const velocityRef2 = useRef(0);

  useEffect(() => {
    const cleanup = createAnimationLoop(
      trackRef2, listHeight2, targetVelocity2,
      offsetRef2, velocityRef2, rafRef2, lastTimestampRef2
    );
    return cleanup;
  }, [listHeight2, isHovered, pauseOnHover]);

  // 监听尺寸变化
  useEffect(() => {
    const handleResize = () => updateDimensions();
    window.addEventListener('resize', handleResize);
    updateDimensions();
    return () => window.removeEventListener('resize', handleResize);
  }, [updateDimensions]);

  // 当友链数据变化时重新计算尺寸
  useEffect(() => {
    if (friendLinks.length > 0) {
      const timer = setTimeout(() => {
        updateDimensions();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [friendLinks.length, updateDimensions]);

  const handleFriendClick = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const renderFriendItem = useCallback((friend: FriendLinks, key: React.Key) => (
    <div className={styles.friendItem} key={key}>
      <div
        className={styles.friendContent}
        onClick={() => handleFriendClick(friend.url)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFriendClick(friend.url);
          }
        }}
      >
        <div className={styles.avatarContainer}>
          <img
            src={friend.avatarUrl}
            alt={friend.name}
            title={`点击访问 ${friend.name} 的网站`}
            className={styles.friendAvatar}
          />
        </div>
        <span className={styles.friendName}>{friend.name}</span>
      </div>
    </div>
  ), [handleFriendClick]);

  // 创建无限滚动的友链列表
  const createInfiniteFriendLists = useCallback((friends: FriendLinks[], listRefTarget: React.RefObject<HTMLDivElement>) => {
    if (friends.length === 0) return [];

    return Array.from({ length: copyCount }, (_, copyIndex) => (
      <div
        className={styles.friendsListCopy}
        key={`copy-${copyIndex}`}
        ref={copyIndex === 0 ? listRefTarget : undefined}
      >
        {friends.map((friend, friendIndex) =>
          renderFriendItem(friend, `${copyIndex}-${friendIndex}`)
        )}
      </div>
    ));
  }, [copyCount, renderFriendItem]);

  const infiniteFriendLists1 = useMemo(() =>
    createInfiniteFriendLists(friendsColumn1, list1Ref),
    [createInfiniteFriendLists, friendsColumn1]
  );

  const infiniteFriendLists2 = useMemo(() =>
    createInfiniteFriendLists(friendsColumn2, list2Ref),
    [createInfiniteFriendLists, friendsColumn2]
  );

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsHovered(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsHovered(false);
  }, [pauseOnHover]);

  if (loading) {
    return (
      <div className={styles.friendsCard}>
        <h1>朋友们</h1>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (friendLinks.length === 0) {
    return (
      <div className={styles.friendsCard}>
        <h1>朋友们</h1>
        <div className={styles.emptyContainer}>
          <p>暂无友链</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.friendsCard}>
      <h1>朋友们</h1>

      <div
        ref={containerRef}
        className={styles.friendsContainer}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* 第一列 */}
        <div className={styles.friendsColumn}>
          <div className={styles.friendsTrack} ref={trackRef1}>
            {infiniteFriendLists1}
          </div>
        </div>

        {/* 第二列 */}
        <div className={styles.friendsColumn}>
          <div className={styles.friendsTrack} ref={trackRef2}>
            {infiniteFriendLists2}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsCard; 