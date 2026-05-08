import { useState } from 'react'
import { motion } from 'framer-motion'

type Msg = { from: 'you' | 'bot'; text: string; tag?: string }

// A simulated chat with key information sprinkled at different distances
// from the end. We tag the messages that contain "facts" the model might
// be asked about later.
const CHAT: Msg[] = [
  { from: 'you', text: 'Hi! I\'m Sarah, nice to meet you.', tag: 'name' },
  { from: 'bot', text: 'Hello Sarah! Lovely to meet you too. How can I help?' },
  { from: 'you', text: 'I\'m allergic to peanuts, so keep that in mind.', tag: 'allergy' },
  { from: 'bot', text: 'Got it — peanut allergy noted. I\'ll avoid those.' },
  { from: 'you', text: 'I\'m planning a dinner party for 8 people on Saturday.' },
  { from: 'bot', text: 'Exciting! What kind of cuisine were you thinking?' },
  { from: 'you', text: 'Mediterranean would be perfect.' },
  { from: 'bot', text: 'Great choice. Hummus, grilled fish, lots of vegetables.' },
  { from: 'you', text: 'My favorite color is teal, by the way.', tag: 'color' },
  { from: 'bot', text: 'Noted! Teal is a beautiful color. Plates? Napkins?' },
  { from: 'you', text: 'Just napkins for now. What appetizers do you suggest?' },
  { from: 'bot', text: 'Bruschetta, stuffed grape leaves, or marinated olives.' },
  { from: 'you', text: 'Olives sound great. Easy to prep ahead?' },
  { from: 'bot', text: 'Yes, marinated olives can be made a day in advance.' },
  { from: 'you', text: 'Perfect. What about the main course?' },
  { from: 'bot', text: 'Grilled sea bass with lemon and herbs is classic.' },
  { from: 'you', text: 'I love sea bass. How long to cook it?' },
  { from: 'bot', text: 'About 4-5 minutes per side, depending on thickness.' },
  { from: 'you', text: 'Alright. What\'s my name again?' },
]

// "Fact" lookup — each tag corresponds to info that lives in a specific
// message index. If that message is in-window, the model can answer.
const FACTS: Record<string, { question: string; answer: string }> = {
  name: { question: 'what\'s my name again?', answer: 'Sarah' },
  allergy: { question: 'what am I allergic to?', answer: 'peanuts' },
  color: { question: 'what\'s my favorite color?', answer: 'teal' },
}

export function ContextWindowDemo() {
  // Window size: how many of the most recent messages the model can see.
  const [windowSize, setWindowSize] = useState(8)
  const total = CHAT.length
  const firstVisible = Math.max(0, total - windowSize)

  // The user's final message asks "what's my name again?". The relevant
  // tag is "name". Determine if that message is in-window.
  const askedTag = 'name'
  const factMsgIdx = CHAT.findIndex((m) => m.tag === askedTag)
  const factInWindow = factMsgIdx >= firstVisible

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        a chat in progress. drag the slider to set how much the model can see.
      </div>

      {/* window size slider */}
      <div className="mb-4 px-1">
        <div className="flex justify-between font-hand text-ink/70 text-base mb-1">
          <span>
            context window:{' '}
            <span className="text-coral font-bold">{windowSize}</span> messages
          </span>
          <span className="text-ink/50">(real LLMs work in tokens, not messages)</span>
        </div>
        <input
          type="range"
          min={2}
          max={total}
          step={1}
          value={windowSize}
          onChange={(e) => setWindowSize(parseInt(e.target.value))}
          className="w-full accent-coral"
        />
      </div>

      {/* the chat */}
      <div className="bg-paper/60 rounded-lg p-3 border-[2px] border-ink/30 max-h-[420px] overflow-y-auto space-y-2 relative">
        {CHAT.map((m, i) => {
          const inWindow = i >= firstVisible
          return (
            <motion.div
              key={i}
              animate={{ opacity: inWindow ? 1 : 0.25 }}
              transition={{ duration: 0.3 }}
              className={`flex ${m.from === 'you' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-3 py-1.5 rounded-lg font-body text-sm md:text-base
                  ${
                    m.from === 'you'
                      ? 'bg-coral/30 border-[1.5px] border-coral'
                      : 'bg-cream border-[1.5px] border-ink/40'
                  }
                  ${!inWindow ? 'grayscale' : ''}
                  ${m.tag ? 'ring-2 ring-mustard/60' : ''}
                  relative`}
              >
                {m.text}
                {m.tag && (
                  <span
                    className="absolute -top-2 -right-2 text-[9px] font-hand
                      bg-mustard text-ink border border-ink rounded-full
                      px-1.5 py-0.5 leading-none"
                  >
                    fact
                  </span>
                )}
              </div>
            </motion.div>
          )
        })}

        {/* visible-window divider */}
        {firstVisible > 0 && (
          <div className="absolute left-0 right-0 pointer-events-none"
            style={{ top: 0, height: `${(firstVisible / total) * 100}%` }}
          >
            <div className="absolute bottom-0 left-2 right-2 border-t-[2px] border-dashed border-ink/40" />
            <div className="absolute bottom-1 left-3 font-hand text-xs text-ink/50 bg-paper/90 px-1">
              ↑ outside the window — the model can't see this
            </div>
          </div>
        )}
      </div>

      {/* model answer */}
      <div className="mt-4 p-4 rounded-lg bg-cream border-[2px] border-ink/40">
        <div className="font-hand text-ink/60 text-sm mb-1">
          the model's answer to "{FACTS[askedTag].question}":
        </div>
        <div className="font-body text-lg">
          {factInWindow ? (
            <span>
              "Your name is{' '}
              <span className="text-coral font-bold">
                {FACTS[askedTag].answer}
              </span>
              ."
            </span>
          ) : (
            <span className="text-ink/70">
              "I'm sorry, I don't think you've told me your name."
            </span>
          )}
        </div>
        <div className="font-hand text-ink/50 text-xs mt-2">
          {factInWindow
            ? '(the "fact" message is inside the window)'
            : '(the message saying "I\'m Sarah" is outside the window — gone, as far as the model is concerned)'}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ this is why long chats start "forgetting" things. the model only ever
        sees a fixed-size slice of the conversation.
      </div>
    </div>
  )
}
