import { useState } from 'react'
import { motion } from 'framer-motion'

// Three abstraction levels of prediction for a single ongoing scenario.
// Each level predicts at its own timescale — picosecond-y motion at the
// bottom, minute-scale plans at the top.

type Scenario = {
  id: string
  label: string
  scene: string
  emoji: string
  // Level descriptions (low → high abstraction).
  levels: {
    name: string
    timescale: string
    prediction: string
    detail: string
    color: string // tailwind color
  }[]
}

const SCENARIOS: Scenario[] = [
  {
    id: 'cooking',
    label: 'cooking dinner',
    scene: 'A person is chopping onions on a kitchen counter.',
    emoji: '🍳',
    levels: [
      {
        name: 'level 1 — pixels & motion',
        timescale: '~30 ms',
        prediction:
          'the knife will continue down, the hand will rock slightly forward, the cutting board will stay still',
        detail:
          'low-level visual prediction. essentially "the next frame of video, in embedding space."',
        color: 'coral',
      },
      {
        name: 'level 2 — events & objects',
        timescale: '~1–10 sec',
        prediction:
          'the onion will be diced into small pieces, then pushed to the side of the board',
        detail:
          'event-level prediction. objects change state, hands grip new things, actions complete.',
        color: 'mustard',
      },
      {
        name: 'level 3 — intentions & plans',
        timescale: '~1–10 min',
        prediction:
          'the onions will go in the pan, then garlic, then meat. dinner will be cooking by 7pm',
        detail:
          'high-level plan prediction. the whole "cooking dinner" arc. spans actions and minutes.',
        color: 'teal',
      },
    ],
  },
  {
    id: 'commute',
    label: 'walking to work',
    scene: 'A person is crossing a busy intersection, halfway across.',
    emoji: '🚶',
    levels: [
      {
        name: 'level 1 — pixels & motion',
        timescale: '~30 ms',
        prediction:
          'foot will continue forward, the bus on the right will roll one tire-width closer',
        detail: 'instant-to-instant visual flow. where is everything in the next blink.',
        color: 'coral',
      },
      {
        name: 'level 2 — events & objects',
        timescale: '~1–10 sec',
        prediction:
          'the person will finish crossing, the walk signal will turn red, the bus will start moving',
        detail:
          'event-level: actions complete, signals change, objects start or stop moving.',
        color: 'mustard',
      },
      {
        name: 'level 3 — intentions & plans',
        timescale: '~1–30 min',
        prediction:
          'arrive at the office building, take the elevator, sit at desk, start the work day',
        detail: 'long-range plan that "crossing the intersection" is a tiny sub-step of.',
        color: 'teal',
      },
    ],
  },
  {
    id: 'game',
    label: 'a tennis rally',
    scene: 'Two players mid-rally, one just hit a forehand crosscourt.',
    emoji: '🎾',
    levels: [
      {
        name: 'level 1 — pixels & motion',
        timescale: '~30 ms',
        prediction: 'the ball will rotate, descend slightly, and continue at ~80 mph',
        detail: 'physics-level frame prediction. ballistic trajectory in embedding space.',
        color: 'coral',
      },
      {
        name: 'level 2 — events & objects',
        timescale: '~1 sec',
        prediction:
          'opponent will sprint to the backhand corner, set up, and return cross-court or down-the-line',
        detail:
          'player-action prediction. anticipates the next stroke, footwork pattern.',
        color: 'mustard',
      },
      {
        name: 'level 3 — intentions & plans',
        timescale: '~1–5 min',
        prediction:
          'the rally will end (winner or error), a new point will start, the set will progress toward 6–4 or 5–7',
        detail: 'point/game/set strategic prediction. spans many shots and minutes.',
        color: 'teal',
      },
    ],
  },
]

const COLOR_MAP: Record<
  string,
  { border: string; bg: string; text: string; chip: string }
> = {
  coral: {
    border: 'border-coral',
    bg: 'bg-coral/10',
    text: 'text-coral',
    chip: 'bg-coral/40 border-coral',
  },
  mustard: {
    border: 'border-mustard',
    bg: 'bg-mustard/10',
    text: 'text-mustard',
    chip: 'bg-mustard/40 border-mustard',
  },
  teal: {
    border: 'border-teal',
    bg: 'bg-teal/10',
    text: 'text-teal',
    chip: 'bg-teal/40 border-teal',
  },
}

export function HierarchicalDemo() {
  const [sid, setSid] = useState(SCENARIOS[0].id)
  const scenario = SCENARIOS.find((s) => s.id === sid)!

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      {/* scenario picker */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <span className="font-hand text-ink/70 text-base mr-1">scenario:</span>
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSid(s.id)}
            className={`pill-sketch text-sm transition ${
              s.id === sid ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
            }`}
          >
            <span className="mr-1">{s.emoji}</span> {s.label}
          </button>
        ))}
      </div>

      {/* the scene */}
      <div className="mb-4 bg-paper/60 border-[2px] border-ink/30 rounded-lg p-3 flex items-center gap-3">
        <div className="text-4xl shrink-0">{scenario.emoji}</div>
        <div>
          <div className="font-hand text-ink/60 text-xs uppercase tracking-wider mb-0.5">
            the moment in question
          </div>
          <div className="font-body text-base italic">{scenario.scene}</div>
        </div>
      </div>

      <div className="font-hand text-ink/70 text-base mb-3">
        what each level of the H-JEPA stack is predicting{' '}
        <em>right now</em>:
      </div>

      <div className="space-y-3 relative">
        {/* connecting line from level 1 (bottom) up to level 3 (top) */}
        <div className="absolute left-6 top-4 bottom-4 w-[2px] bg-ink/15 -z-0" />

        {scenario.levels
          .slice()
          .reverse()
          .map((lv, i) => {
            const c = COLOR_MAP[lv.color]
            return (
              <motion.div
                key={lv.name}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className={`relative ${c.bg} border-[2px] ${c.border} rounded-lg p-4 ml-3`}
              >
                <div
                  className={`absolute -left-6 top-4 w-7 h-7 rounded-full ${c.chip} border-[2.5px] flex items-center justify-center font-display text-lg`}
                >
                  {scenario.levels.length - i}
                </div>
                <div
                  className={`font-display text-xl ${c.text} mb-1 flex items-baseline gap-2`}
                >
                  {lv.name}
                  <span className="font-hand text-xs text-ink/60">
                    timescale {lv.timescale}
                  </span>
                </div>
                <div className="font-body text-base leading-relaxed mb-1">
                  "<em>{lv.prediction}</em>"
                </div>
                <div className="font-hand text-sm text-ink/60">
                  {lv.detail}
                </div>
              </motion.div>
            )
          })}
      </div>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ this is LeCun's proposed{' '}
        <strong className="text-ink">H-JEPA</strong> — hierarchical JEPA.
        each level predicts at its own granularity. summaries flow up; plans
        flow down. it's how minds seem to handle "what's about to happen?"
        across radically different timescales without dropping any of them.
      </div>
    </div>
  )
}
