import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

// Each word lives at a normalized (x, y) in [0,1]. We've hand-placed them so
// that a few canonical analogies work geometrically:
//   king − man + woman ≈ queen
//   paris − france + germany ≈ berlin
//   walk − walking + running ≈ run
type Pt = { word: string; x: number; y: number; cluster: string }

const WORDS: Pt[] = [
  // ── Animals (top-left) ─────────────────────────────
  { word: 'cat', x: 0.08, y: 0.12, cluster: 'animals' },
  { word: 'dog', x: 0.13, y: 0.18, cluster: 'animals' },
  { word: 'bird', x: 0.18, y: 0.10, cluster: 'animals' },
  { word: 'fish', x: 0.06, y: 0.22, cluster: 'animals' },
  { word: 'horse', x: 0.20, y: 0.20, cluster: 'animals' },
  { word: 'mouse', x: 0.10, y: 0.05, cluster: 'animals' },
  { word: 'rabbit', x: 0.22, y: 0.04, cluster: 'animals' },

  // ── Food (top-right) ───────────────────────────────
  { word: 'apple', x: 0.78, y: 0.12, cluster: 'food' },
  { word: 'banana', x: 0.84, y: 0.18, cluster: 'food' },
  { word: 'bread', x: 0.74, y: 0.20, cluster: 'food' },
  { word: 'pizza', x: 0.88, y: 0.10, cluster: 'food' },
  { word: 'sushi', x: 0.92, y: 0.18, cluster: 'food' },
  { word: 'soup', x: 0.80, y: 0.05, cluster: 'food' },

  // ── Emotions (middle-left) ─────────────────────────
  { word: 'happy', x: 0.06, y: 0.50, cluster: 'feelings' },
  { word: 'sad', x: 0.12, y: 0.47, cluster: 'feelings' },
  { word: 'angry', x: 0.16, y: 0.53, cluster: 'feelings' },
  { word: 'calm', x: 0.04, y: 0.40, cluster: 'feelings' },
  { word: 'scared', x: 0.18, y: 0.42, cluster: 'feelings' },

  // ── Royalty / gender (analogy zone) ────────────────
  // queen − king = woman − man  (vertical "gender" axis)
  { word: 'king', x: 0.34, y: 0.78, cluster: 'royalty' },
  { word: 'queen', x: 0.34, y: 0.91, cluster: 'royalty' },
  { word: 'man', x: 0.46, y: 0.78, cluster: 'royalty' },
  { word: 'woman', x: 0.46, y: 0.91, cluster: 'royalty' },
  { word: 'prince', x: 0.30, y: 0.72, cluster: 'royalty' },
  { word: 'princess', x: 0.30, y: 0.85, cluster: 'royalty' },

  // ── Countries / capitals (analogy zone) ────────────
  // capital − country: same offset for all pairs
  // capitals at y=0.65, countries at y=0.80
  { word: 'paris', x: 0.62, y: 0.65, cluster: 'cities' },
  { word: 'france', x: 0.62, y: 0.80, cluster: 'cities' },
  { word: 'berlin', x: 0.74, y: 0.65, cluster: 'cities' },
  { word: 'germany', x: 0.74, y: 0.80, cluster: 'cities' },
  { word: 'rome', x: 0.86, y: 0.65, cluster: 'cities' },
  { word: 'italy', x: 0.86, y: 0.80, cluster: 'cities' },
  { word: 'tokyo', x: 0.95, y: 0.65, cluster: 'cities' },
  { word: 'japan', x: 0.95, y: 0.80, cluster: 'cities' },

  // ── Verbs / tense (small cluster, middle) ──────────
  { word: 'walk', x: 0.50, y: 0.30, cluster: 'verbs' },
  { word: 'walked', x: 0.50, y: 0.42, cluster: 'verbs' },
  { word: 'run', x: 0.62, y: 0.30, cluster: 'verbs' },
  { word: 'ran', x: 0.62, y: 0.42, cluster: 'verbs' },
]

const ANALOGIES: { a: string; minus: string; plus: string; tagline: string }[] =
  [
    {
      a: 'king',
      minus: 'man',
      plus: 'woman',
      tagline: 'royalty has a gender axis',
    },
    {
      a: 'paris',
      minus: 'france',
      plus: 'germany',
      tagline: 'cities know their countries',
    },
    {
      a: 'walked',
      minus: 'walk',
      plus: 'run',
      tagline: 'past-tense is its own direction',
    },
  ]

const CLUSTER_COLORS: Record<string, string> = {
  animals: 'bg-mustard/40 border-mustard',
  food: 'bg-coral/30 border-coral',
  feelings: 'bg-lavender/30 border-lavender',
  royalty: 'bg-teal/30 border-teal',
  cities: 'bg-sage/30 border-sage',
  verbs: 'bg-paper border-ink/40',
}

