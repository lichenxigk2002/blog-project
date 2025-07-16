// src/utils/articleUtils.ts
export function buildArticleData(values: any, editingArticle?: any) {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset();
    const timezoneHours = Math.abs(Math.floor(timezoneOffset / 60));
    const timezoneMinutes = Math.abs(timezoneOffset % 60);
    const timezoneSign = timezoneOffset <= 0 ? '+' : '-';
    const timezoneString = `${timezoneSign}${String(timezoneHours).padStart(2, '0')}:${String(timezoneMinutes).padStart(2, '0')}`;

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezoneString}`;
    };

    return {
        ...values,
        htmlContent: values.content,
        slug: generateSlug(values.title),
        authorId: 1,
        createdAt: formatDate(new Date(editingArticle ? editingArticle.createdAt : new Date())),
        updatedAt: formatDate(new Date()),
        publishedAt: values.status === 'published' ? formatDate(new Date()) : null,
        viewCount: editingArticle ? editingArticle.viewCount : 0,
        likeCount: editingArticle ? editingArticle.likeCount : 0,
        readingTime: values.readingTime || Math.ceil((values.content?.length || 0) / 500),
        tagIds: values.tags || [],
        shouldNotify: values.shouldNotify || false,
        notifyUserIds: values.notifyUserIds || []
    };
}
function generateSlug(title: string) {
    let slug = (title || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    if (!slug) {
        slug = 'untitled-' + Date.now();
    }
    return slug;
}