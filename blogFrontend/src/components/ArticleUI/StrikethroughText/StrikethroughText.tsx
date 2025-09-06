import React, { useState } from 'react';
import styles from './StrikethroughText.module.scss';

interface StrikethroughTextProps {
    children: React.ReactNode;
    className?: string;
}

const StrikethroughText: React.FC<StrikethroughTextProps> = ({
                                                                 children,
                                                                 className = ''
                                                             }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <span
            className={`${styles.strikethroughText} ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            data-hovered={isHovered}
        >
      {children}
    </span>
    );
};

export default StrikethroughText;