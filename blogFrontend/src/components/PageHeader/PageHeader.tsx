import { motion } from 'framer-motion';
import styles from './PageHeader.module.scss';

interface PageHeaderProps {
  headerText: string;
  introText: string;
  englishTitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  headerText,
  introText,
  englishTitle
}) => {
  return (
    <motion.h1
      className={styles.header}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {englishTitle && <span className={styles.englishTitle}>{englishTitle}</span>}
      {headerText}
      <div className={styles.introText}>
        {introText}
      </div>
    </motion.h1>
  );
};

export default PageHeader; 