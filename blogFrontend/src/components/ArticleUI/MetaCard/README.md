# MetaCard 组件使用说明

## 组件简介

MetaCard 是一个用于展示外部链接、推荐资源、友链等元信息的卡片组件，支持平台 icon 自动识别与自定义，适配移动端和桌面端。

---

## Props 参数

| 参数      | 类型     | 说明                           | 是否必填 |
|-----------|----------|--------------------------------|---------|
| title     | string   | 卡片标题                       | 是      |
| url       | string   | 跳转链接                       | 是      |
| image     | string   | 封面图片（可选）               | 否      |
| desc      | string   | 描述信息（可选）               | 否      |
| platform  | string   | 平台标识（可选，自动识别优先） | 否      |

- `platform` 支持如 `bilibili`、`zhihu`、`github`、`tiktok`、`wechat`、`gfbzsblog` 等，具体见下方支持平台列表。
- 若不传 `platform`，会根据 `url` 自动识别。

---

## 支持的平台 icon 背景（platform 可选值）

| 平台         | platform 值   | 说明           |
|--------------|---------------|----------------|
| B站          | bilibili      | 哔哩哔哩       |
| 抖音/抖音国际| tiktok        | 抖音/抖音国际  |
| Twitter (X)  | twitter       | X（原Twitter） |
| YouTube      | youtube       |                |
| 微博         | weibo         |                |
| 知乎         | zhihu         |                |
| GitHub       | github        |                |
| Facebook     | facebook      |                |
| Instagram    | instagram     |                |
| QQ空间       | qzone         |                |
| QQ           | tencentqq     |                |
| 微信         | wechat        |                |
| 豆瓣         | douban        |                |
| Telegram     | telegram      |                |
| LinkedIn     | linkedin      |                |
| Reddit       | reddit        |                |
| Discord      | discord       |                |
| Pinterest    | pinterest     |                |
| StackOverflow| stackoverflow |                |
| Medium       | medium        |                |
| Vimeo        | vimeo         |                |
| Twitch       | twitch        |                |
| Dribbble     | dribbble      |                |
| Behance      | behance       |                |
| Slack        | slack         |                |
| WhatsApp     | whatsapp      |                |
| Snapchat     | snapchat      |                |
| 我的小站      | gfbzsblog     | favicon.ico    |

如需扩展更多平台，可在 `src/utils/platformIcon.tsx` 中添加。

---

## 在文章 Markdown 中的用法

你可以在文章内容的 Markdown 代码块中，使用 `meta` 语言块插入 MetaCard 卡片。例如：

````markdown
```meta
title: 标题
url: 需要跳转的链接
image: 链接的图标
desc: 一些描述
platform: 如果没有识别成功，可以手动添加
```
````

- 每一行 `key: value`，支持 `title`、`url`、`image`、`desc`、`platform`。
- `platform` 可选，若不写则自动根据 `url` 识别。
- 在文章详情页渲染时会自动解析并插入 MetaCard。

---

## 平台 icon 自动识别与自定义

- 支持主流平台（见上表）自动识别并显示品牌色 icon。
- 你可以通过 `platform` 字段手动指定平台（如 `platform: bilibili`）。
- 你自己的网站（如 `gfbzsblog.site`）会显示专属 favicon。

---

## 组件直接用法示例

```tsx
import MetaCard from '@/components/MetaCard/MetaCard';

<MetaCard
  title="B站主页"
  url="https://space.bilibili.com/xxxx"
  desc="B站个人主页"
  image="/images/avatar.png"
  platform="bilibili" // 可选，自动识别也可
/>
```

---

## 样式自定义

- 平台 icon 会在卡片右侧倾斜大图标显示，品牌色自动适配。
- 支持移动端和桌面端响应式。
- 如需自定义样式，可修改 `MetaCard.module.scss`。

---

## 维护与扩展

- 平台识别和 icon 渲染逻辑见 `src/utils/platformIcon.tsx`，如需支持新平台可在此扩展。
- 支持 props 传递和 Markdown 代码块两种用法。

---

如有问题或建议，欢迎提 Issue 或 PR！ 