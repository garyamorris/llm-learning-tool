// SVG <defs> for hand-drawn effects. Mounted once, used everywhere via
// CSS filter: url(#wobble-filter).
export function SketchDefs() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute' }}
      aria-hidden="true"
    >
      <defs>
        <filter id="wobble-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02"
            numOctaves="2"
            seed="3"
          />
          <feDisplacementMap in="SourceGraphic" scale="2" />
        </filter>
      </defs>
    </svg>
  )
}
