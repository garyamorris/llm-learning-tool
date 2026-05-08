import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Statement = {
  text: string
  fake?: boolean
  why: string // shown after reveal
}

type Round = {
  prompt: string
  statements: Statement[]
}

const ROUNDS: Round[] = [
  {
    prompt: 'three "facts" — only one is made up. spot the lie.',
    statements: [
      {
        text: 'The Eiffel Tower was completed in 1889 for the Paris World\'s Fair.',
        why: 'real — finished in March 1889 for the Exposition Universelle.',
      },
      {
        text: 'Big Ben was briefly renovated in 2007 after a small fire damaged the clock face.',
        fake: true,
        why: 'made up. There was no fire. The model strung together plausible-sounding nouns ("renovated", "fire", "clock face") that fit the rhythm of a fact about Big Ben — but none of it happened.',
      },
      {
        text: 'The Statue of Liberty was a gift from France, designed by Frédéric Bartholdi.',
        why: 'real — given to the US in 1886.',
      },
    ],
  },
  {
    prompt: 'three book citations — one is fiction (the citation, not the book).',
    statements: [
      {
        text: '"The Brothers Karamazov" by Fyodor Dostoyevsky, published in 1880.',
        why: 'real — Dostoyevsky\'s last novel.',
      },
      {
        text: '"Pride and Prejudice" by Jane Austen, first published in 1813.',
        why: 'real.',
      },
      {
        text: '"The Glass Tower of Larnen" by Caroline J. Welsh, published in 1987 by Macmillan.',
        fake: true,
        why: 'completely fabricated. The book doesn\'t exist, "Caroline J. Welsh" isn\'t a real author. But every word sounds like a credible citation — name, year, publisher all check out as plausible patterns. This is exactly how LLMs hallucinate sources.',
      },
    ],
  },
  {
    prompt: 'three programming "facts" — one is wrong.',
    statements: [
      {
        text: 'Python\'s "list" type uses a dynamic array internally — appends are amortized O(1).',
        why: 'real.',
      },
      {
        text: 'JavaScript\'s "Array.prototype.sort" was specified to be stable starting in ES2019.',
        why: 'real — V8 also made it stable around that time.',
      },
      {
        text: 'Rust\'s "Vec::shrink" method automatically defragments memory in the background.',
        fake: true,
        why: 'made up. "Vec::shrink_to_fit" exists, but there\'s no background defrag. The plausible-sounding word "defragments" was just the model picking the next likely word in a technical-sounding sentence.',
      },
    ],
  },
]

export function HallucinationDemo() {
  const [roundIdx, setRoundIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const round = ROUNDS[roundIdx]
  const fakeIdx = round.statements.findIndex((s) => s.fake)
  const correct = picked === fakeIdx

  function pick(i: number) {
    if (revealed) return
    setPicked(i)
    setRevealed(true)
  }

  function nextRound() {
    setRoundIdx((r) => (r + 1) % ROUNDS.length)
    setPicked(null)
    setRevealed(false)
  }

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">{round.prompt}</div>

      <div className="space-y-3">
        {round.statements.map((s, i) => {
          const isPicked = picked === i
          const isFake = i === fakeIdx
          const showAsFake = revealed && isFake

          let border = 'border-ink/40'
          let bg = 'bg-cream'
          if (revealed) {
            if (isFake) {
              border = 'border-coral'
              bg = 'bg-coral/10'
            } else {
              border = 'border-sage'
              bg = 'bg-sage/10'
            }
          } else if (isPicked) {
            border = 'border-mustard'
            bg = 'bg-mustard/20'
          }

          return (
            <motion.button
              key={`${roundIdx}-${i}`}
              onClick={() => pick(i)}
              disabled={revealed}
              whileHover={!revealed ? { x: 2 } : {}}
              className={`w-full text-left p-4 rounded-lg
                border-[2.5px] ${border} ${bg} shadow-sketchSm
                transition-all relative
                ${revealed ? 'cursor-default' : 'hover:shadow-sketch cursor-pointer'}`}
            >
              <div className="font-body text-base md:text-lg leading-relaxed pr-12">
                {s.text}
              </div>
              {revealed && (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: showAsFake ? -8 : 6 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className={`absolute top-3 right-3 font-display text-2xl px-2
                    border-[2px] ${
                      showAsFake
                        ? 'text-coral border-coral'
                        : 'text-sage border-sage'
                    } rounded`}
                >
                  {showAsFake ? 'MADE UP' : 'TRUE'}
                </motion.div>
              )}
              {revealed && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-hand text-ink/70 text-base mt-2 italic"
                >
                  {s.why}
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-5 p-4 rounded-lg bg-mustard/20
              border-[2px] border-dashed border-mustard"
          >
            <div className="font-display text-2xl mb-2">
              {correct
                ? '✦ caught it.'
                : picked !== null
                ? '✦ tricked you, didn\'t it?'
                : '✦ here\'s the trick.'}
            </div>
            <div className="font-body text-base leading-relaxed">
              The LLM wrote all three of these sentences{' '}
              <strong>with the same confidence</strong>. There's no internal
              voice that says "wait, I should fact-check this." It's just
              picking plausible next tokens — and a plausible-sounding lie
              looks identical to a plausible-sounding truth from inside the
              model.
            </div>
            <button
              onClick={nextRound}
              className="btn-sketch bg-coral/40 mt-3"
            >
              try another →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ this is the deal. when the truth and a plausible-sounding lie are
        equally fluent, the model can't tell them apart.
      </div>
    </div>
  )
}
