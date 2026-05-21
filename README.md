# 🌌 LiuTao's Personal Website & Blog

[![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://ltao0829.github.io/my-personal-site/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

这是一个极轻量、高性能、隐私友好且高度可定制的个人静态博客主页。无需复杂的静态网站生成器（如 Hugo 或 Hexo），完全由原生的 **HTML5 / CSS3 / Vanilla JS** 构建，极易维护。

✨ **在线预览**：[https://ltao0829.github.io/my-personal-site/](https://ltao0829.github.io/my-personal-site/)

---

## 🚀 核心亮点与特色

*   **🌓 无闪烁暗色模式 (FOUC-free Dark Mode)**：支持一键切换深浅色主题，并在 `<head>` 头部集成了防瞬闪同步脚本，彻底规避了暗色模式下刷新网页时刺眼的 100ms 纯白瞬间。
*   **🎨 高级视觉美学**：
    *   **字体系统**：引入现代谷歌字体 `Outfit`（用于大标题与几何标签）与 `Inter`（用于长文阅读），兼顾科技感与易读性。
    *   **微交互**：为文章卡片和个人头像增加了基于 `cubic-bezier` 的平滑偏转、浮起及阴影交互动效。
*   **💬 隐私友好的评论区 (Cusdis)**：轻量无痕，完美适配网站主题颜色，并在切换暗色模式时自动无缝同步换肤。
*   **📊 免 Cookie 访问统计 (Umami Cloud)**：动态挂载 Umami 统计，完全免 Cookie，不搜集隐私，零首屏加载损耗。
*   **📡 RSS 2.0 订阅**：内置符合规范的订阅源 [feed.xml](feed.xml)，方便读者通过 RSS 阅读器（Feedly / Reeder 等）订阅博客。
*   **🐶 Brian Griffin 个性头像**：带有扁平程序员风格的恶搞之家 Brian Griffin 圆形头像作为主页名片。

---

## 🛠️ 技术栈

![](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![](https://img.shields.io/badge/Umami-Analytics-9cf?style=flat-square)
![](https://img.shields.io/badge/Cusdis-Comments-orange?style=flat-square)
![](https://img.shields.io/badge/RSS-2.0-red?style=flat-square&logo=rss&logoColor=white)

---

## 📁 目录结构说明

```text
├── css/
│   └── styles.css       # 统一管理的主题色盘、排版、响应式布局及悬浮动效
├── js/
│   ├── main.js          # 全站核心逻辑：动态年份、主题切换、Umami 统计注入
│   └── comments.js      # Cusdis 评论系统挂载与主题同步监听器
├── data/
│   └── blogs.json       # 博客列表元数据，首页/博客列表页通过 Ajax 动态渲染
├── posts/
│   ├── template.html    # 博客文章统一的排版模板
│   └── 00*.html         # 已发布文章的独立静态页面
├── images/
│   └── avatar.png       # Brian Griffin 程序员圆形个性头像
├── index.html           # 个人主页入口
├── about.html           # 关于我
├── blog.html            # 博客列表页
├── contact.html         # 联系我与 RSS 订阅入口
├── feed.xml             # RSS 订阅源文件
└── start.bat            # 本地双击启动 Python HTTP 服务器脚本
```

---

## 💻 本地运行与开发

项目不需要任何构建工具（如 Webpack / Vite），为了规避浏览器的跨域安全性限制（CORS），本地开发时可以通过以下方式启动服务器：

1.  **Windows 系统**：直接双击根目录下的 `start.bat`。它会自动启动一个 Python HTTP 服务并在默认浏览器打开 `http://localhost:8000`。
2.  **其他系统**：在终端进入项目根目录，运行如下命令：
    ```bash
    python -m http.server 8000
    ```

---

## ✍️ 日常更新指南

### 1. 发布一篇新文章
1.  复制一份 `posts/template.html` 并重命名为新文件，例如 `posts/004.html`，在其中编写你的文章正文。
2.  在 [data/blogs.json](data/blogs.json) 的数组顶部（首位）添加新文章的元数据信息：
    ```json
    {
      "title": "第 004 期：新文章标题",
      "description": "这是文章的简短介绍...",
      "date": "YYYY-MM-DD",
      "url": "posts/004.html"
    }
    ```
3.  同步更新 [feed.xml](feed.xml)，在 `<channel>` 节点顶部增加一个新的 `<item>`：
    ```xml
    <item>
      <title>第 004 期：新文章标题</title>
      <link>https://ltao0829.github.io/my-personal-site/posts/004.html</link>
      <guid>https://ltao0829.github.io/my-personal-site/posts/004.html</guid>
      <pubDate>文章发布日期 格式如: Thu, 21 May 2026 00:00:00 +0800</pubDate>
      <description>这是文章的简短介绍...</description>
    </item>
    ```

### 2. 更换统计 ID 或评论 ID
*   **修改 Umami 统计**：编辑 `js/main.js` 顶部的 `websiteId` 变量。
*   **修改 Cusdis 评论**：编辑 `js/comments.js` 顶部的 `APP_ID` 变量。

---

## 📜 许可证

本项目基于 [MIT License](LICENSE) 许可协议开源。
