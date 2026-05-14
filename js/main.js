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

  function createPodcastItem(podcast) {
    const article = document.createElement("article");
    article.className = "podcast-item";

    const meta = document.createElement("p");
    meta.className = "podcast-meta";
    meta.textContent = formatDate(podcast.date);

    const title = document.createElement("h2");
    title.className = "podcast-title";
    title.textContent = podcast.title;

    const description = document.createElement("p");
    description.className = "podcast-description";
    description.textContent = podcast.description;

    const actions = document.createElement("div");
    actions.className = "podcast-actions";

    const link = document.createElement("a");
    link.className = "podcast-link";
    link.href = podcast.url;
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

  async function loadPodcasts() {
    const list = document.querySelector("#podcast-list");

    if (!list) {
      return;
    }

    try {
      const response = await fetch("data/podcasts.json", {
        headers: {
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("无法加载 podcasts.json");
      }

      const podcasts = await response.json();

      if (!Array.isArray(podcasts) || podcasts.length === 0) {
        list.innerHTML = "";
        const empty = document.createElement("p");
        empty.className = "muted";
        empty.textContent = "暂时还没有博客内容。";
        list.appendChild(empty);
        return;
      }

      podcasts.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });

      list.innerHTML = "";

      podcasts.forEach(function (podcast) {
        if (!podcast.title || !podcast.description || !podcast.date || !podcast.url) {
          return;
        }

        const item = createPodcastItem(podcast);
        list.appendChild(item);
      });
    } catch (error) {
      list.innerHTML = "";

      const message = document.createElement("p");
      message.className = "muted";
      message.textContent = "播客列表加载失败，请稍后再试。";

      list.appendChild(message);

      console.error(error);
    }
  }

  setCurrentYear();
  loadPodcasts();
})();
