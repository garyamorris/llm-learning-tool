import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Three modes for the same task: LLM-only, JEPA-only, hybrid (both).
// Pre-authored model "outputs" illustrate the strengths and weaknesses of each.

type Mode = 'llm' | 'jepa' | 'hybrid'

type Scenario = {
  id: string
  label: string
  prompt: string
  scene: string // short description of what the robot is "seeing"
  outputs: Record<
    Mode,
    {
      title: string
      response: string
      strengths: string[]
      weaknesses: string[]
    }
  >
}

const SCENARIOS: Scenario[] = [
  {
    id: 'kitchen',
    label: 'robot in a kitchen',
    prompt: 'I asked: "is it safe to grab the coffee mug?"',
    scene: 'a steaming mug sits on the edge of a counter, near a sleeping cat',
    outputs: {
      llm: {
        title: 'LLM only (just language reasoning)',
        response:
          '"Picking up a coffee mug is generally safe. Make sure to grip it firmly by the handle, and watch out for the hot liquid inside. Stay aware of your surroundings."',
        strengths: [
          'Articulate. Knows generic safety considerations.',
          'Can give explanations and step-by-step instructions.',
        ],
        weaknesses: [
          'Doesn\'t actually see the scene. Doesn\'t know about the cat, the counter edge, or the steam.',
          'Its caution is generic, not situational.',
        ],
      },
      jepa: {
        title: 'JEPA only (world-model perception)',
        response:
          '[no words — internal state shifts. its planner notes: mug is on counter edge (~85% confidence), thermal hazard present (steam), small animal in proximity, predicted: small motion of arm near cat could cause cat-startle, may displace mug toward edge]',
        strengths: [
          'Sees the actual hazards: the edge, the steam, the cat.',
          'Can predict short-term physical consequences ("if I move my arm, what happens?").',
        ],
        weaknesses: [
          'Can\'t talk to you. Has rich perceptual state but no language to share it or be asked questions.',
          'Doesn\'t know the social conventions ("safe enough for a human").',
        ],
      },
      hybrid: {
        title: 'Hybrid (JEPA perception + LLM language)',
        response:
          '"Hold on — the mug is right on the counter\'s edge, and your cat is curled up next to it. I\'d move the mug a few inches inward first, away from the cat, before lifting it. The handle\'s facing left."',
        strengths: [
          'Sees the actual scene (JEPA) and articulates it (LLM).',
          'Combines situational awareness with the ability to explain, instruct, or be questioned.',
        ],
        weaknesses: [
          'Two systems to train, glue together, and keep in sync.',
          'Failure modes can compound: misperception → confident wrong words.',
        ],
      },
    },
  },
  {
    id: 'physics',
    label: 'predicting a falling object',
    prompt: 'I asked: "what will happen if I push that book?"',
    scene: 'a book is balanced on the edge of a shelf, with a glass of water on the floor below',
    outputs: {
      llm: {
        title: 'LLM only',
        response:
          '"Pushing a book typically causes it to slide in the direction of the force. If it\'s near the edge, it could fall. Be careful of anything below."',
        strengths: ['Generic physics reasoning is correct.'],
        weaknesses: [
          'Doesn\'t know "below" contains a specific glass of water in a specific position.',
          'Can\'t simulate the trajectory or predict the actual landing point.',
        ],
      },
      jepa: {
        title: 'JEPA only',
        response:
          '[internal prediction: book will rotate forward, leave shelf at t≈0.4s, parabolic descent, predicted impact zone overlaps with target_obj_2 (glass), probability of liquid spill: high]',
        strengths: [
          'Actually simulates the physics: trajectory, impact zone, consequences.',
          'No verbal step required.',
        ],
        weaknesses: [
          'Knows "the glass will get hit" but can\'t explain "you\'ll spill water everywhere" to the human.',
        ],
      },
      hybrid: {
        title: 'Hybrid',
        response:
          '"Don\'t — if you push it from there, it\'ll fall onto the glass of water below. You\'ll either knock the glass over or splash water on everything. Move the glass first, or push the book sideways instead."',
        strengths: [
          'Specific prediction grounded in the actual scene, communicated in actionable language.',
          'Can suggest alternatives because it understands both the world state and the goal.',
        ],
        weaknesses: [
          'Depends on the perceptual model not making a quiet mistake about where the glass is — silent perception bugs become loud language bugs.',
        ],
      },
    },
  },
]

