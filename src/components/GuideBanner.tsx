interface GuideBannerProps {
  visible: boolean
  onDismiss: () => void
}

export function GuideBanner({ visible, onDismiss }: GuideBannerProps) {
  if (!visible) return null

  return (
    <div className="guide-banner" role="note">
      <div>
        <strong>新手引导</strong>
        <p>
          1) 左侧拖入组件到画布 2) 选中后在右侧改属性 3) 需要精细控制时切到「代码」模式。输入「登录表单」可快速生成结构。
        </p>
      </div>
      <button type="button" className="ghost-btn" onClick={onDismiss}>
        知道了
      </button>
    </div>
  )
}
