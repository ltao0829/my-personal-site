(function () {
  "use strict";

  // ==========================================
  // Cusdis 评论系统配置
  // ==========================================
  const CUSDIS_CONFIG = {
    // 请在此处填入你在 Cusdis 官网 (https://cusdis.com) 注册获取的 appId
    appId: "e37ed811-a7c7-40ba-a327-12f1a1024aa1", 
    host: "https://cusdis.com"
  };

  function initComments() {
    const container = document.getElementById("comments-container");
    if (!container) {
      return; // 如果当前页面没有评论容器，则不执行
    }

    // 检查是否配置了 appId
    if (!CUSDIS_CONFIG.appId || CUSDIS_CONFIG.appId === "YOUR_CUSDIS_APP_ID") {
      const hint = document.createElement("div");
      hint.style.padding = "20px";
      hint.style.border = "1px dashed var(--border)";
      hint.style.borderRadius = "var(--radius)";
      hint.style.background = "var(--surface)";
      hint.style.textAlign = "center";
      hint.style.color = "var(--muted)";
      hint.style.fontSize = "0.95rem";
      hint.innerHTML = `
        <p style="margin: 0 0 8px 0; font-weight: 600; color: var(--text);">💬 评论区配置提示</p>
        <p style="margin: 0 0 12px 0; font-size: 0.85rem; line-height: 1.5;">
          留言系统已准备就绪！请在本地项目文件 <code>js/comments.js</code> 中配置你的 <code>appId</code>。
        </p>
        <a href="https://cusdis.com" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline;">
          去 Cusdis 官网获取 appId →
        </a>
      `;
      container.appendChild(hint);
      return;
    }

    // 1. 动态创建 Cusdis 渲染所需的 div 容器
    const threadDiv = document.createElement("div");
    threadDiv.id = "cusdis_thread";
    
    // 设置 Cusdis 数据属性
    threadDiv.setAttribute("data-host", CUSDIS_CONFIG.host);
    threadDiv.setAttribute("data-app-id", CUSDIS_CONFIG.appId);
    
    // 自动派生当前页面的唯一 ID、链接与标题
    const pageId = window.location.pathname;
    threadDiv.setAttribute("data-page-id", pageId);
    threadDiv.setAttribute("data-page-url", window.location.href);
    threadDiv.setAttribute("data-page-title", document.title);

    // 获取并设置当前生效的主题
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    threadDiv.setAttribute("data-theme", currentTheme);

    // 将 Cusdis 线程 div 加入到父容器中
    container.appendChild(threadDiv);

    // 2. 动态创建并插入 Cusdis 脚本
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = CUSDIS_CONFIG.host + "/js/cusdis.es.js";

    document.body.appendChild(script);

    // 3. 监听全局主题改变事件，联动更新 Cusdis 主题
    document.addEventListener("theme-changed", function (e) {
      const nextTheme = e.detail.theme;
      if (window.CUSDIS && typeof window.CUSDIS.setTheme === "function") {
        window.CUSDIS.setTheme(nextTheme);
      } else {
        const el = document.getElementById("cusdis_thread");
        if (el) {
          el.setAttribute("data-theme", nextTheme);
        }
      }
    });
  }

  // 确保在 DOM 解析完成后加载评论区
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initComments);
  } else {
    initComments();
  }
})();
