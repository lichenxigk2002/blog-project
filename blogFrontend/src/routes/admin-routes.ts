export interface AdminRoute {
  id: number;
  path: string;
  name: string;
}

export const adminRoutes: AdminRoute[] = [
  {
    id: 1,
    path: '/admin',
    name: '仪表盘'
  },
  {
    id: 2,
    path: '/admin/articles',
    name: '文章管理'
  },
  {
    id: 3,
    path: '/admin/tags',
    name: '标签管理'
  },
  {
    id: 4,
    path: '/admin/comments',
    name: '评论管理'
  }, {
    id: 5,
    path: '/admin/gallery',
    name: '相册管理'
  }, {
    id: 6,
    path: '/admin/users',
    name: '用户管理'
  }, {
    id: 7,
    path: '/admin/thoughts',
    name: '思考管理'
  }, {
    id: 8,
    path: '/admin/bulletinboard',
    name: '留言板管理'
  }, {
    id: 9,
    path: '/admin/questions',
    name: '面试题管理'
  }, {
    id: 10,
    path: '/admin/friendlinks',
    name: '友链管理'
  }, {
    id: 11,
    path: '/admin/settings',
    name: '系统设置'
  },
  {
    id: 12,
    path: '/admin/copyright',
    name: '版权管理'
  },
  {
    id: 13,
    path: '/admin/crossbell',
    name: 'Crossbell管理'
  }
]; 