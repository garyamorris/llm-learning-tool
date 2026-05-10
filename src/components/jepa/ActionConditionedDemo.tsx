import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Outcome = {
  actionId: string
  label: string
  emoji: string
  predicted: string
  detail: string
  good: boolean // good = useful/safe outcome
}

type Scenario = {
  id: string
  label: string
  startEmoji: string
  startState: string
  actions: Outcome[]
}

const SCENARIOS: Scenario[] = [
  {
    id: 'cup',
    label: 'a teetering cup',
    startEmoji: '☕',
    startState:
      'A full cup of hot coffee sits very close to the edge of a table. Your goal: keep the coffee in the cup.',
    actions: [
      {
        actionId: 'left',
        label: 'nudge it left (away from edge)',
        emoji: '👈',
        predicted: 'cup slides 2cm inward, sits stably in the middle of the table',
        detail: 'safe. the cup is no longer near the edge. coffee stays in.',
        good: true,
      },
      {
        actionId: 'right',
        label: 'nudge it right (toward edge)',
        emoji: '👉',
        predicted: 'cup tips over the edge, coffee spills everywhere on the floor',
        detail: 'bad. the cup falls. coffee is on the floor.',
        good: false,
      },
      {
        actionId: 'lift',
        label: 'lift it straight up',
        emoji: '🖐',
        predicted:
          'cup is held in mid-air, motion-stable, ready to be relocated or sipped',
        detail: 'safe. coffee stays in. requires holding it, but no spill.',
        good: true,
      },
      {
        actionId: 'wait',
        label: 'do nothing',
        emoji: '⏸',
        predicted: 'cup stays in place. world unchanged.',
        detail: 'safe by default. goal preserved at zero cost.',
        good: true,
      },
    ],
  },
  {
    id: 'door',
    label: 'an unfamiliar door',
    startEmoji: '🚪',
    startState:
      'You stand at a closed door. You don\'t know if it pushes or pulls. Your goal: get to the other side.',
    actions: [
      {
        actionId: 'push',
        label: 'push it',
        emoji: '⏩',
        predicted:
          'if it\'s a push door: opens, you walk through. if it\'s a pull door: clunks, doesn\'t move',
        detail: '50/50 outcome. world model isn\'t sure yet.',
        good: true,
      },
      {
        actionId: 'pull',
        label: 'pull it',
        emoji: '⏪',
        predicted:
          'if it\'s a pull door: opens, you walk through. if it\'s a push door: clunks, doesn\'t move',
        detail: '50/50 outcome. same uncertainty.',
        good: true,
      },
      {
        actionId: 'knock',
        label: 'knock',
        emoji: '👊',
        predicted:
          'someone on the other side hears you. they may open the door for you',
        detail:
          'creative move. uses an outside agent. higher confidence the door opens, lower control of when.',
        good: true,
      },
      {
        actionId: 'kick',
        label: 'kick it down',
        emoji: '🦵',
        predicted:
          'door splinters, frame damaged, you walk through but with consequences',
        detail: 'works, but at significant cost. world model flags this as expensive.',
        good: false,
      },
    ],
  },
  {
    id: 'apple',
    label: 'a falling apple',
    startEmoji: '🍎',
    startState:
      'An apple has fallen off a tree and is 1 meter above the ground, falling. Your goal: catch it without bruising.',
    actions: [
      {
        actionId: 'reach',
        label: 'reach out cupped hands underneath',
        emoji: '🤲',
        predicted: 'apple lands softly in palms, no bruising',
        detail: 'optimal. soft catch, no damage.',
        good: true,
      },
      {
        actionId: 'slap',
        label: 'slap it from below',
        emoji: '✋',
        predicted:
          'apple is hit upward, flies in an unpredictable direction, may bruise on second contact',
        detail: 'wrong type of contact. defeats the goal.',
        good: false,
      },
      {
        actionId: 'step',
        label: 'step out of the way',
        emoji: '🚶',
        predicted: 'apple hits the ground, bruises on impact',
        detail: 'goal fails passively. but no other damage.',
        good: false,
      },
      {
        actionId: 'jump',
        label: 'jump up to catch it earlier',
        emoji: '⬆',
        predicted:
          'you reach the apple at higher altitude. less falling distance = softer catch',
        detail: 'creative move. earlier catch = less momentum.',
        good: true,
      },
    ],
  },
]

