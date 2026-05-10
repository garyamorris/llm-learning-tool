import { motion } from 'framer-motion'

type Parallel = {
  emoji: string
  brainName: string
  brainYear: string
  brainBody: string
  jepaEcho: string
}

const PARALLELS: Parallel[] = [
  {
    emoji: '🧠',
    brainName: 'Predictive coding',
    brainYear: 'since the 1990s',
    brainBody:
      'The brain is constantly generating predictions about what its sensory inputs will be next. Each layer of cortex tries to predict what the layer below it is doing, and only sends "prediction errors" up the hierarchy. Most of what flows up your visual system isn\'t "what you\'re seeing" — it\'s "what surprised the predictor."',
    jepaEcho:
      'This is essentially the JEPA training signal, named differently. The predictor predicts the target embedding; the loss is how surprised it is. Hierarchical predictive coding in neuroscience is a direct intellectual ancestor of H-JEPA (chapter 11).',
  },
  {
    emoji: '⚡',
    brainName: 'Free energy principle',
    brainYear: 'Karl Friston, 2006–present',
    brainBody:
      'A bold theory: every living thing is in the business of minimizing "free energy" — roughly, the gap between its model of the world and what it actually observes. Perception minimizes the gap by updating the model. Action minimizes the gap by changing the world to match the prediction.',
    jepaEcho:
      'JEPA does the perception half explicitly: shrink the gap between predicted and actual embeddings. Action-conditioned JEPA (chapter 12) starts to do the action half too. Friston-style theories of life-as-prediction give JEPA philosophical air cover.',
  },
  {
    emoji: '💊',
    brainName: 'Dopamine as prediction error',
    brainYear: 'since the 1990s',
    brainBody:
      'Dopamine in the brain — the "reward chemical" of popular culture — doesn\'t actually fire when good things happen. It fires when good things happen <em>that the brain didn\'t expect</em>. It\'s a prediction error signal. Reward learning in the brain is, mechanically, almost identical to gradient descent on a value function.',
    jepaEcho:
      'Not strictly JEPA-shaped, but the same family of ideas: learning happens at the moment of surprise. JEPA generalizes "surprise" beyond reward — predicted embedding doesn\'t match target embedding → learn from the difference.',
  },
  {
    emoji: '👶',
    brainName: 'Infant intuitive physics',
    brainYear: 'developmental psychology, 1980s–present',
    brainBody:
      'Babies as young as a few months old show "surprise" (longer looking time) when objects violate physical laws — when a ball appears to pass through a wall, or a tower remains standing without support. They learn the regularities of the physical world by watching, without instruction, and detect violations of their model.',
    jepaEcho:
      'This is exactly what V-JEPA is trying to do, at much larger scale and on more abstract regularities. Learn the rules of the world by watching what happens and noticing what surprises. LeCun frequently invokes infant cognition as motivation.',
  },
]

export function BrainEchoes() {
  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-4">
        JEPA didn't fall from the sky. it has clear intellectual ancestors in
        how neuroscientists and cognitive scientists have been describing
        brains for decades:
      </div>

      <div className="space-y-4">
        {PARALLELS.map((p, i) => (
          <motion.div
            key={p.brainName}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="bg-cream border-[2px] border-ink rounded-lg p-4 shadow-sketchSm"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="text-4xl shrink-0">{p.emoji}</div>
              <div>
                <div className="font-display text-2xl text-ink leading-tight">
                  {p.brainName}
                </div>
                <div className="font-hand text-ink/50 text-sm">
                  {p.brainYear}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-lavender/15 border-[1.5px] border-lavender rounded-lg p-3">
                <div className="font-hand text-lavender text-xs uppercase tracking-wider mb-1">
                  🧠 in the brain
                </div>
                <div
                  className="font-body text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: p.brainBody }}
                />
              </div>
              <div className="bg-teal/15 border-[1.5px] border-teal rounded-lg p-3">
                <div className="font-hand text-teal text-xs uppercase tracking-wider mb-1">
                  🔮 in JEPA
                </div>
                <div className="font-body text-sm leading-relaxed">
                  {p.jepaEcho}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ none of this proves JEPA is "how the brain works." brains do many
        things JEPAs don't, and almost certainly the reverse is true too. but
        the family resemblance is strong, and LeCun makes the parallels
        explicitly when pitching the framework.
      </div>
    </div>
  )
}
