import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Tiny grid-world planning demo. The "robot" stands at one cell and the
// goal is at another. Three candidate plans are pre-authored. A JEPA-style
// world model "imagines" the embedding of each plan's end state, evaluates
// it, and picks the best plan to execute.

const COLS = 7
const ROWS = 5
const CELL = 44 // pixels

type Cell = { c: number; r: number }
type Plan = {
  id: string
  label: string
  path: Cell[] // including start and end
  collisions: number
  score: number // 0..10
  comment: string
}

type Scenario = {
  id: string
  label: string
  walls: Cell[]
  robotStart: Cell
  goal: Cell
  plans: Plan[]
}

const SCENARIOS: Scenario[] = [
  {
    id: 'walls',
    label: 'wall avoidance',
    walls: [
      { c: 3, r: 3 },
      { c: 4, r: 3 },
    ],
    robotStart: { c: 1, r: 1 },
    goal: { c: 5, r: 4 },
    plans: [
      {
        id: 'a',
        label: 'top loop',
        path: [
          { c: 1, r: 1 },
          { c: 2, r: 1 },
          { c: 3, r: 1 },
          { c: 4, r: 1 },
          { c: 5, r: 1 },
          { c: 5, r: 2 },
          { c: 5, r: 3 },
          { c: 5, r: 4 },
        ],
        collisions: 0,
        score: 9,
        comment: 'reaches the goal, no collisions, 7 steps.',
      },
      {
        id: 'b',
        label: 'bottom loop',
        path: [
          { c: 1, r: 1 },
          { c: 0, r: 1 },
          { c: 0, r: 2 },
          { c: 0, r: 3 },
          { c: 0, r: 4 },
          { c: 1, r: 4 },
          { c: 2, r: 4 },
          { c: 3, r: 4 },
          { c: 4, r: 4 },
          { c: 5, r: 4 },
        ],
        collisions: 0,
        score: 6,
        comment: 'reaches the goal but 9 steps — longer than needed.',
      },
      {
        id: 'c',
        label: 'straight through',
        path: [
          { c: 1, r: 1 },
          { c: 2, r: 1 },
          { c: 2, r: 2 },
          { c: 3, r: 2 },
          { c: 4, r: 2 },
          { c: 4, r: 3 },
          { c: 5, r: 3 },
          { c: 5, r: 4 },
        ],
        collisions: 1,
        score: 2,
        comment: 'tries to plow through wall at (4,3). would crash.',
      },
    ],
  },
  {
    id: 'maze',
    label: 'tighter maze',
    walls: [
      { c: 2, r: 1 },
      { c: 2, r: 2 },
      { c: 4, r: 2 },
      { c: 4, r: 3 },
    ],
    robotStart: { c: 0, r: 2 },
    goal: { c: 6, r: 2 },
    plans: [
      {
        id: 'a',
        label: 'over the top',
        path: [
          { c: 0, r: 2 },
          { c: 0, r: 1 },
          { c: 0, r: 0 },
          { c: 1, r: 0 },
          { c: 2, r: 0 },
          { c: 3, r: 0 },
          { c: 4, r: 0 },
          { c: 5, r: 0 },
          { c: 6, r: 0 },
          { c: 6, r: 1 },
          { c: 6, r: 2 },
        ],
        collisions: 0,
        score: 7,
        comment: 'reaches the goal via the top edge. 10 steps — safe but long.',
      },
      {
        id: 'b',
        label: 'middle zigzag',
        path: [
          { c: 0, r: 2 },
          { c: 1, r: 2 },
          { c: 1, r: 3 },
          { c: 2, r: 3 },
          { c: 3, r: 3 },
          { c: 3, r: 2 },
          { c: 3, r: 1 },
          { c: 4, r: 1 },
          { c: 5, r: 1 },
          { c: 5, r: 2 },
          { c: 6, r: 2 },
        ],
        collisions: 0,
        score: 8,
        comment: 'threads between the walls. 10 steps, no collisions.',
      },
      {
        id: 'c',
        label: 'straight east',
        path: [
          { c: 0, r: 2 },
          { c: 1, r: 2 },
          { c: 2, r: 2 },
          { c: 3, r: 2 },
          { c: 4, r: 2 },
          { c: 5, r: 2 },
          { c: 6, r: 2 },
        ],
        collisions: 2,
        score: 1,
        comment: 'tries to go straight through two walls. catastrophic.',
      },
    ],
  },
]

type Stage = 'idle' | 'imagine' | 'evaluate' | 'execute' | 'done'

