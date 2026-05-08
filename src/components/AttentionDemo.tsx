import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

// Each example is a sentence shown as word chips, with hand-authored
// "attention weights" from the predicted (last) position back to each
// earlier word. Weights need not sum to 1 — we normalize for display.
type Example = {
  id: string
  label: string
  words: string[] // including the predicted word at the end
  predictedIdx: number // index of the word being predicted (the focus)
  // Attention from focus → each earlier index. Length = predictedIdx.
  attention: number[]
  insight: string
}

const EXAMPLES: Example[] = [
  {
    id: 'agreement',
    label: 'long-distance grammar',
    words: [
      'The',
      'dogs',
      'that',
      'chased',
      'the',
      'cat',
      'across',
      'the',
      'yard',
      'were',
    ],
    predictedIdx: 9,
    attention: [0.05, 0.62, 0.04, 0.08, 0.02, 0.04, 0.02, 0.02, 0.04],
    insight:
      'To pick "were" (plural) instead of "was" (singular), the model has to look past five other nouns and find the original subject — "dogs" — way back at position 2. Attention is what lets it.',
  },
  {
    id: 'pronoun',
    label: 'who is "it"?',
    words: [
      'The',
      'trophy',
      "didn't",
      'fit',
      'in',
      'the',
      'suitcase',
      'because',
      'it',
      'was',
      'too',
      'big',
    ],
    predictedIdx: 11,
    attention: [
      0.02, 0.55, 0.03, 0.02, 0.02, 0.02, 0.05, 0.02, 0.18, 0.02, 0.07,
    ],
    insight:
      '"It" is ambiguous — trophy or suitcase? When the next word is "big", attention swings hard toward "trophy" (only the trophy could be too big to fit). Change "big" to "small" and a real model swings toward "suitcase". Attention is how it figures out what pronouns refer to.',
  },
  {
    id: 'translation',
    label: 'finding the right object',
    words: [
      'Sarah',
      'gave',
      'her',
      'sister',
      'a',
      'birthday',
      'card',
      'and',
      'said',
      'happy',
      'birthday',
    ],
    predictedIdx: 10,
    attention: [
      0.04, 0.03, 0.02, 0.05, 0.02, 0.62, 0.05, 0.02, 0.05, 0.10,
    ],
    insight:
      'To predict "birthday" again, the model leans heavily on the earlier "birthday" (position 6) — a kind of theme-tracking. This is how it stays on topic across long passages.',
  },
]

export function AttentionDemo() {
  const [exampleId, setExampleId] = useState(EXAMPLES[0].id)
  const ex = EXAMPLES.find((e) => e.id === exampleId)!

  const maxAttn = useMemo(() => Math.max(...ex.attention), [ex])
  // Hovered word index (within the prefix, not the predicted word).
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      {/* example picker */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <span className="font-hand text-ink/70 text-base mr-1">try:</span>
        {EXAMPLES.map((e) => (
          <button
            key={e.id}
            onClick={() => setExampleId(e.id)}
            className={`pill-sketch text-base transition ${
              e.id === exampleId
                ? 'bg-mustard/40 shadow-sketchSm'
                : 'hover:bg-paper'
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div className="font-hand text-ink/70 text-base mb-2">
        when predicting the{' '}
        <span className="text-coral font-bold">highlighted word</span>, the
        model looks back. thicker arrows = more attention.
      </div>

      {/* Sentence + attention overlay */}
      <div className="relative bg-paper/60 rounded-lg p-6 border-[2px] border-ink/30 overflow-visible">
        {/* SVG arrow layer — sits behind the chips */}
        <SentenceWithAttention
          words={ex.words}
          predictedIdx={ex.predictedIdx}
          attention={ex.attention}
          maxAttn={maxAttn}
          hoverIdx={hoverIdx}
          onHover={setHoverIdx}
        />
      </div>

      {/* insight */}
      <motion.div
        key={ex.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 rounded-lg bg-mustard/20
          border-[2px] border-dashed border-mustard"
      >
        <div className="font-hand text-coral text-lg mb-1">
          ✦ what attention buys you
        </div>
        <div className="font-body text-base leading-relaxed">{ex.insight}</div>
      </motion.div>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ this is the trick the "transformer" architecture is built around. at
        every position, every word can look back at every other word and weigh
        how much it cares.
      </div>
    </div>
  )
}

function SentenceWithAttention({
  words,
  predictedIdx,
  attention,
  maxAttn,
  hoverIdx,
  onHover,
}: {
  words: string[]
  predictedIdx: number
  attention: number[]
  maxAttn: number
  hoverIdx: number | null
  onHover: (i: number | null) => void
}) {
  // We measure positions using a measured ref-grid. Simpler: compute layout
  // ourselves in CSS pixels via a flex row. For drawing arrows we use
  // percentage-based math on a normalized SVG, keying off the chip indices.
  // But chip widths vary, so for arrows we need actual pixel positions.
  //
  // Pragmatic approach: render the sentence with a CSS grid where each chip
  // gets a column, then overlay an SVG that draws curves between column
  // centers. We approximate this via a layout pass: render chips, on mount
  // measure their centers, store in state. To keep this simple and robust,
  // we use a flex-wrap row and place the SVG underneath, with each curve
  // drawn from chip i's center to predictedIdx's center using on-the-fly
  // bounding-box reads via a callback ref.

  // For a clean layout, we'll force chips onto a single row with horizontal
  // scrolling on overflow. That keeps the SVG geometry simple.
  return (
    <div className="relative pb-2">
      <div className="relative">
        <div className="flex flex-wrap gap-1.5 justify-center items-end relative z-10">
          {words.map((w, i) => {
            const isFocus = i === predictedIdx
            const attn = i < predictedIdx ? attention[i] : 0
            const intensity = attn / (maxAttn || 1)
            const isHovered = hoverIdx === i
            return (
              <motion.div
                key={i}
                onMouseEnter={() => i < predictedIdx && onHover(i)}
                onMouseLeave={() => onHover(null)}
                className={`relative px-2 py-1 rounded-md font-body text-base
                  border-[1.5px] cursor-default transition-all
                  ${
                    isFocus
                      ? 'bg-coral text-cream border-coral font-bold shadow-sketchSm'
                      : 'bg-cream border-ink/40'
                  }
                  ${isHovered ? 'ring-2 ring-mustard scale-105' : ''}
                `}
                style={
                  !isFocus
                    ? {
                        backgroundColor: `rgba(232, 105, 78, ${intensity * 0.35})`,
                      }
                    : undefined
                }
              >
                {w}
                {!isFocus && attn > 0.04 && (
                  <span className="absolute -top-2 -right-1 text-[9px] font-hand bg-cream border border-ink/40 rounded px-1 leading-tight">
                    {(attn * 100).toFixed(0)}%
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
