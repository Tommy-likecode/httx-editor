import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

interface ResizableSplitProps {
  left: ReactNode
  right: ReactNode
  ratio: number
  onRatioChange: (ratio: number) => void
}

export function ResizableSplit({ left, right, ratio, onRatioChange }: ResizableSplitProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  const updateRatio = useCallback(
    (clientX: number) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const next = (clientX - rect.left) / rect.width
      onRatioChange(Math.min(0.75, Math.max(0.25, next)))
    },
    [onRatioChange],
  )

  useEffect(() => {
    if (!dragging) return

    function onMove(event: PointerEvent) {
      updateRatio(event.clientX)
    }

    function onUp() {
      setDragging(false)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [dragging, updateRatio])

  return (
    <div
      ref={containerRef}
      className={dragging ? 'split-layout dragging' : 'split-layout'}
      style={{ '--editor-ratio': String(ratio) } as CSSProperties}
    >
      <div className="split-left">{left}</div>
      <div
        className="split-handle"
        role="separator"
        aria-orientation="vertical"
        aria-valuemin={25}
        aria-valuemax={75}
        aria-valuenow={Math.round(ratio * 100)}
        tabIndex={0}
        onPointerDown={(event) => {
          event.preventDefault()
          setDragging(true)
          updateRatio(event.clientX)
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') onRatioChange(Math.max(0.25, ratio - 0.02))
          if (event.key === 'ArrowRight') onRatioChange(Math.min(0.75, ratio + 0.02))
        }}
      />
      <div className="split-right">{right}</div>
    </div>
  )
}
