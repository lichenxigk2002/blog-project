import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './MottoCard.module.scss';

const MottoCard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const text1 = "日益努力";
  const text2 = "而后风生水起";

  return (
    <motion.div
      className={styles.mottoContainer}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <h1>
        我坚信
      </h1>

      <div className={styles.mottoContent}>
        <div className={styles.mottoText}>
          {/* 第一行文字 */}
          <motion.div
            className={styles.textLine}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          >
            {text1}
            <span className={styles.punctuation}>，</span>
          </motion.div>

          {/* 第二行文字 */}
          <motion.div
            className={styles.textLine}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
          >
            {text2}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MottoCard;
