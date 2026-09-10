type AmbientLightProps = {
  color?: string
  size?: number
  top?: string
  bottom?: string
  left?: string
  right?: string
  opacity?: number
  className?: string
}

/**
 * One diffuse light source, meant to read as "this artwork is lit from
 * somewhere" rather than as a visible decorative shape. Position it
 * behind or beside an artwork within a `position: relative` container.
 * Deliberately no motion — the light direction is the point, not movement.
 */
export function AmbientLight({
  color = 'var(--color-primary)',
  size = 620,
  top,
  bottom,
  left,
  right,
  opacity = 0.28,
  className,
}: AmbientLightProps) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        top,
        bottom,
        left,
        right,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, color-mix(in srgb, ${color} ${Math.round(
          opacity * 100
        )}%, transparent) 0%, transparent 68%)`,
        filter: 'blur(10px)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
