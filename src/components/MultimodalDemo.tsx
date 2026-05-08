import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

// Two hand-drawn SVG scenes used as the "input image". They're inlined
// (no network) and convertable to a data: URL for use as a CSS background.
const SCENES: { id: string; label: string; svg: string }[] = [
  {
    id: 'landscape',
    label: 'a landscape',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <rect width="400" height="280" fill="#bee0ec"/>
      <rect y="280" width="400" height="120" fill="#a4c777"/>
      <circle cx="320" cy="80" r="40" fill="#f5c953"/>
      <circle cx="320" cy="80" r="55" fill="#f5c953" opacity="0.25"/>
      <ellipse cx="100" cy="100" rx="50" ry="20" fill="#fdfaf3"/>
      <ellipse cx="140" cy="90" rx="40" ry="20" fill="#fdfaf3"/>
      <ellipse cx="80" cy="110" rx="30" ry="14" fill="#fdfaf3"/>
      <polygon points="0,280 80,180 160,280" fill="#9a8cc7" opacity="0.55"/>
      <polygon points="100,280 200,200 300,280" fill="#8caf6f" opacity="0.65"/>
      <rect x="150" y="240" width="20" height="80" fill="#7a4a32"/>
      <circle cx="160" cy="230" r="50" fill="#6b8e4e"/>
      <circle cx="180" cy="220" r="35" fill="#7da558"/>
      <rect x="240" y="240" width="80" height="80" fill="#e8694e"/>
      <polygon points="232,240 280,200 328,240" fill="#3d8b8b"/>
      <rect x="270" y="280" width="20" height="40" fill="#7a4a32"/>
      <rect x="300" y="260" width="15" height="15" fill="#bee0ec" stroke="#2b2a26" stroke-width="1"/>
    </svg>`,
  },
  {
    id: 'cat',
    label: 'a cat',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#f3ecd9"/>
      <polygon points="80,120 120,40 160,140" fill="#e3a93a"/>
      <polygon points="240,140 280,40 320,120" fill="#e3a93a"/>
      <polygon points="100,115 120,70 140,120" fill="#e8694e" opacity="0.7"/>
      <polygon points="260,120 280,70 300,115" fill="#e8694e" opacity="0.7"/>
      <circle cx="200" cy="220" r="140" fill="#e3a93a"/>
      <ellipse cx="150" cy="200" rx="20" ry="30" fill="#2b2a26"/>
      <ellipse cx="250" cy="200" rx="20" ry="30" fill="#2b2a26"/>
      <ellipse cx="155" cy="195" rx="6" ry="10" fill="#fdfaf3"/>
      <ellipse cx="255" cy="195" rx="6" ry="10" fill="#fdfaf3"/>
      <polygon points="190,258 210,258 200,275" fill="#e8694e"/>
      <path d="M 200 275 Q 180 295 170 285" fill="none" stroke="#2b2a26" stroke-width="3" stroke-linecap="round"/>
      <path d="M 200 275 Q 220 295 230 285" fill="none" stroke="#2b2a26" stroke-width="3" stroke-linecap="round"/>
      <line x1="60" y1="240" x2="140" y2="245" stroke="#2b2a26" stroke-width="2"/>
      <line x1="60" y1="265" x2="140" y2="265" stroke="#2b2a26" stroke-width="2"/>
      <line x1="260" y1="245" x2="340" y2="240" stroke="#2b2a26" stroke-width="2"/>
      <line x1="260" y1="265" x2="340" y2="265" stroke="#2b2a26" stroke-width="2"/>
    </svg>`,
  },
]

const IMAGE_SIZE = 320 // displayed pixel size of the image

