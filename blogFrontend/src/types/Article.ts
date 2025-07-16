// types/article.ts
export interface Article {
    id?: number;
    title: string;
    slug: string;
    content: string;
    htmlContent: string;
    excerpt: string;
    coverImage: string;
    images: string[]; // 注意：后端返回的是字符串需要解析
    authorId: number;
    status: 'draft' | 'published' | 'archived';  // 更新为与数据库一致的枚举值
    postType: 'post' | 'page' | 'thought' | 'diary';
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    viewCount: number;
    likeCount: number;
    readingTime: number;

    tags: Array<{
        id: number;
        name: string;
        slug: string;
        color: string;
    }>;
}