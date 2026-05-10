import { motion } from 'framer-motion'

type Card = { emoji: string; title: string; body: string }

const PRO: Card[] = [
  {
    emoji: '🌍',
    title: 'It learns a model of the world.',
    body: 'By predicting masked regions in millions of hours of video, a JEPA can internalize physics, object permanence, causality — things a text-only LLM gets at best secondhand from human-written descriptions.',
  },
  {
    emoji: '🎯',
    title: 'It doesn\'t waste capacity on irrelevant detail.',
    body: 'Predicting in embedding space means the system never has to commit to "the next pixel is RGB(123, 87, 42)." It just predicts "around here in meaning-space." Vastly more efficient for high-dimensional inputs like video.',
  },
  {
    emoji: '🤖',
    title: 'It\'s closer to how brains seem to work.',
    body: 'Animals don\'t learn by reading the internet. They learn by interacting with the world, predicting what happens next, and noticing when they\'re surprised. JEPA borrows that recipe.',
  },
  {
    emoji: '🪜',
    title: 'It\'s a path past LLM bottlenecks.',
    body: 'Hallucination, planning, spatial reasoning, embodied tasks — LeCun argues these failure modes are baked into the autoregressive-token paradigm. A different paradigm could be a different ceiling.',
  },
]

const CON: Card[] = [
  {
    emoji: '📈',
    title: 'LLMs keep getting better.',
    body: 'Every prediction that "we\'ve hit the limits" has been broken by another order of magnitude of scale and a few clever tricks. There\'s an empirical case for "just keep scaling LLMs" that\'s harder to argue with than philosophy.',
  },
  {
    emoji: '🛍',
    title: 'JEPA hasn\'t shipped a household name.',
    body: 'I-JEPA, V-JEPA, and successors are real research results. But no product millions of people use day-to-day rests on JEPA the way ChatGPT/Claude/Gemini rest on transformers. The proof-of-utility gap is real.',
  },
  {
    emoji: '🎨',
    title: 'Multimodal LLMs are getting world-model-like already.',
    body: 'GPT-4o, Gemini, Claude — all of these can see images, watch video, reason about physics-ish situations passably well. The "LLMs can never do X" arguments keep getting weaker as the X gets done by LLMs anyway.',
  },
  {
    emoji: '🤝',
    title: 'It might not be either/or.',
    body: 'The most likely future is hybrid: world-model-style learning for perception and planning, language-model-style learning for symbolic reasoning and communication, glued together. Calling it a competition might just be wrong.',
  },
]

const HONEST: Card[] = [
  {
    emoji: '🧪',
    title: 'Both are being pursued, hard.',
    body: 'Meta\'s FAIR group is the loudest about JEPA, but every major AI lab is hedging in some way. The field is not converged on a single paradigm.',
  },
  {
    emoji: '⏳',
    title: 'It\'s genuinely too early to call.',
    body: 'In ten years one approach may look obviously right, and the other obviously wrong, and both camps will pretend they always knew. Today, nobody knows.',
  },
  {
    emoji: '📺',
    title: 'Watch video, not benchmarks.',
    body: 'The clearest test will be in tasks that genuinely demand world-modeling — long-horizon physical reasoning, video understanding, embodied agents. If JEPA-style models start dominating those, the answer becomes clear.',
  },
]

function CardGrid({ cards }: { cards: Card[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {cards.map((c, i) => (
        <motion.div
          key={c.title}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="bg-cream border-[2px] border-ink rounded-lg p-3 shadow-sketchSm"
        >
          <div className="flex items-start gap-3">
            <div className="text-3xl shrink-0 mt-0.5">{c.emoji}</div>
            <div>
              <div className="font-display text-xl text-ink leading-tight mb-1">
                {c.title}
              </div>
              <div className="font-body text-sm text-ink/80 leading-relaxed">
                {c.body}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export function DebateCards() {
  return (
    <div className="space-y-8 my-8">
      <div>
        <div className="font-display text-3xl text-teal mb-3 flex items-center gap-3">
          <span className="inline-block w-8 h-8 rounded-full border-[2.5px] border-teal bg-teal/20 text-center text-xl leading-7">
            +
          </span>
          the case for JEPA (LeCun's pitch)
        </div>
        <CardGrid cards={PRO} />
      </div>

      <div>
        <div className="font-display text-3xl text-coral mb-3 flex items-center gap-3">
          <span className="inline-block w-8 h-8 rounded-full border-[2.5px] border-coral bg-coral/20 text-center text-xl leading-7">
            −
          </span>
          the counter (the LLM camp's reply)
        </div>
        <CardGrid cards={CON} />
      </div>

      <div>
        <div className="font-display text-3xl text-mustard mb-3 flex items-center gap-3">
          <span className="inline-block w-8 h-8 rounded-full border-[2.5px] border-mustard bg-mustard/20 text-center text-xl leading-7">
            ?
          </span>
          the honest take
        </div>
        <CardGrid cards={HONEST} />
      </div>
    </div>
  )
}
