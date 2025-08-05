import React, { useEffect, useRef } from 'react';
import styles from './About/About.module.scss'
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import MBTICard from '@/pages/main/About/components/MBTICard/MBTICard';
import PersonalInfoCard from '@/pages/main/About/components/PersonalInfoCard/PersonalInfoCard';

const About: React.FC = () => {
    const avatarRef = useRef<HTMLImageElement>(null);
    const avatarControls = useAnimation();

    useEffect(() => {
        // 初始动画
        avatarControls.start({
            scale: 1,
            opacity: 1,
            transition: {
                duration: 1,
                ease: "easeOut"
            }
        });

        // 持续旋转动画
        avatarControls.start({
            rotate: [0, 2, 0, -2, 0],
            transition: {
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
            }
        });

        // 浮动动画
        avatarControls.start({
            y: [0, -10, 0],
            transition: {
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
            }
        });
    }, [avatarControls]);

    const handleMouseEnter = () => {
        avatarControls.start({
            scale: 1.05,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        });
    };

    const handleMouseLeave = () => {
        avatarControls.start({
            scale: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        });
    };

    return (
        <div>
            <div className={styles.container}>
                <div className={`${styles.itemCard} ${styles.itemCard1}`}>
                    <motion.div
                        ref={avatarRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className={styles.avatarContainer}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={avatarControls}
                    >
                        <Image src={'/images/avatar_20250520_215057.png'} alt={'avatar'} width={100} height={100} className={styles.avatar} />
                    </motion.div>
                </div>
                <PersonalInfoCard />
                <div className={`${styles.itemCard} ${styles.itemCard3}`}>
                    <h1>生平</h1>
                </div>
                <div className={`${styles.itemCard} ${styles.itemCard4}`}>
                    <h1>技术栈</h1>
                </div>
                <div className={`${styles.itemCard} ${styles.itemCard5}`}>
                    <h1>社交平台</h1>
                </div>
                <div className={`${styles.itemCard} ${styles.itemCard6}`}>
                    <h1>座右铭</h1>
                </div>
                <div className={`${styles.itemCard} ${styles.itemCard7}`}>
                    <h1>作品集</h1>
                </div>
                <MBTICard />
                <div className={`${styles.itemCard} ${styles.itemCard9}`}>
                    <h1>特长</h1>
                </div>
                <div className={`${styles.itemCard} ${styles.itemCard10}`}>
                    <h1>最近在听</h1>
                </div>
                <div className={`${styles.itemCard} ${styles.itemCard11}`}>
                    <h1>喜欢的动漫</h1>
                </div>
                <div className={`${styles.itemCard} ${styles.itemCard12}`}>
                    <h1>喜欢的游戏</h1>
                </div>
                <div className={`${styles.itemCard} ${styles.itemCard13}`}>
                    <h1>致10年后的自己</h1>
                </div>
                <div className={`${styles.itemCard} ${styles.itemCard14}`}>
                    <h1>学习计划</h1>
                </div>
                <div className={`${styles.itemCard} ${styles.itemCard15}`}>
                    朋友们
                </div>
                <div className={`${styles.itemCard} ${styles.itemCard16}`}>
                    最近状态
                </div>
                <div className={`${styles.itemCard} ${styles.itemCard17}`}>
                    常用工具
                </div>
            </div>
        </div>
    );
};

export default About;