import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  PROMPTS,
  getDistribution,
  type TokenChoice,
} from '../data/nextTokenData'

const MAX_TOKENS = 24

// Sample one token from a distribution, honoring temperature.
// temp ≈ 0  → always pick the top
// temp ≈ 1  → sample roughly proportional to probability
// temp >> 1 → flatten toward uniform / weirder picks
function pickToken(choices: TokenChoice[], temp: number): TokenChoice {
  if (temp <= 0.01) {
    return choices.reduce((a, b) => (a.prob > b.prob ? a : b))
  }
  const weights = choices.map((c) => Math.pow(c.prob, 1 / temp))
  const total = weights.reduce((s, w) => s + w, 0)
  let r = Math.random() * total
  for (let i = 0; i < choices.length; i++) {
    r -= weights[i]
    if (r <= 0) return choices[i]
  }
  return choices[choices.length - 1]
}

const ACCENTS = ['bg-coral', 'bg-teal', 'bg-mustard', 'bg-lavender', 'bg-sage']

export function NextTokenDemo() {
  const [promptId, setPromptId] = useState(PROMPTS[0].id)
  const [chosen, setChosen] = useState<string[]>([])
  const [temp, setTemp] = useState(0.7)
  const [autoplay, setAutoplay] = useState(false)
  const [lastPicked, setLastPicked] = useState<string | null>(null)
  const autoTimer = useRef<number | null>(null)

  const prompt = useMemo(
    () => PROMPTS.find((p) => p.id === promptId)!,
    [promptId],
  )
  const textSoFar = prompt.starter + chosen.join('')
  const { choices, authored } = useMemo(
    () => getDistribution(textSoFar),
    [textSoFar],
  )

  // Reset chosen tokens when switching prompts.
  useEffect(() => {
    setChosen([])
    setLastPicked(null)
    setAutoplay(false)
  }, [promptId])

  // Autoplay loop. Stops cleanly on three conditions:
  //   1. We've left the authored "language model" — keeps autoplay from
  //      drifting into meaningless filler from the generic fallback.
  //   2. We picked a sentence-ending punctuation token.
  //   3. We hit MAX_TOKENS (safety cap).
  useEffect(() => {
    if (!autoplay) {
      if (autoTimer.current) {
        window.clearTimeout(autoTimer.current)
        autoTimer.current = null
      }
      return
    }
    if (chosen.length >= MAX_TOKENS) {
      setAutoplay(false)
      return
    }
    if (!authored) {
      setAutoplay(false)
      return
    }
    autoTimer.current = window.setTimeout(() => {
      const pick = pickToken(choices, temp)
      setChosen((prev) => [...prev, pick.token])
      setLastPicked(pick.token)
      const ends = ['.', '!', '?']
      if (ends.includes(pick.token.trim().slice(-1))) {
        setAutoplay(false)
      }
    }, 520)
    return () => {
      if (autoTimer.current) window.clearTimeout(autoTimer.current)
    }
  }, [autoplay, authored, chosen, choices, temp])

  function handlePick(token: string) {
    if (autoplay) return
    if (chosen.length >= MAX_TOKENS) return
    setChosen((prev) => [...prev, token])
    setLastPicked(token)
  }

  function reset() {
    setAutoplay(false)
    setChosen([])
    setLastPicked(null)
  }

  function undo() {
    setAutoplay(false)
    setChosen((prev) => prev.slice(0, -1))
    setLastPicked(null)
  }

  const tempLabel =
    temp <= 0.15 ? 'boring' : temp <= 0.5 ? 'safe' : temp <= 1.0 ? 'lively' : 'wild'

  // Sort choices by probability for display.
  const sorted = [...choices].sort((a, b) => b.prob - a.prob)
  const maxProb = sorted[0]?.prob ?? 1

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      {/* prompt picker */}
      <div className="flex flex-wrap gap-2 mb-5 items-center">
        <span className="font-hand text-ink/70 text-base mr-1">starter:</span>
        {PROMPTS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPromptId(p.id)}
            className={`pill-sketch text-base transition ${
              p.id === promptId
                ? 'bg-mustard/40 shadow-sketchSm'
                : 'hover:bg-paper'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* sentence display */}
      <div className="mb-6 leading-loose">
        <div className="font-hand text-ink/60 text-base mb-1">
          the sentence so far:
        </div>
        <div className="text-2xl md:text-3xl font-body leading-relaxed">
          <span className="text-ink/70">{prompt.starter}</span>
          <AnimatePresence initial={false}>
            {chosen.map((tok, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: -8, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.25, ease: 'backOut' }}
                style={{ whiteSpace: 'pre' }}
                className={`inline-block ${
                  i === chosen.length - 1 ? 'text-coral font-bold' : 'text-ink'
                }`}
              >
                {tok}
              </motion.span>
            ))}
          </AnimatePresence>
          <motion.span
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="inline-block w-3 h-7 bg-ink ml-1 align-middle rounded-sm"
          />
        </div>
      </div>

      {/* candidates */}
      <div className="mb-2">
        <div className="font-hand text-ink/70 text-base mb-2">
          what's likely to come next?
          {!authored && (
            <span className="ml-2 italic text-ink/50">
              (off-script — using a generic guess)
            </span>
          )}
        </div>
        <div className="space-y-2">
          {sorted.slice(0, 7).map((c, i) => {
            const widthPct = (c.prob / maxProb) * 100
            const accent = ACCENTS[i % ACCENTS.length]
            const isJustPicked = c.token === lastPicked
            return (
              <button
                key={c.token + i}
                onClick={() => handlePick(c.token)}
                disabled={autoplay}
                className={`w-full text-left group relative
                  border-[2px] border-ink rounded-lg overflow-hidden
                  transition-all duration-150
                  hover:translate-x-[1px] hover:translate-y-[1px]
                  hover:shadow-none shadow-sketchSm
                  ${autoplay ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                  ${isJustPicked ? 'ring-4 ring-coral/40' : ''}
                  bg-cream`}
              >
                <div
                  className={`absolute inset-y-0 left-0 ${accent} opacity-30
                    transition-all duration-300`}
                  style={{ width: `${widthPct}%` }}
                />
                <div className="relative flex items-center justify-between px-4 py-2">
                  <span className="font-body text-lg">
                    <span className="text-ink/40">"</span>
                    <span className="font-bold">
                      {c.token.replace(/^ /, '·')}
                    </span>
                    <span className="text-ink/40">"</span>
                  </span>
                  <span className="font-hand text-ink/70 text-base tabular-nums">
                    {(c.prob * 100).toFixed(0)}%
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* temperature + controls */}
      <div className="mt-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex-1">
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-hand text-ink/70">
              temperature{' '}
              <span className="text-ink font-bold">({temp.toFixed(2)})</span>
            </span>
            <span className="font-hand text-coral">{tempLabel}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1.5}
            step={0.05}
            value={temp}
            onChange={(e) => setTemp(parseFloat(e.target.value))}
            className="w-full accent-coral"
          />
          <div className="flex justify-between font-hand text-ink/50 text-sm mt-0.5">
            <span>always pick the top</span>
            <span>get weird</span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setAutoplay((a) => !a)}
            className="btn-sketch bg-mustard/60"
            disabled={chosen.length >= MAX_TOKENS}
          >
            {autoplay ? 'pause' : '▶ autoplay'}
          </button>
          <button
            onClick={undo}
            className="btn-sketch"
            disabled={chosen.length === 0 || autoplay}
          >
            undo
          </button>
          <button onClick={reset} className="btn-sketch" disabled={autoplay}>
            reset
          </button>
        </div>
      </div>

      {/* footnote */}
      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ that's the whole secret. it just keeps doing this.
      </div>
    </div>
  )
}
