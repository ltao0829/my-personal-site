# 🌌 Mazi's Personal Website & Blog

[![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://ltao0829.github.io/my-personal-site/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

An ultra-lightweight, high-performance, privacy-friendly, and highly customizable static personal blog. No complex static-site generator (Hugo, Hexo, etc.) — built entirely with native **HTML5 / CSS3 / Vanilla JS**, making it extremely easy to maintain.

✨ **Live preview**: [https://ltao0829.github.io/my-personal-site/](https://ltao0829.github.io/my-personal-site/)

---

## 🚀 Highlights

- **🌓 FOUC-free dark mode**: one-click light/dark theme switching with an anti-flash sync script in `<head>`, eliminating the harsh 100ms white flash when refreshing in dark mode.
- **🎨 Polished visual design**:
  - **Typography**: modern Google Fonts — `Outfit` (headings & geometric labels) and `Inter` (long-form reading).
  - **Micro-interactions**: smooth `cubic-bezier` tilt, lift, and shadow effects on post cards and the avatar.
- **💬 Privacy-friendly comments (Cusdis)**: lightweight and trackless, matches the site theme, and syncs seamlessly when switching dark mode.
- **📊 Cookie-free analytics (Umami Cloud)**: dynamically loaded Umami analytics — no cookies, no personal data, zero first-paint overhead.
- **📡 RSS 2.0 feed**: standards-compliant [feed.xml](feed.xml) for Feedly, Reeder, and other RSS readers.
- **🐶 Brian Griffin avatar**: a flat, programmer-style circular avatar of Family Guy's Brian Griffin as the homepage card.

---

## 🛠️ Tech Stack

![](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![](https://img.shields.io/badge/Umami-Analytics-9cf?style=flat-square)
![](https://img.shields.io/badge/Cusdis-Comments-orange?style=flat-square)
![](https://img.shields.io/badge/RSS-2.0-red?style=flat-square&logo=rss&logoColor=white)

---

## 📁 Project Structure

```text
├── css/
│   └── styles.css       # theme palette, typography, responsive layout & hover effects
├── js/
│   ├── main.js          # core logic: dynamic year, theme toggle, Umami injection
│   └── comments.js      # Cusdis comments mounting & theme-sync listener
├── data/
│   └── blogs.json       # blog post metadata, rendered dynamically via Ajax
├── posts/
│   ├── template.html    # unified post layout template
│   └── 00*.html         # published post pages
├── images/
│   └── avatar.png       # Brian Griffin programmer-style circular avatar
├── index.html           # homepage entry
├── about.html           # about me
├── blog.html            # blog list page
├── contact.html         # contact & RSS subscription entry
├── feed.xml             # RSS feed
└── start.bat            # local one-click Python HTTP server script
```

---

## 💻 Local Development

No build tools required (no Webpack / Vite). To avoid browser CORS restrictions during local development, start a local server:

1. **Windows**: double-click `start.bat` — it starts a Python HTTP server and opens `http://localhost:8000` in the default browser.
2. **Other systems**: run the following from the project root:

   ```bash
   python -m http.server 8000
   ```

---

## ✍️ Publishing a New Post

### 1. Write a new article

1. Copy `posts/template.html` and rename it, e.g. `posts/004.html`, then write your content.
2. Add the new post's metadata to the top of the array in [data/blogs.json](data/blogs.json):

   ```json
   {
     "title": "Issue 004: New post title",
     "description": "A short introduction...",
     "date": "YYYY-MM-DD",
     "url": "posts/004.html"
   }
   ```

3. Update [feed.xml](feed.xml) by adding a new `<item>` at the top of the `<channel>` node:

   ```xml
   <item>
     <title>Issue 004: New post title</title>
     <link>https://ltao0829.github.io/my-personal-site/posts/004.html</link>
     <guid>https://ltao0829.github.io/my-personal-site/posts/004.html</guid>
     <pubDate>Post date, e.g. Thu, 21 May 2026 00:00:00 +0800</pubDate>
     <description>A short introduction...</description>
   </item>
   ```

### 2. Change the analytics or comment IDs

- **Umami analytics**: edit the `websiteId` variable at the top of `js/main.js`.
- **Cusdis comments**: edit the `APP_ID` variable at the top of `js/comments.js`.

---

## 📜 License

This project is open source under the [MIT License](LICENSE).
