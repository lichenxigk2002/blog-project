import React from 'react';
import styles from './MBTICard.module.scss';
import Image from 'next/image';
import { motion } from 'framer-motion';

const MBTICard: React.FC = () => {
  const mbtiFeatures = [
    { name: '外向', opposite: '内向', percentage: 82, color: '#477eaa' },
    { name: '天马行空', opposite: '求真务实', percentage: 88, color: '#e6a23c' },
    { name: '理性思考', opposite: '情感细腻', percentage: 92, color: '#3a935f' },
    { name: '运筹帷幄', opposite: '随机应变', percentage: 86, color: '#735085' },
    { name: '自信果断', opposite: '情绪易波动', percentage: 53, color: '#f16161' }
  ];

  return (
    <motion.div
      className={styles.mbtiCard}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <motion.div
        className={styles.mbtiType}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
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
      </motion.div>
      <motion.div
        className={styles.mbtiFeatures}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
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
      </motion.div>
      <motion.div
        className={styles.mbtiImage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        whileHover={{
          rotate: 5,
          scale: 1.02,
          transition: { duration: 0.3 }
        }}
      >
        <Image src={'https://images-1359353257.cos.ap-beijing.myqcloud.com/aboutMe/4ea4baac8eea30a3901b2e1b2f774a4d04640ac119af-cK9L1H_fw658webp.webp'} alt={'mbti'} width={250} height={250} />
      </motion.div>
    </motion.div>
  );
};

export default MBTICard; 