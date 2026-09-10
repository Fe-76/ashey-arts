import { Sparkle } from './Sparkle'

export type SparkleMark = {
  id: string
  kind?: 'star' | 'dot'
  top: string
  left: string
  size?: number
  scale?: 'small' | 'medium' | 'accent'
  tone?: 'gold' | 'moonlight'
  delay?: number
  color?: string
}

type SparkleFieldProps = {
  marks: SparkleMark[]
  className?: string
  /** z-index for the whole field — pass a negative value to sit behind the artwork */
  style?: React.CSSProperties
}

/**
 * A small hand-placed composition of ✦/✧ marks around a piece of art —
 * never a uniform scatter. Each mark loops on its own irregular timer so
 * the cluster never blinks together. Render one field before the artwork
 * element (marks that should peek out from behind it) and one after
 * (marks that sit in front), both inside a `position: relative` wrapper.
 */
export function SparkleField({ marks, className, style }: SparkleFieldProps) {
  return (
    <div
      className={className}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...style }}
      aria-hidden="true"
    >
      {marks.map((mark) => (
        <Sparkle
          key={mark.id}
          variant={mark.kind ?? 'star'}
          scale={mark.scale}
          size={mark.size ?? (mark.scale ? undefined : 14)}
          tone={mark.tone}
          delay={mark.delay ?? 0}
          color={mark.color}
          loop
          style={{ position: 'absolute', top: mark.top, left: mark.left }}
        />
      ))}
    </div>
  )
}
