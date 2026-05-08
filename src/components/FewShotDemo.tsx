import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Example = { input: string; output: string }

type Task = {
  id: string
  label: string
  description: string
  examples: Example[] // ≥ 3 examples
  testInput: string
  // Model output by example count: 0, 1, 3
  outputs: { 0: string; 1: string; 3: string }
  // What the model gets right/wrong at each level
  notes: { 0: string; 1: string; 3: string }
}

const TASKS: Task[] = [
  {
    id: 'pirate',
    label: 'English → pirate',
    description: 'rewrite plain English in pirate dialect.',
    examples: [
      { input: 'Hello, how are you?', output: 'Ahoy matey, how be ye farin\'?' },
      { input: 'I need a coffee.', output: 'Arrr, I be needin\' me grog.' },
      { input: 'The meeting is at 3pm.', output: 'The parley sets sail at three bells.' },
    ],
    testInput: 'Please send the report by Friday.',
    outputs: {
      0: 'Avast, kindly send the document over by the end of the week, please.',
      1: 'Arrr, kindly send the report over by Friday, matey!',
      3: 'Arrr, dispatch yer scroll to me cabin afore the sun sets on Friday\'s tide!',
    },
    notes: {
      0: 'No examples — the model picks a few pirate-y words ("avast") but mostly stays formal. It hasn\'t locked onto the playful, all-in pirate register.',
      1: 'One example helps — it now picks up "arrr" and "matey." But the style is still half-formal: "the report" stays as "the report."',
      3: 'Three examples lock in the pattern. It nails the all-in pirate voice — "scroll," "cabin," nautical idioms — because three examples are enough to define what "pirate" means here.',
    },
  },
  {
    id: 'date',
    label: 'extract a date',
    description: 'pull a structured date from messy text.',
    examples: [
      {
        input: 'Hey, can we meet up next Tuesday around 3?',
        output: '{"date": "next Tuesday", "time": "15:00"}',
      },
      {
        input: 'Lunch on the 14th sound good?',
        output: '{"date": "the 14th", "time": null}',
      },
      {
        input: 'Free Friday morning at 9:30am?',
        output: '{"date": "Friday", "time": "09:30"}',
      },
    ],
    testInput: 'How about Saturday at noon?',
    outputs: {
      0: 'Sure, Saturday at noon works for me!',
      1: 'Saturday at 12pm.',
      3: '{"date": "Saturday", "time": "12:00"}',
    },
    notes: {
      0: 'Without an example, the model has no idea you wanted structured output. It just chats back like a normal assistant.',
      1: 'One example hints at "extract something" but the output format hasn\'t been pinned down — it gives prose instead of JSON.',
      3: 'Three examples make the format unambiguous: JSON with "date" and "time" keys, "noon" → "12:00", missing parts → null. The model just continues the pattern.',
    },
  },
  {
    id: 'sentiment',
    label: 'sentiment as emoji',
    description: 'classify the mood of a sentence as a single emoji.',
    examples: [
      { input: 'I love this so much!', output: '🥰' },
      { input: 'The package never arrived.', output: '😡' },
      { input: 'I guess it\'s fine, whatever.', output: '😐' },
    ],
    testInput: 'I cannot believe how good this tastes.',
    outputs: {
      0: 'This sentence expresses a strongly positive opinion about the taste of something.',
      1: 'Positive — 🥰',
      3: '😋',
    },
    notes: {
      0: 'Without examples, the model defaults to "explain the sentiment in a sentence." Reasonable, but not what you wanted.',
      1: 'One example shows "emoji is part of the answer," but the model also includes a label. Format isn\'t tight yet.',
      3: 'Three examples teach the rule: output is exactly one emoji. The model also chose "😋" (specifically tasty-good) — it\'s reading the food cue. Patterns can encode pretty subtle judgments.',
    },
  },
]

export function FewShotDemo() {
  const [taskId, setTaskId] = useState(TASKS[0].id)
  const [n, setN] = useState<0 | 1 | 3>(0)
  const task = TASKS.find((t) => t.id === taskId)!

  const examplesShown = task.examples.slice(0, n)
  const output = task.outputs[n]
  const note = task.notes[n]

  function pickTask(id: string) {
    setTaskId(id)
    setN(0)
  }

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      {/* task picker */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <span className="font-hand text-ink/70 text-base mr-1">task:</span>
        {TASKS.map((t) => (
          <button
            key={t.id}
            onClick={() => pickTask(t.id)}
            className={`pill-sketch text-sm transition ${
              t.id === taskId
                ? 'bg-mustard/40 shadow-sketchSm'
                : 'hover:bg-paper'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="font-hand text-ink/70 text-base mb-3">
        {task.description}
      </div>

      {/* example count selector */}
      <div className="mb-4">
        <div className="font-hand text-ink/70 text-base mb-2">
          how many examples to show the model?
        </div>
        <div className="flex gap-2">
          {([0, 1, 3] as const).map((count) => (
            <button
              key={count}
              onClick={() => setN(count)}
              className={`btn-sketch text-base flex-1 ${
                n === count ? 'bg-mustard/60' : ''
              }`}
            >
              {count === 0 ? '0 (no examples)' : `${count} example${count === 1 ? '' : 's'}`}
            </button>
          ))}
        </div>
      </div>

      {/* the prompt */}
      <div className="bg-paper/60 rounded-lg p-3 border-[2px] border-ink/30 mb-3 font-mono text-sm whitespace-pre-wrap">
        <div className="font-hand text-ink/60 text-xs uppercase tracking-wider mb-2">
          the prompt the model sees:
        </div>
        <AnimatePresence mode="popLayout">
          {examplesShown.map((e, i) => (
            <motion.div
              key={`ex-${taskId}-${i}`}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-2 overflow-hidden"
            >
              <div>
                <span className="text-ink/60">Input: </span>
                {e.input}
              </div>
              <div>
                <span className="text-ink/60">Output: </span>
                <span className="text-coral">{e.output}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="border-t-[1.5px] border-dashed border-ink/30 mt-2 pt-2">
          <div>
            <span className="text-ink/60">Input: </span>
            <span className="font-bold">{task.testInput}</span>
          </div>
          <div>
            <span className="text-ink/60">Output: </span>
            <span className="text-ink/30 italic">model fills this in...</span>
          </div>
        </div>
      </div>

      {/* model output */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${taskId}-${n}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="rounded-lg p-3 border-[2px] mb-3 bg-teal/10 border-teal"
        >
          <div className="font-hand text-ink/60 text-xs uppercase tracking-wider mb-1">
            model's output
          </div>
          <div className="font-mono text-base text-ink whitespace-pre-wrap">
            {output}
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.div
        key={`note-${taskId}-${n}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 rounded-lg bg-mustard/20 border-[2px] border-dashed border-mustard"
      >
        <div className="font-hand text-coral text-lg mb-1">
          ✦ what's happening
        </div>
        <div className="font-body text-base leading-relaxed">{note}</div>
      </motion.div>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ no retraining. no fine-tuning. you just put examples in the prompt
        and the model continues the pattern. this is called{' '}
        <strong className="text-ink">few-shot prompting</strong>.
      </div>
    </div>
  )
}
