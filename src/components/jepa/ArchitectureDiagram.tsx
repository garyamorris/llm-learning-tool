import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Six-step reveal of the JEPA architecture, with a play button to
// auto-animate. The diagram is a single SVG; each step toggles the
// opacity of one or more groups.

const STEPS = [
  {
    label: 'start: an input split into two parts',
    body: 'we take an image (or a sentence) and split it into two regions. one we call the "context" — what the model gets to see. the other we call the "target" — what it has to predict.',
  },
  {
    label: 'context encoder',
    body: 'the context is fed through an encoder network. out the other side comes a vector — a position in meaning-space. this is the "context embedding."',
  },
  {
    label: 'target encoder',
    body: 'the target gets its own encoder (usually with the same architecture). its output is the "target embedding" — where in meaning-space the actual hidden region lives.',
  },
  {
    label: 'predictor',
    body: 'a separate small network — the predictor — looks at the context embedding and tries to guess what the target embedding should be. that guess is the "predicted embedding."',
  },
  {
    label: 'compare',
    body: 'measure the distance between the predicted embedding and the actual target embedding. that distance is the loss. shrink it by adjusting all three networks slightly. repeat trillions of times.',
  },
]

export function ArchitectureDiagram() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (!playing) {
      if (timer.current) window.clearTimeout(timer.current)
      return
    }
    if (step >= STEPS.length - 1) {
      setPlaying(false)
      return
    }
    timer.current = window.setTimeout(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1))
    }, 1600)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [playing, step])

  function play() {
    setStep(0)
    setPlaying(true)
  }
  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
    setPlaying(false)
  }
  function reset() {
    setStep(0)
    setPlaying(false)
  }

  const show = (n: number) => (step >= n ? 1 : 0.15)
  const showStroke = (n: number) => (step >= n ? 1 : 0.15)

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        the JEPA architecture. press play to walk through it:
      </div>

      <div className="bg-paper/60 rounded-lg border-[2px] border-ink/30 p-4">
        <svg viewBox="0 0 700 420" className="w-full h-auto">
          <defs>
            <marker
              id="arr-ink"
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" fill="#2b2a26" />
            </marker>
            <marker
              id="arr-coral"
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" fill="#e8694e" />
            </marker>
          </defs>

          {/* INPUTS */}
          <g style={{ opacity: show(0) }}>
            <rect
              x="40"
              y="30"
              width="200"
              height="80"
              rx="8"
              fill="#fbf6ec"
              stroke="#2b2a26"
              strokeWidth="2.5"
            />
            <text
              x="140"
              y="60"
              textAnchor="middle"
              fontFamily="Patrick Hand"
              fontSize="14"
              fill="#2b2a26"
            >
              CONTEXT
            </text>
            <text
              x="140"
              y="85"
              textAnchor="middle"
              fontFamily="Atkinson Hyperlegible"
              fontSize="14"
              fontWeight="bold"
              fill="#2b2a26"
            >
              "The cat sat
            </text>
            <text
              x="140"
              y="102"
              textAnchor="middle"
              fontFamily="Atkinson Hyperlegible"
              fontSize="14"
              fontWeight="bold"
              fill="#2b2a26"
            >
              on the ___"
            </text>
          </g>

          <g style={{ opacity: show(0) }}>
            <rect
              x="460"
              y="30"
              width="200"
              height="80"
              rx="8"
              fill="#fbf6ec"
              stroke="#2b2a26"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />
            <text
              x="560"
              y="60"
              textAnchor="middle"
              fontFamily="Patrick Hand"
              fontSize="14"
              fill="#2b2a26"
            >
              TARGET (hidden)
            </text>
            <text
              x="560"
              y="85"
              textAnchor="middle"
              fontFamily="Atkinson Hyperlegible"
              fontSize="14"
              fontWeight="bold"
              fill="#e8694e"
            >
              "mat"
            </text>
            <text
              x="560"
              y="102"
              textAnchor="middle"
              fontFamily="Patrick Hand"
              fontSize="12"
              fill="#2b2a26"
              opacity="0.6"
            >
              (model can't see this)
            </text>
          </g>

          {/* ARROW: context → context encoder */}
          <line
            x1="140"
            y1="115"
            x2="140"
            y2="145"
            stroke="#2b2a26"
            strokeWidth="2"
            markerEnd="url(#arr-ink)"
            style={{ opacity: showStroke(1) }}
          />

          {/* ENCODER (context) */}
          <g style={{ opacity: show(1) }}>
            <rect
              x="60"
              y="150"
              width="160"
              height="50"
              rx="8"
              fill="#bee0ec"
              stroke="#2b2a26"
              strokeWidth="2.5"
            />
            <text
              x="140"
              y="172"
              textAnchor="middle"
              fontFamily="Caveat Brush"
              fontSize="20"
              fill="#2b2a26"
            >
              context encoder
            </text>
            <text
              x="140"
              y="190"
              textAnchor="middle"
              fontFamily="Patrick Hand"
              fontSize="11"
              fill="#2b2a26"
              opacity="0.7"
            >
              (neural net)
            </text>
          </g>

          {/* ARROW: context encoder → Ec */}
          <line
            x1="140"
            y1="205"
            x2="140"
            y2="232"
            stroke="#2b2a26"
            strokeWidth="2"
            markerEnd="url(#arr-ink)"
            style={{ opacity: showStroke(1) }}
          />

          {/* Context embedding */}
          <g style={{ opacity: show(1) }}>
            <rect
              x="60"
              y="237"
              width="160"
              height="44"
              rx="8"
              fill="#9a8cc7"
              fillOpacity="0.3"
              stroke="#9a8cc7"
              strokeWidth="2.5"
            />
            <text
              x="140"
              y="258"
              textAnchor="middle"
              fontFamily="Patrick Hand"
              fontSize="13"
              fill="#2b2a26"
            >
              context embedding
            </text>
            <g transform="translate(80, 264)">
              {[0.6, 0.2, 0.9, 0.4, 0.7, 0.5, 0.8].map((v, i) => (
                <circle
                  key={i}
                  cx={i * 17}
                  cy={7}
                  r="3.5"
                  fill="#2b2a26"
                  opacity={0.3 + v * 0.7}
                />
              ))}
            </g>
          </g>

          {/* ARROW: target → target encoder */}
          <line
            x1="560"
            y1="115"
            x2="560"
            y2="145"
            stroke="#2b2a26"
            strokeWidth="2"
            markerEnd="url(#arr-ink)"
            style={{ opacity: showStroke(2) }}
          />

          {/* Target encoder */}
          <g style={{ opacity: show(2) }}>
            <rect
              x="480"
              y="150"
              width="160"
              height="50"
              rx="8"
              fill="#bee0ec"
              stroke="#2b2a26"
              strokeWidth="2.5"
            />
            <text
              x="560"
              y="172"
              textAnchor="middle"
              fontFamily="Caveat Brush"
              fontSize="20"
              fill="#2b2a26"
            >
              target encoder
            </text>
            <text
              x="560"
              y="190"
              textAnchor="middle"
              fontFamily="Patrick Hand"
              fontSize="11"
              fill="#2b2a26"
              opacity="0.7"
            >
              (same architecture)
            </text>
          </g>

          {/* ARROW: target encoder → Et */}
          <line
            x1="560"
            y1="205"
            x2="560"
            y2="232"
            stroke="#2b2a26"
            strokeWidth="2"
            markerEnd="url(#arr-ink)"
            style={{ opacity: showStroke(2) }}
          />

          {/* Target embedding */}
          <g style={{ opacity: show(2) }}>
            <rect
              x="480"
              y="237"
              width="160"
              height="44"
              rx="8"
              fill="#9a8cc7"
              fillOpacity="0.3"
              stroke="#9a8cc7"
              strokeWidth="2.5"
            />
            <text
              x="560"
              y="258"
              textAnchor="middle"
              fontFamily="Patrick Hand"
              fontSize="13"
              fill="#2b2a26"
            >
              target embedding
            </text>
            <g transform="translate(500, 264)">
              {[0.5, 0.3, 0.8, 0.5, 0.7, 0.4, 0.85].map((v, i) => (
                <circle
                  key={i}
                  cx={i * 17}
                  cy={7}
                  r="3.5"
                  fill="#2b2a26"
                  opacity={0.3 + v * 0.7}
                />
              ))}
            </g>
          </g>

          {/* ARROW: Ec → Predictor */}
          <line
            x1="220"
            y1="259"
            x2="290"
            y2="320"
            stroke="#2b2a26"
            strokeWidth="2"
            markerEnd="url(#arr-ink)"
            style={{ opacity: showStroke(3) }}
          />

          {/* Predictor */}
          <g style={{ opacity: show(3) }}>
            <rect
              x="280"
              y="320"
              width="180"
              height="50"
              rx="8"
              fill="#f5c953"
              fillOpacity="0.6"
              stroke="#2b2a26"
              strokeWidth="2.5"
            />
            <text
              x="370"
              y="342"
              textAnchor="middle"
              fontFamily="Caveat Brush"
              fontSize="22"
              fill="#2b2a26"
            >
              predictor
            </text>
            <text
              x="370"
              y="360"
              textAnchor="middle"
              fontFamily="Patrick Hand"
              fontSize="11"
              fill="#2b2a26"
              opacity="0.7"
            >
              (small neural net)
            </text>
          </g>

          {/* ARROW: Predictor → predicted embedding */}
          <line
            x1="460"
            y1="345"
            x2="510"
            y2="305"
            stroke="#2b2a26"
            strokeWidth="2"
            markerEnd="url(#arr-ink)"
            style={{ opacity: showStroke(3) }}
          />

          {/* Predicted embedding (overlaps with target embedding visually) */}
          <g style={{ opacity: show(3) }}>
            <rect
              x="480"
              y="287"
              width="160"
              height="20"
              rx="6"
              fill="#e8694e"
              fillOpacity="0.25"
              stroke="#e8694e"
              strokeWidth="2"
              strokeDasharray="3 2"
            />
            <text
              x="560"
              y="301"
              textAnchor="middle"
              fontFamily="Patrick Hand"
              fontSize="11"
              fill="#e8694e"
              fontWeight="bold"
            >
              ← predicted embedding (model's guess)
            </text>
          </g>

          {/* LOSS / DISTANCE */}
          <motion.g
            initial={false}
            animate={{ opacity: show(4) }}
            transition={{ duration: 0.3 }}
          >
            <line
              x1="430"
              y1="280"
              x2="475"
              y2="245"
              stroke="#e8694e"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />
            <rect
              x="290"
              y="240"
              width="140"
              height="55"
              rx="8"
              fill="#e8694e"
              fillOpacity="0.15"
              stroke="#e8694e"
              strokeWidth="2.5"
              strokeDasharray="5 3"
            />
            <text
              x="360"
              y="262"
              textAnchor="middle"
              fontFamily="Caveat Brush"
              fontSize="20"
              fill="#e8694e"
            >
              compare
            </text>
            <text
              x="360"
              y="282"
              textAnchor="middle"
              fontFamily="Patrick Hand"
              fontSize="12"
              fill="#2b2a26"
            >
              distance = loss
            </text>
          </motion.g>

          {/* Bottom annotation */}
          <motion.g
            initial={false}
            animate={{ opacity: show(4) }}
            transition={{ duration: 0.3 }}
          >
            <text
              x="350"
              y="400"
              textAnchor="middle"
              fontFamily="Patrick Hand"
              fontSize="14"
              fill="#2b2a26"
              opacity="0.7"
            >
              ↑ adjust the three networks to shrink this distance. repeat.
            </text>
          </motion.g>
        </svg>
      </div>

      {/* step explanation */}
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 rounded-lg bg-mustard/20 border-[2px] border-dashed border-mustard"
      >
        <div className="font-hand text-coral text-base uppercase tracking-wider mb-1">
          step {step + 1} of {STEPS.length} · {STEPS[step].label}
        </div>
        <div className="font-body text-base leading-relaxed">
          {STEPS[step].body}
        </div>
      </motion.div>

      {/* controls */}
      <div className="flex gap-2 mt-4 justify-end">
        <button onClick={reset} className="btn-sketch" disabled={step === 0}>
          reset
        </button>
        <button
          onClick={play}
          className="btn-sketch bg-mustard/60"
          disabled={playing}
        >
          ▶ play
        </button>
        <button
          onClick={next}
          className="btn-sketch"
          disabled={step >= STEPS.length - 1}
        >
          next →
        </button>
      </div>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ that's the "Joint-Embedding Predictive Architecture" — JEPA.
        joint-embedding = two encoders into the same space. predictive = a
        predictor maps one embedding to another. architecture = these three
        pieces, end of story.
      </div>
    </div>
  )
}
