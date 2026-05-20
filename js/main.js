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

  setCurrentYear();
  loadBlogs();
})();
