// 导入必要的库和组件
import { useRouter } from 'next/router';          // Next.js路由库，用于获取路由参数
import React, { useEffect, useState, useRef } from 'react'; // React核心钩子
import { Article } from '@/types/Article';    // 文章类型定义
import styles from './[id].module.scss';       // CSS模块样式
import { FaHeart, FaRegHeart } from 'react-icons/fa';   // FontAwesome图标库
import ReactMarkdown from 'react-markdown';       // Markdown渲染组件
import remarkGfm from 'remark-gfm'                // 支持GitHub Flavored Markdown的插件
import rehypeRaw from 'rehype-raw';              // 支持HTML标签的插件
import Link from 'next/link';                     // Next.js客户端导航组件
import ArticleToc from '@/components/ArticleUI/ArticleToc/ArticleToc'; // 文章目录组件
import { motion } from 'framer-motion';              // 动画库
import { ArticlesAPI } from '@/api/ArticlesAPI';    // 文章API
import CodeBlock from '@/components/ArticleUI/Code/CodeBlock';   // 代码高亮组件
import Comments from '@/components/Comments/Comments'; // 评论组件
import { FaArrowLeft } from "react-icons/fa";  // FontAwesome图标库
import Head from "next/head";               // Next.js头部组件
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'; // 加载动画组件
import RecentArticles from "@/components/RecentArticles/RecentArticles"; // 最近文章组件
import ArticleSidebar from '@/components/ArticleUI/ArticleSidebar/ArticleSidebar';   // 文章侧边栏组件
import ArticleCopyright from '@/components/ArticleUI/ArticleCopyright/ArticleCopyright';// 版权声明组件
import { useLoading } from "@/hooks/useLoading"; // 自定义加载状态钩子
import dynamic from 'next/dynamic';
import MetaCard from '@/components/ArticleUI/MetaCard/MetaCard';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ArticleUI/Table/Table';
import ArticleImage from '@/components/ArticleUI/ArticleImage/ArticleImage';
import ArticleVideo from '@/components/ArticleUI/ArticleVideo/ArticleVideo';
import ArticleSummary from '@/components/ArticleUI/ArticleSummary';
import { FiEye, FiClock, FiCalendar, FiEdit, FiUser, FiTag } from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';


// 定义标题对象的类型
interface Heading {
    id: string;     // 标题的锚点ID（用于跳转）
    text: string;   // 标题文本内容
    level: number;  // 标题级别（1-6对应h1-h6）
}


