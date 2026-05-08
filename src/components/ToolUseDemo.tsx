import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type ChunkKind = 'speech' | 'tool-call' | 'tool-result'
type Chunk = {
  kind: ChunkKind
  tool?: string
  text: string
  hint?: string
}

type Scenario = {
  id: string
  label: string
  question: string
  chunks: Chunk[]
}

const SCENARIOS: Scenario[] = [
  {
    id: 'tokyo',
    label: 'a math + facts question',
    question: "What's the population of Tokyo, divided by 100?",
    chunks: [
      {
        kind: 'speech',
        text: "I'll need to look up Tokyo's population first.",
      },
      {
        kind: 'tool-call',
        tool: 'search',
        text: 'population of Tokyo',
        hint: 'the model writes a special token sequence — a "tool call" — that the system recognizes and routes to a real search engine.',
      },
      {
        kind: 'tool-result',
        tool: 'search',
        text: '"Tokyo: 13,929,286 (2023 estimate)"',
        hint: 'the result gets pasted back into the conversation as text. now the model can "see" it.',
      },
      {
        kind: 'speech',
        text: 'Now I can divide that by 100.',
      },
      {
        kind: 'tool-call',
        tool: 'calculator',
        text: '13929286 / 100',
        hint: 'remember chapter 2? the model is bad at exact arithmetic. so it doesn\'t do it itself — it asks a calculator.',
      },
      {
        kind: 'tool-result',
        tool: 'calculator',
        text: '139292.86',
      },
      {
        kind: 'speech',
        text: 'Tokyo\'s population is about 13.9 million, so divided by 100 that\'s about 139,293 people.',
      },
    ],
  },
  {
    id: 'weather',
    label: 'a "right now" question',
    question: "What's the weather in Reykjavik right now?",
    chunks: [
      {
        kind: 'speech',
        text: 'I don\'t have live data, but I can check.',
        hint: 'the model knows it can\'t answer "right now" questions from training data alone — that data was frozen months ago.',
      },
      {
        kind: 'tool-call',
        tool: 'weather',
        text: 'current weather in Reykjavik, Iceland',
      },
      {
        kind: 'tool-result',
        tool: 'weather',
        text: '"Reykjavik: 4°C, light rain, wind 18 km/h"',
      },
      {
        kind: 'speech',
        text: 'It\'s 4°C and lightly raining in Reykjavik right now, with moderate wind. Bundle up!',
      },
    ],
  },
  {
    id: 'code',
    label: 'a "run this code" question',
    question: "Is 982451653 a prime number?",
    chunks: [
      {
        kind: 'speech',
        text: 'Let me check that with actual code rather than guessing.',
      },
      {
        kind: 'tool-call',
        tool: 'python',
        text: 'from sympy import isprime\nisprime(982451653)',
        hint: 'instead of guessing token-by-token (which could go wrong), the model writes Python and asks the system to actually run it.',
      },
      {
        kind: 'tool-result',
        tool: 'python',
        text: 'True',
      },
      {
        kind: 'speech',
        text: 'Yes — 982,451,653 is prime.',
      },
    ],
  },
]

const TOOL_ICONS: Record<string, string> = {
  search: '🔎',
  calculator: '🧮',
  weather: '🌦',
  python: '🐍',
}

export function ToolUseDemo() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id)
  const [step, setStep] = useState(0)
  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!
  const total = scenario.chunks.length
  const visible = scenario.chunks.slice(0, step)
  const done = step >= total
  const currentHint = step > 0 ? scenario.chunks[step - 1].hint : undefined

  function pickScenario(id: string) {
    setScenarioId(id)
    setStep(0)
  }

  function next() {
    if (step < total) setStep((s) => s + 1)
  }

  function reset() {
    setStep(0)
  }

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      {/* scenario picker */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <span className="font-hand text-ink/70 text-base mr-1">scenario:</span>
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => pickScenario(s.id)}
            className={`pill-sketch text-sm transition ${
              s.id === scenarioId
                ? 'bg-mustard/40 shadow-sketchSm'
                : 'hover:bg-paper'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* user question */}
      <div className="flex justify-end mb-3">
        <div className="max-w-[85%] bg-coral/30 border-[1.5px] border-coral rounded-lg px-3 py-2 font-body">
          {scenario.question}
        </div>
      </div>

      {/* chunks */}
      <div className="space-y-2 min-h-[160px]">
        <AnimatePresence>
          {visible.map((c, i) => (
            <ChunkView key={`${scenarioId}-${i}`} chunk={c} />
          ))}
        </AnimatePresence>

        {!done && step === 0 && (
          <div className="text-ink/40 font-hand italic">
            press "next step" to watch the model work...
          </div>
        )}
      </div>

      {/* hint */}
      <AnimatePresence mode="wait">
        {currentHint && (
          <motion.div
            key={`hint-${scenarioId}-${step}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 p-3 rounded-lg bg-mustard/20 border-[2px] border-dashed border-mustard"
          >
            <div className="font-hand text-coral text-base mb-0.5">
              ✦ what just happened
            </div>
            <div className="font-body text-sm leading-relaxed">
              {currentHint}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* controls */}
      <div className="flex gap-2 mt-4 justify-end">
        <button onClick={reset} className="btn-sketch" disabled={step === 0}>
          reset
        </button>
        <button
          onClick={next}
          className="btn-sketch bg-mustard/60"
          disabled={done}
        >
          {done ? '✓ done' : `next step (${step}/${total})`}
        </button>
      </div>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ a model with tools is still just a next-token predictor. it's just
        learned that some token sequences trigger external help.
      </div>
    </div>
  )
}

function ChunkView({ chunk }: { chunk: Chunk }) {
  if (chunk.kind === 'speech') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-start"
      >
        <div className="max-w-[85%] bg-cream border-[1.5px] border-ink/40 rounded-lg px-3 py-2 font-body">
          <span className="text-lg mr-1">🤖</span>
          {chunk.text}
        </div>
      </motion.div>
    )
  }
  if (chunk.kind === 'tool-call') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center"
      >
        <div className="max-w-full bg-lavender/20 border-[2px] border-dashed border-lavender rounded-lg px-3 py-2">
          <div className="font-hand text-xs text-ink/60 uppercase tracking-wider mb-1">
            🤖 → {TOOL_ICONS[chunk.tool!] ?? '🛠'} {chunk.tool} (tool call)
          </div>
          <pre className="font-mono text-sm bg-cream/70 rounded px-2 py-1 inline-block whitespace-pre-wrap">
            {chunk.text}
          </pre>
        </div>
      </motion.div>
    )
  }
  // tool-result
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="flex justify-center"
    >
      <div className="max-w-full bg-sage/20 border-[2px] border-sage rounded-lg px-3 py-2">
        <div className="font-hand text-xs text-ink/60 uppercase tracking-wider mb-1">
          {TOOL_ICONS[chunk.tool!] ?? '🛠'} {chunk.tool} → 🤖 (result)
        </div>
        <pre className="font-mono text-sm bg-cream/70 rounded px-2 py-1 inline-block whitespace-pre-wrap">
          {chunk.text}
        </pre>
      </div>
    </motion.div>
  )
}
