import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { encode, decode } from 'gpt-tokenizer/encoding/cl100k_base'

// Soft accent colors used to alternate token chips. We rotate through them
// so adjacent tokens are visually distinct.
const CHIP_COLORS = [
  'bg-coral/30 border-coral',
  'bg-teal/30 border-teal',
  'bg-mustard/40 border-mustard',
  'bg-lavender/30 border-lavender',
  'bg-sage/30 border-sage',
]

const PRESETS: { label: string; text: string; aha?: string }[] = [
  {
    label: 'strawberry 🍓',
    text: 'How many r\'s are in strawberry?',
    aha: 'See "strawberry"? It\'s split into pieces — the model never sees the actual letters. That\'s why it famously miscounts the r\'s.',
  },
  {
    label: 'big number',
    text: 'The population of Tokyo is 13929286 people.',
    aha: 'Long numbers get chopped into weird 2–3 digit chunks. The model never sees the whole number — that\'s why it\'s bad at arithmetic.',
  },
  {
    label: 'a flag emoji',
    text: 'I love France 🇫🇷 and Japan 🇯🇵',
    aha: 'Some emojis are one token, others are multiple. Country flags are pairs of "regional indicator" symbols glued together — and the tokenizer splits them apart.',
  },
  {
    label: 'a long word',
    text: 'antidisestablishmentarianism',
    aha: 'Long words become a chain of subword pieces. The model recognizes morphemes ("anti", "establish", "ment", "ism") even though it never learned the whole word as one unit.',
  },
  {
    label: 'a tweet',
    text: 'omg this is sooooo good!!!! 😂😂😂 #blessed',
    aha: 'Notice "sooooo" gets broken up because the tokenizer never saw enough of those during training to make it one token. Hashtags split off the # too.',
  },
  {
    label: 'normal sentence',
    text: 'The quick brown fox jumped over the lazy dog.',
    aha: 'Common words are usually one token each. Boring text → boring tokenization. The interesting cases are the unusual ones above.',
  },
]

type Token = { text: string; id: number }

function tokenize(text: string): Token[] {
  if (!text) return []
  const ids = encode(text)
  return ids.map((id) => ({ id, text: decode([id]) }))
}

const DEFAULT_TEXT = PRESETS[0].text

export function TokenizerDemo() {
  const [text, setText] = useState(DEFAULT_TEXT)
  const [activePreset, setActivePreset] = useState<string | null>(
    PRESETS[0].label,
  )

  const tokens = useMemo(() => tokenize(text), [text])
  const chars = text.length
  const aha = PRESETS.find((p) => p.label === activePreset)?.aha

  function pickPreset(p: (typeof PRESETS)[number]) {
    setText(p.text)
    setActivePreset(p.label)
  }

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      {/* preset chips */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <span className="font-hand text-ink/70 text-base mr-1">try:</span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => pickPreset(p)}
            className={`pill-sketch text-base transition ${
              p.label === activePreset
                ? 'bg-mustard/40 shadow-sketchSm'
                : 'hover:bg-paper'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* free-form input */}
      <div className="mb-5">
        <label className="font-hand text-ink/70 text-base mb-1 block">
          ...or type your own:
        </label>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setActivePreset(null)
          }}
          rows={2}
          className="w-full font-body text-lg p-3 rounded-lg
            border-[2.5px] border-ink bg-cream
            focus:outline-none focus:ring-4 focus:ring-coral/30
            shadow-sketchSm"
          placeholder="type anything..."
        />
      </div>

      {/* tokens output */}
      <div className="mb-3">
        <div className="font-hand text-ink/70 text-base mb-2 flex justify-between">
          <span>here's how the model sees it:</span>
          <span>
            <span className="text-coral font-bold">{tokens.length}</span> tokens
            {' · '}
            <span className="text-ink/60">{chars} characters</span>
          </span>
        </div>
        <div className="bg-paper/60 rounded-lg p-4 border-[2px] border-ink/30 min-h-[80px]">
          <AnimatePresence mode="popLayout">
            {tokens.map((t, i) => (
              <motion.span
                key={`${i}-${t.id}`}
                layout
                initial={{ opacity: 0, scale: 0.6, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18, delay: Math.min(i * 0.015, 0.4) }}
                className={`inline-block m-[3px] px-2 py-1 rounded-md
                  border-[1.5px] font-body text-base
                  ${CHIP_COLORS[i % CHIP_COLORS.length]}`}
                title={`token id: ${t.id}`}
              >
                {/* Render visible-space placeholder for tokens that start with
                    a space — otherwise the chip is hard to read. */}
                {t.text.startsWith(' ') ? (
                  <>
                    <span className="text-ink/30">·</span>
                    {t.text.slice(1)}
                  </>
                ) : t.text === '\n' ? (
                  <span className="text-ink/40">↵</span>
                ) : (
                  t.text
                )}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* aha callout */}
      {aha && (
        <motion.div
          key={activePreset}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-lg bg-mustard/20 border-[2px] border-dashed border-mustard"
        >
          <div className="font-hand text-coral text-lg mb-1">
            ✦ did you notice?
          </div>
          <div className="font-body text-base leading-relaxed">{aha}</div>
        </motion.div>
      )}

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ these chunks are called <strong className="text-ink">tokens</strong>.
        the model lives entirely in token-land — it has no idea letters exist.
      </div>
    </div>
  )
}
