import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Example = {
  prompt: string
  base: string
  chat: string
  note: string
}

const EXAMPLES: Example[] = [
  {
    prompt: 'How do I make pasta?',
    base: `How do I make pasta? It's actually one of those questions that sounds simple until you try to write it out. I learned to cook from my grandmother, who never measured anything, and...`,
    chat: `Sure! Here's a basic method:

1. Bring a large pot of salted water to a boil.
2. Add the pasta and stir occasionally.
3. Cook 8–11 minutes for most dried pasta, until al dente.
4. Drain, toss with sauce, and serve.

Want a specific sauce recipe?`,
    note: 'The base model just keeps writing — it treats your message as the start of an article. The chat model has been taught to recognize "this is a question to me, I should answer it helpfully."',
  },
  {
    prompt: 'Write an email asking for a day off.',
    base: `Write an email asking for a day off. The trouble with these things is always tone. Too formal and it reads like a legal document; too casual and your boss thinks you don't take it seriously. There's a Reddit thread I read once...`,
    chat: `Subject: Time-off request — [date]

Hi [Manager],

I'd like to request [date] off. I'll make sure my work is up to date beforehand and ensure coverage for anything urgent.

Let me know if that works.

Thanks,
[Your name]`,
    note: 'Same pattern. The base model rambles in essay-mode. The chat model went straight to producing the actual email.',
  },
  {
    prompt: 'What is photosynthesis?',
    base: `What is photosynthesis? Most of us learned the basic answer in school: plants turn sunlight into food. But the real story is much more fascinating, and modern biologists are still uncovering details. Let me take you on a journey...`,
    chat: `Photosynthesis is the process plants use to convert sunlight, water, and carbon dioxide into glucose (food) and oxygen.

The basic equation:
6 CO₂ + 6 H₂O + light → C₆H₁₂O₆ + 6 O₂

It happens in chloroplasts, mostly in the leaves.`,
    note: 'The base model writes like Wikipedia\'s "early version." The chat model gives you a clean, structured answer — exactly what an "assistant" would produce.',
  },
]

export function BaseVsChatDemo() {
  const [exIdx, setExIdx] = useState(0)
  const [mode, setMode] = useState<'base' | 'chat'>('base')
  const ex = EXAMPLES[exIdx]

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      {/* example picker */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <span className="font-hand text-ink/70 text-base mr-1">prompt:</span>
        {EXAMPLES.map((e, i) => (
          <button
            key={i}
            onClick={() => setExIdx(i)}
            className={`pill-sketch text-sm transition ${
              i === exIdx ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
            }`}
          >
            {e.prompt.length > 28 ? e.prompt.slice(0, 28) + '…' : e.prompt}
          </button>
        ))}
      </div>

      {/* the prompt */}
      <div className="mb-4">
        <div className="font-hand text-ink/60 text-sm mb-1">you ask:</div>
        <div className="bg-coral/20 border-[2px] border-coral rounded-lg p-3 font-body text-lg">
          {ex.prompt}
        </div>
      </div>

      {/* mode toggle */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setMode('base')}
          className={`btn-sketch flex-1 ${
            mode === 'base' ? 'bg-mustard/60' : ''
          }`}
        >
          🦜 base model
        </button>
        <button
          onClick={() => setMode('chat')}
          className={`btn-sketch flex-1 ${
            mode === 'chat' ? 'bg-mustard/60' : ''
          }`}
        >
          🎓 chat-tuned model
        </button>
      </div>

      {/* output */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${exIdx}-${mode}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className={`rounded-lg p-4 border-[2px] mb-3 font-body text-base whitespace-pre-wrap leading-relaxed
            ${
              mode === 'base'
                ? 'bg-paper/60 border-ink/40'
                : 'bg-teal/15 border-teal'
            }`}
        >
          <div className="font-hand text-ink/60 text-sm mb-2">
            {mode === 'base'
              ? 'the raw next-token predictor:'
              : 'the same model, after instruction tuning + human feedback:'}
          </div>
          {mode === 'base' ? ex.base : ex.chat}
        </motion.div>
      </AnimatePresence>

      <motion.div
        key={`note-${exIdx}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 rounded-lg bg-mustard/20 border-[2px] border-dashed border-mustard"
      >
        <div className="font-hand text-coral text-lg mb-1">
          ✦ what changed?
        </div>
        <div className="font-body text-base leading-relaxed">{ex.note}</div>
      </motion.div>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ same neural network underneath. the chat model just had a second
        round of training on examples of "user asks → assistant answers".
      </div>
    </div>
  )
}
