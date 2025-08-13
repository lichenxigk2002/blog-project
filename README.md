# 本地极速体验指南

> **性能优化，用户体验。LCP 0.6s，FCP 0.4s，内容快速加载，交互流畅。**

---

这是一个博客系统项目，主要关注前端体验和工程化实践。项目注重代码质量和用户体验，在功能实现和性能优化方面做了一些尝试。

## 在线体验

👉 [在线体验博客](https://www.gfbzsblog.site)

## 🛠️ 技术栈

- 前端：Next.js 15 + React 18 + TypeScript + Redux Toolkit + SCSS + Framer Motion
- 后端：Spring Boot 3 + MyBatis Plus + MySQL
- 部署：宝塔Linux + Nginx
- 其他：腾讯云COS、腾讯云SES、DeepSeek API 接口、腾讯云CDN内容分发与全球加速

## 目录结构

- /api：接口集中封装，类型安全，便于维护，接口变动一处修改即可全站生效

- /components：多个可复用组件，支持动画、响应式、主题切换，包括AI聊天、评论、目录、弹窗、骨架屏、分页、表情、打字机、代码高亮、友链、头像预览等

- /pages：Next.js 路由自动映射，包含主站、后台、404、首页、文章、归档、友链、相册、灵感、统计、AI 聊天、搜索、标签、留言板等页面

- /redux：全局状态管理，覆盖权限、主题、系统设置、认证、管理员认证等，支持异步操作、持久化

- /hooks：自定义 Hook，业务逻辑解耦，包括useAIChat、useAuth、useLoading、useDebounce、useThrottle、useTheme、useError等

- /utils：工具函数库，http 封装、加密、格式化、AI 工具、文章工具、类型安全、校验等功能

- /routes：路由集中配置，导航菜单自动生成，支持嵌套路由、权限控制

- /styles：全局样式、字体、主题变量、CSS Modules 样式隔离，支持暗黑/明亮模式切换

- /config：全局配置项，AI 助手、主题、接口、系统参数统一管理

- /client、/admin、/context、/http、/types：细分业务和基础能力，代码结构清晰，便于维护和扩展

## 工程化和体验

- HTTP 封装：自研 HTTP工具，支持全局 BASE_URL、自动带 token、错误统一处理，具备请求拦截、响应拦截、错误拦截、请求取消拦截、请求重试拦截等拦截器，API 层全部基于 http 封装

- 性能优化：采用SSG/SSR/ISR/CSR混合策略，首页 LCP 0.6s、FCP 0.4s，虚拟滚动优化长列表，图片懒加载+CDN，骨架屏/渐进加载，代码分割/懒加载分包策略，Tree Shaking减少包体积

- 类型安全：全量 TypeScript，接口、组件、工具、全局状态全部类型覆盖

- 动画和交互：使用Framer Motion、Typewriter等库，注重用户体验

- 功能：包含文章、标签、友链、相册、公告、AI 聊天、评论、后台管理、权限、邮箱通知、云存储、统计分析等

- 细节体验：智能文章目录、评论区 Markdown/表情/楼中楼、AI 聊天流式响应、操作提示弹窗、主题切换、后台权限管理、性能监控等

---

## 1. 博客内容截图 & Lighthouse 评分

**内容截图**

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/b63a15c3-7d4a-4507-94ec-a7833eda11a6.png" alt="图片" width="1000" />

**Lighthouse 评分**

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/6faeb1b3-3dd0-49cb-a092-eaf4a4f30afa.png" alt="图片" width="1000" />

> **首页 LCP 0.6s，FCP 0.4s，Lighthouse 评分 99+**  
> 通过SSR/SSG/ISR、Next.js图片压缩、图片懒加载、条件渲染+虚拟滚动、Tree Shaking、CDN内容分发、路由懒加载、组件懒加载等优化实现

---

## 2. 博客界面体验

- 首页设计参考了[@grtsinry43大佬](https://github.com/grtsinry43)的实现思路

- 文章列表页

  <img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/5e711698-b310-46df-a5b9-ba2180ad8960.png" alt="图片" width="1000" />

- 文章详情页

  文章详情页是博客系统的核心页面，支持Markdown 全格式渲染、代码高亮、表格、视频、序列图等内容的展示。左侧有智能目录，实时高亮当前阅读进度，右侧有文章侧边栏，支持字体调节、阅读时间统计、MarkDown导出和分享等功能。包含点赞动画、评论区、最近文章推荐、返回列表等交互功能。

  <img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/c389510e-7bb9-48d6-876a-b62f724afb57.png" alt="图片" width="1000" />

- 标签云页

  标签云页面的动画和交互设计，参考了@grtsinry43大佬的实现思路。每个标签都有独立的配色和动态背景，入场时带有弹性和旋转的动画效果，鼠标悬停时有缩放与旋转反馈。底部还叠加了动态的 TagCloud 背景，增加视觉层次感。

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/db853d83-32dd-4154-b126-f89d35958f3f.png" alt="图片" width="1000" />

- 灵光一瞬

灵光一瞬页面用于记录生活中的点滴和小想法。每条内容以简洁的动漫风卡片形式展示，错落有致，方便浏览。整体风格轻松温和，可以随时回顾和分享这些生活片段。

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/b6331b2d-77b4-4854-a0ff-0518300f0288.png" alt="图片" width="1000" />

- AI智能助手

小熙AI页面是博客里的智能助手空间。整体风格亲切，顶部有氛围感文案和欢迎语。未登录时会提示登录，登录后可以直接和AI对话。对话区采用了自研的 AIChat 组件，基于DeepSeek大模型API，支持流式消息、Markdown 渲染、代码高亮。页面布局简洁，交互细节到位。

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/6bf93c49-c305-4e3a-8647-4c3f8d77f686.png" alt="图片" width="1000"  />

- 留言板

留言板页面提供留言、互动、交流的功能。支持匿名或带头像留言（支持QQ邮箱自动解析头像，也可以自定义上传），每条留言都能被置顶、回复，支持性别标识和时间显示。包含表单校验、头像上传、操作提示、加载动画等基础功能。留言内容支持动态打字机动画，管理员回复会高亮展示。

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/0678ce32-0977-40c3-adc4-38a566a5d8b4.png" alt="图片" width="1000" />

- 友链页面

友链页面除了展示链接外，还提供了实时预览功能：点击任意友链，右侧会弹出对方网站的实时窗口（iframe 预览），不用跳转就能预览对方站点。如果对方网站不支持嵌入，会有友好的提示。预览区自适应缩放，窗口高度和布局会自动同步。

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/fb9a1c27-7118-453e-9cf7-e4520e75ba7b.png" alt="图片" width="1000" />

- 暗黑/明亮模式切换

主题切换支持在明亮模式和暗黑模式之间切换，整个站点的配色、背景、字体会实时变化。所有页面、组件、动画都适配了主题变化，细节统一。

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/ac3a310c-11a6-40cc-9337-7042a6f7dc1f.png" alt="图片" width="1000" />

- 后台管理

后台管理系统用于管理博客的所有内容和功能。采用模块化、组件化的设计，每个功能区独立成模块，便于维护和扩展。

后台分为文章管理、评论管理、标签管理、用户管理、友链管理、留言板管理、相册管理、灵感管理、面试题收集管理、系统设置等多个板块。每个板块都有专属的表单、列表、筛选、批量操作、权限校验等功能，支持增删改查、批量导入导出、内容审核、置顶、回复、关联等操作。

后台采用响应式布局，适配不同屏幕，包含权限管理和路由守卫。每个管理模块都拆分成独立的 React 组件，样式隔离，逻辑清晰。

**仪表盘**

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/c7cdc5ed-f095-422f-8e1a-c80844dadb2e.png" alt="图片" width="1000" />

**文章管理表单**

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/666eef03-cde8-461e-b4f9-5ffac49d09cc.png" alt="图片" width="1000" />

**留言板管理**

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/026cad66-9562-483b-82d6-eebf24eacbc2.png" alt="图片" width="1000" />

**全局系统设置**

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/e24431c4-75f7-4a44-8c0c-c7194d21cb8d.png" alt="图片" width="1000" />

---

## 3. 本地安装

### 环境要求

- Node.js 18+
- npm 9+
- Java 17+
- Maven 3+
- MySQL 5.7+/8.0+
- 推荐 Edge 浏览器体验

### 克隆项目

```bash
git clone <your-repo-url>
cd <your-repo-directory>
```

---

### 后端配置（Spring Boot）

#### 1. 数据库准备

创建数据库（如有需要）：

```sql
CREATE DATABASE my_blog ;
```
数据库文件路径：src/main/resources/db/migration/mysql_db.sql

#### 2. .env 配置（blogBackend/.env）

```env
# 数据库
MYSQL_USERNAME=your_mysql_user
MYSQL_PASSWORD=your_mysql_password

# 邮箱
TENCENT_CLOUD_MAIL_USERNAME=your_mail@domain.com
TENCENT_CLOUD_MAIL_PASSWORD=your_mail_smtp_password

# 腾讯云COS
COS_SECRET_ID=your_cos_secret_id
COS_SECRET_KEY=your_cos_secret_key
COS_BUCKET_NAME=your_cos_bucket
COS_REGION=your_cos_region
COS_URL=https://your-cos-url

# Google OAuth（如用到）
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### 3. 启动后端

```bash
cd blogBackend
mvn spring-boot:run
```

默认端口：**8000**  
配置文件：`src/main/resources/application.yml`（支持环境变量注入）

---

### 前端配置（Next.js）

#### 1. .env 配置（blogFrontend/.env.local）

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_PASSWORD_SALT=your-salt-here
NEXT_PUBLIC_API_ENDPOINT=https://api.deepseek.com/v1/chat/completions
NEXT_PUBLIC_API_KEY=your-deepseek-api-key
```

#### 2. 启动前端

```bash
cd blogFrontend
npm install
npm run dev
```

默认端口：**3000**  
访问地址：[http://localhost:3000](http://localhost:3000)

---

## 4. 性能优化

- **SSR + SSG + ISR**：采用多种渲染策略，首屏内容直出，提升加载速度
- **图片懒加载 + CDN**：使用CDN加速和Next.js图片压缩，优化图片加载
- **骨架屏/按需加载**：使用虚拟滚动和IntersectionObserver API，按需加载内容
- **代码分割**：路由级和组件级的代码分割，减少主包体积
- **Tree Shaking**：移除未使用的代码，减少打包体积
- **缓存策略**：静态资源强缓存，接口智能缓存
- **Lighthouse 评分 99+**：性能、可访问性、最佳实践等方面表现良好

> **首页 LCP 0.6s，FCP 0.4s**

---

## 5. 致谢

特别感谢 [@grtsinry43大佬](https://github.com/grtsinry43) 的灵感与技术分享，他的博客项目给了我很多启发。

---

## 6. 生产部署

如需了解一键部署、线上环境变量配置等生产环境相关内容，  
👉 [查看生产部署指南](https://www.gfbzsblog.site/main/Articles/49)

---

## 贡献指南

欢迎 PR、Issue、建议和反馈！  
如需本地开发、二次开发、定制功能，欢迎联系或直接提 Issue。

## License / 许可证

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

本项目采用 MIT 开源许可证，详见 [LICENSE](./LICENSE) 文件。

## 📬联系方式

- 邮箱：624787243@qq.com


