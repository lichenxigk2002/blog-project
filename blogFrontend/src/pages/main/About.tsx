import React, { useState } from 'react';
import styles from './About/About.module.scss'
import Head from "next/head";
import MBTICard from '@/pages/main/About/components/MBTICard/MBTICard';
import PersonalInfoCard from '@/pages/main/About/components/PersonalInfoCard/PersonalInfoCard';
import FutureSelfCard from '@/pages/main/About/components/FutureSelfCard/FutureSelfCard';
import AvatarCard from '@/pages/main/About/components/AvatarCard/AvatarCard';
import TechStackCard from '@/pages/main/About/components/TechStackCard/TechStackCard';
import GameCard from '@/pages/main/About/components/GameCard/GameCard';
import AnimeCard from '@/pages/main/About/components/AnimeCard/AnimeCard';
import MusicCard from '@/pages/main/About/components/MusicCard/MusicCard';
import SocialPlatformCard from '@/pages/main/About/components/SocialPlatformCard/SocialPlatformCard';
import MottoCard from '@/pages/main/About/components/MottoCard/MottoCard';
import BiographyCard from '@/pages/main/About/components/BiographyCard/BiographyCard';
import PortfolioCard from '@/pages/main/About/components/PortfolioCard/PortfolioCard';
import SkillsCard from '@/pages/main/About/components/SkillsCard/SkillsCard';
import ToolsCard from '@/pages/main/About/components/ToolsCard/ToolsCard';
import StudyPlanCard from '@/pages/main/About/components/StudyPlanCard/StudyPlanCard';
import FriendsCard from '@/pages/main/About/components/FriendsCard/FriendsCard';
import RecentStatusCard from '@/pages/main/About/components/RecentStatusCard/RecentStatusCard';
import OperationTipModal from '@/components/OperationTipModal/OperationTipModal';

const About: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState<'success' | 'info'>('success');

    const handleShowModal = (message: string, type: 'success' | 'info') => {
        setModalMessage(message);
        setModalType(type);
        setShowModal(true);
    };

    return (
        <div>
            <Head>
                <title>关于我 | 代码的追梦者</title>
                <meta name="description" />
            </Head>
            <div className={styles.container}>
                <AvatarCard />
                <PersonalInfoCard />
                <BiographyCard />
                <TechStackCard />
                <SocialPlatformCard onShowModal={handleShowModal} />
                <MottoCard />
                <PortfolioCard />
                <MBTICard />
                <SkillsCard />
                <MusicCard />
                <AnimeCard />
                <GameCard />
                <FutureSelfCard />
                <StudyPlanCard />
                <FriendsCard />
                <RecentStatusCard />
                <ToolsCard />
            </div>

            <OperationTipModal
                open={showModal}
                onClose={() => setShowModal(false)}
                message={modalMessage}
                type={modalType}
                autoClose={true}
                autoCloseDelay={2000}
            />
        </div>
    );
};

export default About;