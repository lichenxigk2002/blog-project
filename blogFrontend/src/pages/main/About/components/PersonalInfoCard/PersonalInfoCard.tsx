import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './PersonalInfoCard.module.scss';

const PersonalInfoCard: React.FC = () => {
  const introTextsRef = useRef<HTMLParagraphElement[]>([]);
  const highlightCharsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const introTexts = introTextsRef.current;
    const highlightChars = highlightCharsRef.current;

    if (!introTexts.length) return;

    // 设置初始状态
    gsap.set(introTexts, {
      opacity: 0,
      y: 30,
      scale: 0.95
    });

    // 设置高亮字符的初始状态 - 在容器底部下方，透明度为0
    gsap.set(highlightChars, {
      opacity: 0,
      y: 20,
      scale: 1
    });

    // 创建主时间轴
    const tl = gsap.timeline({
      delay: 0.3,
      ease: "power2.out"
    });

    // 文字逐行显示动画
    introTexts.forEach((text, index) => {
      tl.to(text, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, index * 0.1);
    });

    // 高亮字符整体显示动画
    if (highlightChars.length > 0) {
      tl.to(highlightChars, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: 0.1 // 极小的错开效果，几乎同时显示
      }, "+=0.2");
    }

    // 添加高亮字符的呼吸效果 - 在所有动画完成后开始
    if (highlightChars.length > 0) {
      const breathingTl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        delay: 3 // 等待所有入场动画完成
      });

      breathingTl.to(highlightChars, {
        scale: 1.05,
        duration: 2.5,
        ease: "power1.inOut",
        stagger: 0.1 // 错开呼吸效果
      });
    }

  }, []);

  const addToRefs = (el: HTMLParagraphElement | null) => {
    if (el && !introTextsRef.current.includes(el)) {
      introTextsRef.current.push(el);
    }
  };

  const addCharToRefs = (el: HTMLSpanElement | null) => {
    if (el && !highlightCharsRef.current.includes(el)) {
      highlightCharsRef.current.push(el);
    }
  };

  const highlightText = "孤芳不自赏";
  const highlightChars = highlightText.split('');

  return (
    <div className={styles.personalInfoCard}>
      <div className={styles.introContent}>
        <p
          ref={addToRefs}
          className={styles.introText}
        >
          你好！欢迎来到我的博客！
        </p>
        <p
          ref={addToRefs}
          className={styles.introText}
        >
          我是
          {highlightChars.map((char, index) => (
            <span
              key={index}
              ref={addCharToRefs}
              className={styles.highlight}
            >
              {char}
            </span>
          ))}
        </p>
        <p
          ref={addToRefs}
          className={styles.introText}
        >
          一个热爱技术的全栈开发工程师
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoCard; 