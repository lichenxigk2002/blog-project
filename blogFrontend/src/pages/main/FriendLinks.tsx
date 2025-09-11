import React, { useState, useEffect, useRef } from 'react';
import { FriendLinksAPI } from '@/api/FriendLinkAPI';
import styles from './FriendLinks/FriendLinks.module.scss';
import { useLoading } from "@/hooks/useLoading";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import Head from "next/head";
import PageHeader from '../../components/PageHeader/PageHeader';
import type { FriendLinks } from "@/types/FriendLinks";
import OperationTipModal from '@/components/OperationTipModal/OperationTipModal';
import DOMPurify from 'dompurify';
import { useMobile } from '@/hooks/useMobile';

// 新增：定义props类型
interface FriendLinksPageProps {
    initialFriendLinks: FriendLinks[];
}

const SITE_INFO = {
    name: "孤芳不自赏",
    url: "https://www.gfbzsblog.site/",
    description: "日益努力，而后风生水起",
    avatarUrl: "/images/avatar_20250520_215057.png"
};

const REQUIREMENTS = [
    "站长非常喜欢交朋友，所以欢迎大家大胆的来申请友链！",
    "申请前请先在贵站友链专区添加本站链接哦（名称+网址），非常感谢😉",
    "网站需备案且能稳定访问，无恶意弹窗/违规内容，如果使用https证书会更好！",
    "希望贵站内容健康积极，定期更新原创内容，站长对版权比较重视，因此如果有转载的文章，一定要标明转载文章的出处！",
    "麻烦朋友添加后请在本站留言板留言，站长看到会第一时间回复并且通过，记得真实邮箱才能收到回复！",
];

