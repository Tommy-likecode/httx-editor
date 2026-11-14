import { createNodeFromKind } from './visual/ops'
import { serializeVisualToBody } from './visual/serialize'
import type { VisualDocument } from './visual/types'

export interface GenerateResult {
  matched: boolean
  label: string
  htmlSnippet: string
  tip: string
}

const RULES: { keys: string[]; label: string; tip: string; build: () => VisualDocument }[] = [
  {
    keys: ['登录表单', '登录', 'login'],
    label: '登录表单',
    tip: '已插入可编辑登录表单，可在属性面板改文案与样式。',
    build: () => ({ nodes: [createNodeFromKind('form')] }),
  },
  {
    keys: ['卡片', '产品卡片', 'card'],
    label: '产品卡片',
    tip: '已插入产品卡片结构。',
    build: () => ({ nodes: [createNodeFromKind('card')] }),
  },
  {
    keys: ['导航', '导航栏', 'nav'],
    label: '导航栏',
    tip: '已插入顶部导航。',
    build: () => ({ nodes: [createNodeFromKind('nav')] }),
  },
  {
    keys: ['落地页', '首页', 'hero', 'landing'],
    label: '落地页片段',
    tip: '已插入品牌落地页片段。',
    build: () => ({
      nodes: [
        createNodeFromKind('nav'),
        {
          ...createNodeFromKind('section'),
          children: [
            {
              ...createNodeFromKind('heading'),
              text: '把想法写成可运行的页面',
              styles: { margin: '0 0 0.75rem', fontSize: '2rem', color: '#0f172a' },
            },
            {
              ...createNodeFromKind('text'),
              text: '可视化搭建，或切换到代码模式继续精细编辑。',
              styles: { margin: '0 0 1rem', color: '#475569' },
            },
            {
              ...createNodeFromKind('button'),
              text: '开始编辑',
            },
          ],
        },
      ],
    }),
  },
  {
    keys: ['按钮', 'button'],
    label: '按钮',
    tip: '已插入按钮组件。',
    build: () => ({ nodes: [createNodeFromKind('button')] }),
  },
  {
    keys: ['标题', 'heading'],
    label: '标题',
    tip: '已插入标题组件。',
    build: () => ({ nodes: [createNodeFromKind('heading')] }),
  },
]

export function generateFromPrompt(prompt: string): GenerateResult {
  const q = prompt.trim().toLowerCase()
  if (!q) {
    return {
      matched: false,
      label: '',
      htmlSnippet: '',
      tip: '请输入需求，例如「登录表单」或「产品卡片」。',
    }
  }

  for (const rule of RULES) {
    if (rule.keys.some((key) => q.includes(key.toLowerCase()))) {
      const doc = rule.build()
      return {
        matched: true,
        label: rule.label,
        htmlSnippet: serializeVisualToBody(doc),
        tip: rule.tip,
      }
    }
  }

  return {
    matched: false,
    label: '',
    htmlSnippet: '',
    tip: '暂无匹配规则。可试：登录表单 / 卡片 / 导航 / 落地页。AI 接入为可选扩展。',
  }
}
