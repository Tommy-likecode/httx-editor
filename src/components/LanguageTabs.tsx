import type { Language } from '../types'

const TABS: { id: Language; label: string }[] = [
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'js', label: 'JS' },
]

interface LanguageTabsProps {
  active: Language
  onChange: (language: Language) => void
}

export function LanguageTabs({ active, onChange }: LanguageTabsProps) {
  return (
    <div className="language-tabs" role="tablist" aria-label="语言标签">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={active === tab.id ? 'tab active' : 'tab'}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
