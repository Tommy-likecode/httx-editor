export interface SnippetItem {
  id: string
  name: string
  description: string
  html: string
}

export const SNIPPETS: SnippetItem[] = [
  {
    id: 'badge',
    name: '标签徽章',
    description: '小型状态标签',
    html: `<span style="display:inline-block;padding:0.2rem 0.55rem;background:#ccfbf1;color:#115e59;font-size:0.8rem;">新功能</span>`,
  },
  {
    id: 'quote',
    name: '引用块',
    description: '强调说明',
    html: `<blockquote style="margin:0;padding:0.75rem 1rem;border-left:3px solid #0f766e;color:#334155;background:#f8fafc;">在可视化与代码之间自由切换。</blockquote>`,
  },
  {
    id: 'cta-row',
    name: '双按钮',
    description: '主次操作并排',
    html: `<div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
  <button type="button" style="background:#0f766e;color:#ecfdf5;border:0;padding:0.65rem 1rem;">立即开始</button>
  <button type="button" style="background:transparent;color:#0f172a;border:1px solid #94a3b8;padding:0.65rem 1rem;">查看示例</button>
</div>`,
  },
  {
    id: 'avatar-row',
    name: '头像行',
    description: '人物信息简卡',
    html: `<div style="display:flex;gap:0.75rem;align-items:center;">
  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80" alt="avatar" style="width:48px;height:48px;object-fit:cover;border-radius:999px;" />
  <div>
    <strong style="display:block;">Alex Chen</strong>
    <span style="color:#64748b;font-size:0.9rem;">产品设计师</span>
  </div>
</div>`,
  },
]
