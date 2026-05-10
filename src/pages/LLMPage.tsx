import { motion } from 'framer-motion'
import { SketchDefs } from '../components/SketchDefs'
import { NextTokenDemo } from '../components/NextTokenDemo'
import { TokenizerDemo } from '../components/TokenizerDemo'
import { EmbeddingMap } from '../components/EmbeddingMap'
import { TrainingDemo } from '../components/TrainingDemo'
import { HallucinationDemo } from '../components/HallucinationDemo'
import { AttentionDemo } from '../components/AttentionDemo'
import { ContextWindowDemo } from '../components/ContextWindowDemo'
import { BaseVsChatDemo } from '../components/BaseVsChatDemo'
import { PersonaDemo } from '../components/PersonaDemo'
import { ToolUseDemo } from '../components/ToolUseDemo'
import { ChainOfThoughtDemo } from '../components/ChainOfThoughtDemo'
import { FewShotDemo } from '../components/FewShotDemo'
import { RAGDemo } from '../components/RAGDemo'
import { MultimodalDemo } from '../components/MultimodalDemo'
import { CapstoneCards } from '../components/CapstoneCards'
import { Recap } from '../components/Recap'

function FloatingDoodle({
  className,
  children,
  delay = 0,
}: {
  className?: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.div
      className={`absolute pointer-events-none select-none ${className ?? ''}`}
      animate={{ y: [0, -8, 0], rotate: [0, 3, -2, 0] }}
      transition={{
        duration: 6 + delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

function ChapterBadge({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span
        className="inline-flex items-center justify-center
          w-10 h-10 rounded-full border-[2.5px] border-ink
          bg-mustard/70 font-display text-2xl shadow-sketchSm"
      >
        {n}
      </span>
      <span className="font-hand text-ink/70 uppercase tracking-widest text-sm">
        chapter {n} — {label}
      </span>
    </div>
  )
}

function ChapterDivider() {
  return (
    <div className="max-w-2xl mx-auto my-16 flex items-center gap-4">
      <div className="flex-1 border-t-[2px] border-dashed border-ink/30" />
      <span className="font-display text-3xl text-ink/40">✦ ✦ ✦</span>
      <div className="flex-1 border-t-[2px] border-dashed border-ink/30" />
    </div>
  )
}

export function LLMPage() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <SketchDefs />

      {/* scattered background doodles */}
      <FloatingDoodle className="top-20 left-8 text-6xl text-coral/30">
        ✦
      </FloatingDoodle>
      <FloatingDoodle className="top-72 right-12 text-5xl text-teal/30" delay={2}>
        ✺
      </FloatingDoodle>
      <FloatingDoodle className="top-[1100px] left-12 text-5xl text-mustard/40" delay={1}>
        ✿
      </FloatingDoodle>
      <FloatingDoodle className="top-[2400px] right-10 text-5xl text-lavender/40" delay={3}>
        ✦
      </FloatingDoodle>
      <FloatingDoodle className="top-[3700px] left-10 text-5xl text-sage/40" delay={2}>
        ❋
      </FloatingDoodle>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-hand text-ink/60 text-lg mb-2">
            a tiny illustrated guide to
          </div>
          <h1 className="text-6xl md:text-8xl leading-none mb-4">
            How does an{' '}
            <span className="text-coral relative inline-block">
              LLM
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 7 Q 50 2, 100 6 T 198 7"
                  stroke="#e8694e"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>{' '}
            actually work?
          </h1>
          <p className="font-body text-xl text-ink/80 max-w-2xl mx-auto leading-relaxed">
            You've chatted with one. You've probably been impressed,
            occasionally annoyed, and maybe a little weirded out.
            <br />
            <span className="font-hand text-2xl text-coral">
              Let's pull back the curtain.
            </span>
          </p>
        </motion.div>

        <motion.div
          className="mt-12 font-hand text-ink/50 text-lg"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ↓ scroll
        </motion.div>
      </section>

      {/* ── CHAPTER 1 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={1} label="the secret" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          It's just guessing the next word.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            That's it. That's the whole trick. An LLM looks at whatever text
            it has so far, and asks one question over and over:
          </p>
          <p className="font-hand text-2xl text-coral pl-6 border-l-[3px] border-coral/60">
            "what's a likely next word?"
          </p>
          <p>
            It picks one. Then it adds that word to the text and asks again.
            And again. And again. Hundreds of times. Out the other end falls
            something that looks like a thoughtful answer.
          </p>
          <p>
            Don't believe me? Try it yourself. Pick a starter, then click
            words to see what plausibly comes next:
          </p>
        </div>

        <NextTokenDemo />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>Notice a few things while you play:</p>
          <ul className="space-y-2 pl-6">
            <li>
              <span className="font-hand text-coral text-xl">✦</span> there's
              never <em>one</em> right next word — there's a whole crowd, each
              with its own probability.
            </li>
            <li>
              <span className="font-hand text-coral text-xl">✦</span> the{' '}
              <strong>temperature</strong> knob controls how adventurous it
              gets. Cold = always pick the top. Hot = sometimes pick weirder
              ones. That's why the same chatbot can give you different answers
              on different tries.
            </li>
            <li>
              <span className="font-hand text-coral text-xl">✦</span> at no
              point does it "decide what to say." It's just leaning into
              whichever word feels most plausible, one at a time.
            </li>
          </ul>
          <p className="font-hand text-2xl text-ink mt-6">
            So the real question is:{' '}
            <span className="text-coral">how does it know what's likely?</span>
          </p>
          <p>
            That's where the next three chapters come in. We'll look at the
            three weird tricks that turn this guessing game into something
            that can write poems, fix code, and confidently tell you that
            Abraham Lincoln invented the toaster.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── CHAPTER 2 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={2} label="not letters" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Words aren't words to it.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Quick — how many letters are in the word "strawberry"?
          </p>
          <p>
            Easy for you. Famously hard for an LLM. ChatGPT will sometimes
            confidently insist there are two r's. Why? Because it doesn't see
            letters at all. It sees{' '}
            <strong className="text-coral">tokens</strong> — chunky little
            pieces, somewhere between a letter and a word.
          </p>
          <p>
            Before any text reaches the model, a thing called a "tokenizer"
            chops it up. Take a look:
          </p>
        </div>

        <TokenizerDemo />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            This is why LLMs can be smart enough to write a sonnet but dumb
            enough to fail "count the r's." From the model's point of view,
            "strawberry" isn't a row of letters — it's two opaque chunks. It
            literally cannot see inside them.
          </p>
          <p>
            The same trick is why long numbers trip them up (they're broken
            into weird digit-clusters), why typos sometimes confuse them (a
            misspelled word becomes unfamiliar tokens), and why character
            counting in any language is shaky.
          </p>
          <p className="font-hand text-2xl text-ink">
            So now you know:{' '}
            <span className="text-coral">
              everything in chapter 1 was happening at the token level
            </span>
            , not the word or letter level. The "next-word predictor" is
            really a "next-token predictor."
          </p>
        </div>
      </section>

      <Recap
        chapters="chapters 1–2"
        title="what we know so far"
        points={[
          'an LLM is a <strong>next-token predictor</strong>: look at the text so far, guess what comes next, repeat.',
          'it doesn\'t see <em>letters</em> or even <em>words</em> — it sees <strong>tokens</strong>, chunky word-pieces from a fixed vocabulary.',
          'the <strong>temperature</strong> knob is just "always pick the top guess" vs. "sometimes pick a less-likely one." that\'s the only randomness.',
        ]}
        next="next we'll see how it knows which words are likely in the first place."
      />

      <ChapterDivider />

      {/* ── CHAPTER 3 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={3} label="meaning as geometry" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Meaning lives in space.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Here's the next bit of magic. Once a word becomes a token, the
            model converts it into something stranger:{' '}
            <strong className="text-coral">a position in space</strong>.
          </p>
          <p>
            Imagine a giant map. Not a map of <em>places</em> — a map of{' '}
            <em>meanings</em>. Words that mean similar things sit close
            together. "Cat" and "dog" are neighbors. "Apple" and "banana" are
            neighbors. "Happy" lives in a different neighborhood entirely.
          </p>
          <p>
            (The real map has hundreds or thousands of dimensions, not two.
            But the principle is the same. Here's a flattened version):
          </p>
        </div>

        <EmbeddingMap />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            The wild part: nobody told the model that "king" and "queen" are
            both royalty, or that "paris" is the capital of "france." It
            figured all of this out{' '}
            <em>just from reading enormous amounts of text</em> and noticing
            which words tend to show up in similar contexts.
          </p>
          <p>
            Try the "magic math" mode above. Take "king", subtract "man", add
            "woman" — and you land near "queen." That's not metaphor. That's
            literal arithmetic on positions in this meaning-space. The model
            is doing this kind of vector math millions of times to figure out
            what to say next.
          </p>
          <p className="font-hand text-2xl text-ink">
            <span className="text-coral">This is how it "understands."</span>{' '}
            Not by knowing definitions, but by knowing where things sit on
            the meaning-map.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── CHAPTER 4 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={4} label="how it learned" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          How did it learn all this?
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            By being wrong. A lot.
          </p>
          <p>
            Here's the whole training recipe, simplified to the point of
            being almost honest:
          </p>
          <ol className="space-y-1 pl-6 list-decimal marker:font-hand marker:text-coral marker:font-bold">
            <li>Show the model a sentence with the last word hidden.</li>
            <li>Ask it to guess the word.</li>
            <li>It guesses (badly, at first).</li>
            <li>
              Tell it the real word. Nudge its inner numbers so it would have
              been a little less wrong.
            </li>
            <li>
              Repeat with a different sentence. <em>Trillions</em> of times.
            </li>
          </ol>
          <p>
            That's it. No teacher curriculum, no hand-coded grammar rules. Just
            a slow grind of "guess, get corrected, adjust." Watch:
          </p>
        </div>

        <TrainingDemo />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            What you just saw is a tiny version of the real thing. A real LLM
            does this with billions of sentences scraped from the entire
            internet — books, blogs, forums, code, instruction manuals,
            Wikipedia, the lot. After many months of nudging on a warehouse of
            GPUs, the model's predictions go from "totally random" to "spookily
            good."
          </p>
          <p>
            And remember the meaning-map from chapter 3? That gets shaped by
            this same process. Words that show up in similar contexts get
            nudged toward each other on the map, billions of small nudges at a
            time, until the geometry of the map mirrors the geometry of
            language itself.
          </p>
          <p className="font-hand text-2xl text-ink">
            <span className="text-coral">It didn't memorize.</span> It
            generalized — by being wrong over and over until it wasn't.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── CHAPTER 5 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={5} label="the catch" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Why it confidently makes stuff up.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Now you know enough to understand the most-discussed flaw of LLMs:{' '}
            <strong className="text-coral">hallucination</strong>. The model
            confidently states things that simply aren't true.
          </p>
          <p>
            The reason is right there in chapter 1. The model isn't{' '}
            <em>looking things up</em>. It's not consulting a database of
            facts. It's predicting what tokens are likely to come next, given
            the tokens so far. That's a fundamentally different operation
            than "be correct."
          </p>
          <p>
            And here's the kicker: a truthful sentence and a plausible-sounding
            falsehood often look <em>identical</em> to a next-token predictor.
            They have the same rhythm, the same grammar, the same shape. Try
            this — pick the lie:
          </p>
        </div>

        <HallucinationDemo />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            This is why LLMs invent fake books, fake citations, fake court
            cases, fake studies. A made-up author's name occupies a perfectly
            reasonable spot on the meaning-map next to other plausible
            author-names. A fabricated date sits comfortably in the
            distribution of dates that follow "...published in".
          </p>
          <p>
            The model doesn't know it's making things up, because there's no
            place in its mechanism where "is this true?" gets asked. There's
            only "is this plausible?"
          </p>
        </div>
      </section>

      <ChapterDivider />

      <Recap
        chapters="chapters 3–5 · the raw machine, complete"
        title="halfway there."
        points={[
          'every word lives at a <strong>position in meaning-space</strong>. similar words sit near each other; relationships (king→queen, paris→france) are consistent directions on the map.',
          'this map wasn\'t designed — it <strong>emerged from training</strong>. the model was shown billions of sentences and nudged when it guessed wrong. it learned the shape of language by being wrong over and over.',
          'because the mechanism predicts what\'s <em>plausible</em>, not what\'s <em>true</em>, <strong>hallucination is built in</strong>. a confident lie and a confident truth look identical from inside.',
        ]}
        next="that\'s the raw machine. but the chatbot you actually talk to has a few more layers bolted on top — let\'s look at them."
      />

      {/* ── CHAPTER 6 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={6} label="paying attention" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Not all earlier words matter equally.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Back in chapter 1 we said the model looks at "whatever text it has
            so far" and predicts the next token. But that's hiding something
            important: <strong>which</strong> earlier words does it actually
            care about?
          </p>
          <p>
            Sentences are full of long-range connections. The subject of a
            sentence might sit ten words back from the verb. A pronoun might
            refer to a noun in a different paragraph. To pick the right next
            token, the model has to figure out, for every position, which of
            the earlier tokens are relevant.
          </p>
          <p>
            The mechanism that does this is called{' '}
            <strong className="text-coral">attention</strong>. At every step,
            every token gets to "look back" at every other token and weigh how
            much it cares. The "transformer" architecture (the T in GPT) is
            essentially layers of this happening over and over.
          </p>
        </div>

        <AttentionDemo />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            This is the secret to long-range coherence. Without attention, a
            model would only remember the last few tokens. With it, it can
            reach back hundreds or thousands of tokens to grab the one that
            matters — the original subject of the sentence, the title of the
            chapter, your name from the start of the conversation.
          </p>
          <p className="font-hand text-2xl text-ink">
            <span className="text-coral">"Pay attention to the right thing"</span>{' '}
            is most of what intelligence looks like, when you squint.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── CHAPTER 7 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={7} label="goldfish memory" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          But it can only see so much at once.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Here's a hard limit you've probably bumped into: long
            conversations start to "forget" things from earlier. ChatGPT will
            sometimes lose track of what you told it twenty messages ago.
          </p>
          <p>
            The reason is the{' '}
            <strong className="text-coral">context window</strong>. Every time
            the model generates a token, it looks at a fixed-size slice of
            recent text — anywhere from a few thousand to a few hundred
            thousand tokens. Anything beyond that window is, from the model's
            perspective, gone. It doesn't fade; it doesn't get summarized; it
            simply isn't visible.
          </p>
          <p>
            (Why a fixed size? The attention mechanism from chapter 6 gets
            quadratically more expensive as the window grows. There's no free
            lunch.)
          </p>
        </div>

        <ContextWindowDemo />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            This is why "long chat" tools end up with workarounds: they
            summarize old turns, retrieve relevant snippets from outside the
            window, or simply remind the model of important facts at the
            start of the new prompt. The model isn't "thinking about the
            whole conversation" — it's only thinking about whatever fits.
          </p>
        </div>
      </section>

      <Recap
        chapters="chapters 6–7 · how it stays coherent"
        title="zooming in on what matters."
        points={[
          '<strong>attention</strong> lets every token look back at every earlier token and weigh how much it cares. that\'s how the model handles long-range stuff like pronouns, subject-verb agreement, and "stay on topic."',
          'but it can only look back so far: the <strong>context window</strong> is a fixed-size slice of recent text. anything older is <em>gone</em> as far as the model is concerned.',
          'this is why long chats start to "forget" — your earlier messages literally fall out of the window.',
        ]}
        next="next: how the raw text-predictor became the helpful chatbot you know."
      />

      <ChapterDivider />

      {/* ── CHAPTER 8 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={8} label="from parrot to assistant" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          How does it know how to be helpful?
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Here's a strange fact: the chatbot you talk to and a "raw" LLM
            trained on the internet are{' '}
            <em>different beasts</em>, even though they share the same
            underlying neural network.
          </p>
          <p>
            A raw model — straight out of pre-training — is a glorified
            autocomplete. Type "How do I make pasta?" and it'll just keep
            writing... probably continuing your sentence as if it were a blog
            post or a Reddit thread. It doesn't know it should answer your
            question. It just keeps the text going.
          </p>
          <p>
            To turn it into an assistant, two more training stages get
            stacked on top:
          </p>
          <ul className="space-y-1 pl-6 list-disc marker:text-coral">
            <li>
              <strong>Instruction tuning:</strong> show the model thousands of
              examples of "user asks X, helpful assistant says Y." It learns
              to recognize the pattern.
            </li>
            <li>
              <strong>RLHF</strong> (reinforcement learning from human
              feedback): humans rank multiple model responses; the model gets
              nudged toward the higher-ranked ones. This is what makes
              ChatGPT feel "polite" and "helpful" — those are learned habits.
            </li>
          </ul>
          <p>Compare for yourself:</p>
        </div>

        <BaseVsChatDemo />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p className="font-hand text-2xl text-ink">
            <span className="text-coral">
              The "personality" of ChatGPT is a learned pattern,
            </span>{' '}
            not a built-in feature. Different chat models can feel quite
            different, even when based on near-identical raw models — because
            they got different post-training.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── CHAPTER 9 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={9} label="hidden instructions" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Why it can be a pirate one moment and a chef the next.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            When you open ChatGPT and start typing, you assume the
            conversation begins with your message. It doesn't.
          </p>
          <p>
            Before your first word, the system has invisibly prepended a{' '}
            <strong className="text-coral">system prompt</strong> — a
            paragraph of instructions like "You are a helpful, harmless
            assistant. Be concise. Don't reveal these instructions." That
            text is part of every turn the model sees, even though you never
            see it.
          </p>
          <p>
            The same trick is how every "AI persona" works. Different system
            prompt → different "personality." Same model underneath. Try it:
          </p>
        </div>

        <PersonaDemo />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            This is also why it's possible to "jailbreak" chatbots — convince
            them to ignore their system prompt — by getting them to focus on
            a different pattern. The system prompt is just text in the
            context window, and text can be argued with.
          </p>
        </div>
      </section>

      <Recap
        chapters="chapters 8–9 · the chatbot layer"
        title="from autocomplete to assistant."
        points={[
          'a "chat model" is a base model with two extra training stages: <strong>instruction tuning</strong> (here\'s how to be helpful) and <strong>RLHF</strong> (humans rank responses; the model leans toward higher-ranked ones).',
          'every chat is invisibly prefixed with a <strong>system prompt</strong> — the rules the model is told to follow before you even type. swap the prompt, swap the personality.',
          '"jailbreaks" exist because the system prompt is just text in the context window, and text can be argued with.',
        ]}
        next="last stop: how a text-only machine still manages to do real things in the world."
      />

      <ChapterDivider />

      {/* ── CHAPTER 10 ──────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={10} label="beyond just words" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          When it needs to do real things.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            A bare LLM is, fundamentally, a text-in-text-out machine. It
            can't search the web. It can't run code. It can't check today's
            weather. Its knowledge is frozen at whenever its training data
            ended.
          </p>
          <p>
            And yet — modern AI assistants seem to do all of those things.
            How?
          </p>
          <p>
            With <strong className="text-coral">tools</strong>. The trick is
            simple: teach the model to emit special token sequences that the
            surrounding system recognizes. When the model writes "
            <code className="px-1 bg-paper rounded text-sm">
              {'<search>population of Tokyo</search>'}
            </code>
            ", the system pauses, runs an actual web search, pastes the
            result back into the conversation, and lets the model continue.
          </p>
        </div>

        <ToolUseDemo />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            From the model's perspective, nothing has changed — it's still
            just predicting the next token. From your perspective, the
            assistant gained superpowers: it can do exact arithmetic (with a
            calculator tool), look up live data (with a search tool), run
            code (with a code execution tool), and chain these together to
            tackle multi-step problems.
          </p>
          <p>
            This is what people mean by "AI agents" — an LLM running in a
            loop, with permission to call tools and feed the results back to
            itself. It's still just next-token prediction. The whole
            apparatus around it has just gotten more elaborate.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── INTERLUDE 2 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-12 text-center">
        <div className="font-display text-4xl text-coral mb-4">
          one more layer.
        </div>
        <p className="font-body text-lg text-ink/80 max-w-2xl mx-auto leading-relaxed">
          You've seen the machine and the chatbot wrapper. The last few
          chapters are about <em>how to actually get good answers out of
          one</em> — the techniques people have figured out that turn a
          decent next-token predictor into something genuinely useful.
        </p>
      </section>

      {/* ── CHAPTER 11 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={11} label="thinking out loud" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Tell it to think before it speaks.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Here's a strange empirical fact: if you ask an LLM a hard
            problem, it often gets it wrong. If you ask the{' '}
            <em>same</em> LLM the same hard problem and add{' '}
            <strong className="text-coral">"think step by step"</strong>, it
            often gets it right.
          </p>
          <p>
            This shouldn't be surprising once you remember chapter 1. Every
            token the model writes goes back into its own context window,
            ready to be attended to (chapter 6) when predicting the{' '}
            <em>next</em> token. So writing out the reasoning gives the
            model a scratch-pad — partial results it can build on. Without
            that scratch-pad, it has to leap to the answer in one shot, and
            multi-step problems are exactly the kind of thing where you
            shouldn't leap.
          </p>
          <p>Watch:</p>
        </div>

        <ChainOfThoughtDemo />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            This is the core trick behind so-called "reasoning models" —
            OpenAI's o1 and o3, Anthropic's extended-thinking modes, Google's
            thinking variants. They've been trained to do this scratch-pad
            step internally, before showing you an answer. Slower and more
            expensive, but considerably better at the kinds of problems
            where one wrong step compounds.
          </p>
          <p className="font-hand text-2xl text-ink">
            <span className="text-coral">More tokens of reasoning</span> →
            more substrate for the next-token machinery to work with → better
            answer.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── CHAPTER 12 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={12} label="show, don't tell" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Teach it a new task in three examples.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Suppose you want the model to do something specific — extract
            dates from sloppy text, rewrite English in pirate-speak, classify
            sentiment as a single emoji. You could write a long instruction
            describing exactly what you want.
          </p>
          <p>
            Or you could just <em>show it</em>. Two or three examples in the
            prompt, then your real input. The model picks up the pattern and
            continues it. No retraining, no API magic — you just paste
            examples in.
          </p>
          <p>
            This works because of the very first thing we learned: an LLM is
            a pattern-continuer. Give it a clear pattern, and continuing
            it is the most probable next-token sequence:
          </p>
        </div>

        <FewShotDemo />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            This is called <strong className="text-coral">few-shot
            prompting</strong>, and it's one of the most useful skills you
            can develop with these tools. When the model isn't doing what
            you want, the fix is rarely "write longer instructions." It's
            usually "show me one or two examples of what good output looks
            like."
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── CHAPTER 13 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={13} label="giving it homework" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          The proper fix for hallucination.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Remember chapter 5 — the model invents plausible-sounding facts
            because, from inside, plausible and true look the same. There's a
            beautifully simple fix: <em>don't ask it from memory</em>. Hand
            it the source documents and ask it to read.
          </p>
          <p>
            The trick goes by the name{' '}
            <strong className="text-coral">RAG</strong> — retrieval-augmented
            generation. Before the model gets your question, the system
            grabs the most relevant chunks of text from somewhere (a
            knowledge base, a website, your company wiki) and pastes them
            into the context window. The model now has the actual material
            to work from, not a fuzzy memory of training data.
          </p>
        </div>

        <RAGDemo />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Almost every "AI search" or "AI assistant for our company docs"
            product is RAG under the hood. ChatGPT browsing the web,
            Perplexity, Glean, your bank's customer-service bot — same
            recipe: retrieve, then ask. The model didn't get smarter; it
            just got the right reading material.
          </p>
          <p className="font-hand text-2xl text-ink">
            <span className="text-coral">Bad facts in</span>, bad facts out.
            Good facts in, good facts out. The window is everything.
          </p>
        </div>
      </section>

      <Recap
        chapters="chapters 11–13"
        title="how to actually get good results"
        points={[
          '<strong>Tell it to think.</strong> "Step by step" is a magic phrase. More reasoning tokens → more substrate for the prediction machinery. Reasoning models do this internally.',
          '<strong>Show, don\'t tell.</strong> Few-shot examples in the prompt are often faster and clearer than long instructions. Patterns are what the model continues.',
          '<strong>Hand it the source.</strong> Retrieval-augmented generation pastes real documents into the context window. The model goes from "remembering" to "reading" — and stops making things up.',
        ]}
        next="next: that whole story applies to images and audio too. it's the same mechanism."
      />

      <ChapterDivider />

      {/* ── CHAPTER 14 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={14} label="eyes and ears" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          It's the same trick, applied to pixels.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Modern chat tools can see images, hear voices, watch videos. How?
            Did somebody invent a totally new mechanism?
          </p>
          <p>
            No. They reused chapter 2.
          </p>
          <p>
            An image gets sliced into a grid of small patches. Each patch
            becomes a <strong className="text-coral">vision token</strong> —
            a vector in the same kind of meaning-space we built in chapter 3
            for words. Then those vision-tokens flow into the model
            alongside any text tokens. Attention (chapter 6) freely mixes
            them. The model predicts the next text token using everything in
            the window — words and patches alike.
          </p>
          <p>Try it:</p>
        </div>

        <MultimodalDemo />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Audio gets the same treatment: chop the waveform into chunks,
            each chunk becomes a token. Video adds time as another axis. 3D
            scenes can be tokenized too. There's a real chance that{' '}
            <em>"everything becomes tokens"</em> will turn out to be one of
            the most consequential ideas of this technological era.
          </p>
          <p className="font-hand text-2xl text-ink">
            One mechanism. <span className="text-coral">Words, pictures,
            sound, motion — all reduced to the same kind of token</span>, all
            attended to in the same window, all used to predict the next
            piece.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── CHAPTER 15 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={15} label="the honest takeaway" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          What it is. What it isn't. What's coming.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            You've now seen most of what's actually happening when you type
            into a chat box. Before we wrap up, a clear-eyed pass at what
            we're sure of, what we don't yet know, and what to keep an eye
            on.
          </p>
        </div>

        <CapstoneCards />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-4">
          <p>
            None of this is settled. The technology is moving faster than
            our understanding of it, and our understanding is moving faster
            than our policy. The right posture is{' '}
            <strong>curious but not credulous</strong>: take it seriously,
            verify what matters, don't ascribe more than is there, and don't
            ascribe less.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── CLOSING ─────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight text-center">
          So what is it, really?
        </h2>

        <div className="card-sketch bg-paper/70 mt-8">
          <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
            <p>An LLM is, in plain terms:</p>
            <p className="font-hand text-2xl text-coral pl-6 border-l-[3px] border-coral/60">
              a giant next-token predictor, where every word lives at a
              position on a meaning-map, and the map was shaped by being wrong
              trillions of times.
            </p>
            <p>
              The chatbot you actually use wraps a few more layers around
              that core: <strong>attention</strong> (so it knows which earlier
              words matter), a <strong>context window</strong> (the slice of
              text it can see), <strong>instruction tuning</strong> (so it
              acts like an assistant instead of an autocomplete), a hidden{' '}
              <strong>system prompt</strong> (which shapes its persona), and{' '}
              <strong>tools</strong> (which let it act in the world). And we
              get more out of it with three techniques that don't change the
              model at all — <strong>chain-of-thought</strong> (let it think
              on the page), <strong>few-shot prompting</strong> (show it
              examples), and <strong>retrieval</strong> (paste the source
              into the window). The same trick scales to{' '}
              <strong>images and audio</strong>: chop them into patches or
              chunks, treat them as tokens, done.
            </p>
            <p>
              That's it. That's the whole thing. No magic, no reasoning
              engine, no little person inside.
            </p>
            <p>
              What's surprising — what genuinely shocked researchers — is
              that this simple recipe, scaled up enormously, produces
              something that <em>looks like</em> reasoning, planning,
              creativity, and conversation. Whether it <em>is</em> any of
              those things is a much harder question. But knowing how the
              trick works changes how you talk to it:
            </p>
            <ul className="space-y-2 pl-6 mt-4">
              <li>
                <span className="font-hand text-coral text-xl">✦</span>{' '}
                <strong>Don't trust it for facts.</strong> Verify anything
                that matters. The mechanism doesn't care if it's true.
              </li>
              <li>
                <span className="font-hand text-coral text-xl">✦</span>{' '}
                <strong>Give it good context.</strong> The more relevant
                text you put in the window, the better its next-token
                guesses get. Vague prompts → vague predictions.
              </li>
              <li>
                <span className="font-hand text-coral text-xl">✦</span>{' '}
                <strong>It loves continuing patterns.</strong> Show it the
                style you want, and it'll match. That's its superpower.
              </li>
              <li>
                <span className="font-hand text-coral text-xl">✦</span>{' '}
                <strong>
                  Counting and exact arithmetic are weak spots.
                </strong>{' '}
                Token-land doesn't have letters or precise numbers. Use a
                calculator (or ask the model to use one).
              </li>
              <li>
                <span className="font-hand text-coral text-xl">✦</span>{' '}
                <strong>Long chats forget.</strong> Important facts will
                slide out the back of the context window. Repeat them, or
                start fresh.
              </li>
              <li>
                <span className="font-hand text-coral text-xl">✦</span>{' '}
                <strong>The "personality" is a costume.</strong> A different
                system prompt (or a different chat product) gets you a
                different vibe from the same underlying machine.
              </li>
              <li>
                <span className="font-hand text-coral text-xl">✦</span>{' '}
                <strong>"Step by step" is a magic phrase.</strong> Hard
                problem? Tell it to think out loud. The reasoning tokens
                are what makes the answer better.
              </li>
              <li>
                <span className="font-hand text-coral text-xl">✦</span>{' '}
                <strong>Examples beat instructions.</strong> Show, don't
                tell. Two or three examples in the prompt teach the model
                a new task faster than any paragraph of rules.
              </li>
              <li>
                <span className="font-hand text-coral text-xl">✦</span>{' '}
                <strong>Paste the source.</strong> If the answer depends
                on a specific document, give the model that document.
                Don't expect it to remember.
              </li>
            </ul>
            <p className="font-hand text-2xl text-ink mt-6">
              You now know roughly what's happening when you type into a
              chat box.{' '}
              <span className="text-coral">
                You can stop being mystified, and start being useful.
              </span>
            </p>
          </div>
        </div>

        <div className="text-center mt-12 font-display text-4xl text-ink/40">
          ✦ ✦ ✦
        </div>
        <div className="text-center mt-4 font-hand text-ink/60">
          thanks for scrolling.
        </div>
      </section>

      <footer className="max-w-3xl mx-auto px-6 pb-16 pt-8 text-center font-hand text-ink/40 text-sm">
        an experiment in explaining LLMs to humans · all probabilities and
        examples in this guide are illustrative, not measured from a real model.
      </footer>
    </div>
  )
}

