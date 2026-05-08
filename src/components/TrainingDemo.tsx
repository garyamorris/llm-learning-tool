import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// The "true" distribution (matches chapter 1's authored distribution).
const TRUE_DIST = [
  { token: 'mat', prob: 0.47 },
  { token: 'floor', prob: 0.14 },
  { token: 'couch', prob: 0.11 },
  { token: 'windowsill', prob: 0.09 },
  { token: 'keyboard', prob: 0.06 },
  { token: 'rug', prob: 0.05 },
  { token: 'fence', prob: 0.04 },
  { token: 'roof', prob: 0.04 },
] as const

// Tiny seeded RNG so the same demo plays each time.
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

// Pre-generate the training stream by sampling from the true distribution.
const TRAINING: string[] = (() => {
  const rng = mulberry32(42)
  const out: string[] = []
  for (let i = 0; i < 120; i++) {
    const r = rng()
    let cum = 0
    for (const c of TRUE_DIST) {
      cum += c.prob
      if (r < cum) {
        out.push(c.token)
        break
      }
    }
  }
  return out
})()

const COLORS = [
  'bg-coral/40 border-coral',
  'bg-teal/40 border-teal',
  'bg-mustard/50 border-mustard',
  'bg-lavender/40 border-lavender',
  'bg-sage/40 border-sage',
  'bg-coral/30 border-coral/70',
  'bg-teal/30 border-teal/70',
  'bg-mustard/40 border-mustard/70',
]

