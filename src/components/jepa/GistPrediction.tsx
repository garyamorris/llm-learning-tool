import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Reuse the layout style of the LLM-page EmbeddingMap. Words are
// hand-placed at normalized [0,1] coords. The "context" tells us which
// cluster we're predicting around. Each context defines:
//   - the prompt
//   - which word the LLM "commits to" (a single pin)
//   - the JEPA "region" (a list of words inside the blob, plus blob center & radius)
type Pt = { word: string; x: number; y: number }

const WORDS: Pt[] = [
  // Cat-furniture cluster (center: ~0.25, 0.35)
  { word: 'mat', x: 0.20, y: 0.32 },
  { word: 'rug', x: 0.18, y: 0.40 },
  { word: 'floor', x: 0.27, y: 0.42 },
  { word: 'couch', x: 0.30, y: 0.30 },
  { word: 'windowsill', x: 0.22, y: 0.25 },
  { word: 'bed', x: 0.32, y: 0.40 },
  { word: 'cushion', x: 0.15, y: 0.36 },

  // Vehicle cluster (top-right, just to fill out the space)
  { word: 'car', x: 0.78, y: 0.20 },
  { word: 'truck', x: 0.82, y: 0.26 },
  { word: 'bus', x: 0.75, y: 0.28 },
  { word: 'bike', x: 0.85, y: 0.22 },

  // Food cluster (bottom-right)
  { word: 'apple', x: 0.72, y: 0.78 },
  { word: 'banana', x: 0.78, y: 0.82 },
  { word: 'bread', x: 0.74, y: 0.85 },
  { word: 'soup', x: 0.82, y: 0.78 },

  // Color cluster (bottom-left)
  { word: 'red', x: 0.18, y: 0.78 },
  { word: 'blue', x: 0.22, y: 0.82 },
  { word: 'green', x: 0.14, y: 0.84 },
  { word: 'orange', x: 0.20, y: 0.88 },
]

type Scenario = {
  id: string
  label: string
  context: string
  llmPick: string
  blobCenter: { x: number; y: number }
  blobRadius: number // in normalized [0,1] units
  insideBlob: string[] // words that the JEPA region "covers"
}

const SCENARIOS: Scenario[] = [
  {
    id: 'cat',
    label: 'the cat sat on the ___',
    context: 'The cat sat on the',
    llmPick: 'mat',
    blobCenter: { x: 0.235, y: 0.345 },
    blobRadius: 0.13,
    insideBlob: ['mat', 'rug', 'floor', 'couch', 'windowsill', 'bed', 'cushion'],
  },
  {
    id: 'drive',
    label: 'i drove my ___ to work',
    context: 'I drove my',
    llmPick: 'car',
    blobCenter: { x: 0.80, y: 0.24 },
    blobRadius: 0.12,
    insideBlob: ['car', 'truck', 'bus', 'bike'],
  },
  {
    id: 'fruit',
    label: 'for lunch i had ___',
    context: 'For lunch I had',
    llmPick: 'apple',
    blobCenter: { x: 0.765, y: 0.81 },
    blobRadius: 0.13,
    insideBlob: ['apple', 'banana', 'bread', 'soup'],
  },
]

