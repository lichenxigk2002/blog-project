import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import styles from './MetaCard.module.scss';
import { getPlatform, getPlatformIcon } from '@/utils/platformIcon';

interface MetaCardProps {
    title: string;
    url: string;
    image?: string;
    desc?: string;
    platform?: string; // 新增平台字段
}

const MetaCard: React.FC<MetaCardProps> = ({ title, url, image, desc, platform }) => {
    const realPlatform = platform || getPlatform(url);
    const platformIcon = realPlatform ? getPlatformIcon(realPlatform, { className: styles.platformIcon }) : null;

    return (
        <div className={styles.metaCard}>
            {platformIcon}
            {image && (
                <div className={styles.imageWrapper}>
                    <img src={image} alt="meta cover" className={styles.image} />
                </div>
            )}
            <div className={styles.info}>
                <a href={url} className={styles.title} target="_blank" rel="noopener noreferrer">
                    {title}
                    <FiExternalLink className={styles.externalIcon} />
                </a>
                {desc && <div className={styles.desc}>{desc}</div>}
            </div>
        </div>
    );
};

export default MetaCard;