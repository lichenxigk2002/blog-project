import React from 'react';
import styles from './OriginalityNotice.module.css';

const OriginalityNotice: React.FC = () => (
  <div className={styles.notice}>
    <strong>原创声明：</strong>
    本博客所有文章均为原创，转载请注明出处和作者。<br />
    如需转载，请联系作者获得授权。
  </div>
);

export default OriginalityNotice; 