const PLAN_COLORS = [
  { stroke: '#3d8b8b', fill: 'rgba(61,139,139,0.18)', text: 'text-teal', name: 'teal' },
  { stroke: '#9a8cc7', fill: 'rgba(154,140,199,0.18)', text: 'text-lavender', name: 'lavender' },
  { stroke: '#e8694e', fill: 'rgba(232,105,78,0.18)', text: 'text-coral', name: 'coral' },
]

export function PlanningDemo() {
  const [sid, setSid] = useState(SCENARIOS[0].id)
  const [stage, setStage] = useState<Stage>('idle')
  const [robotStep, setRobotStep] = useState(0)
  const timer = useRef<number | null>(null)

  const scenario = SCENARIOS.find((s) => s.id === sid)!
  const bestPlan = [...scenario.plans].sort((a, b) => b.score - a.score)[0]

  function pickScenario(id: string) {
    setSid(id)
    setStage('idle')
    setRobotStep(0)
  }

  function imagine() {
    setStage('imagine')
  }

  function evaluate() {
    setStage('evaluate')
  }

  function execute() {
    setStage('execute')
    setRobotStep(0)
  }

  function reset() {
    setStage('idle')
    setRobotStep(0)
  }

  // Drive the robot animation during execute.
  useEffect(() => {
    if (stage !== 'execute') {
      if (timer.current) window.clearTimeout(timer.current)
      return
    }
    if (robotStep >= bestPlan.path.length - 1) {
      setStage('done')
      return
    }
    timer.current = window.setTimeout(() => setRobotStep((s) => s + 1), 320)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [stage, robotStep, bestPlan])

  const robotCell =
    stage === 'execute' || stage === 'done'
      ? bestPlan.path[Math.min(robotStep, bestPlan.path.length - 1)]
      : scenario.robotStart

  const w = COLS * CELL
  const h = ROWS * CELL

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

      <div className="bg-paper/60 rounded-lg border-[2px] border-ink/30 p-3 flex justify-center overflow-x-auto">
        <svg
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          className="max-w-full h-auto"
        >
          {/* grid cells */}
          {Array.from({ length: ROWS }).map((_, r) =>
            Array.from({ length: COLS }).map((_, c) => (
              <rect
                key={`${c}-${r}`}
                x={c * CELL}
                y={r * CELL}
                width={CELL}
                height={CELL}
                fill="#fbf6ec"
                stroke="#2b2a26"
                strokeWidth="0.6"
                opacity="0.7"
              />
            )),
          )}

          {/* walls */}
          {scenario.walls.map((w, i) => (
            <g key={`wall-${i}`}>
              <rect
                x={w.c * CELL + 4}
                y={w.r * CELL + 4}
                width={CELL - 8}
                height={CELL - 8}
                rx="4"
                fill="#2b2a26"
                opacity="0.85"
              />
              <text
                x={w.c * CELL + CELL / 2}
                y={w.r * CELL + CELL / 2 + 4}
                textAnchor="middle"
                fontFamily="Patrick Hand"
                fontSize="14"
                fill="#fdfaf3"
              >
                🧱
              </text>
            </g>
          ))}

          {/* goal */}
          <g>
            <circle
              cx={scenario.goal.c * CELL + CELL / 2}
              cy={scenario.goal.r * CELL + CELL / 2}
              r={CELL / 2 - 5}
              fill="#f5c953"
              fillOpacity="0.6"
              stroke="#2b2a26"
              strokeWidth="2"
            />
            <text
              x={scenario.goal.c * CELL + CELL / 2}
              y={scenario.goal.r * CELL + CELL / 2 + 6}
              textAnchor="middle"
              fontFamily="Patrick Hand"
              fontSize="18"
            >
              🍎
            </text>
          </g>

          {/* imagined paths */}
          {(stage === 'imagine' || stage === 'evaluate' || stage === 'execute' || stage === 'done') &&
            scenario.plans.map((p, i) => {
              const color = PLAN_COLORS[i]
              const isBest =
                (stage === 'execute' || stage === 'done') && p.id === bestPlan.id
              const isDimmed =
                (stage === 'execute' || stage === 'done') && p.id !== bestPlan.id
              const pts = p.path
                .map(
                  (cell) =>
                    `${cell.c * CELL + CELL / 2},${cell.r * CELL + CELL / 2}`,
                )
                .join(' ')
              return (
                <motion.polyline
                  key={p.id}
                  points={pts}
                  fill="none"
                  stroke={color.stroke}
                  strokeWidth={isBest ? 4 : 2.5}
                  strokeDasharray={isBest ? undefined : '5 3'}
                  opacity={isDimmed ? 0.15 : 1}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                />
              )
            })}

          {/* robot */}
          <motion.g
            animate={{
              x: robotCell.c * CELL + CELL / 2,
              y: robotCell.r * CELL + CELL / 2,
            }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <circle r={CELL / 2 - 6} fill="#e8694e" stroke="#2b2a26" strokeWidth="2" />
            <text
              textAnchor="middle"
              y={6}
              fontFamily="Patrick Hand"
              fontSize="20"
            >
              🤖
            </text>
          </motion.g>
        </svg>
      </div>

      {/* plan cards (only after imagine) */}
      <AnimatePresence>
        {(stage === 'imagine' ||
          stage === 'evaluate' ||
          stage === 'execute' ||
          stage === 'done') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid md:grid-cols-3 gap-2 mt-3">
              {scenario.plans.map((p, i) => {
                const color = PLAN_COLORS[i]
                const isBest =
                  (stage === 'execute' || stage === 'done') && p.id === bestPlan.id
                const showScore = stage !== 'imagine'
                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-lg border-[2px] bg-cream
                      ${
                        isBest
                          ? 'border-mustard ring-4 ring-mustard/30 shadow-sketchSm'
                          : 'border-ink/40'
                      }`}
                  >
                    <div
                      className={`font-display text-lg ${color.text} flex items-center gap-2`}
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color.stroke }}
                      />
                      plan {p.id.toUpperCase()}: {p.label}
                    </div>
                    {showScore && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2"
                      >
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-hand text-ink/60 text-sm">
                            JEPA score:
                          </span>
                          <span
                            className={`font-display text-2xl ${
                              p.score >= 7
                                ? 'text-sage'
                                : p.score >= 4
                                ? 'text-mustard'
                                : 'text-coral'
                            }`}
                          >
                            {p.score}/10
                          </span>
                        </div>
                        <div className="font-body text-xs text-ink/70 leading-relaxed">
                          {p.comment}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* controls */}
      <div className="flex flex-wrap gap-2 mt-4 justify-end">
        <button
          onClick={reset}
          className="btn-sketch"
          disabled={stage === 'idle'}
        >
          reset
        </button>
        <button
          onClick={imagine}
          className="btn-sketch bg-mustard/60"
          disabled={stage !== 'idle'}
        >
          1. imagine plans
        </button>
        <button
          onClick={evaluate}
          className="btn-sketch bg-mustard/60"
          disabled={stage !== 'imagine'}
        >
          2. evaluate
        </button>
        <button
          onClick={execute}
          className="btn-sketch bg-mustard/60"
          disabled={stage !== 'evaluate'}
        >
          3. execute best
        </button>
      </div>

      <motion.div
        key={stage}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 rounded-lg bg-mustard/20 border-[2px] border-dashed border-mustard"
      >
        <div className="font-hand text-coral text-lg mb-1">
          ✦ what just happened
        </div>
        <div className="font-body text-base leading-relaxed">
          {stage === 'idle' && (
            <>
              The robot wants to reach the 🍎. To plan a route, it{' '}
              <em>imagines</em> several candidate plans, predicts the
              embedding of each plan's end state with its world model, picks
              the most promising one, and acts. Click <strong>imagine</strong>{' '}
              to start.
            </>
          )}
          {stage === 'imagine' && (
            <>
              The robot has imagined three candidate plans (different colored
              dashed paths). It hasn't moved yet — these are{' '}
              <em>simulations inside the world model</em>, running in the
              JEPA's embedding space. Click <strong>evaluate</strong> to
              score them.
            </>
          )}
          {stage === 'evaluate' && (
            <>
              For each plan, the world model predicts what the embedding
              of the final state would look like — and a small scorer head
              estimates how good that is (close to goal? no collisions?).
              Plan{' '}
              <strong className="text-mustard">
                {bestPlan.id.toUpperCase()}
              </strong>{' '}
              wins. Click <strong>execute</strong>.
            </>
          )}
          {(stage === 'execute' || stage === 'done') && (
            <>
              Now the robot actually acts in the world, following the chosen
              plan. The other plans fade — they were only ever simulations.
              This is "model-based planning": think first, act second.
              {stage === 'done' && (
                <span className="block mt-2 font-display text-xl text-sage">
                  ✓ goal reached.
                </span>
              )}
            </>
          )}
        </div>
      </motion.div>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ the dream: a JEPA learned from raw video knows how the world
        evolves, so an agent built on top can plan its actions by{' '}
        <em>imagining</em> outcomes before committing. that's "objective-driven
        AI" in LeCun's framing.
      </div>
    </div>
  )
}
