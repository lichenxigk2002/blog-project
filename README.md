# 本地极速体验指南

> **极致性能，极致体验。LCP 0.6s，FCP 0.4s，内容秒开，交互丝滑。**

---

这个博客系统，以前端为主场，体验和工程化拉满。不是那种“能跑起来就行”的小玩具，而是我一行行打磨出来、追求极致体验和可维护性的中大型项目。

## 在线体验

👉 [点我在线体验博客](https://www.gfbzsblog.site)
## 🛠️ 技术栈

- 前端：Next.js 15 + React 18 + TypeScript + Redux Toolkit + SCSS + Framer Motion
- 后端：Spring Boot 3 + MyBatis Plus + MySQL
- 部署：宝塔Linux + Nginx
- 其他：腾讯云 COS、邮箱推送、AI 接口、CDN

## 目录结构，极致清晰

- /api：所有接口都集中封装，类型安全，维护简单，接口变动一处改全站生效。

- /components：几十个高复用组件，动画、响应式、主题切换全支持，什么AI聊天、评论、目录、弹窗、骨架屏、分页、表情、打字机、代码高亮、友链、头像预览……你想要的细节全都有。

- /pages：Next.js 路由自动映射....我没用哈，主站、后台、404、首页、文章、归档、友链、相册、灵感、统计、AI 聊天、搜索、标签、留言板……每个页面都不是“能用就行”，而是“用起来爽”。

- /redux：全局状态管理，权限、主题、系统设置、认证、管理员认证全覆盖，异步操作、持久化、开发体验全拉满。

- /hooks：自定义 Hook，业务逻辑彻底解耦，useAIChat、useAuth、useLoading、useDebounce、useThrottle、useTheme、useError……用起来就是顺手。

- /utils：工具函数库，http 封装、加密、节流、防抖、格式化、AI 工具、文章工具、校验……全都类型安全，随用随取。

- /routes：路由集中配置，导航菜单自动生成，嵌套路由、权限控制一目了然。

- /styles：全局样式、字体、主题变量、CSS Modules 样式隔离，暗黑/明亮模式一键切换。

- /config：全局配置项，AI 助手、主题、接口、系统参数统一管理。

- /client、/admin、/context、/http、/types：细分业务和基础能力，代码结构极致清晰，维护和扩展都很舒服。

## 工程化和体验，细节拉满

- HTTP 封装：自研 request.ts，支持全局 BASE_URL、自动带 token、错误统一处理，API 层全部基于 http 封装，接口变动一处改全站生效。

- 性能优化：SSG/SSR/ISR/CSR混合策略，首页 LCP 0.6s、FCP 0.4s，虚拟滚动优化长列表，图片懒加载+CDN，骨架屏/渐进加载，代码分割/懒加载分包策略，Tree Shaking减少包体积。

- 类型安全：全量 TypeScript，接口、组件、工具、全局状态全部类型覆盖，开发无忧。

- 动画和交互：Framer Motion、Typewriter每个细节都追求“用起来顺手，看起来舒服”。

- 功能丰富但不臃肿：文章、标签、友链、相册、公告、AI 聊天、评论、后台管理、权限、邮箱通知、云存储、统计分析……每个功能都不是“能用就行”，而是“用起来爽、看起来酷、改起来顺手”。

- 细节体验：智能文章目录、评论区 Markdown/表情/楼中楼、AI 聊天流式响应、操作提示弹窗、主题切换、后台权限分明、性能监控……每一处都在打磨。

一句话总结：

这不是“能用就行”的博客系统，而是“性能、体验、工程化、可维护性”全都拉满的中大型项目。

如果你在意体验、在意代码质量、在意后期维护和扩展，这个项目绝对值得一试。

---

## 1. 先睹为快：博客内容截图 & Lighthouse 评分

**内容截图**

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/b63a15c3-7d4a-4507-94ec-a7833eda11a6.png" alt="图片" width="1000" />

**Lighthouse 评分**

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/6faeb1b3-3dd0-49cb-a092-eaf4a4f30afa.png" alt="图片" width="1000" />

> **首页 LCP 0.6s，FCP 0.4s，Lighthouse 评分 99+，性能拉满。**  
> 归功于 SSR/SSG/ISR、Next.js图片压缩、图片懒加载、条件渲染+虚拟滚动、Tree Shaking、CDN内容分发、路由懒加载、组件懒加载等多重优化。



---

## 2. 博客界面体验（截图&交互细节）

- 首页没什么好截图的，上面就有UI参考[@grtsinry43大佬](https://github.com/grtsinry43)，实话实说我是真没这种设计理念...

- 文章列表页

  <img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/5e711698-b310-46df-a5b9-ba2180ad8960.png" alt="图片" width="1000" />

- 文章详情页

  等下，bro有话说。
  文章详情页是我博客系统里体验和细节都拉满的核心页面。支持Markdown 全格式渲染、代码高亮、表格、视频、序列图，所有内容都能优雅展示。左侧有智能目录，实时高亮当前阅读进度，右侧有文章侧边栏，支持字体调节、阅读时间统计、MarkDown导出和分享等实用功能。点赞动画、评论区、最近文章推荐、返回列表等交互一应俱全。

  <img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/c389510e-7bb9-48d6-876a-b62f724afb57.png" alt="图片" width="1000" />

- 标签云页截图

  标签云页面的动画和交互设计，核心理念是借鉴了@grtsinry43大佬的实现思路。每个标签都拥有独立的配色和动态背景，入场时带有弹性和旋转的动画效果，鼠标悬停时有细腻的缩放与旋转反馈，整体交互非常灵动。底部还叠加了动态的 TagCloud 背景，视觉层次感十足。

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/db853d83-32dd-4154-b126-f89d35958f3f.png" alt="图片" width="1000" />

- 灵光一瞬

灵光一瞬页面其实就是用来记录生活中的点滴和小想法。每一条内容都会以简洁的动漫风卡片形式展示，错落有致，方便浏览。没有复杂的交互，也不追求花哨，就是想把日常的灵感、随笔、感悟，安静地收集在这里。整体风格轻松温和，让你随时可以回顾和分享这些生活片段。

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/b6331b2d-77b4-4854-a0ff-0518300f0288.png" alt="图片" width="1000" />

- AI智能助手

小熙AI页面是博客里的专属智能助手空间。整体风格可爱亲切，顶部有氛围感文案和欢迎语。未登录时，页面会友好地提示你登录，并有醒目的按钮引导操作，整个流程很顺滑。登录后，就能直接和“小熙”AI对话，无论是技术问题、学习困惑还是日常闲聊，都能得到即时响应。

对话区采用了自研的 AIChat 组件，继承DeepSeek大模型API，支持流式消息、Markdown 渲染、代码高亮，体验接近主流 AI 聊天产品。页面布局简洁，交互细节到位，既有现代感又不失亲和力。无论你是想问技术、聊生活，还是单纯找个AI陪伴，这里都能给你一个安静、专属的交流空间。

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/6bf93c49-c305-4e3a-8647-4c3f8d77f686.png" alt="图片" width="1000"  />

- 留言板

留言板页面就是给大家一个可以随时留言、互动、表达的小天地。你可以匿名或者带头像（支持QQ邮箱自动解析头像，也可以自定义上传），写下想说的话，和我或者其他访客交流。每条留言都能被置顶、回复，支持性别标识和时间显示，界面风格温暖，交互细节也很友好。

表单校验、头像上传、操作提示、加载动画这些基础体验都做得很扎实。留言内容支持动态打字机动画，管理员回复会高亮展示。整体就是一个简单、纯粹、氛围感很强的社区角落，欢迎你随时来写下自己的心情和想法。

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/0678ce32-0977-40c3-adc4-38a566a5d8c4.png" alt="图片" width="1000" />

- 友链页面截图

友链页面不仅仅是展示一堆卡片那么简单。和大多数博客只给个链接不同，我这里做了一个实时预览的功能：你点开任意一个友链，右侧会直接弹出对方网站的实时窗口（iframe 预览），不用跳转就能先“偷看”一下对方的站点风格和内容。如果对方网站不支持嵌入，也会有友好的提示和兜底。整个预览区自适应缩放，窗口高度和布局会自动同步，体验非常顺滑。

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/fb9a1c27-7118-453e-9cf7-e4520e75ba7b.png" alt="图片" width="1000" />

- 暗黑/明亮模式切换

主题切换支持一键在明亮模式和暗黑模式之间自由切换，整个站点的配色、背景、字体都会跟着实时变化。无论你喜欢白天模式的清爽，还是夜间模式的护眼，都能一秒切换，体验自然流畅。所有页面、组件、动画都适配了主题变化，细节统一，不会出现“半明半暗”的尴尬。只不过做的没有那么细节，比如跟随系统啊，或者是多种颜色啊，以后我会慢慢更新的~~

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/ac3a310c-11a6-40cc-9337-7042a6f7dc1f.png" alt="图片" width="1000" />

- 后台管理

后台管理系统是整个博客项目的“中枢大脑”，所有内容和功能都能在这里高效管理。实现上采用了模块化、组件化的设计，每个功能区都独立成模块，维护和扩展都非常方便。

具体来说，后台分为文章管理、评论管理、标签管理、用户管理、友链管理、留言板管理、相册管理、灵感管理、面试题收集管理、系统设置等多个板块。每个板块都有专属的表单、列表、筛选、批量操作、权限校验等功能，支持增删改查、批量导入导出、内容审核、置顶、回复、关联等复杂操作。比如文章管理支持 Markdown 编辑、实时预览、草稿/发布/归档切换，评论和留言支持审核和回复，友链和相册支持图片上传和排序，系统设置则涵盖了内容、通知、UI、权限等全局配置。

后台整体采用响应式布局，适配不同屏幕，交互细节和表单校验都做得很扎实。权限管理和路由守卫保证了只有管理员才能访问敏感功能。每个管理模块都拆分成独立的 React 组件，样式隔离，逻辑清晰，便于你自己的扩展和维护。

这里简单的截几张图展示一下：

**这是仪表盘**

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/c7cdc5ed-f095-422f-8e1a-c80844dadb2e.png" alt="图片" width="1000" />

**这是文章管理的表单**

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/666eef03-cde8-461e-b4f9-5ffac49d09cc.png" alt="图片" width="1000" />

**这是留言板管理**

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/026cad66-9562-483b-82d6-eebf24eacbc2.png" alt="图片" width="1000" />

这是全局系统设置，由于主包实在没什么UI经验，仅仅将功能实现了一下

<img src="https://images-1359353257.cos.ap-beijing.myqcloud.com/images/e24431c4-75f7-4a44-8c0c-c7194d21cb8d.png" alt="图片" width="1000" />

还有很多其他页面就不展示了，请问这种猛男主题的管理系统你心动了吗？

---

## 3. 极速本地安装

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

## 4. 性能优化亮点

- **SSR + SSG + ISR**：SSG+ISR在打包的时候就渲染好了，SSG在服务器就渲染好了。首屏内容直出，极致加速。
- **图片懒加载 + CDN**：全球CDN加速+Next.js图片压缩，大图无压力，秒开。
- **骨架屏/按需加载**：虚拟滚动啊，IntersectionObserver API的运用，底下看不到就不加载，首页就是快。
- **代码分割**：路由级组件级的代码分割，只要是大包，全从主包分出去。
- **Tree Shaking**：将正在开发中还没有用到的代码在打包的时候踢出去哈。
- **缓存策略**：静态资源强缓存，接口智能缓存。
- **Lighthouse 评分 99+**：性能、可访问性、最佳实践全绿，为什么无障碍不行，他竟然让我github按钮加上github字段？我不接受。

> **首页 LCP 0.6s，FCP 0.4s，体验就是快！**

---

## 5. 致谢

特别感谢 [@grtsinry43大佬](https://github.com/grtsinry43) 的灵感与技术分享，是他的博客启发了我，说白了，没有他就没有现在的我。

---

## 6. 生产部署

想要一键部署、线上环境变量配置？  
👉 [点此查看生产部署指南](https://www.gfbzsblog.site/main/Articles/49)

---

> **极致性能，极致体验。欢迎 star & PR，一起让博客更快更酷！**

##  贡献指南

欢迎 PR、Issue、建议和吐槽！  
如需本地开发、二次开发、定制功能，欢迎联系我或直接提 Issue。

## 📬联系方式

- 我的邮箱：624787243@qq.com


