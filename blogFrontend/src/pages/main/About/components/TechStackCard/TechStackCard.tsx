import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './TechStackCard.module.scss';

interface TechItem {
  name: string;
  image: string;
  url?: string; // 添加官网链接
}

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
} as const;

const TechStackCard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef1 = useRef<HTMLDivElement>(null);
  const trackRef2 = useRef<HTMLDivElement>(null);
  const trackRef3 = useRef<HTMLDivElement>(null);
  const seqRef1 = useRef<HTMLUListElement>(null);
  const seqRef2 = useRef<HTMLUListElement>(null);
  const seqRef3 = useRef<HTMLUListElement>(null);

  const [seqWidth1, setSeqWidth1] = useState<number>(0);
  const [seqWidth2, setSeqWidth2] = useState<number>(0);
  const [seqWidth3, setSeqWidth3] = useState<number>(0);
  const [copyCount, setCopyCount] = useState<number>(ANIMATION_CONFIG.MIN_COPIES);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // 从项目中获取的技术栈图标
  const allTechImages = [
    { image: 'React.png', url: 'https://react.dev/' },
    { image: 'Vue.png', url: 'https://vuejs.org/' },
    { image: 'Angular.png', url: 'https://angular.io/' },
    { image: 'NextJS.png', url: 'https://nextjs.org/' },
    { image: 'js.png', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
    { image: 'Typescript.png', url: 'https://www.typescriptlang.org/' },
    { image: 'html.png', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
    { image: 'css.png', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
    { image: 'scss.png', url: 'https://sass-lang.com/' },
    { image: 'tailwindcss.png', url: 'https://www.tailwindcss.cn/' },
    { image: 'nodejs.png', url: 'https://nodejs.org/' },
    { image: 'python.png', url: 'https://www.python.org/' },
    { image: 'java.png', url: 'https://www.oracle.com/java/' },
    { image: 'c语言.png', url: 'https://en.cppreference.com/w/c' },
    { image: 'spring.png', url: 'https://spring.io/' },
    { image: 'Mysql.png', url: 'https://www.mysql.com/' },
    { image: 'mongodb.png', url: 'https://www.mongodb.com/' },
    { image: 'git.png', url: 'https://git-scm.com/' },
    { image: 'docker.png', url: 'https://www.docker.com/' },
    { image: 'nginx.png', url: 'https://nginx.org/' },
    { image: 'webpack.png', url: 'https://webpack.js.org/' },
    { image: 'vite.png', url: 'https://vitejs.dev/' },
    { image: 'redux.png', url: 'https://redux.js.org/' },
    { image: 'expo.png', url: 'https://expo.dev/' },
    { image: 'uniapp.png', url: 'https://uniapp.dcloud.net.cn/' },
    { image: '鸿蒙.png', url: 'https://developer.harmonyos.com/' },
    { image: 'wireshark.png', url: 'https://www.wireshark.org/' },
    { image: 'Photoshop.png', url: 'https://www.adobe.com/products/photoshop.html' },
    { image: '宝塔.png', url: 'https://www.bt.cn/' },
    { image: 'matlab.png', url: 'https://www.mathworks.com/products/matlab.html' }
  ];

  // 分成三组
  const techStack1: TechItem[] = allTechImages.slice(0, 10).map(tech => ({
    name: tech.image.replace(/\.(png|jpg|jpeg|svg)$/i, ''),
    image: tech.image,
    url: tech.url
  }));

  const techStack2: TechItem[] = allTechImages.slice(10, 20).map(tech => ({
    name: tech.image.replace(/\.(png|jpg|jpeg|svg)$/i, ''),
    image: tech.image,
    url: tech.url
  }));

  const techStack3: TechItem[] = allTechImages.slice(20).map(tech => ({
    name: tech.image.replace(/\.(png|jpg|jpeg|svg)$/i, ''),
    image: tech.image,
    url: tech.url
  }));

  const speed = 30;
  const pauseOnHover = true;
  const hoverSpeedRatio = 0.3; // 悬浮时速度降为30%

  const targetVelocity1 = speed; // 向左滚动
  const targetVelocity2 = -speed; // 向右滚动
  const targetVelocity3 = speed; // 向左滚动

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const sequenceWidth1 = seqRef1.current?.getBoundingClientRect?.()?.width ?? 0;
    const sequenceWidth2 = seqRef2.current?.getBoundingClientRect?.()?.width ?? 0;
    const sequenceWidth3 = seqRef3.current?.getBoundingClientRect?.()?.width ?? 0;

    if (sequenceWidth1 > 0) setSeqWidth1(Math.ceil(sequenceWidth1));
    if (sequenceWidth2 > 0) setSeqWidth2(Math.ceil(sequenceWidth2));
    if (sequenceWidth3 > 0) setSeqWidth3(Math.ceil(sequenceWidth3));

    const minWidth = Math.min(sequenceWidth1, sequenceWidth2, sequenceWidth3);
    const copiesNeeded = Math.ceil(containerWidth / minWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
    setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
  }, []);

  // 创建动画循环的通用函数
  const createAnimationLoop = (
    trackRef: React.RefObject<HTMLDivElement>,
    seqWidth: number,
    targetVelocity: number,
    offsetRef: React.MutableRefObject<number>,
    velocityRef: React.MutableRefObject<number>,
    rafRef: React.MutableRefObject<number | null>,
    lastTimestampRef: React.MutableRefObject<number | null>
  ) => {
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
  };

  // 第一行动画
  const rafRef1 = useRef<number | null>(null);
  const lastTimestampRef1 = useRef<number | null>(null);
  const offsetRef1 = useRef(0);
  const velocityRef1 = useRef(0);

  useEffect(() => {
    const cleanup = createAnimationLoop(
      trackRef1, seqWidth1, targetVelocity1,
      offsetRef1, velocityRef1, rafRef1, lastTimestampRef1
    );
    return cleanup;
  }, [seqWidth1, isHovered, pauseOnHover]);

  // 第二行动画
  const rafRef2 = useRef<number | null>(null);
  const lastTimestampRef2 = useRef<number | null>(null);
  const offsetRef2 = useRef(0);
  const velocityRef2 = useRef(0);

  useEffect(() => {
    const cleanup = createAnimationLoop(
      trackRef2, seqWidth2, targetVelocity2,
      offsetRef2, velocityRef2, rafRef2, lastTimestampRef2
    );
    return cleanup;
  }, [seqWidth2, isHovered, pauseOnHover]);

  // 第三行动画
  const rafRef3 = useRef<number | null>(null);
  const lastTimestampRef3 = useRef<number | null>(null);
  const offsetRef3 = useRef(0);
  const velocityRef3 = useRef(0);

  useEffect(() => {
    const cleanup = createAnimationLoop(
      trackRef3, seqWidth3, targetVelocity3,
      offsetRef3, velocityRef3, rafRef3, lastTimestampRef3
    );
    return cleanup;
  }, [seqWidth3, isHovered, pauseOnHover]);

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

  const handleTechClick = useCallback((url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  const renderTechItem = useCallback((item: TechItem, key: React.Key) => (
    <li className={styles.techItem} key={key}>
      <div
        className={styles.techContent}
        onClick={() => handleTechClick(item.url)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTechClick(item.url);
          }
        }}
      >
        <img
          src={`/technologyStack/${item.image}`}
          alt={item.name}
          title={`点击访问 ${item.name} 官网`}
          className={styles.techImage}
        />
        <span className={styles.techName}>{item.name}</span>
      </div>
    </li>
  ), [handleTechClick]);

  const createTechLists = useCallback((techStack: TechItem[], seqRefTarget: React.RefObject<HTMLUListElement>) =>
    Array.from({ length: copyCount }, (_, copyIndex) => (
      <ul
        className={styles.techList}
        key={`copy-${copyIndex}`}
        ref={copyIndex === 0 ? seqRefTarget : undefined}
      >
        {techStack.map((item, itemIndex) =>
          renderTechItem(item, `${copyIndex}-${itemIndex}`)
        )}
      </ul>
    )),
    [copyCount, renderTechItem]
  );

  const techLists1 = useMemo(() => createTechLists(techStack1, seqRef1), [createTechLists, techStack1]);
  const techLists2 = useMemo(() => createTechLists(techStack2, seqRef2), [createTechLists, techStack2]);
  const techLists3 = useMemo(() => createTechLists(techStack3, seqRef3), [createTechLists, techStack3]);

  return (
    <div className={styles.techStackCard}>
      <h1>我所掌握的技术</h1>

      <div
        ref={containerRef}
        className={styles.techCarousel}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* 第一行 - 向左滚动 */}
        <div className={styles.techRow}>
          <div className={styles.techTrack} ref={trackRef1}>
            {techLists1}
          </div>
        </div>

        {/* 第二行 - 向右滚动 */}
        <div className={styles.techRow}>
          <div className={styles.techTrack} ref={trackRef2}>
            {techLists2}
          </div>
        </div>

        {/* 第三行 - 向左滚动 */}
        <div className={styles.techRow}>
          <div className={styles.techTrack} ref={trackRef3}>
            {techLists3}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStackCard; 