function dist(a: Pt, b: Pt) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function nearestWord(target: { x: number; y: number }, exclude: string[]) {
  let best = WORDS[0]
  let bestD = Infinity
  for (const w of WORDS) {
    if (exclude.includes(w.word)) continue
    const d = Math.hypot(w.x - target.x, w.y - target.y)
    if (d < bestD) {
      bestD = d
      best = w
    }
  }
  return best
}

export function EmbeddingMap() {
  const [mode, setMode] = useState<'explore' | 'analogy'>('explore')
  const [selected, setSelected] = useState<string>('cat')
  const [analogyIdx, setAnalogyIdx] = useState(0)

  const selectedWord = useMemo(
    () => WORDS.find((w) => w.word === selected) ?? WORDS[0],
    [selected],
  )

  // Explore mode: find K nearest neighbors of selected word.
  const neighbors = useMemo(() => {
    if (mode !== 'explore') return []
    return WORDS.filter((w) => w.word !== selectedWord.word)
      .map((w) => ({ w, d: dist(selectedWord, w) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 4)
      .map((n) => n.w)
  }, [mode, selectedWord])

  // Analogy mode: compute target point and the word closest to it.
  const analogy = ANALOGIES[analogyIdx]
  const analogyResult = useMemo(() => {
    if (mode !== 'analogy') return null
    const a = WORDS.find((w) => w.word === analogy.a)!
    const minus = WORDS.find((w) => w.word === analogy.minus)!
    const plus = WORDS.find((w) => w.word === analogy.plus)!
    const target = {
      x: a.x - minus.x + plus.x,
      y: a.y - minus.y + plus.y,
    }
    const nearest = nearestWord(target, [analogy.a, analogy.minus, analogy.plus])
    return { a, minus, plus, target, nearest }
  }, [mode, analogy])

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      {/* mode switcher */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('explore')}
          className={`btn-sketch ${mode === 'explore' ? 'bg-mustard/60' : ''}`}
        >
          explore
        </button>
        <button
          onClick={() => setMode('analogy')}
          className={`btn-sketch ${mode === 'analogy' ? 'bg-mustard/60' : ''}`}
        >
          ✨ magic math
        </button>
      </div>

      {/* the map */}
      <div
        className="relative w-full aspect-[3/2] bg-paper/60 rounded-xl
          border-[2px] border-ink/30 overflow-hidden"
      >
        {/* faint grid */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="#2b2a26"
                strokeWidth="0.15"
                opacity="0.15"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>

        {/* lines (drawn under chips) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {mode === 'explore' &&
            neighbors.map((n) => (
              <line
                key={n.word}
                x1={selectedWord.x * 100}
                y1={selectedWord.y * 100}
                x2={n.x * 100}
                y2={n.y * 100}
                stroke="#e8694e"
                strokeWidth="0.4"
                strokeDasharray="1 1"
                opacity={0.6}
              />
            ))}

          {mode === 'analogy' && analogyResult && (
            <AnalogyVectors {...analogyResult} />
          )}
        </svg>

        {/* word chips */}
        {WORDS.map((w, i) => {
          const isSelected = mode === 'explore' && w.word === selectedWord.word
          const isNeighbor =
            mode === 'explore' &&
            neighbors.some((n) => n.word === w.word)

          let analogyRole: 'a' | 'minus' | 'plus' | 'result' | null = null
          if (mode === 'analogy' && analogyResult) {
            if (w.word === analogyResult.a.word) analogyRole = 'a'
            else if (w.word === analogyResult.minus.word) analogyRole = 'minus'
            else if (w.word === analogyResult.plus.word) analogyRole = 'plus'
            else if (w.word === analogyResult.nearest.word) analogyRole = 'result'
          }

          const dimmed =
            mode === 'analogy' && analogyRole === null
              ? 'opacity-30'
              : mode === 'explore' && !isSelected && !isNeighbor
              ? 'opacity-50'
              : ''

          const ring =
            isSelected || analogyRole === 'a' || analogyRole === 'minus'
              ? 'ring-4 ring-coral/60'
              : analogyRole === 'plus'
              ? 'ring-4 ring-teal/60'
              : analogyRole === 'result'
              ? 'ring-4 ring-mustard'
              : isNeighbor
              ? 'ring-2 ring-coral/30'
              : ''

          // Tiny rotation jitter for sticky-note feel.
          const rot = ((i * 37) % 11) - 5
          return (
            <motion.button
              key={w.word}
              onClick={() => mode === 'explore' && setSelected(w.word)}
              disabled={mode === 'analogy'}
              initial={false}
              animate={{ scale: isSelected || analogyRole ? 1.08 : 1 }}
              transition={{ duration: 0.2 }}
              style={{
                left: `${w.x * 100}%`,
                top: `${w.y * 100}%`,
                transform: `translate(-50%, -50%) rotate(${rot}deg)`,
              }}
              className={`absolute px-2 py-0.5 rounded-md
                font-body text-sm md:text-base
                border-[1.5px] shadow-sketchSm
                hover:z-10 transition-opacity
                ${CLUSTER_COLORS[w.cluster]}
                ${ring}
                ${dimmed}
                ${mode === 'explore' ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {w.word}
            </motion.button>
          )
        })}

        {/* analogy "predicted point" marker */}
        {mode === 'analogy' && analogyResult && (
          <motion.div
            key={analogyIdx}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            style={{
              left: `${analogyResult.target.x * 100}%`,
              top: `${analogyResult.target.y * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute pointer-events-none"
          >
            <div
              className="w-5 h-5 rounded-full border-[2.5px] border-mustard
                bg-mustard/30 animate-pulse"
            />
          </motion.div>
        )}
      </div>

      {/* footer / controls */}
      {mode === 'explore' && (
        <div className="mt-4 font-hand text-ink/70 text-base">
          you picked{' '}
          <span className="font-bold text-coral">"{selectedWord.word}"</span>
          {' '}— see how its neighbors are all{' '}
          <span className="text-ink font-bold">{selectedWord.cluster}</span>?
          related ideas live near each other on the map.
          <div className="mt-2 text-ink/50 text-sm">
            click any word to make it the center.
          </div>
        </div>
      )}

      {mode === 'analogy' && analogyResult && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2 mb-3 items-center">
            <span className="font-hand text-ink/70 text-base mr-1">try:</span>
            {ANALOGIES.map((a, i) => (
              <button
                key={i}
                onClick={() => setAnalogyIdx(i)}
                className={`pill-sketch text-sm transition ${
                  i === analogyIdx
                    ? 'bg-mustard/40 shadow-sketchSm'
                    : 'hover:bg-paper'
                }`}
              >
                {a.a} − {a.minus} + {a.plus}
              </button>
            ))}
          </div>
          <div className="font-hand text-xl text-ink leading-relaxed">
            <span className="text-coral font-bold">{analogy.a}</span>{' '}
            <span className="text-ink/50">minus</span>{' '}
            <span className="text-coral font-bold">{analogy.minus}</span>{' '}
            <span className="text-ink/50">plus</span>{' '}
            <span className="text-teal font-bold">{analogy.plus}</span>{' '}
            <span className="text-ink/50">≈</span>{' '}
            <span
              className="text-mustard font-bold underline decoration-wavy
                decoration-mustard"
            >
              {analogyResult.nearest.word}
            </span>
          </div>
          <div className="font-body text-sm text-ink/70 mt-2 italic">
            {analogy.tagline} — and the model figures this out without ever
            being told.
          </div>
        </div>
      )}
    </div>
  )
}

// Animated SVG arrows showing king − man + woman → predicted point.
function AnalogyVectors(props: {
  a: Pt
  minus: Pt
  plus: Pt
  target: { x: number; y: number }
  nearest: Pt
}) {
  const { a, minus, plus, target } = props
  // Vector 1: minus → a (this is the "subtract" leg)
  // Vector 2: plus → predicted (the same offset, transplanted)
  return (
    <g>
      <motion.line
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }}
        x1={minus.x * 100}
        y1={minus.y * 100}
        x2={a.x * 100}
        y2={a.y * 100}
        stroke="#e8694e"
        strokeWidth="0.5"
        markerEnd="url(#arrowhead-coral)"
      />
      <motion.line
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        x1={plus.x * 100}
        y1={plus.y * 100}
        x2={target.x * 100}
        y2={target.y * 100}
        stroke="#3d8b8b"
        strokeWidth="0.5"
        strokeDasharray="1.5 1"
        markerEnd="url(#arrowhead-teal)"
      />
      <defs>
        <marker
          id="arrowhead-coral"
          markerWidth="4"
          markerHeight="4"
          refX="3"
          refY="2"
          orient="auto"
        >
          <path d="M0,0 L4,2 L0,4 Z" fill="#e8694e" />
        </marker>
        <marker
          id="arrowhead-teal"
          markerWidth="4"
          markerHeight="4"
          refX="3"
          refY="2"
          orient="auto"
        >
          <path d="M0,0 L4,2 L0,4 Z" fill="#3d8b8b" />
        </marker>
      </defs>
    </g>
  )
}