const ArticleDetail: React.FC = () => {
    // 使用路由钩子获取路由参数
    const SequenceDiagram = dynamic(() => import('@/components/ArticleUI/SequenceDiagram/SequenceDiagram'), { ssr: false });
    const MermaidDiagram = dynamic(() => import('@/components/ArticleUI/MermaidDiagram/MermaidDiagram'), { ssr: false });
    const router = useRouter(); // Next.js路由对象
    const { id } = router.query; // 从URL中获取文章ID


    // 状态管理
    const [article, setArticle] = useState<Article | null>(null); // 存储文章数据
    const [error, setError] = useState<string | null>(null); // 错误信息
    const [headings, setHeadings] = useState<Heading[]>([]); // 文章标题列表
    const [contentHeight, setContentHeight] = useState(0); // 文章内容高度
    const [contentTop, setContentTop] = useState(0);       // 文章内容顶部位置
    const [likeCount, setLikeCount] = useState<number>();// 点赞数
    const [isLiked, setIsLiked] = useState(false); // 添加点赞状态
    const [isMobile, setIsMobile] = useState(false); //  添加移动设备状态
    const { isLoading } = useLoading(); //  加载状态钩子


    const contentRef = useRef<HTMLDivElement>(null);    // 使用ref获取文章内容DOM元素的引用

    //监听窗口大小变化
    useEffect(() => {
        const checkMobile = () => { // 添加移动设备状态
            setIsMobile(window.innerWidth <= 768); //小于768px为移动设备
        };
        checkMobile(); // 检查当前设备
        window.addEventListener('resize', checkMobile);  //监听窗口大小变化
        return () => window.removeEventListener('resize', checkMobile);  //移除监听
    }, []);

    // 点赞操作
    const handleLike = async () => {
        if (!id) return; // 如果没有id，则不执行操作
        try {
            const response = await ArticlesAPI.likeArticle(Number(id));  //  调用点赞接口
            if (!response) {
                throw new Error('操作失败');
            }

            // 更新文章状态
            setArticle(prevArticle => {
                if (!prevArticle) return null;
                return {
                    ...prevArticle,
                    likeCount: isLiked ? prevArticle.likeCount - 1 : prevArticle.likeCount + 1
                };
            });

            // 更新点赞数
            setLikeCount(prev => isLiked ? (prev || 0) - 1 : (prev || 0) + 1);
            setIsLiked(!isLiked);
        } catch (err) {
            console.error('操作失败:', err);
            alert('操作失败，请稍后重试');
        }
    }

    // 数据获取的副作用钩子
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                if (!id) return;
                setError(null);
                // 使用 ArticlesAPI 获取特定文章
                const response = await ArticlesAPI.getArticleById(Number(id));
                // 更新文章状态
                setArticle(response);
                console.log('获取文章数据:', response);
                setLikeCount(response.likeCount || 0);
                setIsLiked(false); // 每次进入页面重置点赞状态

                // 提取标题
                const headingRegex = /^(#{1,6})\s+(.+)$/gm; // 作用：识别以 # 开头、后跟空格和标题文字的行，并分别捕获标签级别和标题内容。
                const matches = Array.from(response.content.matchAll(headingRegex)); //作用：使用正则表达式匹配文章内容中的所有标题，并返回一个包含匹配结果的数组。
                // console.log('匹配到的标题:', matches);
                const extractedHeadings = matches.map(match => ({
                    id: match[2].toLowerCase().replace(/\s+/g, '-'),
                    text: match[2],
                    level: match[1].length
                }));
                // console.log('提取的标题:', extractedHeadings);
                setHeadings(extractedHeadings);
            } catch (err) {
                console.error('获取数据错误:', err);
                const errorMessage = err instanceof Error ? err.message : '未知错误';
                setError(errorMessage);
            }
        };

        fetchArticle();
    }, [id]);

    const routerBack = useRouter();

    // 测量文章内容尺寸的副作用钩子
    useEffect(() => {
        const measureContent = () => {
            if (contentRef.current) {
                // 获取内容区域的实际高度和位置
                const rect = contentRef.current.getBoundingClientRect();
                setContentHeight(rect.height);
                setContentTop(contentRef.current.offsetTop);
            }
        };

        // 初始测量
        measureContent();
        // 添加窗口大小变化监听
        window.addEventListener('resize', measureContent);
        // 清除监听器
        return () => window.removeEventListener('resize', measureContent);
    }, [article]); // 当文章内容更新时重新测量

    const handleFontSizeChange = (size: number) => {
        if (contentRef.current) {
            contentRef.current.style.fontSize = `${size}px`;
        }
    };

    const handleExportOutline = (format: 'markdown' | 'pdf') => {
        // 实现导出大纲逻辑
    };

    const handleResultClick = (index: number) => {
        // 实现搜索结果点击逻辑
        const element = document.querySelector(`[data-index="${index}"]`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // 加载状态UI
    if (isLoading) return (
        <LoadingSpinner />
    );

    // 错误状态UI
    if (error) return (
        <motion.div
            className={styles.error}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <p>{error}</p>
            <Link href="/main/Articles" className={styles.backLink}>
                返回文章列表
            </Link>
        </motion.div>
    );

    // 文章不存在状态UI
    if (!article) return (
        <motion.div
            className={styles.empty}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <p>正在加载中...</p>
            <Link href="/main/Articles" className={styles.backLink}>
                返回文章列表
            </Link>
        </motion.div>
    );

    // 主渲染内容
    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Head>
                <title>{article.title}</title>
                <meta name="description" content={article.content.substring(0, 160)} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.content.substring(0, 160)} />
                <meta property="og:type" content="article" />
                <meta property="article:published_time" content={article.createdAt} />
                <meta property="article:author" content="博主" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={article.title} />
                <meta name="twitter:description" content={article.content.substring(0, 160)} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "BlogPosting",
                            "headline": article.title,
                            "datePublished": article.createdAt,
                            "dateModified": article.updatedAt || article.createdAt,
                            "author": {
                                "@type": "Person",
                                "name": "孤芳不自赏"
                            },
                            "publisher": {
                                "@type": "Organization",
                                "name": "孤芳不自赏的Blog",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "/favicon.ico"
                                }
                            },
                            "description": article.content.substring(0, 160),
                            "mainEntityOfPage": {
                                "@type": "WebPage",
                                "@id": typeof window !== 'undefined' ? window.location.href : ''
                            }
                        })
                    }}
                />
            </Head>
            <div className={styles.grailLayout}>
                {/* 左侧栏 ArticleToc，大屏显示 */}
                {headings.length > 0 && (
                    <aside className={styles.leftSidebar}>
                        <div className={styles.sidebarInner}>
                            <ArticleToc
                                headings={headings}
                                title={article.title}
                                contentHeight={contentHeight}
                                contentTop={contentTop}
                            />
                        </div>
                    </aside>
                )}

                {/* 手机端 ArticleToc，独立显示 */}
                {headings.length > 0 && (
                    <div className={styles.mobileTocWrapper}>
                        <ArticleToc
                            headings={headings}
                            title={article.title}
                            contentHeight={contentHeight}
                            contentTop={contentTop}
                        />
                    </div>
                )}

                {/* 主内容区，宽度固定居中 */}
                <main className={styles.articleMain}>
                    {!isMobile ? (
                        <div
                            onClick={() => routerBack.back()}
                            className={styles.backLinkButton}>
                            <FaArrowLeft style={{ color: "var(--text)" }} />
                        </div>
                    ) : null}

                    <article className={styles.articleContainer} itemScope itemType="https://schema.org/BlogPosting">
                        <header className={styles.articleHeader}>
                            <motion.h1
                                className={styles.articleTitle}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                itemProp="headline"
                            >
                                {article.title}
                            </motion.h1>
                            <motion.div
                                className={styles.articleMeta}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className={styles.metaInfo}>
                                    {/* Views */}
                                    <span className={styles.metaItem}>
                                        <FiEye style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                        {article.viewCount || 0}
                                    </span>

                                    {/* Likes */}
                                    <motion.span
                                        className={styles.metaItem}
                                        whileHover={{ scale: 1.05 }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleLike();
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {isLiked ? (
                                            <FaHeart style={{ marginRight: 4, verticalAlign: 'middle', color: 'var(--like)' }} />
                                        ) : (
                                            <FaRegHeart style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                        )}
                                        {likeCount}
                                    </motion.span>

                                    {/* Reading Time */}
                                    <span className={styles.metaItem}>
                                        <FiClock style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                        预计阅读时间：{article.readingTime || 5}分钟
                                    </span>


                                    {/* Author */}
                                    <span className={styles.metaItem}>
                                        <FiUser style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                        作者：{'孤芳不自赏'}
                                    </span>

                                    {/* Status */}
                                    <span className={styles.metaItem}>
                                        <FiTag style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                        状态：{
                                            article.status === 'published'
                                                ? '已发布'
                                                : article.status === 'archived'
                                                    ? '已归档'
                                                    : '草稿'
                                        }
                                    </span>
                                </div>
                            </motion.div>
                        </header>

                        <motion.div
                            className={styles.articleContent}
                            ref={contentRef}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            itemProp="articleBody"
                        >
                            {/* AI摘要组件 */}
                            <ArticleSummary
                                title={article.title}
                                content={article.content}
                                taobaoSummary={article.taobaoSummary}
                                aiSummary={article.aiSummary}
                            />

                            <ReactMarkdown
                                rehypePlugins={[[rehypeRaw], [remarkGfm]]}
                                components={{
                                    // 自定义标题渲染，添加锚点ID和样式
                                    h1: ({ node, ...props }) => (
                                        <h1
                                            id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
                                            className={styles.heading}
                                            // style={{ fontFamily: "'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', sans-serif" }}
                                            {...props}
                                        />
                                    ),
                                    h2: ({ node, ...props }) => (
                                        <h2
                                            id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
                                            className={styles.heading}
                                            // style={{ fontFamily: "'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', sans-serif" }}
                                            {...props}
                                        />
                                    ),
                                    h3: ({ node, ...props }) => (
                                        <h3
                                            id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
                                            className={styles.heading}
                                            // style={{ fontFamily: "'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', sans-serif" }}
                                            {...props}
                                        />
                                    ),
                                    h4: ({ node, ...props }) => (
                                        <h4
                                            id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
                                            className={styles.heading}
                                            // style={{ fontFamily: "'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', sans-serif" }}
                                            {...props}
                                        />
                                    ),
                                    h5: ({ node, ...props }) => (
                                        <h5
                                            id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
                                            className={styles.heading}
                                            // style={{ fontFamily: "'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', sans-serif" }}
                                            {...props}
                                        />
                                    ),
                                    h6: ({ node, ...props }) => (
                                        <h6
                                            id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
                                            className={styles.heading}
                                            // style={{ fontFamily: "'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', sans-serif" }}
                                            {...props}
                                        />
                                    ),
                                    // 段落样式
                                    p: ({ node, ...props }) => (
                                        <p
                                            className="article-content-text-size"
                                            itemProp="text"
                                            // style={{ fontFamily: "'Noto Serif SC', 'SimSun', 'STSong', serif" }}
                                            {...props}
                                        />
                                    ),

                                    //列表样式
                                    ul: ({ node, ...props }) => (
                                        <ul
                                            className={styles.list}
                                            // style={{ fontFamily: "'Noto Serif SC', 'SimSun', 'STSong', serif" }}
                                            {...props}
                                        />
                                    ),
                                    ol: ({ node, ...props }) => (
                                        <ol
                                            className={styles.list}
                                            // style={{ fontFamily: "'Noto Serif SC', 'SimSun', 'STSong', serif" }}
                                            {...props}
                                        />
                                    ),
                                    li: ({ node, ...props }) => (
                                        <li
                                            className="article-content-text-size"
                                            // style={{ fontFamily: "'Noto Serif SC', 'SimSun', 'STSong', serif" }}
                                            {...props}
                                        />
                                    ),

                                    // 引用样式
                                    blockquote: ({ node, ...props }) => (
                                        <blockquote
                                            className="article-content-text-size"
                                            // style={{ fontFamily: "'Noto Serif SC', 'SimSun', 'STSong', serif" }}
                                            {...props}
                                        />
                                    ),

                                    // 代码块处理
                                    code: ({ node, className, children, ...props }) => {
                                        const match = /language-(\w+)/.exec(className || '');
                                        const language = match ? match[1] : 'text';

                                        // 处理序列图
                                        if (language === 'sequence') {
                                            return (
                                                <SequenceDiagram diagram={String(children).replace(/\n$/, '')} />
                                            );
                                        }

                                        if (language === 'mermaid') {
                                            return <MermaidDiagram diagram={String(children).replace(/\n$/, '')} />;
                                        }

                                        if (language === 'meta') {
                                            // 解析 key:value 格式
                                            const lines = String(children).split('\n');
                                            const meta: any = {};
                                            lines.forEach(line => {
                                                const [key, ...rest] = line.split(':');
                                                if (key && rest.length) {
                                                    meta[key.trim()] = rest.join(':').trim();
                                                }
                                            });
                                            // tags 特殊处理
                                            if (meta.tags) {
                                                meta.tags = meta.tags.split(',').map((t: string) => t.trim());
                                            }
                                            if (meta.views) {
                                                meta.views = Number(meta.views);
                                            }
                                            return <MetaCard {...meta} />;
                                        }

                                        // 行内代码
                                        if (!match) {
                                            return (
                                                <code className={styles.inlineCode} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        }

                                        // 代码块
                                        return (
                                            <CodeBlock
                                                language={language}
                                                value={String(children).replace(/\n$/, '')}
                                            />
                                        );
                                    },
                                    // 预格式化标签样式
                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                    pre: ({ node, ...props }) => <pre className={styles.pre} {...props} />,

                                    // 添加表格相关组件
                                    table: ({ node, ...props }) => <Table {...props} />,
                                    thead: ({ node, ...props }) => <Thead {...props} />,
                                    tbody: ({ node, ...props }) => <Tbody {...props} />,
                                    tr: ({ node, ...props }) => <Tr {...props} />,
                                    th: ({ node, ...props }) => <Th {...props} />,
                                    td: ({ node, ...props }) => <Td {...props} />,

                                    // 添加视频组件
                                    video: ({ node, ...props }) => <ArticleVideo {...props} />,
                                    img: ({ node, ...props }) => <ArticleImage {...props} />,
                                }}
                            >
                                {article.content}
                            </ReactMarkdown>
                        </motion.div>

                        <footer className={styles.articleFooter}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                {article && <ArticleCopyright article={article} />}
                            </motion.div>
                        </footer>
                    </article>

                    <RecentArticles />
                    <Comments articleId={article.id!} />
                </main>
                {/* 右侧栏 ArticleSidebar，大屏显示 */}
                <aside className={styles.rightSidebar}>
                    <div className={styles.sidebarInner}>
                        <ArticleSidebar
                            articleContent={article.content}
                            onFontSizeChange={handleFontSizeChange}
                            readingTime={article.readingTime}
                            onExportOutline={handleExportOutline}
                            onResultClick={handleResultClick}
                            contentRef={contentRef}
                        />
                    </div>
                </aside>
            </div>
        </motion.div>
    );
}
export default ArticleDetail;