const MODE_STYLES: Record<
  Mode,
  { label: string; emoji: string; cardClass: string; chipClass: string }
> = {
  llm: {
    label: 'LLM only',
    emoji: '🦜',
    cardClass: 'bg-coral/10 border-coral',
    chipClass: 'bg-coral/40 border-coral',
  },
  jepa: {
    label: 'JEPA only',
    emoji: '🔮',
    cardClass: 'bg-teal/10 border-teal',
    chipClass: 'bg-teal/40 border-teal',
  },
  hybrid: {
    label: 'hybrid',
    emoji: '✨',
    cardClass: 'bg-mustard/20 border-mustard',
    chipClass: 'bg-mustard/60 border-mustard',
  },
}

export function HybridDemo() {
  const [sid, setSid] = useState(SCENARIOS[0].id)
  const [mode, setMode] = useState<Mode>('llm')
  const scenario = SCENARIOS.find((s) => s.id === sid)!
  const out = scenario.outputs[mode]

  function pickScenario(id: string) {
    setSid(id)
    setMode('llm')
  }

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      {/* scenario picker */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <span className="font-hand text-ink/70 text-base mr-1">scenario:</span>
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => pickScenario(s.id)}
            className={`pill-sketch text-sm transition ${
              s.id === sid ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* the scene */}
      <div className="mb-4 bg-paper/60 border-[2px] border-ink/30 rounded-lg p-3">
        <div className="font-hand text-ink/60 text-xs uppercase tracking-wider mb-1">
          the situation
        </div>
        <div className="font-body text-base italic text-ink/80 mb-2">
          {scenario.scene}
        </div>
        <div className="font-body text-base">
          <span className="font-hand text-ink/60 text-sm mr-2">your prompt:</span>
          {scenario.prompt}
        </div>
      </div>

      {/* mode toggle */}
      <div className="flex gap-2 mb-4">
        {(['llm', 'jepa', 'hybrid'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`btn-sketch flex-1 text-sm ${
              mode === m ? MODE_STYLES[m].chipClass : ''
            }`}
          >
            <span className="text-lg mr-1">{MODE_STYLES[m].emoji}</span>{' '}
            {MODE_STYLES[m].label}
          </button>
        ))}
      </div>

      {/* output */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${sid}-${mode}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className={`rounded-lg p-4 border-[2px] mb-3 ${MODE_STYLES[mode].cardClass}`}
        >
          <div className="font-hand text-ink/60 text-xs uppercase tracking-wider mb-2">
            {out.title}
          </div>
          <div className="font-body text-base leading-relaxed whitespace-pre-wrap">
            {out.response}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-cream border-[2px] border-sage rounded-lg p-3 shadow-sketchSm">
          <div className="font-hand text-sage text-sm uppercase tracking-wider mb-2">
            ✓ what this gets right
          </div>
          <ul className="space-y-1.5">
            {out.strengths.map((s, i) => (
              <li
                key={i}
                className="font-body text-sm leading-relaxed flex gap-2"
              >
                <span className="text-sage shrink-0">✦</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-cream border-[2px] border-coral rounded-lg p-3 shadow-sketchSm">
          <div className="font-hand text-coral text-sm uppercase tracking-wider mb-2">
            ⚠ what's missing
          </div>
          <ul className="space-y-1.5">
            {out.weaknesses.map((w, i) => (
              <li
                key={i}
                className="font-body text-sm leading-relaxed flex gap-2"
              >
                <span className="text-coral shrink-0">✦</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ neither paradigm alone is the whole answer. LLMs talk well but
        don't see. JEPAs see well but don't talk. <strong>together</strong>:
        a perception module that builds a world model, a language module
        that lets you ask about it and be told.
      </div>
    </div>
  )
}
