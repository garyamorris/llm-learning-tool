import { motion } from 'framer-motion'

type Card = { emoji: string; title: string; body: string }

const FOR: Card[] = [
  {
    emoji: '🎥',
    title: 'Learning from raw observation.',
    body: 'Video, images, audio, sensor streams — anything where the world provides natural data and the right learning signal is "predict the missing part." This is JEPA\'s home turf.',
  },
  {
    emoji: '⏱',
    title: 'Short-horizon prediction.',
    body: 'What happens in the next frame, the next second, the next event. The world model produces useful predictions at these timescales.',
  },
  {
    emoji: '🏗',
    title: 'Perception backbones.',
    body: 'A JEPA-trained encoder is a rich feature extractor. Useful as a frozen backbone for downstream classification, segmentation, retrieval, etc.',
  },
  {
    emoji: '🤖',
    title: 'Sensor-driven robot tasks.',
    body: 'Anything where an agent has cameras and needs to predict "if I do X, what will I see next?" The action-conditioned variant of JEPA is purpose-built for this.',
  },
]

const STRUGGLE: Card[] = [
  {
    emoji: '⏳',
    title: 'Very long horizons.',
    body: 'Predicting an embedding 5 seconds ahead is plausible. 5 minutes ahead is hard. 5 hours ahead is barely tractable. Hierarchical JEPA helps but doesn\'t solve.',
  },
  {
    emoji: '📊',
    title: 'Rare or out-of-distribution events.',
    body: 'JEPAs learn the regularities of their training data. When something genuinely novel happens — never seen in any training video — predictions degrade. This is true of all current ML, but JEPA isn\'t a special exception.',
  },
  {
    emoji: '🧪',
    title: 'Causal vs correlational reasoning.',
    body: 'A JEPA trained on observation alone learns what tends to happen together. Distinguishing "this causes that" from "these tend to co-occur" requires intervention data — the agent has to actually try things. Pure observation has a ceiling.',
  },
  {
    emoji: '🤔',
    title: 'Knowing when it doesn\'t know.',
    body: 'Calibrated uncertainty — "I\'m 70% sure of this prediction, 20% sure of that one" — is hard in JEPA-style models. Current versions don\'t naturally tell you when they\'re extrapolating.',
  },
]

const NOT_TRYING: Card[] = [
  {
    emoji: '🔣',
    title: 'Symbolic & abstract reasoning.',
    body: 'Algebra, logic puzzles, formal proof, abstract math — none of this lives naturally in embedding-space prediction. JEPA isn\'t aimed at it. LLMs (and dedicated symbolic systems) do this better.',
  },
  {
    emoji: '📚',
    title: 'Encyclopedic knowledge.',
    body: 'LLMs memorize enormous amounts of factual content from their training corpus. JEPAs don\'t — they learn structure, not facts. "When was Napoleon born?" isn\'t a JEPA question.',
  },
  {
    emoji: '🗣',
    title: 'Producing language.',
    body: 'A JEPA doesn\'t generate text. It builds representations. To get a sentence out, you need a separate decoder (an LLM, typically). This is the natural place for hybrid systems (chapter 9).',
  },
  {
    emoji: '🎓',
    title: 'Following nuanced human instructions.',
    body: 'Instruction-following — "be helpful, be honest, here are 47 rules" — is fundamentally an LLM-shaped problem. JEPA has no mechanism for it because it has no language interface.',
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

export function LimitsCards() {
  return (
    <div className="space-y-8 my-8">
      <div>
        <div className="font-display text-3xl text-sage mb-3 flex items-center gap-3">
          <span className="inline-block w-8 h-8 rounded-full border-[2.5px] border-sage bg-sage/20 text-center text-xl leading-7">
            ✓
          </span>
          what JEPA is designed for
        </div>
        <CardGrid cards={FOR} />
      </div>

      <div>
        <div className="font-display text-3xl text-mustard mb-3 flex items-center gap-3">
          <span className="inline-block w-8 h-8 rounded-full border-[2.5px] border-mustard bg-mustard/20 text-center text-xl leading-7">
            ⚠
          </span>
          where it currently struggles
        </div>
        <CardGrid cards={STRUGGLE} />
      </div>

      <div>
        <div className="font-display text-3xl text-coral mb-3 flex items-center gap-3">
          <span className="inline-block w-8 h-8 rounded-full border-[2.5px] border-coral bg-coral/20 text-center text-xl leading-7">
            🚫
          </span>
          things it doesn't even try to solve
        </div>
        <CardGrid cards={NOT_TRYING} />
      </div>
    </div>
  )
}
