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
import ArticleToc from '@/components/ArticleToc/ArticleToc'; // 文章目录组件
import { motion } from 'framer-motion';              // 动画库
import { ArticlesAPI } from '@/api/ArticlesAPI';    // 文章API
import CodeBlock from '@/components/Code/CodeBlock';   // 代码高亮组件
import Comments from '@/components/Comments/Comments'; // 评论组件
import { FaArrowLeft } from "react-icons/fa";  // FontAwesome图标库
import Head from "next/head";               // Next.js头部组件
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'; // 加载动画组件
import RecentArticles from "@/components/RecentArticles/RecentArticles"; // 最近文章组件
import SequenceDiagram from '@/components/SequenceDiagram/SequenceDiagram'; // 渲染序列图组件
import ArticleSidebar from '@/components/ArticleSidebar/ArticleSidebar';   // 文章侧边栏组件
import { useLoading } from "@/hooks/useLoading"; // 自定义加载状态钩子


// 定义标题对象的类型
interface Heading {
    id: string;     // 标题的锚点ID（用于跳转）
    text: string;   // 标题文本内容
    level: number;  // 标题级别（1-6对应h1-h6）
}

const ArticleDetail: React.FC = () => {
    // 使用路由钩子获取路由参数
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
            </Head>
            {isMobile ? null : <div
                onClick={() => routerBack.back()}
                className={styles.backLinkButton}>
                <FaArrowLeft style={{ color: "var(--text)" }} />
            </div>}

            <motion.h1
                className={styles.articleTitle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {article.title}
            </motion.h1>

            <ArticleSidebar
                articleContent={article.content}
                onFontSizeChange={handleFontSizeChange}
                readingTime={article.readingTime}
                onExportOutline={handleExportOutline}
                onResultClick={handleResultClick}
            />

            <motion.div
                className={styles.articleDetail}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <motion.div
                    className={styles.articleMeta}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <span className={styles.date}>
                        发布时间: {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                    <span className={styles.status}>
                        文章状态: {
                            article.status === 'published'
                                ? '已发布'
                                : article.status === 'archived'
                                    ? '已归档'
                                    : '草稿'
                        }
                    </span>
                    <motion.span
                        className={styles.likeButton}
                        whileHover={{ scale: 1.05 }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleLike();
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <motion.div
                            className={styles.heartWrapper}
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, -10, 10, 0],
                            }}
                            transition={{
                                duration: 0.5,
                                ease: "easeInOut",
                                times: [0, 0.2, 0.4, 1]
                            }}
                        >
                            {isLiked ? (
                                <FaHeart className={styles.heartIcon} style={{ color: 'var(--like)' }} />
                            ) : (
                                <FaRegHeart className={styles.heartIcon} />
                            )}
                        </motion.div>
                        <motion.span
                            className={styles.likeCount}
                            animate={{
                                scale: [1, 1.2, 1],
                                y: [0, -10, 0]
                            }}
                            transition={{
                                duration: 0.5,
                                ease: "easeInOut"
                            }}
                        >
                            {likeCount}
                        </motion.span>
                    </motion.span>
                </motion.div>
                <motion.div
                    className={styles.articleContent}
                    ref={contentRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <ReactMarkdown
                        rehypePlugins={[[rehypeRaw], [remarkGfm]]}
                        components={{
                            // 自定义标题渲染，添加锚点ID和样式
                            h1: ({ node, ...props }) => (
                                <h1
                                    id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
                                    className={styles.heading}
                                    style={{ fontFamily: "'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', sans-serif" }}
                                    {...props}
                                />
                            ),
                            h2: ({ node, ...props }) => (
                                <h2
                                    id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
                                    className={styles.heading}
                                    style={{ fontFamily: "'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', sans-serif" }}
                                    {...props}
                                />
                            ),
                            h3: ({ node, ...props }) => (
                                <h3
                                    id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
                                    className={styles.heading}
                                    style={{ fontFamily: "'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', sans-serif" }}
                                    {...props}
                                />
                            ),
                            h4: ({ node, ...props }) => (
                                <h4
                                    id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
                                    className={styles.heading}
                                    style={{ fontFamily: "'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', sans-serif" }}
                                    {...props}
                                />
                            ),
                            h5: ({ node, ...props }) => (
                                <h5
                                    id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
                                    className={styles.heading}
                                    style={{ fontFamily: "'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', sans-serif" }}
                                    {...props}
                                />
                            ),
                            h6: ({ node, ...props }) => (
                                <h6
                                    id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
                                    className={styles.heading}
                                    style={{ fontFamily: "'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', sans-serif" }}
                                    {...props}
                                />
                            ),
                            // 段落样式
                            p: ({ node, ...props }) => (
                                <p
                                    className="article-content-text-size"
                                    style={{ fontFamily: "'Noto Serif SC', 'SimSun', 'STSong', serif" }}
                                    {...props}
                                />
                            ),

                            //列表样式
                            ul: ({ node, ...props }) => (
                                <ul
                                    className={styles.list}
                                    style={{ fontFamily: "'Noto Serif SC', 'SimSun', 'STSong', serif" }}
                                    {...props}
                                />
                            ),
                            ol: ({ node, ...props }) => (
                                <ol
                                    className={styles.list}
                                    style={{ fontFamily: "'Noto Serif SC', 'SimSun', 'STSong', serif" }}
                                    {...props}
                                />
                            ),
                            li: ({ node, ...props }) => (
                                <li
                                    className="article-content-text-size"
                                    style={{ fontFamily: "'Noto Serif SC', 'SimSun', 'STSong', serif" }}
                                    {...props}
                                />
                            ),

                            // 引用样式
                            blockquote: ({ node, ...props }) => (
                                <blockquote
                                    className="article-content-text-size"
                                    style={{ fontFamily: "'Noto Serif SC', 'SimSun', 'STSong', serif" }}
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
                            table: ({ node, ...props }) => (
                                <div className={styles.tableContainer}>
                                    <table className={styles.table} {...props} />
                                </div>
                            ),
                            thead: ({ node, ...props }) => <thead className={styles.tableHead} {...props} />,
                            tbody: ({ node, ...props }) => <tbody className={styles.tableBody} {...props} />,
                            tr: ({ node, ...props }) => <tr className={styles.tableRow} {...props} />,
                            th: ({ node, ...props }) => <th className={styles.tableHeader} {...props} />,
                            td: ({ node, ...props }) => <td className={styles.tableCell} {...props} />,

                            // 添加图片渲染组件
                            // img: ({ node, src, alt, ...props }) => {
                            //     // 检查是否是相对路径
                            //     const isRelativePath = src?.startsWith('/');
                            //     // 如果是相对路径，添加基础URL
                            //     const imageUrl = isRelativePath ? `${process.env.NEXT_PUBLIC_API_URL}/api/images${src}` : src;
                            //
                            //     return (
                            //         <div className={styles.imageWrapper}>
                            //             <Image
                            //                 src={imageUrl || ''}
                            //                 alt={alt || ''}
                            //                 width={800}
                            //                 height={400}
                            //                 className={styles.markdownImage}
                            //                 style={{
                            //                     maxWidth: '100%',
                            //                     height: 'auto',
                            //                     borderRadius: '8px',
                            //                     margin: '1rem 0'
                            //                 }}
                            //                 {...props}
                            //             />
                            //             {alt && <p className={styles.imageCaption}>{alt}</p>}
                            //         </div>
                            //     );
                            // },
                        }}
                    >
                        {article.content}
                    </ReactMarkdown>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <Link href="/main/Articles" className={styles.backLink}>
                        ←返回文章列表
                    </Link>
                </motion.div>
            </motion.div>

            {headings.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <ArticleToc
                        headings={headings}
                        title={article.title}
                        contentHeight={contentHeight}
                        contentTop={contentTop}
                    />
                </motion.div>
            )}
            <RecentArticles />
            <Comments articleId={article.id} />

        </motion.div>

    );
}
export default ArticleDetail;