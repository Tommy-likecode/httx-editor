import { useState } from 'react'

interface GenerateBarProps {
  onGenerate: (prompt: string) => void
}

export function GenerateBar({ onGenerate }: GenerateBarProps) {
  const [prompt, setPrompt] = useState('')

  return (
    <form
      className="generate-bar"
      onSubmit={(event) => {
        event.preventDefault()
        onGenerate(prompt)
      }}
    >
      <label>
        <span>智能生成</span>
        <input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="试试：登录表单 / 产品卡片 / 导航 / 落地页"
          data-testid="nl-input"
        />
      </label>
      <button type="submit" data-testid="nl-generate">
        生成并插入
      </button>
    </form>
  )
}
