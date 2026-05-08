import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Persona = {
  id: string
  emoji: string
  label: string
  systemPrompt: string
  reply: string
}

const QUESTION = 'How do I cook pasta?'

const PERSONAS: Persona[] = [
  {
    id: 'assistant',
    emoji: '🤖',
    label: 'helpful assistant',
    systemPrompt: 'You are a helpful, harmless, and honest assistant.',
    reply: `Bring a large pot of salted water to a rolling boil. Add the pasta and stir occasionally. Cook for 8–11 minutes, depending on the pasta shape, until al dente. Drain and serve with your favorite sauce.`,
  },
  {
    id: 'pirate',
    emoji: '🏴‍☠️',
    label: 'salty pirate',
    systemPrompt:
      'You are a salty pirate. Respond in pirate dialect. Use words like "arrr", "matey", and nautical metaphors.',
    reply: `Arrr, listen close, matey! Ye take a great cauldron of seawater — well, salt water — and ye boil it like the depths of the Mariana. Toss yer noodles in like ballast. Eight or nine bells later, fish 'em out. Drown 'em in red sauce and feast! Yo ho ho!`,
  },
  {
    id: 'chef',
    emoji: '👨‍🍳',
    label: 'snobby chef',
    systemPrompt:
      'You are a Michelin-starred Italian chef who is mildly offended by amateur cooking questions.',
    reply: `*sighs deeply* Pasta is not "cooked" — it is honored. One liter of water per 100 grams of pasta. Salt: at least 10 grams per liter. Salted water must taste of the Mediterranean, no? You drain when al dente — never, ever soft. And please — for the love of San Genesio — do not rinse it.`,
  },
  {
    id: 'teacher',
    emoji: '👩‍🏫',
    label: 'kindergarten teacher',
    systemPrompt:
      'You are a kindergarten teacher explaining things to a 5-year-old. Use simple words and lots of encouragement.',
    reply: `Great question, friend! 🌟 First, we get a big pot and fill it with water. We put it on the stove (with a grown-up's help — always!). When the water has lots of bubbles, we carefully drop the pasta in. We wait a few minutes, then a grown-up pours it into a strainer. And then — yummy pasta! You're going to be a great cook!`,
  },
]

export function PersonaDemo() {
  const [pid, setPid] = useState(PERSONAS[0].id)
  const [showCurtain, setShowCurtain] = useState(false)
  const persona = PERSONAS.find((p) => p.id === pid)!

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        same model. same question. four hidden costumes.
      </div>

      {/* persona picker */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PERSONAS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPid(p.id)}
            className={`btn-sketch text-base ${
              p.id === pid ? 'bg-mustard/60' : ''
            }`}
          >
            <span className="text-lg">{p.emoji}</span> {p.label}
          </button>
        ))}
      </div>

      {/* show-curtain toggle */}
      <div className="mb-3">
        <button
          onClick={() => setShowCurtain((s) => !s)}
          className="font-hand text-coral text-base underline decoration-wavy hover:text-ink"
        >
          {showCurtain ? '🪄 hide the curtain' : '👁 peek behind the curtain'}
        </button>
      </div>

      {/* the chat */}
      <div className="space-y-3">
        {/* system prompt (only when peeking) */}
        <AnimatePresence>
          {showCurtain && (
            <motion.div
              key={`sys-${pid}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-lavender/20 border-[2px] border-dashed border-lavender rounded-lg p-3">
                <div className="font-hand text-ink/60 text-xs uppercase tracking-wider mb-1">
                  hidden system prompt (you never see this in chatgpt)
                </div>
                <div className="font-body text-base italic text-ink/80">
                  "{persona.systemPrompt}"
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* user message */}
        <div className="flex justify-end">
          <div className="max-w-[80%] bg-coral/30 border-[1.5px] border-coral rounded-lg px-3 py-2 font-body">
            {QUESTION}
          </div>
        </div>

        {/* model reply */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pid}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex justify-start"
          >
            <div className="max-w-[85%] bg-cream border-[1.5px] border-ink/40 rounded-lg px-3 py-2 font-body whitespace-pre-wrap relative">
              <span className="absolute -top-3 -left-2 text-2xl">
                {persona.emoji}
              </span>
              {persona.reply}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ the model isn't switching personalities. it's just predicting tokens
        that fit the hidden setup it was given.
      </div>
    </div>
  )
}
