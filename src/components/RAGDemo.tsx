import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Scenario = {
  id: string
  label: string
  question: string
  // The "retrieved" document chunk — pasted into the context window when on.
  doc: { source: string; text: string }
  // What the model says without the retrieved doc.
  withoutDoc: string
  withoutDocLabel: string // "made up" / "outdated" / etc.
  // What the model says with the retrieved doc.
  withDoc: string
}

const SCENARIOS: Scenario[] = [
  {
    id: 'policy',
    label: 'a return policy',
    question:
      'What\'s the return policy for laptops at TechStore?',
    doc: {
      source: 'TechStore Help Center → Returns & Refunds',
      text: 'Laptops may be returned within 14 days of delivery if unopened. Once opened, returns are accepted within 7 days only if the device is in its original packaging and shows no signs of use. A 15% restocking fee applies to all opened-laptop returns.',
    },
    withoutDoc:
      'TechStore offers a 30-day return policy for laptops. You can return your laptop within 30 days of purchase for a full refund, as long as it\'s in its original packaging.',
    withoutDocLabel: 'made up',
    withDoc:
      'According to the TechStore Help Center: laptops have a 14-day return window if unopened. Once opened, returns are accepted within 7 days, in original packaging, with a 15% restocking fee.',
  },
  {
    id: 'recent',
    label: 'a recent event',
    question:
      'Who won the Tour de France in 2024?',
    doc: {
      source: 'sports.example.com — "Tour de France 2024 results"',
      text: 'Tadej Pogačar (UAE Team Emirates) won the 2024 Tour de France, his third overall victory. The Slovenian rider finished 6\'17" ahead of Jonas Vingegaard.',
    },
    withoutDoc:
      'I\'m not certain about the most recent Tour de France results — my training data has a cutoff date. The 2023 winner was Jonas Vingegaard. For the 2024 results I\'d recommend checking a current sports site.',
    withoutDocLabel: 'doesn\'t know',
    withDoc:
      'Tadej Pogačar won the 2024 Tour de France — his third overall victory, finishing 6 minutes 17 seconds ahead of Jonas Vingegaard.',
  },
  {
    id: 'internal',
    label: 'an internal-only fact',
    question:
      'How do I expense lunch with a client at Acme Corp?',
    doc: {
      source: 'Acme Internal Wiki → Expense Policy v3.4',
      text: 'Client meals are reimbursable up to $75/person. Submit via the "Client Hospitality" category in Concur within 30 days. Itemized receipts are required for any expense over $25. Alcohol must be reported separately.',
    },
    withoutDoc:
      'Most companies have an expense reimbursement system. You\'ll typically need to: keep your itemized receipt, log the expense in your company\'s expense tool (often Expensify, Concur, or similar), include the client name and business purpose, and submit within a deadline.',
    withoutDocLabel: 'generic',
    withDoc:
      'Per Acme\'s Expense Policy v3.4: client meals are reimbursable up to $75/person. Submit it via the "Client Hospitality" category in Concur within 30 days. You\'ll need an itemized receipt for anything over $25, and alcohol gets reported separately.',
  },
]

export function RAGDemo() {
  const [sid, setSid] = useState(SCENARIOS[0].id)
  const [retrieve, setRetrieve] = useState(false)
  const scenario = SCENARIOS.find((s) => s.id === sid)!

  function pickScenario(id: string) {
    setSid(id)
    setRetrieve(false)
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

      {/* retrieval toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setRetrieve(false)}
          className={`btn-sketch flex-1 text-sm ${!retrieve ? 'bg-mustard/60' : ''}`}
        >
          🤷 no retrieval
        </button>
        <button
          onClick={() => setRetrieve(true)}
          className={`btn-sketch flex-1 text-sm ${retrieve ? 'bg-mustard/60' : ''}`}
        >
          📚 with retrieval
        </button>
      </div>

      {/* "context window" view */}
      <div className="bg-paper/60 rounded-lg p-3 border-[2px] border-ink/30 mb-3">
        <div className="font-hand text-ink/60 text-xs uppercase tracking-wider mb-2">
          what the model sees in its context window:
        </div>

        {/* retrieved doc (only when retrieval on) */}
        <AnimatePresence>
          {retrieve && (
            <motion.div
              key={`doc-${sid}`}
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-3"
            >
              <div className="bg-sage/15 border-[2px] border-sage rounded-lg p-3">
                <div className="font-hand text-xs text-ink/60 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span>📄 retrieved snippet</span>
                  <span className="text-ink/40 normal-case">·</span>
                  <span className="italic normal-case text-ink/50">
                    {scenario.doc.source}
                  </span>
                </div>
                <div className="font-body text-sm leading-relaxed">
                  {scenario.doc.text}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* user question */}
        <div className="bg-coral/15 border-[1.5px] border-coral rounded-lg p-2 font-body text-base">
          <span className="font-hand text-xs text-ink/60 uppercase tracking-wider mr-2">
            you:
          </span>
          {scenario.question}
        </div>
      </div>

      {/* model response */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${sid}-${retrieve}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className={`rounded-lg p-3 border-[2px] mb-3 ${
            retrieve
              ? 'bg-teal/10 border-teal'
              : 'bg-coral/5 border-coral/60 border-dashed'
          }`}
        >
          <div className="font-hand text-ink/60 text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
            <span>🤖 model:</span>
            {!retrieve && (
              <span className="text-coral border border-coral rounded px-1.5 normal-case">
                {scenario.withoutDocLabel}
              </span>
            )}
            {retrieve && (
              <span className="text-sage border border-sage rounded px-1.5 normal-case">
                grounded in source
              </span>
            )}
          </div>
          <div className="font-body text-base leading-relaxed">
            {retrieve ? scenario.withDoc : scenario.withoutDoc}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="p-4 rounded-lg bg-mustard/20 border-[2px] border-dashed border-mustard">
        <div className="font-hand text-coral text-lg mb-1">
          ✦ how this works
        </div>
        <div className="font-body text-base leading-relaxed">
          The model doesn't get magically smarter. The relevant document is
          just <em>copied into its context window</em> before your question.
          Then the next-token machinery has the actual facts to reach for —
          and the answer that "feels plausible" is also the one that's
          actually grounded in the source.
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ this is how every "AI search" tool works (Perplexity, Bing, your
        company's internal chatbot). retrieve relevant chunks first, then ask
        the model. it's called <strong className="text-ink">RAG</strong> —
        retrieval-augmented generation.
      </div>
    </div>
  )
}