export function GistPrediction() {
  const [sid, setSid] = useState(SCENARIOS[0].id)
  const [mode, setMode] = useState<'llm' | 'jepa'>('llm')
  const scenario = SCENARIOS.find((s) => s.id === sid)!

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      {/* scenario picker */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <span className="font-hand text-ink/70 text-base mr-1">context:</span>
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSid(s.id)}
            className={`pill-sketch text-sm transition ${
              s.id === sid ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* mode toggle */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setMode('llm')}
          className={`btn-sketch flex-1 text-sm ${
            mode === 'llm' ? 'bg-mustard/60' : ''
          }`}
        >
          🤖 LLM: predict a token
        </button>
        <button
          onClick={() => setMode('jepa')}
          className={`btn-sketch flex-1 text-sm ${
            mode === 'jepa' ? 'bg-mustard/60' : ''
          }`}
        >
          🔮 JEPA: predict a region
        </button>
      </div>

      {/* the map */}
      <div className="relative w-full aspect-[3/2] bg-paper/60 rounded-xl border-[2px] border-ink/30 overflow-hidden">
        {/* grid */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="g2" width="10" height="10" patternUnits="userSpaceOnUse">
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="#2b2a26"
                strokeWidth="0.15"
                opacity="0.15"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#g2)" />
        </svg>

        {/* JEPA blob */}
        <AnimatePresence>
          {mode === 'jepa' && (
            <motion.div
              key={`blob-${sid}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 90 }}
              className="absolute rounded-full bg-teal/30 border-[2.5px] border-teal pointer-events-none"
              style={{
                left: `${(scenario.blobCenter.x - scenario.blobRadius) * 100}%`,
                top: `${(scenario.blobCenter.y - scenario.blobRadius) * 100}%`,
                width: `${scenario.blobRadius * 200}%`,
                height: `${scenario.blobRadius * 200}%`,
              }}
            >
              <div
                className="absolute inset-2 rounded-full bg-teal/15 animate-pulse"
              />
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 font-hand text-teal text-sm whitespace-nowrap bg-cream/90 border border-teal rounded px-1.5">
                predicted region
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LLM pin */}
        <AnimatePresence>
          {mode === 'llm' &&
            (() => {
              const pin = WORDS.find((w) => w.word === scenario.llmPick)
              if (!pin) return null
              return (
                <motion.div
                  key={`pin-${sid}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${pin.x * 100}%`,
                    top: `${pin.y * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="w-5 h-5 rounded-full border-[3px] border-coral bg-coral/40 animate-pulse" />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 font-hand text-coral text-sm whitespace-nowrap bg-cream/90 border border-coral rounded px-1.5">
                    LLM picks "{pin.word}"
                  </div>
                </motion.div>
              )
            })()}
        </AnimatePresence>

        {/* word chips */}
        {WORDS.map((w, i) => {
          const isLLMPick = mode === 'llm' && w.word === scenario.llmPick
          const insideBlob =
            mode === 'jepa' && scenario.insideBlob.includes(w.word)
          const dimmed = !isLLMPick && !insideBlob
          const rot = ((i * 37) % 11) - 5
          return (
            <div
              key={w.word}
              style={{
                left: `${w.x * 100}%`,
                top: `${w.y * 100}%`,
                transform: `translate(-50%, -50%) rotate(${rot}deg)`,
              }}
              className={`absolute px-2 py-0.5 rounded-md
                font-body text-sm md:text-base
                border-[1.5px] shadow-sketchSm bg-cream
                transition-opacity duration-300
                ${
                  isLLMPick
                    ? 'border-coral ring-2 ring-coral/40'
                    : insideBlob
                    ? 'border-teal ring-2 ring-teal/40'
                    : 'border-ink/40'
                }
                ${dimmed ? 'opacity-40' : ''}
              `}
            >
              {w.word}
            </div>
          )
        })}
      </div>

      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 rounded-lg bg-mustard/20 border-[2px] border-dashed border-mustard"
      >
        <div className="font-hand text-coral text-lg mb-1">
          ✦ what just happened
        </div>
        <div className="font-body text-base leading-relaxed">
          {mode === 'llm' ? (
            <>
              The LLM has to{' '}
              <strong>commit to a specific word</strong> — "
              {scenario.llmPick}". To do that, it spent capacity learning
              every possible next-token and its probability. It now has to
              "pick a winner" — even though "mat", "rug", "floor", and
              "couch" are all roughly equally fine answers.
            </>
          ) : (
            <>
              JEPA predicts a <strong>region</strong> in meaning-space — a
              fuzzy cluster covering {scenario.insideBlob.length} plausible
              answers. It never picks one. It just says "the answer lives{' '}
              <em>around here</em>." No capacity wasted on which exact word.
              No commitment to detail that doesn't matter.
            </>
          )}
        </div>
      </motion.div>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ the JEPA bet: most of the time, the gist is what matters. predicting
        the exact word is wasted work.
      </div>
    </div>
  )
}
