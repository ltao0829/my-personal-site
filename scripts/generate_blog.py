import os
import sys
import json
import datetime
import email.utils
import re
import argparse

def get_next_blog_info():
    blogs_path = "data/blogs.json"
    if not os.path.exists(blogs_path):
        return 1, "001", []
        
    with open(blogs_path, "r", encoding="utf-8") as f:
        try:
            blogs = json.load(f)
        except json.JSONDecodeError:
            blogs = []
            
    next_index = len(blogs) + 1
    index_str = f"{next_index:03d}"
    
    # Get last 10 titles for context
    existing_titles = [b.get("title", "") for b in blogs[:10]]
    return next_index, index_str, existing_titles

def generate_mock_content(next_index, index_str):
    """Generates mock data for local dry-run testing."""
    title = f"第 {index_str} 期：数字极简主义与心智带宽"
    description = "探讨在充满通知和算法推荐的信息时代，如何通过数字极简主义找回专注，释放我们宝贵的心智带宽。"
    content = """
    <p>我们生活在一个被屏幕和通知包围的时代。手机上的红点、社交媒体的无限滚动，以及随时随地弹出的新闻，正在无声无息地瓜分我们宝贵的心智带宽（Mental Bandwidth）。</p>
    
    <h2>什么是心智带宽？</h2>
    <p>心智带宽指的是我们大脑在某一时刻进行思考、做决策和抵御诱惑的认知容量。当我们的大脑不断被琐碎的信息碎片和即时消息打断时，这种认知容量就会被严重消耗，导致我们无法进行深度的思考和创造性工作。</p>
    
    <h2>实践数字极简主义的三个步骤</h2>
    <ul>
      <li><strong>精简应用与通知</strong>：卸载非必要的社交和娱乐软件，关闭除即时通讯（如微信等）以外的所有非人工触发通知。</li>
      <li><strong>设定数字边界</strong>：每天规定固定的时间检查邮件和社交媒体，而不是将其作为无意识的条件反射。</li>
      <li><strong>找回离线时光</strong>：每天留出至少一小时的完全离线时间，用于阅读、散步或冥想，让大脑得到真正的休息。</li>
    </ul>
    
    <h2>长期主义的视角</h2>
    <p>数字极简主义并不是让我们退回到原始社会，而是倡导一种“有意识地使用技术”的态度。在这个喧嚣的数字世界中，保护好自己的心智带宽，才能让我们在长期主义的道路上走得更稳、更远。</p>
    """
    return title, description, content

