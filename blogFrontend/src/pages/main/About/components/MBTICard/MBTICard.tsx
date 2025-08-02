import React, { useEffect, useRef } from 'react';
import styles from './MBTICard.module.scss';
import Image from 'next/image';
import { gsap } from 'gsap';

const MBTICard: React.FC = () => {
  const mbtiCardRef = useRef<HTMLDivElement>(null);
  const mbtiImageRef = useRef<HTMLDivElement>(null);

  const mbtiFeatures = [
    { name: '外向', opposite: '内向', percentage: 82, color: '#477eaa' },
    { name: '天马行空', opposite: '求真务实', percentage: 88, color: '#e6a23c' },
    { name: '理性思考', opposite: '情感细腻', percentage: 92, color: '#3a935f' },
    { name: '运筹帷幄', opposite: '随机应变', percentage: 86, color: '#735085' },
    { name: '自信果断', opposite: '情绪易波动', percentage: 53, color: '#f16161' }
  ];

  // MBTI卡片内容动画
  useEffect(() => {
    const mbtiCard = mbtiCardRef.current;
    if (mbtiCard) {
      // 获取卡片内的各个元素
      const mbtiType = mbtiCard.querySelector(`.${styles.mbtiType}`);
      const mbtiFeatures = mbtiCard.querySelector(`.${styles.mbtiFeatures}`);
      const mbtiImage = mbtiCard.querySelector(`.${styles.mbtiImage}`);

      // 设置所有元素的初始状态
      gsap.set([mbtiType, mbtiFeatures, mbtiImage], {
        opacity: 0,
        y: 20
      });

      // 创建时间轴，依次显示各个元素
      const tl = gsap.timeline({ delay: 0.5 });

      tl.to(mbtiType, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      })
        .to(mbtiFeatures, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.3")
        .to(mbtiImage, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.3");
    }
  }, []);

  // MBTI图片悬浮效果
  const handleMbtiImageEnter = () => {
    const mbtiImage = mbtiImageRef.current;
    if (mbtiImage) {
      gsap.to(mbtiImage, {
        rotation: 5,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleMbtiImageLeave = () => {
    const mbtiImage = mbtiImageRef.current;
    if (mbtiImage) {
      gsap.to(mbtiImage, {
        rotation: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  return (
    <div ref={mbtiCardRef} className={styles.mbtiCard}>
      <div className={styles.mbtiType}>
        <h1 style={{ color: '#757575' }}>Commander</h1>
        <h1>ENTJ-A</h1>
        <div className={styles.mbtiLink}>
          <span style={{ color: '#757575', fontSize: '0.7rem' }}>在 </span>
          <a href="https://www.16personalities.com/ch/%E4%BA%BA%E6%A0%BC%E6%B5%8B%E8%AF%95" target="_blank" rel="noopener noreferrer" style={{ color: '#757575', textDecoration: 'none', fontSize: '0.7rem' }}>
            16personalities
          </a>
          <span style={{ color: '#757575', fontSize: '0.7rem' }}> 了解更多关于 </span>
          <a href="https://www.16personalities.com/ch/entj-%E4%BA%BA%E6%A0%BC" target="_blank" rel="noopener noreferrer" style={{ color: '#757575', textDecoration: 'none', fontSize: '0.7rem' }}>
            Commander
          </a>
        </div>
      </div>
      <div className={styles.mbtiFeatures}>
        {mbtiFeatures.map((feature, index) => (
          <div key={index} className={styles.featureBar}>
            <div className={styles.featureLabel}>{feature.name}</div>
            <div className={styles.progressContainer}>
              <div
                className={styles.progressBar}
                style={{
                  width: `${feature.percentage}%`,
                  backgroundColor: feature.color
                }}
              />
              <div
                className={styles.progressDot}
                style={{ left: `${feature.percentage}%` }}
              />
            </div>
            <div className={styles.percentage}>{feature.percentage}%</div>
            <div className={styles.featureOpposite}>{feature.opposite}</div>
          </div>
        ))}
      </div>
      <div
        ref={mbtiImageRef}
        className={styles.mbtiImage}
        onMouseEnter={handleMbtiImageEnter}
        onMouseLeave={handleMbtiImageLeave}
      >
        <Image src={'https://images-1359353257.cos.ap-beijing.myqcloud.com/aboutMe/4ea4baac8eea30a3901b2e1b2f774a4d04640ac119af-cK9L1H_fw658webp.webp'} alt={'mbti'} width={250} height={250} />
      </div>
    </div>
  );
};

export default MBTICard; 