export function TrainingDemo() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1) // 1 = normal, 3 = fast
  const timer = useRef<number | null>(null)

  // Counts of each token after `step` examples.
  const counts = useMemo(() => {
    const c: Record<string, number> = Object.fromEntries(
      TRUE_DIST.map((t) => [t.token, 0]),
    )
    for (let i = 0; i < step; i++) c[TRAINING[i]]++
    return c
  }, [step])

  const total = step

  // Smoothed probabilities — early on, blend toward uniform so the bars
  // start nearly equal (like random init) and sharpen as data arrives.
  const probs = useMemo(() => {
    const uniform = 1 / TRUE_DIST.length
    return TRUE_DIST.map((t) => {
      if (total === 0) {
        // Tiny per-token jitter so bars don't look perfectly identical.
        const seed = t.token.length * 17
        return uniform + ((seed % 7) - 3) * 0.005
      }
      const observed = counts[t.token] / total
      // Blend factor that grows from 0 → 1 as more data arrives.
      const conf = Math.min(1, total / 30)
      return uniform * (1 - conf) + observed * conf
    })
  }, [counts, total])

  const recentBatch = useMemo(
    () => TRAINING.slice(Math.max(0, step - 5), step),
    [step],
  )
  const lastToken = recentBatch[recentBatch.length - 1]

  // Drive the playback.
  useEffect(() => {
    if (!playing) {
      if (timer.current) {
        window.clearTimeout(timer.current)
        timer.current = null
      }
      return
    }
    if (step >= TRAINING.length) {
      setPlaying(false)
      return
    }
    const delay = 600 / speed
    timer.current = window.setTimeout(() => {
      setStep((s) => s + 1)
    }, delay)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [playing, step, speed])

  function reset() {
    setPlaying(false)
    setStep(0)
  }

  // Convergence bar: how close are we to the true distribution?
  const tvDistance = useMemo(() => {
    let d = 0
    for (let i = 0; i < TRUE_DIST.length; i++) {
      d += Math.abs(probs[i] - TRUE_DIST[i].prob)
    }
    return d / 2 // total variation distance, in [0, 1]
  }, [probs])
  const convergence = Math.max(0, 1 - tvDistance)

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      {/* The prompt */}
      <div className="mb-4">
        <div className="font-hand text-ink/60 text-base mb-1">
          the model is trying to predict:
        </div>
        <div className="text-2xl md:text-3xl font-body">
          <span className="text-ink/70">The cat sat on the</span>
          <span className="ml-2 inline-block px-3 py-0.5 border-[2px] border-dashed border-ink/40 rounded font-hand text-coral">
            ?
          </span>
        </div>
      </div>

      {/* Training stream */}
      <div className="mb-5">
        <div className="font-hand text-ink/70 text-base mb-2">
          examples flowing in (real text from the world):
        </div>
        <div
          className="bg-paper/60 rounded-lg p-3 border-[2px] border-ink/30
            min-h-[60px] flex flex-wrap items-center gap-2"
        >
          <AnimatePresence mode="popLayout">
            {recentBatch.map((tok, i) => {
              const isLatest = i === recentBatch.length - 1
              return (
                <motion.div
                  key={`${step}-${i}`}
                  initial={{ opacity: 0, x: 30, scale: 0.8 }}
                  animate={{ opacity: isLatest ? 1 : 0.4, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -30, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="font-body text-sm md:text-base"
                >
                  <span className="text-ink/50">"...sat on the </span>
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded ${
                      isLatest
                        ? 'bg-coral text-cream'
                        : 'bg-paper text-ink'
                    }`}
                  >
                    {tok}
                  </span>
                  <span className="text-ink/50">"</span>
                </motion.div>
              )
            })}
          </AnimatePresence>
          {step === 0 && (
            <div className="font-hand text-ink/40">
              press play to start training...
            </div>
          )}
        </div>
      </div>

      {/* Probability bars */}
      <div className="mb-5">
        <div className="font-hand text-ink/70 text-base mb-2">
          what the model now thinks is likely:
        </div>
        <div className="space-y-1.5">
          {TRUE_DIST.map((t, i) => {
            const p = probs[i]
            const truePct = t.prob * 100
            const widthPct = Math.max(p, 0) * 100 * 1.8 // scale up for visual
            const isHighlight = lastToken === t.token
            return (
              <div key={t.token} className="relative">
                <div
                  className={`relative border-[1.5px] border-ink rounded-md
                    overflow-hidden bg-cream
                    ${isHighlight ? 'ring-4 ring-coral/40' : ''}`}
                >
                  <motion.div
                    className={`absolute inset-y-0 left-0 ${COLORS[i]} opacity-60`}
                    initial={false}
                    animate={{ width: `${Math.min(widthPct, 100)}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                  {/* Faint marker showing the "true" probability */}
                  <div
                    className="absolute inset-y-0 w-[2px] bg-ink/70"
                    style={{ left: `${Math.min(truePct * 1.8, 100)}%` }}
                    title={`true probability: ${truePct.toFixed(0)}%`}
                  />
                  <div className="relative flex items-center justify-between px-3 py-1.5 font-body">
                    <span className="font-bold">{t.token}</span>
                    <span className="font-hand text-ink/70 tabular-nums">
                      {(p * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="font-hand text-xs text-ink/50 mt-2">
          ↑ tiny dark line = the "real" answer the model is converging toward
        </div>
      </div>

      {/* Convergence + controls */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex-1">
          <div className="flex justify-between font-hand text-ink/70 text-base mb-1">
            <span>
              examples seen:{' '}
              <span className="text-coral font-bold">{step}</span> / {TRAINING.length}
            </span>
            <span>
              accuracy:{' '}
              <span className="text-teal font-bold">
                {(convergence * 100).toFixed(0)}%
              </span>
            </span>
          </div>
          <div className="h-3 bg-paper/60 border-[1.5px] border-ink rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-teal/60"
              animate={{ width: `${convergence * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="btn-sketch bg-mustard/60"
            disabled={step >= TRAINING.length}
          >
            {playing ? 'pause' : '▶ play'}
          </button>
          <button
            onClick={() => setSpeed((s) => (s >= 4 ? 1 : s + 1))}
            className="btn-sketch"
          >
            speed ×{speed}
          </button>
          <button onClick={reset} className="btn-sketch">
            reset
          </button>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ that's training. it's just{' '}
        <strong className="text-ink">counting and adjusting</strong>, billions
        of times.
      </div>
    </div>
  )
}