def call_gemini_api(next_index, index_str, existing_titles):
    from google import genai
    from google.genai import types
    
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable is missing.", file=sys.stderr)
        sys.exit(1)
        
    print("API Key detected in environment. Configuring google-genai Client...")
    try:
        client = genai.Client(api_key=api_key)
    except Exception as e:
        print(f"Error initializing Google GenAI Client: {e}", file=sys.stderr)
        sys.exit(1)
    
    # Format existing titles list for the prompt
    titles_context = "\n".join([f"- {t}" for t in existing_titles])
    
    prompt = f"""你是一个专栏作家、科技博主与深度思考者。请为我的个人静态博客写一篇全新的、高质量的中文个人博客文章。

我的博客主要关注以下主题：
- 技术与开发（特别是极简、原生、高性能的开发理念）
- 数字生活与效率工具
- 设计美学与排版
- 阅读与个人成长
- 长期主义与深度思考

以下是最近几期已发布的文章标题（请不要重复编写相同的主题或重复相近的标题）：
{titles_context}

请选择一个新颖的、与上述主题契合且对读者有启发性的话题进行写作。

【输出格式要求】
你必须返回一个符合 JSON 格式的字符串，不要包裹在 ```json 标记中。JSON 中必须包含以下三个键：
1. "title": 文章的标题。标题必须是中文，且必须以 "第 {index_str} 期：" 开头，格式形如 "第 {index_str} 期：[具体标题]"。例如："第 {index_str} 期：关于数字极简主义的思考"。
2. "description": 一句话的简短文章摘要（不超过 80 字），用于在博客列表页中作为引言展示。
3. "content": 文章的正文内容。必须是纯 HTML 格式。
   - 只能使用基本的 HTML 标签，如 <p>, <h2>, <ul>, <li>, <strong>, <pre>（代码块，如果有代码的话）等。
   - 不要包含 <html>, <head>, <body>, <!DOCTYPE> 标签。
   - 不要包含全局 CSS 样式，只返回标签包围的段落与结构。
   - 确保文章深度足够，字数在 800 - 1500 字左右，文字排版优雅，行文有启发性，结构清晰（使用 <h2> 分段）。
"""
    
    print(f"Calling Gemini API for post #{index_str}...")
    import time
    
    models_to_try = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
    response = None
    last_error = None
    
    for model_name in models_to_try:
        print(f"Trying to call Gemini API using model: {model_name}...")
        retries = 3
        delay = 2 # seconds
        for attempt in range(retries):
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=0.7,
                    ),
                )
                break
            except Exception as e:
                last_error = e
                err_str = str(e)
                if "503" in err_str or "demand" in err_str or "UNAVAILABLE" in err_str:
                    print(f"Model {model_name} is busy (Attempt {attempt+1}/{retries}). Retrying in {delay}s...", file=sys.stderr)
                    time.sleep(delay)
                    delay *= 2
                else:
                    print(f"Error calling {model_name}: {e}. Skipping retries.", file=sys.stderr)
                    break
        if response is not None:
            print(f"Successfully generated content using model: {model_name}")
            break
            
    if response is None:
        print(f"All models failed. Last error: {last_error}", file=sys.stderr)
        sys.exit(1)
        
    try:
        raw_text = response.text
        print("Successfully received text response from Gemini.")
    except Exception as e:
        print(f"Error: Failed to retrieve text from Gemini response: {e}", file=sys.stderr)
        sys.exit(1)
        
    # Clean raw_text from markdown code blocks if present
    cleaned_text = raw_text.strip()
    if cleaned_text.startswith("```"):
        cleaned_text = re.sub(r"^```(?:json)?\n", "", cleaned_text)
        cleaned_text = re.sub(r"\n```$", "", cleaned_text)
    cleaned_text = cleaned_text.strip()
    
    try:
        data = json.loads(cleaned_text)
        title = data.get("title", f"第 {index_str} 期：无标题")
        description = data.get("description", "无摘要。")
        content = data.get("content", "<p>无内容。</p>")
        
        # Guard against AI forgetting the prefix
        prefix = f"第 {index_str} 期："
        if not title.startswith(prefix):
            # Strip off any similar prefix and enforce the correct one
            title = prefix + title.split("：", 1)[-1]
            
        return title, description, content
    except Exception as e:
        print(f"Failed to parse JSON response: {e}", file=sys.stderr)
        print(f"Raw response text: {raw_text}", file=sys.stderr)
        print(f"Cleaned response text: {cleaned_text}", file=sys.stderr)
        sys.exit(1)

