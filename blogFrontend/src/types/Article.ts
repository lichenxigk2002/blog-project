// types/article.ts
import type { ArticleCopyright } from './Copyright';

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
    isTop?: boolean; // 是否置顶
    sortOrder?: number; // 排序权重

    tags: Array<{
        id: number;
        name: string;
        slug: string;
        color: string;
    }>;

    copyright?: ArticleCopyright; // 关联的版权信息
}

// 简化的文章列表类型，不包含内容字段
export interface ArticleListItem {
    id?: number;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    authorId: number;
    status: 'draft' | 'published' | 'archived';
    postType: 'post' | 'page' | 'thought' | 'diary';
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    viewCount: number;
    likeCount: number;
    readingTime: number;
    isTop?: boolean;
    sortOrder?: number;

    tags: Array<{
        id: number;
        name: string;
        slug: string;
        color: string;
    }>;
}