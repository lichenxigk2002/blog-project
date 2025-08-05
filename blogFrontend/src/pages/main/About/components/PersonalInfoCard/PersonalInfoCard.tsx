import React from 'react';
import { motion } from 'framer-motion';
import styles from './PersonalInfoCard.module.scss';

const PersonalInfoCard: React.FC = () => {
  const highlightText = "孤芳不自赏";
  const highlightChars = highlightText.split('');

  return (
    <motion.div
      className={styles.personalInfoCard}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.introContent}>
        <motion.p
          className={styles.introText}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          你好！欢迎来到我的博客！
        </motion.p>
        <motion.p
          className={styles.introText}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          我是
          {highlightChars.map((char, index) => (
            <motion.span
              key={index}
              className={styles.highlight}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.5 + index * 0.1
              }}
              whileHover={{ scale: 1.1 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.p>
        <motion.p
          className={styles.introText}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          一个热爱技术的全栈开发工程师
        </motion.p>
      </div>
    </motion.div>
  );
};

export default PersonalInfoCard; 