def update_files(title, description, content, index_str):
    # Get current date
    tz_bj = datetime.timezone(datetime.timedelta(hours=8))
    now = datetime.datetime.now(tz_bj)
    html_date = now.strftime("%Y-%m-%d")
    
    # 1. Generate new HTML file in posts/
    template_path = "posts/template.html"
    if not os.path.exists(template_path):
        print("Error: posts/template.html template not found.", file=sys.stderr)
        sys.exit(1)
        
    with open(template_path, "r", encoding="utf-8") as f:
        template_content = f.read()
        
    html_content = template_content
    html_content = html_content.replace("<title>文章标题 - LiuTao</title>", f"<title>{title} - LiuTao</title>")
    html_content = html_content.replace('content="这里是文章的简短描述或摘要。"', f'content="{description}"')
    html_content = html_content.replace('<p class="eyebrow">发布于 2026-05-20</p>', f'<p class="eyebrow">发布于 {html_date}</p>')
    html_content = html_content.replace('<h1>文章标题</h1>', f'<h1>{title}</h1>')
    html_content = html_content.replace('<p>这里是文章的简短描述或摘要。它会显示在博客列表的简介中，帮助读者快速了解本篇内容。</p>', f'<p>{description}</p>')
    
    # Replace content inside <article class="content">...</article>
    start_tag = '<article class="content">'
    end_tag = '</article>'
    start_idx = html_content.find(start_tag)
    end_idx = html_content.find(end_tag, start_idx)
    
    if start_idx != -1 and end_idx != -1:
        before = html_content[:start_idx + len(start_tag)]
        after = html_content[end_idx:]
        html_content = before + "\n      " + content.strip() + "\n    " + after
    else:
        print("Error: Could not find <article class='content'> in template.", file=sys.stderr)
        sys.exit(1)
        
    output_path = f"posts/{index_str}.html"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Created new post file: {output_path}")
    
    # 2. Update data/blogs.json
    blogs_path = "data/blogs.json"
    if os.path.exists(blogs_path):
        with open(blogs_path, "r", encoding="utf-8") as f:
            try:
                blogs = json.load(f)
            except json.JSONDecodeError:
                blogs = []
    else:
        blogs = []
        
    new_blog = {
        "title": title,
        "description": description,
        "date": html_date,
        "url": f"posts/{index_str}.html"
    }
    blogs.insert(0, new_blog)
    
    with open(blogs_path, "w", encoding="utf-8") as f:
        json.dump(blogs, f, indent=2, ensure_ascii=False)
    print("Updated data/blogs.json")
    
    # 3. Update feed.xml
    feed_path = "feed.xml"
    if os.path.exists(feed_path):
        with open(feed_path, "r", encoding="utf-8") as f:
            feed_content = f.read()
            
        last_build_date = email.utils.format_datetime(now)
        pub_date = email.utils.format_datetime(now)
        
        feed_content = re.sub(
            r'<lastBuildDate>.*?</lastBuildDate>',
            f'<lastBuildDate>{last_build_date}</lastBuildDate>',
            feed_content,
            flags=re.DOTALL
        )
        
        new_item = f"""    <item>
      <title>{title}</title>
      <link>https://ltao0829.github.io/my-personal-site/posts/{index_str}.html</link>
      <guid>https://ltao0829.github.io/my-personal-site/posts/{index_str}.html</guid>
      <pubDate>{pub_date}</pubDate>
      <description>{description}</description>
    </item>
"""
        
        first_item_match = re.search(r'<item>', feed_content)
        if first_item_match:
            idx = first_item_match.start()
            feed_content = feed_content[:idx] + new_item + "    " + feed_content[idx:]
        else:
            channel_end_match = re.search(r'</channel>', feed_content)
            if channel_end_match:
                idx = channel_end_match.start()
                feed_content = feed_content[:idx] + new_item + feed_content[idx:]
                
        with open(feed_path, "w", encoding="utf-8") as f:
            f.write(feed_content)
        print("Updated feed.xml")
    else:
        print("Warning: feed.xml not found. Skipping RSS feed update.", file=sys.stderr)

def main():
    parser = argparse.ArgumentParser(description="Generate a daily blog post using Gemini.")
    parser.add_argument("--dry-run", action="store_true", help="Perform a dry-run using mock content (no API call)")
    args = parser.parse_args()
    
    next_index, index_str, existing_titles = get_next_blog_info()
    print(f"Preparing to generate Post #{index_str}...")
    
    if args.dry_run:
        print("Performing dry-run...")
        title, description, content = generate_mock_content(next_index, index_str)
    else:
        title, description, content = call_gemini_api(next_index, index_str, existing_titles)
        
    update_files(title, description, content, index_str)
    print("Done!")

if __name__ == "__main__":
    main()