export function ActionConditionedDemo() {
  const [sid, setSid] = useState(SCENARIOS[0].id)
  const [actionId, setActionId] = useState<string | null>(null)
  const scenario = SCENARIOS.find((s) => s.id === sid)!
  const chosen = scenario.actions.find((a) => a.actionId === actionId)

  function pickScenario(id: string) {
    setSid(id)
    setActionId(null)
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

      {/* current state */}
      <div className="mb-4 bg-paper/60 border-[2px] border-ink/30 rounded-lg p-3 flex items-center gap-3">
        <div className="text-5xl shrink-0">{scenario.startEmoji}</div>
        <div>
          <div className="font-hand text-ink/60 text-xs uppercase tracking-wider mb-0.5">
            current state
          </div>
          <div className="font-body text-base">{scenario.startState}</div>
        </div>
      </div>

      {/* action picker */}
      <div className="font-hand text-ink/70 text-base mb-2">
        pick an action — the world model will predict the next state:
      </div>
      <div className="grid md:grid-cols-2 gap-2 mb-3">
        {scenario.actions.map((a) => (
          <button
            key={a.actionId}
            onClick={() => setActionId(a.actionId)}
            className={`btn-sketch text-left text-sm ${
              actionId === a.actionId ? 'bg-mustard/60' : ''
            }`}
          >
            <span className="text-lg mr-1">{a.emoji}</span> {a.label}
          </button>
        ))}
      </div>

      {/* arrow */}
      {chosen && (
        <div className="text-center font-display text-2xl text-ink/40 mb-2">
          ↓
        </div>
      )}

      {/* predicted next state */}
      <AnimatePresence mode="wait">
        {chosen && (
          <motion.div
            key={`${sid}-${chosen.actionId}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className={`rounded-lg p-4 border-[2px] mb-3 ${
              chosen.good
                ? 'bg-sage/10 border-sage'
                : 'bg-coral/10 border-coral'
            }`}
          >
            <div className="font-hand text-ink/60 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
              <span>predicted next state</span>
              {chosen.good ? (
                <span className="text-sage border border-sage rounded px-1.5 normal-case font-bold">
                  goal preserved
                </span>
              ) : (
                <span className="text-coral border border-coral rounded px-1.5 normal-case font-bold">
                  goal threatened
                </span>
              )}
            </div>
            <div className="font-body text-base leading-relaxed italic mb-2">
              "{chosen.predicted}"
            </div>
            <div className="font-hand text-sm text-ink/70">{chosen.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {!chosen && (
        <div className="rounded-lg p-4 border-[2px] border-dashed border-ink/30 bg-paper/40 text-center font-hand text-ink/50 mb-3">
          pick an action to see the model's prediction.
        </div>
      )}

      <div className="p-4 rounded-lg bg-mustard/20 border-[2px] border-dashed border-mustard">
        <div className="font-hand text-coral text-lg mb-1">
          ✦ what changed
        </div>
        <div className="font-body text-base leading-relaxed">
          The predictor here doesn't just take the current state — it takes{' '}
          <strong>(current state, action)</strong>. Different actions
          produce different predicted next states. With this, an agent can
          score each action's predicted outcome and pick the one that best
          fits its goal. This is the tweak that takes JEPA from "passive
          observer" to "useful for planning."
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ V-JEPA 2 (chapter 7) explicitly trains this kind of
        action-conditioned predictor. it's the bridge from "watching the
        world" to "acting in it."
      </div>
    </div>
  )
}
