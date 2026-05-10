import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Model = {
  id: string
  emoji: string
  name: string
  year: string
  tagline: string
  whatItDoes: string[]
  benchmarkLine: string
  bestAt: string
  notQuiteThere: string
}

const MODELS: Model[] = [
  {
    id: 'i-jepa',
    emoji: '🖼',
    name: 'I-JEPA',
    year: '2023',
    tagline: 'the first JEPA that worked on real images at scale',
    whatItDoes: [
      'Takes a single image, masks out one or more big rectangular regions, predicts the masked regions\' embeddings.',
      'Uses a vision transformer (ViT) backbone — same architecture family as image-capable LLMs.',
      'No data augmentation, no contrastive negatives, no pixel reconstruction. Just predict embeddings.',
    ],
    benchmarkLine:
      'Matched or beat the (then) state-of-the-art self-supervised methods on ImageNet linear-probe classification, while using less compute.',
    bestAt: 'Building visual features that are useful for downstream tasks. Linear-probe classification, object detection.',
    notQuiteThere:
      'Doesn\'t generate images. The features it produces are good, but turning those features back into pixels needs a separate decoder.',
  },
  {
    id: 'v-jepa',
    emoji: '🎬',
    name: 'V-JEPA',
    year: '2024',
    tagline: 'the same recipe, applied to video',
    whatItDoes: [
      'Takes short video clips, masks out spatiotemporal regions (a chunk of the picture across several frames), predicts their embeddings.',
      'Learns to represent motion, object permanence, and causality — by being forced to predict what happens next in embedding space.',
      'Trained on millions of hours of public web video. Zero captions or human annotations.',
    ],
    benchmarkLine:
      'Outperformed prior self-supervised video models on action recognition and motion classification benchmarks (Kinetics, SSv2).',
    bestAt: 'Understanding what\'s happening in video. Recognizing actions, tracking objects through time, anticipating short-term motion.',
    notQuiteThere:
      'Long-horizon planning is still hard. The model is good at "what happens in the next second" but doesn\'t reason about minute-scale futures yet.',
  },
  {
    id: 'v-jepa-2',
    emoji: '🤖',
    name: 'V-JEPA 2',
    year: '2025',
    tagline: 'V-JEPA, but big and pointed at robots',
    whatItDoes: [
      'A scaled-up V-JEPA trained on over a million hours of video — explicitly designed to learn a useful "world model" for embodied agents.',
      'Includes an action-conditioned predictor: given the current state and an action, predict the next state\'s embedding.',
      'Used as the perception+prediction backbone for robot planning experiments.',
    ],
    benchmarkLine:
      'Demonstrated zero-shot transfer: a V-JEPA 2 trained on video alone could be used for robotic manipulation tasks it never saw during training.',
    bestAt: 'Acting as a world model for planning. Predicting "if I do X, what happens next?" in embedding space.',
    notQuiteThere:
      'Still well behind specialized robotics systems on complex long-horizon tasks. The general-purpose world model is a promising start, not a finished product.',
  },
]

export function ImplementationsTour() {
  const [mid, setMid] = useState(MODELS[0].id)
  const model = MODELS.find((m) => m.id === mid)!

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        a tour of the JEPAs that have actually been built and published. all
        from Meta's FAIR group, where LeCun leads.
      </div>

      {/* model picker */}
      <div className="flex flex-wrap gap-2 mb-4">
        {MODELS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMid(m.id)}
            className={`btn-sketch text-base flex-1 ${
              m.id === mid ? 'bg-mustard/60' : ''
            }`}
          >
            <span className="text-lg mr-1">{m.emoji}</span> {m.name}{' '}
            <span className="text-ink/50 text-xs ml-1">({m.year})</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={model.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <div className="bg-teal/10 border-[2px] border-teal rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{model.emoji}</span>
              <div>
                <div className="font-display text-2xl text-ink">
                  {model.name}{' '}
                  <span className="font-hand text-base text-ink/50">
                    ({model.year})
                  </span>
                </div>
                <div className="font-hand text-teal italic text-base">
                  {model.tagline}
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-cream border-[2px] border-ink/40 rounded-lg p-3 shadow-sketchSm">
              <div className="font-hand text-coral text-base uppercase tracking-wider mb-2">
                ⚙ what it does
              </div>
              <ul className="space-y-2">
                {model.whatItDoes.map((p, i) => (
                  <li
                    key={i}
                    className="font-body text-sm leading-relaxed flex gap-2"
                  >
                    <span className="text-coral shrink-0">✦</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-cream border-[2px] border-ink/40 rounded-lg p-3 shadow-sketchSm">
              <div className="font-hand text-coral text-base uppercase tracking-wider mb-2">
                📊 results
              </div>
              <div className="font-body text-sm leading-relaxed italic mb-3 text-ink/80">
                {model.benchmarkLine}
              </div>
              <div className="font-hand text-sage text-sm mb-1">
                ✓ best at:
              </div>
              <div className="font-body text-sm leading-relaxed mb-3">
                {model.bestAt}
              </div>
              <div className="font-hand text-coral text-sm mb-1">
                ⚠ not quite there:
              </div>
              <div className="font-body text-sm leading-relaxed">
                {model.notQuiteThere}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ the trajectory is clear: from "good image features" → "good video
        understanding" → "useful world model for robots". each generation
        scales up and aims at a more ambitious target.
      </div>
    </div>
  )
}
