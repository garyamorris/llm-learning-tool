import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Reused landscape SVG (same family as the multimodal demo on the LLM page).
const SCENE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
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
</svg>`

const IMG = 300

// Three mask regions the user can pick. Coords in image-pixel space (0-400).
const REGIONS = [
  { id: 'sun', label: 'mask the sun', x: 260, y: 30, w: 120, h: 100, target: { x: 0.78, y: 0.28 } },
  { id: 'house', label: 'mask the house', x: 220, y: 200, w: 120, h: 120, target: { x: 0.65, y: 0.72 } },
  { id: 'tree', label: 'mask the tree', x: 110, y: 180, w: 110, h: 140, target: { x: 0.30, y: 0.68 } },
]

// Seeded RNG so the demo plays the same way each time.
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function MaskAndPredict() {
  const [regionId, setRegionId] = useState(REGIONS[0].id)
  const region = REGIONS.find((r) => r.id === regionId)!
  const dataUrl = useMemo(
    () => `url("data:image/svg+xml;utf8,${encodeURIComponent(SCENE_SVG)}")`,
    [],
  )

  // training "step": how many gradient updates have been performed.
  const [step, setStep] = useState(0)
  const MAX_STEPS = 30

  // Starting "predicted embedding" — random, but seeded so it's stable.
  const startPos = useMemo(() => {
    const rng = mulberry32(region.id.length * 7919)
    return { x: 0.1 + rng() * 0.8, y: 0.1 + rng() * 0.8 }
  }, [region])

  // Current predicted position lerps from startPos → region.target as step grows.
  const t = Math.min(1, step / MAX_STEPS)
  const eased = 1 - Math.pow(1 - t, 3) // ease-out for nicer movement
  const predicted = {
    x: startPos.x + (region.target.x - startPos.x) * eased,
    y: startPos.y + (region.target.y - startPos.y) * eased,
  }

  // Auto-train mode.
  const [training, setTraining] = useState(false)
  const timer = useRef<number | null>(null)
  useEffect(() => {
    if (!training) {
      if (timer.current) window.clearTimeout(timer.current)
      return
    }
    if (step >= MAX_STEPS) {
      setTraining(false)
      return
    }
    timer.current = window.setTimeout(() => setStep((s) => s + 1), 120)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [training, step])

  function pickRegion(id: string) {
    setRegionId(id)
    setStep(0)
    setTraining(false)
  }

  function reset() {
    setStep(0)
    setTraining(false)
  }

  // Loss = euclidean distance in [0,1] space
  const loss = Math.hypot(
    predicted.x - region.target.x,
    predicted.y - region.target.y,
  )

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      {/* region picker */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <span className="font-hand text-ink/70 text-base mr-1">try:</span>
        {REGIONS.map((r) => (
          <button
            key={r.id}
            onClick={() => pickRegion(r.id)}
            className={`pill-sketch text-sm transition ${
              r.id === regionId
                ? 'bg-mustard/40 shadow-sketchSm'
                : 'hover:bg-paper'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Image with mask */}
        <div className="bg-paper/60 rounded-lg border-[2px] border-ink/30 p-3">
          <div className="font-hand text-ink/60 text-xs uppercase tracking-wider mb-2">
            the input image
          </div>
          <div
            className="relative rounded-md border-[2px] border-ink/30 mx-auto"
            style={{ width: IMG, height: IMG, maxWidth: '100%' }}
          >
            <div
              className="absolute inset-0 rounded-md"
              style={{
                backgroundImage: dataUrl,
                backgroundSize: 'cover',
              }}
            />
            {/* The mask overlay */}
            <div
              className="absolute bg-ink/85 rounded border-[2px] border-coral"
              style={{
                left: `${(region.x / 400) * 100}%`,
                top: `${(region.y / 400) * 100}%`,
                width: `${(region.w / 400) * 100}%`,
                height: `${(region.h / 400) * 100}%`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center font-hand text-cream text-xs">
                hidden
              </div>
            </div>
          </div>
        </div>

        {/* Embedding space */}
        <div className="bg-paper/60 rounded-lg border-[2px] border-ink/30 p-3">
          <div className="font-hand text-ink/60 text-xs uppercase tracking-wider mb-2">
            embedding space
          </div>
          <div
            className="relative rounded-md border-[2px] border-ink/30 mx-auto"
            style={{
              width: IMG,
              height: IMG,
              maxWidth: '100%',
              background:
                'radial-gradient(circle at 50% 50%, rgba(154,140,199,0.08), rgba(154,140,199,0))',
            }}
          >
            {/* grid */}
            <svg
              className="absolute inset-0 pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="g3"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="#2b2a26"
                    strokeWidth="0.15"
                    opacity="0.2"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#g3)" />
            </svg>

            {/* Connecting line from predicted → target (loss) */}
            <svg
              className="absolute inset-0 pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <line
                x1={predicted.x * 100}
                y1={predicted.y * 100}
                x2={region.target.x * 100}
                y2={region.target.y * 100}
                stroke="#e8694e"
                strokeWidth="0.5"
                strokeDasharray="1.5 1.5"
                opacity="0.7"
              />
            </svg>

            {/* Target embedding (where the actual masked region lives) */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${region.target.x * 100}%`,
                top: `${region.target.y * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="w-5 h-5 rounded-full border-[2.5px] border-sage bg-sage/30" />
              <div className="absolute top-6 left-1/2 -translate-x-1/2 font-hand text-xs text-sage whitespace-nowrap bg-cream/90 border border-sage rounded px-1.5">
                actual
              </div>
            </div>

            {/* Predicted embedding (animated) */}
            <motion.div
              className="absolute pointer-events-none"
              animate={{
                left: `${predicted.x * 100}%`,
                top: `${predicted.y * 100}%`,
              }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              <div className="w-8 h-8 rounded-full border-[2.5px] border-coral bg-coral/30 animate-pulse" />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-hand text-xs text-coral whitespace-nowrap bg-cream/90 border border-coral rounded px-1.5">
                predicted
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Training progress */}
      <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex-1">
          <div className="flex justify-between font-hand text-ink/70 text-base mb-1">
            <span>
              training steps:{' '}
              <span className="text-coral font-bold">{step}</span> / {MAX_STEPS}
            </span>
            <span>
              loss:{' '}
              <span className="text-teal font-bold">{loss.toFixed(3)}</span>
            </span>
          </div>
          <div className="h-3 bg-paper/60 border-[1.5px] border-ink rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-teal/60"
              animate={{ width: `${(1 - Math.min(1, loss * 1.2)) * 100}%` }}
              transition={{ duration: 0.18 }}
            />
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setStep((s) => Math.min(MAX_STEPS, s + 1))}
            className="btn-sketch"
            disabled={step >= MAX_STEPS || training}
          >
            +1 step
          </button>
          <button
            onClick={() => setTraining((t) => !t)}
            className="btn-sketch bg-mustard/60"
            disabled={step >= MAX_STEPS}
          >
            {training ? 'pause' : '▶ train'}
          </button>
          <button onClick={reset} className="btn-sketch">
            reset
          </button>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-lg bg-mustard/20 border-[2px] border-dashed border-mustard">
        <div className="font-hand text-coral text-lg mb-1">
          ✦ what's happening
        </div>
        <div className="font-body text-base leading-relaxed">
          {step === 0 ? (
            <>
              The predictor's first guess is essentially random — the coral
              blob is nowhere near the actual masked region's embedding (the
              sage circle). Press <strong>train</strong> to start nudging.
            </>
          ) : step >= MAX_STEPS ? (
            <>
              After {MAX_STEPS} training steps, the prediction is sitting
              right on top of the actual embedding. Loss ≈ {loss.toFixed(3)}.
              The model has learned what kind of content "lives" in this part
              of the image, without ever being told.
            </>
          ) : (
            <>
              Each training step nudges the encoders and predictor a little so
              the predicted embedding moves toward the actual one. Notice: at
              no point did we tell the model "this is a sun" or "this is a
              house." The only signal is "match this embedding."
            </>
          )}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ this is{' '}
        <strong className="text-ink">self-supervised learning</strong>: no
        labels, no captions, no humans rating outputs. just "see part, predict
        the rest, in embedding space." you can do this with billions of
        videos. that's the dream.
      </div>
    </div>
  )
}
