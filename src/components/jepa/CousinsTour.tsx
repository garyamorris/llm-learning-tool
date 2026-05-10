import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Method = {
  id: string
  name: string
  year: string
  emoji: string
  tagline: string
  howItWorks: string
  vsJepa: string
  shines: string
  scar: string
}

const METHODS: Method[] = [
  {
    id: 'simclr',
    name: 'SimCLR / contrastive',
    year: '2020',
    emoji: '⚖',
    tagline: 'pull augmented views together, push other images apart',
    howItWorks:
      'Take an image, make two different "augmented views" of it (random crop, color shift, etc). Train an encoder so that the two views of the same image produce similar embeddings, but views of <em>different</em> images produce dissimilar ones.',
    vsJepa:
      'Needs explicit negative samples (other images to push away from). JEPA doesn\'t — it relies on the asymmetric-encoder trick instead. Negatives are a hassle: they\'re slow, sometimes ambiguous (what if two "different" images are actually similar?), and require large batch sizes.',
    shines:
      'Conceptually simple. Strong baseline. Easy to understand "why it doesn\'t collapse" — the negatives force diversity.',
    scar: 'Batch-size hungry. Engineering pain. Newer methods mostly drop the negatives.',
  },
  {
    id: 'byol',
    name: 'BYOL',
    year: '2020',
    emoji: '🐉',
    tagline: 'bootstrap your own latent — no negatives needed',
    howItWorks:
      'Two networks: a "student" and a "teacher". Student learns to predict the teacher\'s output for an augmented view of the same image. The teacher\'s weights are an exponentially-moving-average of the student\'s.',
    vsJepa:
      'Very similar to JEPA in structure — asymmetric encoders, slow-moving target, no negatives. JEPA generalizes this idea to "predict embeddings of <em>different parts</em> of the input," not just augmented views of the whole. JEPA is BYOL\'s ambitious cousin.',
    shines: 'Showed for the first time that "no-negatives" self-supervised learning was viable. Lit the path JEPA walks down.',
    scar: 'The "why doesn\'t it collapse?" mystery wasn\'t fully understood for a while. People assumed it needed batch normalization. (It mostly doesn\'t.)',
  },
  {
    id: 'dino',
    name: 'DINO / DINOv2',
    year: '2021 / 2024',
    emoji: '🦖',
    tagline: 'student-teacher self-distillation, that also just... works',
    howItWorks:
      'Same student-teacher EMA setup as BYOL, plus "centering" and "sharpening" on the teacher\'s outputs to prevent collapse. DINOv2 scales this up massively with curated data and lots of compute.',
    vsJepa:
      'DINOv2 is, arguably, the <em>most widely used</em> self-supervised image-backbone today — for things like segmentation, depth estimation, dense feature extraction. JEPA aims for "world model"; DINOv2 aims for "really good features."',
    shines:
      'Excellent downstream features. DINOv2 in particular has become a workhorse — used as a frozen backbone in lots of applications.',
    scar: 'Not really a world model in the JEPA sense. It learns features, not predictions about how the world evolves.',
  },
  {
    id: 'mae',
    name: 'MAE',
    year: '2021',
    emoji: '🧩',
    tagline: 'masked autoencoder — predict the missing pixels',
    howItWorks:
      'Mask out most of an image (75% or more). An encoder sees the visible patches. A decoder tries to reconstruct the missing pixels exactly.',
    vsJepa:
      'The "obvious" approach JEPA explicitly rejects. MAE wastes capacity predicting pixel-perfect detail — the exact RGB value of each blade of grass. JEPA predicts embeddings, which are way coarser and more useful.',
    shines: 'Conceptually elegant. Beautiful visualizations of what the model "reconstructs." Strong on certain transfer tasks.',
    scar: 'For high-dimensional inputs (video especially), all that pixel-prediction capacity is essentially wasted on irrelevant detail. JEPA-style methods consistently outperform on perceptual tasks.',
  },
]

export function CousinsTour() {
  const [mid, setMid] = useState(METHODS[0].id)
  const method = METHODS.find((m) => m.id === mid)!

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        JEPA is part of a broader family of self-supervised methods. here are
        the most important cousins, and what each is doing differently:
      </div>

      {/* method picker */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMid(m.id)}
            className={`btn-sketch text-sm text-center flex flex-col items-center gap-1 py-2 ${
              m.id === mid ? 'bg-mustard/60' : ''
            }`}
          >
            <span className="text-2xl">{m.emoji}</span>
            <span className="text-xs leading-tight">{m.name}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={method.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          <div className="bg-teal/10 border-[2px] border-teal rounded-lg p-3 mb-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{method.emoji}</span>
              <div>
                <div className="font-display text-2xl text-ink">
                  {method.name}{' '}
                  <span className="font-hand text-base text-ink/50">
                    ({method.year})
                  </span>
                </div>
                <div className="font-hand text-teal italic text-base">
                  {method.tagline}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="bg-cream border-[2px] border-ink/40 rounded-lg p-3 shadow-sketchSm">
              <div className="font-hand text-coral text-base uppercase tracking-wider mb-2">
                ⚙ how it works
              </div>
              <div
                className="font-body text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: method.howItWorks }}
              />
            </div>

            <div className="bg-cream border-[2px] border-mustard rounded-lg p-3 shadow-sketchSm">
              <div className="font-hand text-mustard text-base uppercase tracking-wider mb-2">
                ↔ vs JEPA
              </div>
              <div
                className="font-body text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: method.vsJepa }}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-2">
              <div className="bg-cream border-[2px] border-sage rounded-lg p-3 shadow-sketchSm">
                <div className="font-hand text-sage text-sm uppercase tracking-wider mb-1">
                  ✓ what it gets right
                </div>
                <div className="font-body text-sm leading-relaxed">
                  {method.shines}
                </div>
              </div>
              <div className="bg-cream border-[2px] border-coral rounded-lg p-3 shadow-sketchSm">
                <div className="font-hand text-coral text-sm uppercase tracking-wider mb-1">
                  ⚠ its scar
                </div>
                <div className="font-body text-sm leading-relaxed">
                  {method.scar}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ JEPA isn't a lonely outlier — it's the most ambitious member of a
        family that's been steadily figuring out how to train models on raw
        observation. each cousin contributed an idea that JEPA either uses
        or pointedly rejects.
      </div>
    </div>
  )
}
