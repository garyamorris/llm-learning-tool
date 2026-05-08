import { motion } from 'framer-motion'

type Card = {
  emoji: string
  title: string
  body: string
}

const SURE: Card[] = [
  {
    emoji: '🔮',
    title: 'It\'s a next-token predictor.',
    body: 'Underneath every chatbot, no matter how clever it seems, is the loop from chapter 1: pick the most likely next token, append, repeat.',
  },
  {
    emoji: '🧠',
    title: 'No memory between sessions.',
    body: 'Unless a tool deliberately saves it, nothing you said in a previous chat is in the model when you start a new one. It "knows" you only via what fits in the current context window.',
  },
  {
    emoji: '🪞',
    title: 'It has no inner experience that anyone has detected.',
    body: 'No feelings, no goals, no continuous self. Today\'s models are not conscious agents — they\'re statistical engines. Treating them as such is a category error, even when their fluency makes it tempting.',
  },
  {
    emoji: '🧮',
    title: 'It\'s not reliably truthful.',
    body: 'There is no fact-checker module. "Plausible" and "true" feel identical from inside the model. Always verify when it matters.',
  },
]

const UNCERTAIN: Card[] = [
  {
    emoji: '✨',
    title: 'Where capability comes from at scale.',
    body: 'Bigger models suddenly do things smaller ones can\'t. Researchers debate whether these are genuine new abilities or measurement artifacts. Nobody fully understands why pile-of-text + scale = "can write working code."',
  },
  {
    emoji: '🎭',
    title: 'How much of "reasoning" is real.',
    body: 'When an LLM thinks step-by-step and gets the right answer, is it reasoning, or pattern-matching to similar problems it saw during training? The honest answer is "we\'re not sure, and it might be both."',
  },
  {
    emoji: '🔒',
    title: 'How to make them reliably safe.',
    body: 'Alignment — keeping a model\'s outputs honest, helpful, and harmless — is an active research area. Current methods (RLHF, constitutional AI, evals) are promising but not bulletproof.',
  },
  {
    emoji: '🌍',
    title: 'How they\'ll change everything around them.',
    body: 'Education, software, customer service, journalism, science — anything that runs on text is being reshaped. The shape of the new equilibrium is genuinely unknown.',
  },
]

const COMING: Card[] = [
  {
    emoji: '🧠',
    title: 'Reasoning models, mainstream.',
    body: 'Models that "think" with internal scratch-pads before answering (like chapter 11, but built-in). They\'re slower and more expensive, but considerably better at hard problems.',
  },
  {
    emoji: '🤖',
    title: 'Long-running agents.',
    body: 'LLMs in loops, allowed to call tools, browse, run code, and pursue multi-step goals over hours or days. Useful — and a frontier where things can go quietly wrong if poorly supervised.',
  },
  {
    emoji: '🎨',
    title: 'Multimodal everywhere.',
    body: 'Models that handle text, images, audio, video, and 3D in one stream. Chapter 14\'s trick, generalized.',
  },
  {
    emoji: '🪶',
    title: 'Smaller, faster, cheaper.',
    body: 'Capable models that fit on your phone, your laptop, your toaster. Not all useful AI needs to be huge.',
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

export function CapstoneCards() {
  return (
    <div className="space-y-8 my-8">
      <div>
        <div className="font-display text-3xl text-sage mb-3 flex items-center gap-3">
          <span className="inline-block w-8 h-8 rounded-full border-[2.5px] border-sage bg-sage/20 text-center text-xl leading-7">
            ✓
          </span>
          things we're sure of
        </div>
        <CardGrid cards={SURE} />
      </div>

      <div>
        <div className="font-display text-3xl text-mustard mb-3 flex items-center gap-3">
          <span className="inline-block w-8 h-8 rounded-full border-[2.5px] border-mustard bg-mustard/20 text-center text-xl leading-7">
            ?
          </span>
          things we're still figuring out
        </div>
        <CardGrid cards={UNCERTAIN} />
      </div>

      <div>
        <div className="font-display text-3xl text-coral mb-3 flex items-center gap-3">
          <span className="inline-block w-8 h-8 rounded-full border-[2.5px] border-coral bg-coral/20 text-center text-xl leading-7">
            →
          </span>
          things to watch
        </div>
        <CardGrid cards={COMING} />
      </div>
    </div>
  )
}
