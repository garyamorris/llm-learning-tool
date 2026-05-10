import { motion } from 'framer-motion'

type Card = { emoji: string; title: string; body: string }

const OPEN_PROBLEMS: Card[] = [
  {
    emoji: '⏳',
    title: 'Long-horizon prediction.',
    body: 'Current JEPAs are good at "what happens in the next second." Predicting useful embeddings 10 seconds, 1 minute, or 1 hour into the future — at the level where you can plan with them — is still mostly an open research question.',
  },
  {
    emoji: '🏗',
    title: 'Hierarchical world models.',
    body: 'Real reasoning needs to operate at multiple levels at once: pixels, objects, scenes, intentions. LeCun\'s proposed "H-JEPA" stacks JEPAs at different abstraction levels. Demonstrably building one of these is still ahead of us.',
  },
  {
    emoji: '🎯',
    title: 'Defining the right objectives.',
    body: 'For planning to work, the agent needs a scorer that says "this imagined future is good, that one is bad." Designing scoring functions that don\'t collapse into degenerate solutions ("predict nothing") is harder than it sounds.',
  },
  {
    emoji: '🔬',
    title: 'Evaluation is fuzzy.',
    body: 'How do you measure "does this model have a good world model?" Benchmarks exist (Kinetics, SSv2, etc.) but they\'re not great proxies. We need better tests of the things JEPA is supposed to be good at.',
  },
]

const APPLICATIONS: Card[] = [
  {
    emoji: '🤖',
    title: 'Robotics.',
    body: 'The biggest near-term application. A robot needs to predict consequences of actions in the physical world — exactly what a JEPA-style world model is supposed to do. Watch V-JEPA 2 and successors here.',
  },
  {
    emoji: '🎥',
    title: 'Video understanding.',
    body: 'Captioning, search, content moderation, surveillance, sports analysis. Anything where a system needs to know what\'s happening in a video, not just what frames look like. JEPA-style representations are already showing up in this space.',
  },
  {
    emoji: '🚗',
    title: 'Self-driving.',
    body: 'A vehicle that predicts "what will the pedestrian do in the next 2 seconds?" needs something that looks a lot like a JEPA. Several autonomous-driving labs are exploring world-model approaches publicly.',
  },
  {
    emoji: '🎮',
    title: 'Game AI / agents.',
    body: 'Agents that play games, navigate virtual worlds, or run in simulation are natural testbeds for world-model approaches. Easier to evaluate, plentiful training data, well-defined rewards.',
  },
]

const MILESTONES: Card[] = [
  {
    emoji: '📺',
    title: 'A "V-JEPA moment" for video.',
    body: 'A JEPA-style model that becomes the obvious default backbone for video understanding tasks the way CLIP became the default for image-text. We\'re not there yet — but it would be a clear signal.',
  },
  {
    emoji: '🦾',
    title: 'A general-purpose robot that learned from video.',
    body: 'A robot that watched a million hours of humans doing things and can now do household tasks reasonably well, without task-specific training. JEPA-style world models are the most plausible path to this.',
  },
  {
    emoji: '🧩',
    title: 'A truly hybrid system.',
    body: 'A consumer product where a JEPA-style perceptual world model is glued to an LLM, and the combo demonstrably does things neither could alone. Probably comes from one of the big labs in the next 2-3 years.',
  },
  {
    emoji: '🤷',
    title: 'Or none of the above.',
    body: 'It\'s also possible that pure-LLM scaling, plus better training data and longer context, just keeps eating these capabilities. We could end up looking back at JEPA as a beautiful idea whose time hadn\'t quite come — or which got absorbed into something larger.',
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

export function WatchCards() {
  return (
    <div className="space-y-8 my-8">
      <div>
        <div className="font-display text-3xl text-mustard mb-3 flex items-center gap-3">
          <span className="inline-block w-8 h-8 rounded-full border-[2.5px] border-mustard bg-mustard/20 text-center text-xl leading-7">
            ?
          </span>
          open problems
        </div>
        <CardGrid cards={OPEN_PROBLEMS} />
      </div>

      <div>
        <div className="font-display text-3xl text-teal mb-3 flex items-center gap-3">
          <span className="inline-block w-8 h-8 rounded-full border-[2.5px] border-teal bg-teal/20 text-center text-xl leading-7">
            ▸
          </span>
          where it matters most
        </div>
        <CardGrid cards={APPLICATIONS} />
      </div>

      <div>
        <div className="font-display text-3xl text-coral mb-3 flex items-center gap-3">
          <span className="inline-block w-8 h-8 rounded-full border-[2.5px] border-coral bg-coral/20 text-center text-xl leading-7">
            →
          </span>
          milestones worth watching for
        </div>
        <CardGrid cards={MILESTONES} />
      </div>
    </div>
  )
}