const FriendLinks: React.FC<FriendLinksPageProps> = ({ initialFriendLinks }) => {
    const { isLoading } = useLoading();
    const [friendLinks, setFriendLinks] = useState<FriendLinks[]>(initialFriendLinks || []);
    const { isMobile } = useMobile(); // 使用移动端检测hook
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        description: '',
        avatarUrl: ''
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [hoverColors, setHoverColors] = useState<Record<string, { h3: string, p: string }>>({});
    const [tipOpen, setTipOpen] = useState(false);
    const [tipMessage, setTipMessage] = useState('');
    const [tipType, setTipType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
    const [selectedFriendLink, setSelectedFriendLink] = useState<FriendLinks | null>(null);
    const [isDetailView, setIsDetailView] = useState(false);
    const DESIGN_WIDTH = 1200;
    const DESIGN_HEIGHT = 800;
    const previewRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const detailSectionRef = useRef<HTMLDivElement>(null);
    const detailHeaderRef = useRef<HTMLDivElement>(null);
    const iframeContainerRef = useRef<HTMLDivElement>(null);
    const leftListRef = useRef<HTMLDivElement>(null);
    // const [iframeLoaded, setIframeLoaded] = useState<boolean | 'fail'>(false);

    // 在状态管理部分添加展开/收起状态
    const [isSiteInfoExpanded, setIsSiteInfoExpanded] = useState(false);

    // 检测是否为移动端
    useEffect(() => {
        const checkIsMobile = () => {
            // setIsMobile(window.innerWidth <= 768); // This line is now handled by useMobile
        };

        // checkIsMobile(); // This line is now handled by useMobile
        // window.addEventListener('resize', checkIsMobile); // This line is now handled by useMobile

        return () => {
            // window.removeEventListener('resize', checkIsMobile); // This line is now handled by useMobile
        };
    }, []);


    useEffect(() => {
        function updateScale() {
            if (!previewRef.current) return;
            const container = previewRef.current.parentElement;
            if (!container) return;
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            const scaleW = containerWidth / DESIGN_WIDTH;
            const scaleH = containerHeight / DESIGN_HEIGHT;
            setScale(Math.min(scaleW, scaleH, 1)); // 不放大，只缩小
        }
        updateScale();
        // window.addEventListener('resize', updateScale); // This line is now handled by useMobile
        return () => {
            // window.removeEventListener('resize', updateScale); // This line is now handled by useMobile
        };
    }, [isDetailView, selectedFriendLink]);

    useEffect(() => {
        function updateDetailSectionHeight() {
            if (
                detailSectionRef.current &&
                detailHeaderRef.current &&
                iframeContainerRef.current
            ) {
                const sectionWidth = detailSectionRef.current.offsetWidth;
                const headerHeight = detailHeaderRef.current.offsetHeight;
                const iframeHeight = Math.round(sectionWidth * 2 / 3);
                const totalHeight = headerHeight + iframeHeight;
                iframeContainerRef.current.style.height = `${iframeHeight}px`;
                detailSectionRef.current.style.height = `${totalHeight}px`;
                if (leftListRef.current) {
                    leftListRef.current.style.height = `${totalHeight}px`;
                }
            }
        }
        updateDetailSectionHeight();
        // window.addEventListener('resize', updateDetailSectionHeight); // This line is now handled by useMobile
        return () => {
            // window.removeEventListener('resize', updateDetailSectionHeight); // This line is now handled by useMobile
        };
    }, [isDetailView, selectedFriendLink]);

    // useEffect(() => {
    //     setIframeLoaded(false);
    //     let timer = setTimeout(() => {
    //         if (!iframeLoaded) {
    //             setIframeLoaded('fail');
    //         }
    //     }, 3000);
    //     return () => clearTimeout(timer);
    // }, [selectedFriendLink]);

    function getRandomColor() {
        const letters = '89ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    }

    const handleCardMouseEnter = (id: string) => {
        setHoverColors(prev => ({
            ...prev,
            [id]: {
                h3: getRandomColor(),
                p: getRandomColor()
            }
        }));
    };
    const handleCardMouseLeave = (id: string) => {
        setHoverColors(prev => {
            const newColors = { ...prev };
            delete newColors[id];
            return newColors;
        });
    };

    const handleFriendLinkClick = (e: React.MouseEvent, friendLink: FriendLinks) => {
        e.preventDefault();

        // 移动端直接跳转，不显示详情页
        if (isMobile) {
            window.open(friendLink.url, '_blank', 'noopener,noreferrer');
            return;
        }

        // 桌面端显示详情页
        setSelectedFriendLink(friendLink);
        setIsDetailView(true);
    };

    // 新增：返回友链列表
    const handleBackToList = () => {
        setIsDetailView(false);
        setSelectedFriendLink(null);
    };

    // 新增：跳转到友链网站
    const handleVisitWebsite = () => {
        if (selectedFriendLink) {
            window.open(selectedFriendLink.url, '_blank', 'noopener,noreferrer');
        }
    };

    // 获取友链列表
    const fetchFriendLinks = async () => {
        try {
            const response = await FriendLinksAPI.getAllFriendLinks();
            if (Array.isArray(response)) {
                setFriendLinks(response as FriendLinks[]);
            } else {
                setFriendLinks([]);
            }
        } catch (error) {
            setFriendLinks([]);
        }
    };

    useEffect(() => {
        // SSG兜底：如果props有数据则不再请求
        if (initialFriendLinks && initialFriendLinks.length > 0) return;
        fetchFriendLinks();
    }, [initialFriendLinks]);

    // 处理输入变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    // 处理表单提交
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.url || !formData.description || !formData.avatarUrl) {
            setTipMessage('请填写所有必填字段');
            setTipType('warning');
            setTipOpen(true);
            return;
        }
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
        if (!urlRegex.test(formData.url)) {
            setTipMessage('请输入有效的网站地址');
            setTipType('warning');
            setTipOpen(true);
            return;
        }
        try {
            await FriendLinksAPI.addFriendLinks({
                name: formData.name,
                url: formData.url,
                description: formData.description,
                avatarUrl: formData.avatarUrl,
                status: 'pending'
            });
            setFormData({ name: '', url: '', description: '', avatarUrl: '' });
            await fetchFriendLinks();
            setModalOpen(false);
            setTipMessage('友链申请已提交！记得在留言板留言，站长会第一时间回复哦！');
            setTipType('success');
            setTipOpen(true);
        } catch (error) {
            setTipMessage('提交失败，请稍后重试');
            setTipType('error');
            setTipOpen(true);
        }
    };

    return (
        <>
            {!isDetailView && (
                <div className={styles.container}
                    style={isDetailView ? { padding: 0 } : undefined}
                >
                    <Head>
                        <title>友人帐 | 海内存知己，天涯若比邻</title>
                        <meta name="description" content="友链交换，让我们的博客世界更加精彩" />
                    </Head>
                    {isLoading && <LoadingSpinner />}
                    <div className={isDetailView ? styles.fadeOut : styles.fadeIn}>
                        <PageHeader
                            headerText="朋友们"
                            introText="互联网的美好，在于让有趣的灵魂跨越山海相遇。这里是我在数字世界里遇到的宝藏创作者——他们用文字编织思想的星空，用真诚分享点亮彼此的世界。每一篇文章都是独特的礼物，每一次阅读都是一场温暖的邂逅。。"
                            englishTitle="FriendLinks"
                        />
                    </div>
                    {/* 友链列表 */}
                    {/*{isDetailView && (*/}
                    {/*    <div className={styles.backButtonContainer}>*/}
                    {/*        <button className={styles.backButton} onClick={handleBackToList}>*/}
                    {/*            <span>←</span> 返回友链列表*/}
                    {/*        </button>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                    <div className={`${styles.mainContent} ${isDetailView ? styles.detailView : ''}`}>
                        {/* 友链列表 */}
                        <div className={`${styles.friendLinksSection} ${!isDetailView ? styles.fadeIn : styles.fadeOut}`}>
                            {Array.isArray(friendLinks) && friendLinks.length > 0 ? (
                                <div className={`${styles.friendLinksGrid} ${isDetailView ? styles.verticalList : ''}`}>
                                    {friendLinks
                                        .filter((link) => link.status === 'approved')
                                        .map((link, index) => (
                                            <motion.div
                                                key={link.id}
                                                className={`${styles.friendLinkCard} ${link.name === "Grtsinry43's Blog" ? styles.specialRecommended : ''}`}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                                onClick={(e) => handleFriendLinkClick(e, link)}
                                                onMouseEnter={() => handleCardMouseEnter(link.id.toString())}
                                                onMouseLeave={() => handleCardMouseLeave(link.id.toString())}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        handleFriendLinkClick(e as any, link);
                                                    }
                                                }}
                                            >
                                                <div className={styles.avatar}>
                                                    <img src={link.avatarUrl} alt={link.name} />
                                                </div>
                                                <div className={styles.bgAvatar}>
                                                    <img src={link.avatarUrl} alt={link.name + '背景'} />
                                                </div>
                                                <div className={styles.info}>
                                                    <h3
                                                        style={hoverColors[link.id.toString()]?.h3 ? { color: hoverColors[link.id.toString()].h3 } : {}}
                                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(link.name) }}
                                                    />
                                                    <p
                                                        style={hoverColors[link.id.toString()]?.p ? { color: hoverColors[link.id.toString()].p } : {}}
                                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(link.description) }}
                                                    />
                                                </div>
                                            </motion.div>
                                        ))}
                                </div>
                            ) : (
                                <p className={styles.emptyMessage}>朋友们正在赶过来</p>
                            )}
                        </div>
                    </div> {/* 主要内容区域的结束标签 - 只包裹友链列表 */}

                    {/* 申请友链按钮 - 在详情视图时隐藏 */}
                    <div className={`${styles.applyButtonWrapper} ${isDetailView ? styles.fadeOut : styles.fadeIn}`}>
                        <div style={{ textAlign: 'center', margin: '2.5rem 0 1.5rem 0' }}>
                            <button className={styles.simpleButton} style={{ maxWidth: 180 }} onClick={() => setModalOpen(true)}>
                                点我来交朋友啦
                            </button>
                        </div>
                    </div>
                    {/* 本站信息 - 可收起/展开，包含友链要求 */}
                    <div className={`${styles.siteInfoWrapper} ${isDetailView ? styles.fadeOut : styles.fadeIn}`}>
                        <section className={styles.siteInfoSection}>
                            <div className={styles.siteInfoHeader} onClick={() => setIsSiteInfoExpanded(!isSiteInfoExpanded)}>
                                <h2>本站信息</h2>
                                <span className={`${styles.expandIcon} ${isSiteInfoExpanded ? styles.rotated : ''}`}>
                                    {isSiteInfoExpanded ? '−' : '+'}
                                </span>
                            </div>

                            <div className={`${styles.siteInfoCard} ${isSiteInfoExpanded ? styles.expanded : ''}`}>
                                <div className={styles.siteInfoText}>
                                    <div><b>头像链接：</b><a href={SITE_INFO.avatarUrl} target="_blank" rel="noopener noreferrer">点我获取</a></div>
                                    <div><b>我的名字：</b>{SITE_INFO.name}</div>
                                    <div><b>网站地址：</b><a href={SITE_INFO.url} target="_blank" rel="noopener noreferrer">{SITE_INFO.url}</a></div>
                                    <div><b>网站描述：</b>{SITE_INFO.description}</div>
                                </div>

                                {/* 友链要求也放在本站信息内 */}
                                <div className={styles.requirementsSection}>
                                    <h3>友链要求</h3>
                                    <ul className={styles.requirementsList}>
                                        {REQUIREMENTS.map((item, idx) => <li key={idx}>{item}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>

                    <OperationTipModal
                        open={tipOpen}
                        onClose={() => setTipOpen(false)}
                        message={tipMessage}
                        type={tipType}
                    />
                </div>
            )}

            {/* 申请友链模态框 - 移出条件渲染，独立于 isDetailView 状态 */}
            {modalOpen && (
                <div className={styles.friendLinksFormWrapper}>
                    <div className={styles.loginCard}>
                        <button className={styles.closeButton} onClick={() => setModalOpen(false)} title="关闭">×</button>
                        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
                            <h2 className={styles.header}>申请友链</h2>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} htmlFor="name">网站名称</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="网站名称"
                                    className={styles.input}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} htmlFor="url">网站地址</label>
                                <input
                                    type="url"
                                    id="url"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleInputChange}
                                    placeholder="网站地址"
                                    className={styles.input}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} htmlFor="avatarUrl">头像图片地址</label>
                                <input
                                    type="url"
                                    id="avatarUrl"
                                    name="avatarUrl"
                                    value={formData.avatarUrl}
                                    onChange={handleInputChange}
                                    placeholder="头像图片地址"
                                    className={styles.input}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} htmlFor="description">网站描述</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="网站描述"
                                    className={styles.input}
                                    required
                                />
                            </div>
                            <button type="submit" className={styles.submitButton}>提交申请</button>
                        </form>
                    </div>
                </div>
            )}

            {/* 详情视图 - 只在桌面端显示 */}
            {!isMobile && (
                <div className={styles.ViewContainer}>
                    {isDetailView && selectedFriendLink && (
                        <div className={`${styles.detailViewWrapper} ${isDetailView ? styles.fadeIn : styles.fadeOut}`}>
                            <div className={styles.verticalListSection}>
                                <div className={styles.verticalList} ref={leftListRef}>
                                    {friendLinks
                                        .filter((link) => link.status === 'approved')
                                        .map((link) => (
                                            <div
                                                key={link.id}
                                                className={`${styles.friendLinkCard} ${styles.narrowCard} ${link.name === "Grtsinry43's Blog" ? styles.specialRecommended : ''}`}
                                                onClick={(e) => handleFriendLinkClick(e, link)}
                                                onMouseEnter={() => handleCardMouseEnter(link.id.toString())}
                                                onMouseLeave={() => handleCardMouseLeave(link.id.toString())}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        handleFriendLinkClick(e as any, link);
                                                    }
                                                }}
                                            >
                                                <div className={styles.avatar}>
                                                    <img src={link.avatarUrl} alt={link.name} />
                                                </div>
                                                <div className={styles.bgAvatar}>
                                                    <img src={link.avatarUrl} alt={link.name + '背景'} />
                                                </div>
                                                <div className={styles.info}>
                                                    <h3
                                                        style={hoverColors[link.id.toString()]?.h3 ? { color: hoverColors[link.id.toString()].h3 } : {}}
                                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(link.name) }}
                                                    />
                                                    <p
                                                        style={hoverColors[link.id.toString()]?.p ? { color: hoverColors[link.id.toString()].p } : {}}
                                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(link.description) }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div className={styles.detailSection} ref={detailSectionRef}>
                                <div className={styles.detailHeader} ref={detailHeaderRef}>
                                    <div className={styles.detailInfo}>
                                        <img src={selectedFriendLink.avatarUrl} alt={selectedFriendLink.name} className={styles.detailAvatar} />
                                        <div className={styles.detailText}>
                                            <h2>{selectedFriendLink.name}</h2>
                                            <p>{selectedFriendLink.description}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button className={styles.visitButton} onClick={handleBackToList}>
                                            返回<FaLink />
                                        </button>
                                        <button className={styles.visitButton} onClick={handleVisitWebsite}>
                                            去浏览🚀
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.iframeContainer} ref={iframeContainerRef}>
                                    <div
                                        ref={previewRef}
                                        className={styles.previewWrapper}
                                    >
                                        <iframe
                                            src={selectedFriendLink.url}
                                            title={`${selectedFriendLink.name} - 博客预览`}
                                            className={styles.previewIframe}
                                            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

// 新增：getStaticProps实现SSG+ISR
import { GetStaticProps } from 'next';
import { FaLink } from "react-icons/fa";
import { motion } from 'framer-motion';
export const getStaticProps: GetStaticProps = async () => {
    try {
        const response = await FriendLinksAPI.getAllFriendLinks();
        return {
            props: {
                initialFriendLinks: Array.isArray(response) ? response : []
            },
            revalidate: 600 // ISR: 每10分钟自动更新
        };
    } catch (err) {
        return {
            props: {
                initialFriendLinks: []
            },
            revalidate: 600
        };
    }
};

export default FriendLinks;