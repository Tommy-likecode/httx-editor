import type { TemplateItem } from '../types'

export const TEMPLATES: TemplateItem[] = [
  {
    id: 'blank',
    name: '空白页面',
    description: '最小可运行骨架',
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>空白页</title>
</head>
<body>
  <h1>开始编写</h1>
</body>
</html>`,
    css: `body {
  margin: 2rem;
  font-family: system-ui, sans-serif;
  color: #111827;
}`,
    js: `console.log('空白模板已加载')`,
  },
  {
    id: 'card',
    name: '产品卡片',
    description: '简洁产品介绍卡片',
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>产品卡片</title>
</head>
<body>
  <article class="card">
    <p class="eyebrow">Httx Studio</p>
    <h1>即时预览的 HTML 工作台</h1>
    <p>编辑、预览、导出，一屏完成。</p>
    <button type="button">了解更多</button>
  </article>
</body>
</html>`,
    css: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #0b1220;
  color: #e5eefc;
  font-family: "IBM Plex Sans", system-ui, sans-serif;
}

.card {
  width: min(380px, 90vw);
  padding: 1.75rem;
  border: 1px solid #243247;
  background: #121a2b;
}

.eyebrow {
  margin: 0 0 0.75rem;
  color: #5eead4;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.75rem;
}

h1 {
  margin: 0 0 0.75rem;
  font-size: 1.6rem;
  line-height: 1.25;
}

p {
  margin: 0 0 1.25rem;
  color: #94a3b8;
  line-height: 1.6;
}

button {
  border: 0;
  background: #14b8a6;
  color: #042f2e;
  padding: 0.7rem 1rem;
  font: inherit;
  cursor: pointer;
}`,
    js: `document.querySelector('button')?.addEventListener('click', () => {
  console.info('点击了了解更多')
})`,
  },
  {
    id: 'form',
    name: '登录表单',
    description: '基础登录界面示意',
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>登录</title>
</head>
<body>
  <form class="login" id="loginForm">
    <h1>欢迎回来</h1>
    <label>
      邮箱
      <input type="email" name="email" required placeholder="you@example.com" />
    </label>
    <label>
      密码
      <input type="password" name="password" required placeholder="••••••••" />
    </label>
    <button type="submit">登录</button>
    <p id="msg" aria-live="polite"></p>
  </form>
</body>
</html>`,
    css: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, #f1f5f9, #dbeafe);
  font-family: "IBM Plex Sans", system-ui, sans-serif;
  color: #0f172a;
}

.login {
  width: min(360px, 92vw);
  display: grid;
  gap: 0.9rem;
  padding: 1.5rem;
  background: #fff;
  border: 1px solid #cbd5e1;
}

h1 {
  margin: 0 0 0.25rem;
  font-size: 1.4rem;
}

label {
  display: grid;
  gap: 0.35rem;
  font-size: 0.9rem;
}

input {
  border: 1px solid #94a3b8;
  padding: 0.65rem 0.75rem;
  font: inherit;
}

button {
  border: 0;
  background: #0f766e;
  color: #fff;
  padding: 0.75rem;
  font: inherit;
  cursor: pointer;
}

#msg {
  min-height: 1.25rem;
  margin: 0;
  color: #047857;
  font-size: 0.9rem;
}`,
    js: `const form = document.getElementById('loginForm')
const msg = document.getElementById('msg')

form?.addEventListener('submit', (event) => {
  event.preventDefault()
  const data = new FormData(form)
  msg.textContent = '已提交：' + data.get('email')
  console.log('表单提交', Object.fromEntries(data.entries()))
})`,
  },
  {
    id: 'landing',
    name: '落地页片段',
    description: '品牌标题 + CTA',
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>落地页</title>
</head>
<body>
  <section class="hero">
    <p class="brand">HTTX</p>
    <h1>把想法写成可运行的页面</h1>
    <p class="lead">分栏编辑 HTML、CSS、JavaScript，右侧即时看到结果。</p>
    <div class="actions">
      <a class="primary" href="#">开始编辑</a>
      <a class="ghost" href="#">查看模板</a>
    </div>
  </section>
</body>
</html>`,
    css: `:root {
  color-scheme: light;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: "IBM Plex Sans", system-ui, sans-serif;
  background:
    linear-gradient(120deg, rgba(15, 118, 110, 0.12), transparent 40%),
    #f8fafc;
  color: #0f172a;
}

.hero {
  min-height: 100vh;
  display: grid;
  align-content: center;
  gap: 1rem;
  padding: 2rem;
  max-width: 720px;
}

.brand {
  margin: 0;
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  color: #0f766e;
}

h1 {
  margin: 0;
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  line-height: 1.2;
}

.lead {
  margin: 0;
  max-width: 34rem;
  color: #475569;
  line-height: 1.7;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

a {
  text-decoration: none;
  padding: 0.75rem 1.1rem;
  font-weight: 600;
}

.primary {
  background: #0f766e;
  color: #ecfdf5;
}

.ghost {
  border: 1px solid #94a3b8;
  color: #0f172a;
}`,
    js: `console.info('落地页模板就绪')`,
  },
  {
    id: 'nav',
    name: '导航页',
    description: '顶栏导航 + 内容区',
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>导航</title>
</head>
<body>
  <nav class="topnav">
    <a href="#">首页</a>
    <a href="#">文档</a>
    <a href="#">关于</a>
  </nav>
  <main class="content">
    <h1>欢迎使用 Httx</h1>
    <p>从导航模板开始，继续可视化编辑。</p>
  </main>
</body>
</html>`,
    css: `body {
  margin: 0;
  font-family: "IBM Plex Sans", system-ui, sans-serif;
  color: #0f172a;
  background: #f8fafc;
}

.topnav {
  display: flex;
  gap: 1rem;
  padding: 0.9rem 1.25rem;
  background: #0f172a;
}

.topnav a {
  color: #e2e8f0;
  text-decoration: none;
}

.topnav a:hover {
  color: #5eead4;
}

.content {
  padding: 2rem;
  max-width: 720px;
}`,
    js: `console.info('导航模板就绪')`,
  },
]
