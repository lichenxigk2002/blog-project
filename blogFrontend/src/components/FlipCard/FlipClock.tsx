import React, { useEffect, useRef } from 'react';
import FlipCard, { FlipCardHandleInterface } from './FlipCard';
import styles from './FlipClock.module.scss';

function FlipClock( ) {
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const flipCardHour1Ref = useRef<FlipCardHandleInterface | null>(null);
  const flipCardHour2Ref = useRef<FlipCardHandleInterface | null>(null);
  const flipCardMinute1Ref = useRef<FlipCardHandleInterface | null>(null);
  const flipCardMinute2Ref = useRef<FlipCardHandleInterface | null>(null);
  const flipCardSecond1Ref = useRef<FlipCardHandleInterface | null>(null);
  const flipCardSecond2Ref = useRef<FlipCardHandleInterface | null>(null);

  const flipCards = [
    flipCardHour1Ref,
    flipCardHour2Ref,
    flipCardMinute1Ref,
    flipCardMinute2Ref,
    flipCardSecond1Ref,
    flipCardSecond2Ref,
  ];

  useEffect(() => {
    const run = () => {
      timer.current = setInterval(() => {
        const now = new Date();
        const nowTimeStr = formatDate(
          new Date(now.getTime() - 1000),
          'hhiiss'
        );
        const nextTimeStr = formatDate(now, 'hhiiss');
        for (let i = 0; i < flipCards.length; i++) {
          if (nowTimeStr[i] === nextTimeStr[i]) continue;
          flipCards[i].current?.flipDown(nowTimeStr[i], nextTimeStr[i]);
        }
      }, 1000);
    };
    run();

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  // 格式化日期
  const formatDate = (date: Date, dateFormat: string) => {
    const formatMap: Record<string, number> = {
      'h+': date.getHours(),
      'i+': date.getMinutes(),
      's+': date.getSeconds(),
    };

    for (const key in formatMap) {
      const match = dateFormat.match(new RegExp(`(${key})`));
      if (match) {
        const str = formatMap[key] + '';
        dateFormat = dateFormat.replace(
          match[0],
          match[0].length === 1 ? str : str.padStart(2, '0')
        );
      }
    }

    return dateFormat;
  };

  // 初始化
  const now = new Date();
  const initNowTimeStr = formatDate(now, 'hhiiss');

  return (
    <div className={styles.clock}>
      <FlipCard ref={flipCardHour1Ref} initFrontText={initNowTimeStr[0]} />
      <FlipCard ref={flipCardHour2Ref} initFrontText={initNowTimeStr[1]} />
      <em>:</em>
      <FlipCard ref={flipCardMinute1Ref} initFrontText={initNowTimeStr[2]} />
      <FlipCard ref={flipCardMinute2Ref} initFrontText={initNowTimeStr[3]} />
      <em>:</em>
      <FlipCard ref={flipCardSecond1Ref} initFrontText={initNowTimeStr[4]} />
      <FlipCard ref={flipCardSecond2Ref} initFrontText={initNowTimeStr[5]} />
    </div>
  );
}

export default FlipClock; 