import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Two encoder "vectors" wander around in a 2D embedding space. Naive
// training pulls them together → they collapse to the same point. JEPA
// training keeps the target encoder as a slow-moving average of the
// context encoder → the context can shift to encode useful structure
// while the target lags behind, never letting both go to a constant.

const STEPS = 80
const W = 320

// Hand-authored target structure: 4 distinct "concept points" the
// context encoder *should* learn to represent (different inputs land at
// different points). In the naive case, they all collapse to one. In
// the JEPA case, they spread out.
const STRUCTURE = [
  { x: 0.30, y: 0.32, label: 'cat' },
  { x: 0.72, y: 0.30, label: 'dog' },
  { x: 0.35, y: 0.72, label: 'tree' },
  { x: 0.74, y: 0.70, label: 'house' },
]

// Compute the 4 "context encoder outputs" at each step under each mode.
function computePositions(mode: 'naive' | 'jepa', step: number) {
  const t = step / STEPS
  // Smooth interpolation from random scatter → final state.
  return STRUCTURE.map((pt, i) => {
    // Initial random-ish scatter, seeded per input.
    const seed = (i * 9301 + 49297) % 233280
    const r1 = ((seed * 7) % 1000) / 1000
    const r2 = ((seed * 13) % 1000) / 1000
    const startX = 0.2 + r1 * 0.6
    const startY = 0.2 + r2 * 0.6
    if (mode === 'naive') {
      // All four collapse to the same constant center point.
      const collapseCenter = { x: 0.5, y: 0.5 }
      const eased = 1 - Math.pow(1 - t, 2)
      return {
        x: startX + (collapseCenter.x - startX) * eased,
        y: startY + (collapseCenter.y - startY) * eased,
        label: pt.label,
      }
    } else {
      // JEPA: each input ends at its proper concept point.
      const eased = 1 - Math.pow(1 - t, 3)
      return {
        x: startX + (pt.x - startX) * eased,
        y: startY + (pt.y - startY) * eased,
        label: pt.label,
      }
    }
  })
}

// The "target encoder" in JEPA mode lags behind context by a few steps.
function computeTarget(mode: 'naive' | 'jepa', step: number) {
  if (mode === 'naive') {
    return computePositions('naive', step) // same as context — that's the problem
  }
  const lagged = Math.max(0, step - 20)
  return computePositions('jepa', lagged)
}

function lossFor(mode: 'naive' | 'jepa', step: number) {
  const ctx = computePositions(mode, step)
  if (mode === 'naive') {
    // In naive mode, both encoders are jointly minimized → distance shrinks to 0.
    // But the "useful structure" loss (whether the points represent different
    // things) goes to 0 too — collapse. We report a "real" loss that distinguishes:
    // the model has discovered nothing.
    const spread = ctx.reduce((s, p) => {
      return (
        s +
        Math.hypot(p.x - 0.5, p.y - 0.5)
      )
    }, 0)
    return spread / ctx.length // small = collapsed (bad)
  }
  // JEPA: loss is distance between predicted (context) and target embeddings.
  const tgt = computeTarget(mode, step)
  let d = 0
  for (let i = 0; i < ctx.length; i++) {
    d += Math.hypot(ctx[i].x - tgt[i].x, ctx[i].y - tgt[i].y)
  }
  return d / ctx.length
}

const COLORS = [
  { fill: 'bg-coral/40', border: 'border-coral', text: 'text-coral' },
  { fill: 'bg-teal/40', border: 'border-teal', text: 'text-teal' },
  { fill: 'bg-mustard/50', border: 'border-mustard', text: 'text-mustard' },
  { fill: 'bg-lavender/40', border: 'border-lavender', text: 'text-lavender' },
]

