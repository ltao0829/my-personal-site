(function () {
  "use strict";

  function setCurrentYear() {
    const yearElements = document.querySelectorAll("#year");
    const currentYear = new Date().getFullYear();

    yearElements.forEach(function (element) {
      element.textContent = currentYear;
    });
  }

  function formatDate(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  }

  function createBlogItem(blog) {
    const article = document.createElement("article");
    article.className = "blog-item";

    const meta = document.createElement("p");
    meta.className = "blog-meta";
    meta.textContent = formatDate(blog.date);

    const title = document.createElement("h2");
    title.className = "blog-title";
    title.textContent = blog.title;

    const description = document.createElement("p");
    description.className = "blog-description";
    description.textContent = blog.description;

    const actions = document.createElement("div");
    actions.className = "blog-actions";

    const link = document.createElement("a");
    link.className = "blog-link";
    link.href = blog.url;
    link.textContent = "阅读这一篇 →";
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    actions.appendChild(link);

    article.appendChild(meta);
    article.appendChild(title);
    article.appendChild(description);
    article.appendChild(actions);

    return article;
  }

  async function loadBlogs() {
    const list = document.querySelector("#blog-list");

    if (!list) {
      return;
    }

    try {
      const response = await fetch("data/blogs.json", {
        headers: {
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("无法加载 blogs.json");
      }

      const blogs = await response.json();

      if (!Array.isArray(blogs) || blogs.length === 0) {
        list.innerHTML = "";
        const empty = document.createElement("p");
        empty.className = "muted";
        empty.textContent = "暂时还没有博客内容。";
        list.appendChild(empty);
        return;
      }

      blogs.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });

      list.innerHTML = "";

      blogs.forEach(function (blog) {
        if (!blog.title || !blog.description || !blog.date || !blog.url) {
          return;
        }

        const item = createBlogItem(blog);
        list.appendChild(item);
      });
    } catch (error) {
      list.innerHTML = "";

      const message = document.createElement("p");
      message.className = "muted";
      message.textContent = "博客列表加载失败，请稍后再试。";

      list.appendChild(message);

      console.error(error);
    }
  }

  function initThemeToggle() {
    const nav = document.querySelector(".site-nav");
    if (!nav) {
      return;
    }

    const sunIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
    const moonIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';

    // 读取当前生效的主题（由 Head 内联防闪烁脚本设置）
    let currentTheme = document.documentElement.getAttribute("data-theme") || "light";

    const button = document.createElement("button");
    button.className = "theme-toggle";
    button.type = "button";
    button.setAttribute("aria-label", "切换主题");
    button.setAttribute("title", "切换暗色/亮色模式");
    button.innerHTML = currentTheme === "dark" ? sunIcon : moonIcon;

    button.addEventListener("click", function () {
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      
      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("theme", nextTheme);
      button.innerHTML = nextTheme === "dark" ? sunIcon : moonIcon;
      
      currentTheme = nextTheme;

      // 派发全局主题变更自定义事件，用于与其他组件联动（如评论区）
      document.dispatchEvent(new CustomEvent("theme-changed", {
        detail: { theme: nextTheme }
      }));
    });

    nav.appendChild(button);
  }

  setCurrentYear();
  loadBlogs();
  initThemeToggle();
})();
