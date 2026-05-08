import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Problem = {
  id: string
  label: string
  question: string
  // Quick "vibes-based" answer the model gives without thinking.
  directAnswer: string
  directCorrect: boolean
  // Step-by-step chain-of-thought reasoning. Last step is the final answer.
  steps: string[]
  finalAnswer: string
  trap: string // why the direct answer is appealing-but-wrong
}

const PROBLEMS: Problem[] = [
  {
    id: 'pencils',
    label: 'pencil math',
    question:
      'Sarah has 3 boxes. Each box holds 4 packs of pencils. Each pack has 6 pencils. She gives half of all her pencils to her brother. How many does she have left?',
    directAnswer: '12',
    directCorrect: false,
    steps: [
      '3 boxes × 4 packs = 12 packs total.',
      '12 packs × 6 pencils = 72 pencils total.',
      'She gives away half: 72 ÷ 2 = 36.',
      'So she has 36 pencils left.',
    ],
    finalAnswer: '36',
    trap: '"12" is what you get if you stop after the first multiplication. The fast/intuitive answer is wrong.',
  },
  {
    id: 'shirt',
    label: 'discount + tax',
    question:
      'A shirt costs $40. It\'s 25% off, then 8% sales tax is added on top. What\'s the final price?',
    directAnswer: '$32.40',
    directCorrect: true,
    steps: [
      '25% off $40 = $40 × 0.75 = $30.',
      '8% tax on $30 = $30 × 1.08 = $32.40.',
      'Final price: $32.40.',
    ],
    finalAnswer: '$32.40',
    trap: 'This one the model gets right both ways — but only because it\'s a common pattern. Try the same problem with weirder numbers and the direct version often slips.',
  },
  {
    id: 'train',
    label: 'classic train problem',
    question:
      'A train leaves Station A at 9am going 60mph east. Another train leaves Station A at 11am going 80mph east. At what time does the second train catch the first?',
    directAnswer: '1pm',
    directCorrect: false,
    steps: [
      'By 11am the first train has traveled 2 hours × 60mph = 120 miles.',
      'After that, the second train closes the gap at 80 − 60 = 20mph.',
      '120 miles ÷ 20mph = 6 hours to catch up.',
      'Adding 6 hours to 11am gives 5pm.',
    ],
    finalAnswer: '5pm',
    trap: '"1pm" sounds plausible if you misread the problem as a simple speed/distance lookup. Without working through the relative-speed step, the model often picks something fast and wrong.',
  },
]

export function ChainOfThoughtDemo() {
  const [pid, setPid] = useState(PROBLEMS[0].id)
  const [mode, setMode] = useState<'direct' | 'cot'>('direct')
  const [revealedStep, setRevealedStep] = useState(0)
  const timer = useRef<number | null>(null)
  const problem = PROBLEMS.find((p) => p.id === pid)!

  // When switching to CoT, reveal steps progressively.
  useEffect(() => {
    if (mode !== 'cot') {
      setRevealedStep(0)
      return
    }
    setRevealedStep(0)
    let i = 0
    const tick = () => {
      i++
      setRevealedStep(i)
      if (i < problem.steps.length) {
        timer.current = window.setTimeout(tick, 700)
      }
    }
    timer.current = window.setTimeout(tick, 400)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [mode, pid, problem.steps.length])

  function pickProblem(id: string) {
    setPid(id)
    setMode('direct')
    setRevealedStep(0)
  }

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      {/* problem picker */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <span className="font-hand text-ink/70 text-base mr-1">problem:</span>
        {PROBLEMS.map((p) => (
          <button
            key={p.id}
            onClick={() => pickProblem(p.id)}
            className={`pill-sketch text-sm transition ${
              p.id === pid ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* the question */}
      <div className="mb-4">
        <div className="font-hand text-ink/60 text-sm mb-1">you ask:</div>
        <div className="bg-coral/20 border-[2px] border-coral rounded-lg p-3 font-body text-base md:text-lg leading-relaxed">
          {problem.question}
        </div>
      </div>

      {/* mode toggle */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setMode('direct')}
          className={`btn-sketch flex-1 text-sm ${
            mode === 'direct' ? 'bg-mustard/60' : ''
          }`}
        >
          ⚡ answer directly
        </button>
        <button
          onClick={() => setMode('cot')}
          className={`btn-sketch flex-1 text-sm ${
            mode === 'cot' ? 'bg-mustard/60' : ''
          }`}
        >
          🧠 think step by step
        </button>
      </div>

      {/* output */}
      <AnimatePresence mode="wait">
        {mode === 'direct' ? (
          <motion.div
            key={`direct-${pid}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-lg p-4 border-[2px] mb-3 bg-paper/60 border-ink/40"
          >
            <div className="font-hand text-ink/60 text-sm mb-2">
              the model fires off an answer:
            </div>
            <div className="font-body text-2xl md:text-3xl flex items-baseline gap-3">
              <span className="font-bold">{problem.directAnswer}</span>
              <span
                className={`font-display text-xl px-2 rounded border-[2px] ${
                  problem.directCorrect
                    ? 'text-sage border-sage'
                    : 'text-coral border-coral'
                }`}
              >
                {problem.directCorrect ? 'correct' : 'wrong'}
              </span>
            </div>
            {!problem.directCorrect && (
              <div className="font-hand text-ink/60 text-sm mt-3 italic">
                {problem.trap}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key={`cot-${pid}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-lg p-4 border-[2px] mb-3 bg-teal/10 border-teal"
          >
            <div className="font-hand text-ink/60 text-sm mb-2">
              the model writes out its reasoning:
            </div>
            <ol className="space-y-2 list-none mb-3">
              {problem.steps.map((s, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: i < revealedStep ? 1 : 0.15,
                    x: 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="font-body text-base leading-relaxed flex gap-3"
                >
                  <span className="font-hand text-coral font-bold text-lg shrink-0">
                    {i + 1}.
                  </span>
                  <span>{s}</span>
                </motion.li>
              ))}
            </ol>
            {revealedStep >= problem.steps.length && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2 pt-3 border-t-[1.5px] border-dashed border-teal/60"
              >
                <span className="font-hand text-ink/60 text-sm mr-2">
                  final answer:
                </span>
                <span className="font-body text-2xl font-bold text-teal">
                  {problem.finalAnswer}
                </span>
                <span className="font-display text-xl text-sage border-[2px] border-sage rounded ml-3 px-2">
                  correct
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 rounded-lg bg-mustard/20 border-[2px] border-dashed border-mustard">
        <div className="font-hand text-coral text-lg mb-1">
          ✦ why this works
        </div>
        <div className="font-body text-base leading-relaxed">
          Each step the model writes becomes more tokens in its context. The
          <em> next </em>step is then predicted based on those reasoning tokens
          — not just the original question. It's the same machinery from
          chapter 1, but now with a richer scratch-pad to build on.
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ "let's think step by step" can change a wrong answer into a right
        one. modern "reasoning models" (o1, o3, claude with extended thinking)
        do this internally before they reply.
      </div>
    </div>
  )
}