export function CollapseDemo() {
  const [mode, setMode] = useState<'naive' | 'jepa'>('naive')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (!playing) {
      if (timer.current) window.clearTimeout(timer.current)
      return
    }
    if (step >= STEPS) {
      setPlaying(false)
      return
    }
    timer.current = window.setTimeout(() => setStep((s) => s + 1), 35)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [playing, step])

  function pickMode(m: 'naive' | 'jepa') {
    setMode(m)
    setStep(0)
    setPlaying(false)
  }

  const ctx = computePositions(mode, step)
  const tgt = computeTarget(mode, step)
  const loss = lossFor(mode, step)
  const collapsed = mode === 'naive' && step >= STEPS * 0.7

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      {/* mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => pickMode('naive')}
          className={`btn-sketch flex-1 text-sm ${
            mode === 'naive' ? 'bg-mustard/60' : ''
          }`}
        >
          🪤 naive setup
        </button>
        <button
          onClick={() => pickMode('jepa')}
          className={`btn-sketch flex-1 text-sm ${
            mode === 'jepa' ? 'bg-mustard/60' : ''
          }`}
        >
          ✨ JEPA's asymmetric trick
        </button>
      </div>

      <div className="font-hand text-ink/70 text-base mb-3">
        {mode === 'naive' ? (
          <>
            both encoders updated jointly. four different inputs (
            <em>cat, dog, tree, house</em>). just minimize distance between
            their embeddings →
          </>
        ) : (
          <>
            context encoder updates fast. target encoder is a{' '}
            <strong>slow-moving copy</strong> of it (no gradient flows back
            through). that asymmetry is the whole trick.
          </>
        )}
      </div>

      <div className="bg-paper/60 rounded-lg border-[2px] border-ink/30 p-4 flex flex-col items-center">
        <div
          className="relative rounded-md border-[2px] border-ink/30 mx-auto"
          style={{
            width: W,
            height: W,
            maxWidth: '100%',
            background:
              'radial-gradient(circle at 50% 50%, rgba(154,140,199,0.06), transparent 80%)',
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
                id="cg"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="#2b2a26"
                  strokeWidth="0.15"
                  opacity="0.18"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#cg)" />
          </svg>

          {/* faint target points (only in jepa mode) */}
          {mode === 'jepa' &&
            tgt.map((p, i) => (
              <div
                key={`tgt-${i}`}
                style={{
                  left: `${p.x * 100}%`,
                  top: `${p.y * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute pointer-events-none"
              >
                <div
                  className={`w-4 h-4 rounded-full ${COLORS[i].fill} border ${COLORS[i].border} opacity-50`}
                />
              </div>
            ))}

          {/* context points */}
          {ctx.map((p, i) => (
            <motion.div
              key={`ctx-${i}`}
              animate={{
                left: `${p.x * 100}%`,
                top: `${p.y * 100}%`,
              }}
              transition={{ duration: 0.1 }}
              style={{ transform: 'translate(-50%, -50%)' }}
              className="absolute pointer-events-none"
            >
              <div
                className={`w-6 h-6 rounded-full ${COLORS[i].fill} border-[2.5px] ${COLORS[i].border} shadow-sketchSm`}
              />
              <div
                className={`absolute -top-5 left-1/2 -translate-x-1/2 font-hand text-xs ${COLORS[i].text} bg-cream/90 border ${COLORS[i].border} rounded px-1 whitespace-nowrap`}
              >
                "{p.label}"
              </div>
            </motion.div>
          ))}
        </div>

        {/* collapse warning sign */}
        {collapsed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-display text-xl text-coral mt-3 border-[2px] border-coral rounded px-2"
          >
            ⚠ COLLAPSED
          </motion.div>
        )}
      </div>

      {/* progress / controls */}
      <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex-1">
          <div className="flex justify-between font-hand text-ink/70 text-base mb-1">
            <span>
              training step:{' '}
              <span className="text-coral font-bold">{step}</span> / {STEPS}
            </span>
            <span>
              {mode === 'naive' ? 'spread:' : 'loss:'}{' '}
              <span
                className={`font-bold ${
                  mode === 'naive'
                    ? collapsed
                      ? 'text-coral'
                      : 'text-teal'
                    : 'text-teal'
                }`}
              >
                {loss.toFixed(3)}
              </span>
            </span>
          </div>
          <div className="h-3 bg-paper/60 border-[1.5px] border-ink rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                mode === 'naive' ? 'bg-coral/60' : 'bg-teal/60'
              }`}
              animate={{
                width:
                  mode === 'naive'
                    ? `${(1 - Math.min(1, loss * 3)) * 100}%`
                    : `${(1 - Math.min(1, loss * 1.2)) * 100}%`,
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="btn-sketch bg-mustard/60"
            disabled={step >= STEPS}
          >
            {playing ? 'pause' : '▶ train'}
          </button>
          <button
            onClick={() => {
              setStep(0)
              setPlaying(false)
            }}
            className="btn-sketch"
          >
            reset
          </button>
        </div>
      </div>

      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 rounded-lg bg-mustard/20 border-[2px] border-dashed border-mustard"
      >
        <div className="font-hand text-coral text-lg mb-1">
          ✦ what's going on
        </div>
        <div className="font-body text-base leading-relaxed">
          {mode === 'naive' ? (
            collapsed ? (
              <>
                <strong>Disaster.</strong> All four inputs — cat, dog, tree,
                house — got mapped to the same point. The model "solved"
                its loss (distance = 0) by encoding everything as the same
                useless constant. This is{' '}
                <strong className="text-coral">representational
                collapse</strong>, and it's why naive JEPA-style training
                doesn't work out of the box.
              </>
            ) : (
              <>
                Both encoders are being pushed together. Watch what happens
                as training continues — the inputs lose their identity and
                merge.
              </>
            )
          ) : (
            <>
              The four inputs end up at four distinct points — they keep
              their identity. The target encoder updates so slowly (a few
              percent of context's update per step, via exponential moving
              average) that the context encoder can't simply "race" toward
              it. To minimize loss, the context encoder has to learn{' '}
              <em>actual structure</em>: representing different inputs as
              different embeddings. No collapse.
            </>
          )}
        </div>
      </motion.div>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ this asymmetry — context-fast, target-slow, no gradient through the
        target — is the key insight that made JEPA actually trainable.
        related methods (BYOL, DINO, SimSiam) use variations on the same
        trick.
      </div>
    </div>
  )
}