export function MultimodalDemo() {
  const [sceneId, setSceneId] = useState(SCENES[0].id)
  const [grid, setGrid] = useState(8) // patches per side
  const [tokenized, setTokenized] = useState(false)
  const scene = SCENES.find((s) => s.id === sceneId)!

  // Convert SVG to a data URL for use as a CSS background-image.
  const dataUrl = useMemo(
    () => `url("data:image/svg+xml;utf8,${encodeURIComponent(scene.svg)}")`,
    [scene.svg],
  )

  const patchSize = IMAGE_SIZE / grid

  // Build a flat list of patch coordinates.
  const patches = useMemo(() => {
    const out: { row: number; col: number; key: string }[] = []
    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        out.push({ row: r, col: c, key: `${sceneId}-${grid}-${r}-${c}` })
      }
    }
    return out
  }, [grid, sceneId])

  function pickScene(id: string) {
    setSceneId(id)
    setTokenized(false)
  }

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      {/* scene picker */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <span className="font-hand text-ink/70 text-base mr-1">image:</span>
        {SCENES.map((s) => (
          <button
            key={s.id}
            onClick={() => pickScene(s.id)}
            className={`pill-sketch text-sm transition ${
              s.id === sceneId
                ? 'bg-mustard/40 shadow-sketchSm'
                : 'hover:bg-paper'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* grid size slider */}
      <div className="mb-4">
        <div className="flex justify-between font-hand text-ink/70 text-base mb-1">
          <span>
            patch grid:{' '}
            <span className="text-coral font-bold">
              {grid}×{grid}
            </span>{' '}
            <span className="text-ink/50">({grid * grid} patches)</span>
          </span>
        </div>
        <input
          type="range"
          min={2}
          max={16}
          step={1}
          value={grid}
          onChange={(e) => {
            setGrid(parseInt(e.target.value))
            setTokenized(false)
          }}
          className="w-full accent-coral"
        />
      </div>

      {/* image with patch overlay */}
      <div
        className="relative bg-paper/60 rounded-lg p-4 border-[2px] border-ink/30
          flex flex-col items-center"
      >
        {!tokenized ? (
          <div className="relative" style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}>
            <div
              className="absolute inset-0 rounded-md border-[2px] border-ink/30"
              style={{
                backgroundImage: dataUrl,
                backgroundSize: 'cover',
              }}
            />
            {/* grid overlay */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width={IMAGE_SIZE}
              height={IMAGE_SIZE}
            >
              {Array.from({ length: grid + 1 }, (_, i) => (
                <g key={i}>
                  <line
                    x1={i * patchSize}
                    y1={0}
                    x2={i * patchSize}
                    y2={IMAGE_SIZE}
                    stroke="#2b2a26"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                  <line
                    x1={0}
                    y1={i * patchSize}
                    x2={IMAGE_SIZE}
                    y2={i * patchSize}
                    stroke="#2b2a26"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                </g>
              ))}
            </svg>
          </div>
        ) : (
          <div
            className="grid gap-1.5 p-2"
            style={{
              gridTemplateColumns: `repeat(${Math.min(grid, 8)}, minmax(0, 1fr))`,
            }}
          >
            {patches.map(({ row, col, key }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.5, rotate: ((i * 13) % 11) - 5 }}
                animate={{ opacity: 1, scale: 1, rotate: ((i * 13) % 11) - 5 }}
                transition={{
                  duration: 0.35,
                  delay: Math.min(i * 0.012, 0.6),
                }}
                className="rounded border-[1.5px] border-ink/40 shadow-sketchSm"
                style={{
                  width: Math.max(28, 240 / Math.min(grid, 8)),
                  height: Math.max(28, 240 / Math.min(grid, 8)),
                  backgroundImage: dataUrl,
                  backgroundSize: `${IMAGE_SIZE}px ${IMAGE_SIZE}px`,
                  backgroundPosition: `-${col * patchSize}px -${row * patchSize}px`,
                }}
              />
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setTokenized((t) => !t)}
            className="btn-sketch bg-mustard/60"
          >
            {tokenized ? '↩ put it back' : '✂ tokenize'}
          </button>
        </div>
      </div>

      <motion.div
        key={tokenized ? 'after' : 'before'}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 rounded-lg bg-mustard/20 border-[2px] border-dashed border-mustard"
      >
        <div className="font-hand text-coral text-lg mb-1">
          ✦ {tokenized ? 'now what?' : 'what\'s about to happen'}
        </div>
        <div className="font-body text-base leading-relaxed">
          {tokenized ? (
            <>
              Each of those <strong>{grid * grid} patches</strong> becomes a{' '}
              <strong>vision token</strong> — just a vector in the same kind
              of meaning-space we built in chapter 3 for words. The model
              attends to them, mixes them with text tokens, and predicts the
              next text token. Same machinery, more inputs.
            </>
          ) : (
            <>
              The image is about to get sliced into a {grid}×{grid} grid.
              Each patch will be turned into a "vision token" the model can
              attend to — alongside any words you wrote. It's chapter 2 all
              over again, but for pixels.
            </>
          )}
        </div>
      </motion.div>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ this is how a "multimodal" model sees images. audio works similarly:
        chop the waveform into chunks, each chunk is a token. the magic isn't
        a new mechanism — it's that <em>everything becomes tokens</em>.
      </div>
    </div>
  )
}
