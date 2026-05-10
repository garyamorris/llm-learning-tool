import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Example = {
  id: string
  category: string
  emoji: string
  task: string
  llmAnswer: string
  llmCritique: string
  worldModelNeed: string
}

const EXAMPLES: Example[] = [
  {
    id: 'physics',
    category: 'physics intuition',
    emoji: '🥃',
    task: 'I balance a coin on top of an empty wine glass on the edge of a table. The cat brushes the table. What happens?',
    llmAnswer:
      'The coin might wobble and fall, depending on how hard the cat brushes the table. The glass could potentially tip over too.',
    llmCritique:
      'Plausible-sounding, but it\'s pattern-matching to "cats knocking things over" stories from the training data. It hasn\'t imagined the actual physics — center of mass, vibration propagation, the cascade.',
    worldModelNeed:
      'A real answer requires simulating: coin\'s mass and balance point, glass\'s stability, how vibration travels through the table, what catches what on the way down. That\'s a mental simulation, not a sentence-completion.',
  },
  {
    id: 'spatial',
    category: 'spatial reasoning',
    emoji: '🗺',
    task: 'You\'re standing in the corner of a kitchen. The fridge is to your left. The sink is across from you. Describe the layout from the perspective of someone who just walked in through the door behind you.',
    llmAnswer:
      'From their perspective, the fridge would be on the right, and the sink would be straight ahead, in front of them.',
    llmCritique:
      'Sometimes gets this right, often gets it wrong — especially with three or four objects. The model doesn\'t maintain a mental 3D space. It re-derives orientation from the text each time, which is brittle.',
    worldModelNeed:
      'A world model would hold an internal layout — actual coordinates for kitchen, sink, fridge, door — and rotate the camera. Transformations on a representation, not transformations on words.',
  },
  {
    id: 'planning',
    category: 'multi-step planning',
    emoji: '🗓',
    task: 'I need to run four errands: gas (closes 9pm), groceries, post office (closes 5pm), pharmacy (anytime). It\'s 4:30pm now. Both pharmacy and groceries are next to the post office. What order?',
    llmAnswer:
      'Start with the post office since it closes soonest, then grab groceries and pharmacy nearby, then gas on the way home.',
    llmCritique:
      'This one\'s OK because the answer is a common template ("hit the closing-soonest place first"). But change the constraints slightly — gas station only takes cash, ATM is at the grocery store — and LLMs frequently produce plans that violate constraints they were told.',
    worldModelNeed:
      'Real planning needs a representation of "states of the world" and "actions that change them" — checking each candidate plan against constraints. LLMs sometimes look like they\'re doing this; mostly they\'re recalling similar plans.',
  },
  {
    id: 'counterfactual',
    category: 'counterfactual thinking',
    emoji: '🌐',
    task: 'If Earth\'s gravity were 80% of what it is, how would basketball change?',
    llmAnswer:
      'Players would jump higher, dunk more easily. The ball would travel further with the same effort. Games might be faster-paced.',
    llmCritique:
      'Lots of plausible bullet points, all recombinations of "gravity = jumping" associations from training. But the model isn\'t actually working out the physics — it\'s producing the kind of bullet points a sports article on this topic would produce.',
    worldModelNeed:
      'Counterfactuals require running a model of "what if X were different?" — playing forward an altered version of the world and seeing what changes. That\'s a simulation, not a text continuation.',
  },
]

export function WorldModelGap() {
  const [activeId, setActiveId] = useState(EXAMPLES[0].id)
  const [revealed, setRevealed] = useState<'llm' | 'need' | null>(null)
  const example = EXAMPLES.find((e) => e.id === activeId)!

  function pick(id: string) {
    setActiveId(id)
    setRevealed(null)
  }

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      {/* category picker */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <span className="font-hand text-ink/70 text-base mr-1">try:</span>
        {EXAMPLES.map((e) => (
          <button
            key={e.id}
            onClick={() => pick(e.id)}
            className={`pill-sketch text-sm transition ${
              e.id === activeId
                ? 'bg-mustard/40 shadow-sketchSm'
                : 'hover:bg-paper'
            }`}
          >
            <span className="mr-1">{e.emoji}</span>
            {e.category}
          </button>
        ))}
      </div>

      {/* the task */}
      <div className="mb-4">
        <div className="font-hand text-ink/60 text-sm mb-1">the question:</div>
        <div className="bg-coral/15 border-[2px] border-coral rounded-lg p-3 font-body text-base md:text-lg leading-relaxed">
          {example.task}
        </div>
      </div>

      {/* reveal toggles */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setRevealed('llm')}
          className={`btn-sketch flex-1 text-sm ${
            revealed === 'llm' ? 'bg-mustard/60' : ''
          }`}
        >
          🤖 what an LLM says
        </button>
        <button
          onClick={() => setRevealed('need')}
          className={`btn-sketch flex-1 text-sm ${
            revealed === 'need' ? 'bg-mustard/60' : ''
          }`}
        >
          🔮 what we actually need
        </button>
      </div>

      <AnimatePresence mode="wait">
        {revealed === 'llm' && (
          <motion.div
            key={`llm-${example.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-lg p-4 border-[2px] bg-paper/60 border-ink/40 mb-3"
          >
            <div className="font-hand text-ink/60 text-xs uppercase tracking-wider mb-2">
              LLM-style answer
            </div>
            <div className="font-body text-base leading-relaxed italic mb-3">
              "{example.llmAnswer}"
            </div>
            <div className="font-hand text-coral text-sm mb-1">
              ✦ the catch
            </div>
            <div className="font-body text-sm text-ink/80 leading-relaxed">
              {example.llmCritique}
            </div>
          </motion.div>
        )}

        {revealed === 'need' && (
          <motion.div
            key={`need-${example.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-lg p-4 border-[2px] bg-teal/10 border-teal mb-3"
          >
            <div className="font-hand text-ink/60 text-xs uppercase tracking-wider mb-2">
              what a world model would do
            </div>
            <div className="font-body text-base leading-relaxed">
              {example.worldModelNeed}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-2 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ this gap — between "plausible-sounding text" and "actual
        understanding of how the world works" — is what JEPA is trying to
        close.
      </div>
    </div>
  )
}
