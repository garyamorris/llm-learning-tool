import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SketchDefs } from '../components/SketchDefs'
import { Recap } from '../components/Recap'
import { WorldModelGap } from '../components/jepa/WorldModelGap'
import { GistPrediction } from '../components/jepa/GistPrediction'
import { ArchitectureDiagram } from '../components/jepa/ArchitectureDiagram'
import { MaskAndPredict } from '../components/jepa/MaskAndPredict'
import { DebateCards } from '../components/jepa/DebateCards'

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
          bg-teal/60 font-display text-2xl shadow-sketchSm"
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

export function JEPAPage() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <SketchDefs />

      <FloatingDoodle className="top-20 left-8 text-6xl text-teal/30">
        ✺
      </FloatingDoodle>
      <FloatingDoodle className="top-72 right-12 text-5xl text-lavender/30" delay={2}>
        ✦
      </FloatingDoodle>
      <FloatingDoodle className="top-[1500px] left-12 text-5xl text-mustard/40" delay={1}>
        ❋
      </FloatingDoodle>
      <FloatingDoodle className="top-[2800px] right-10 text-5xl text-sage/40" delay={3}>
        ✿
      </FloatingDoodle>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-hand text-ink/60 text-lg mb-2">
            an illustrated guide to
          </div>
          <h1 className="text-6xl md:text-8xl leading-none mb-4">
            What if{' '}
            <span className="text-teal relative inline-block">
              LLMs
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 7 Q 50 2, 100 6 T 198 7"
                  stroke="#3d8b8b"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>{' '}
            aren't the answer?
          </h1>
          <p className="font-body text-xl text-ink/80 max-w-2xl mx-auto leading-relaxed">
            A small but loud crowd — including Yann LeCun, who runs Meta's AI
            research — argues today's chatbots are a dead end. Their
            alternative has a name:{' '}
            <strong className="text-teal">JEPA</strong>.
            <br />
            <span className="font-hand text-2xl text-teal">
              Here's what they're talking about.
            </span>
          </p>
          <p className="font-hand text-ink/60 text-base mt-6">
            (assumes you've read the{' '}
            <Link
              to="/"
              className="text-coral underline decoration-wavy hover:text-ink"
            >
              LLM guide
            </Link>{' '}
            first — we'll lean on it)
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
        <ChapterBadge n={1} label="the missing thing" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          LLMs are great at text. Less great at the world.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            You've seen what LLMs can do: write, summarize, code, chat.
            They've blown past every "can a machine really do X?" benchmark
            anyone bothered to set.
          </p>
          <p>
            But poke at them a little and you find some weirdly soft spots.
            They're shaky on physical intuition. They struggle with spatial
            reasoning. They produce plausible-sounding plans that violate
            constraints they were just told. They can write essays about
            counterfactuals but can't reliably reason inside one.
          </p>
          <p>
            The diagnosis some researchers offer:{' '}
            <strong className="text-teal">
              LLMs don't have a model of the world
            </strong>
            . They have a model of text <em>about</em> the world. That's
            often close enough — until it isn't.
          </p>
          <p>Try a few:</p>
        </div>

        <WorldModelGap />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            If you find these examples shrug-worthy — "the model gets it
            roughly right, that's fine" — you're in good company; many
            researchers do too. If you find them alarming — "the model is
            faking competence" — you're also in good company. JEPA is the
            second camp's bet on a better foundation.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── CHAPTER 2 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={2} label="the core insight" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Predict the gist, not the words.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Here's the JEPA bet, in one sentence:{' '}
            <strong className="text-teal">
              don't predict the exact next token — predict the meaning of the
              next thing.
            </strong>
          </p>
          <p>
            Think about what an LLM has to do (chapter 1 of the other
            guide). For "The cat sat on the ___", the model must commit to a
            single word from a distribution of hundreds: <em>mat, floor,
            couch, windowsill, rug...</em> But for most purposes,{' '}
            <em>any</em> of those answers is fine. The exact word doesn't
            matter. The <em>region of meaning</em> matters.
          </p>
          <p>
            JEPA throws away the requirement to pick a winner. Instead, it
            predicts a position in meaning-space — a fuzzy blob that covers
            "kinds of things a cat would sit on." Watch:
          </p>
        </div>

        <GistPrediction />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            This sounds like a small change but it's a profound one. For
            text, the difference may seem academic. For{' '}
            <strong>images and video</strong>, it's enormous. An LLM-style
            model trying to predict the next frame of video has to predict
            every pixel — millions of numbers, most of which don't matter.
            A JEPA-style model just predicts "the gist of the next frame" in
            embedding space. Vastly less wasted work.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── CHAPTER 3 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={3} label="the shape of the thing" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Two encoders walk into a model.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            "Joint-Embedding Predictive Architecture" sounds intimidating.
            The actual structure is three pieces:
          </p>
          <ul className="space-y-1 pl-6 list-disc marker:text-teal">
            <li>
              <strong>A context encoder.</strong> Turns the visible input
              (text, pixels, whatever) into an embedding.
            </li>
            <li>
              <strong>A target encoder.</strong> Same job, but for the
              hidden/target part — the thing we're trying to predict.
            </li>
            <li>
              <strong>A predictor.</strong> A small network that takes the
              context embedding and tries to guess what the target embedding
              should be.
            </li>
          </ul>
          <p>
            Training shrinks the distance between the prediction and the
            actual target embedding. That's the whole loop. Walk through it:
          </p>
        </div>

        <ArchitectureDiagram />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Compared to an LLM, what's missing is striking: there's no
            decoder, no token-by-token generation, no probability over
            vocabulary. The model never "writes" anything. It just builds
            internal representations that predict each other.
          </p>
          <p className="font-hand text-2xl text-ink">
            <span className="text-teal">All the action is in the embeddings.</span>{' '}
            The world is shaped, indirectly, by which embeddings end up
            close to which.
          </p>
        </div>
      </section>

      <Recap
        chapters="chapters 1–3"
        title="what JEPA actually is"
        points={[
          '<strong>The diagnosis:</strong> LLMs lack a model of the world. They model text <em>about</em> the world, which is brittle on physics, planning, and spatial reasoning.',
          '<strong>The insight:</strong> don\'t predict exact tokens. Predict where things land in meaning-space — a region, not a pin.',
          '<strong>The architecture:</strong> two encoders + a small predictor. The training signal is the distance between the predicted embedding and the actual target embedding.',
        ]}
        next="next: how all this gets trained, with no labels and no captions — just videos and images."
      />

      <ChapterDivider />

      {/* ── CHAPTER 4 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={4} label="how it learns" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Mask part. Predict the rest. In embedding space.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            JEPA training is gloriously simple in concept. Take an image (or
            a video clip, or a sentence). Hide some part of it. Ask the
            model to predict — not the missing pixels — but the{' '}
            <em>embedding</em> of the missing region.
          </p>
          <p>
            No captions. No human labels. No "this is a cat" annotations.
            Just: see part, predict the rest, measure how close the
            prediction lands. Adjust. Repeat.
          </p>
        </div>

        <MaskAndPredict />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            This is <strong className="text-teal">self-supervised
            learning</strong>, and it's the same recipe that made LLMs work
            in the first place (chapter 4 of the other guide). The
            difference is{' '}
            <em>what</em> the model is trying to predict. For LLMs: a
            specific next token. For JEPA: an abstract embedding of the
            next thing.
          </p>
          <p>
            The training data can be raw, unlabeled video — which the
            internet has in essentially limitless supply, and which is where
            most of the information about how the world actually works
            lives. Cats falling off counters. Glasses breaking. Doors
            opening. Cars stopping. <em>That's</em> the world. Predicting
            embeddings of frames from that data is a much richer learning
            signal than predicting the next word in a Wikipedia article
            about cats.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── CHAPTER 5 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={5} label="the debate" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Is this the path to AGI? Or a beautiful sideshow?
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Here's where opinions diverge sharply — and where, frankly,
            nobody knows the answer yet. Yann LeCun, one of the three
            "godfathers of deep learning," argues forcefully that scaling
            LLMs further will not lead to general intelligence, and that
            JEPA-style world models are necessary. Other equally credentialed
            researchers think LLMs are already showing the seeds of world
            modeling and just need to keep getting bigger.
          </p>
          <p>
            Both sides have real arguments. Here they are:
          </p>
        </div>

        <DebateCards />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-4">
          <p>
            Whichever side ends up right (or, more likely, partly right),
            the JEPA story is worth knowing. It's the most fleshed-out
            alternative to the autoregressive-token paradigm that runs
            today's chatbots. It might quietly become the foundation of how
            robots, video understanding, and embodied AI work. Or it might
            stay an interesting research line.
          </p>
          <p>
            What's certain is that the recipe — <strong>predict in
            embedding space, learn from raw observation, build a model of
            the world before you build a model of language</strong> — is{' '}
            getting taken seriously across the field. Even at labs that
            don't call it JEPA.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── CLOSING ─────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight text-center">
          So now you've seen both bets.
        </h2>

        <div className="card-sketch bg-paper/70 mt-8">
          <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
            <p>
              On one side: <strong>LLMs</strong> — predict the exact next
              token, train on text from the internet, scale until something
              like intelligence falls out. The bet that's currently winning
              the consumer-product war.
            </p>
            <p>
              On the other:{' '}
              <strong className="text-teal">JEPA</strong> — predict the gist
              of what's missing, train on raw observation, build an internal
              model of the world before you build a model of language. The
              bet on a different ceiling.
            </p>
            <p className="font-hand text-2xl text-ink mt-4">
              <span className="text-teal">
                The next few years of AI will tell us which side was more
                right — or whether the future hybridizes them in ways neither
                camp predicted.
              </span>
            </p>
            <p>
              Either way, you now have the conceptual vocabulary to follow
              the arguments without getting lost in jargon. That's the
              point.
            </p>
            <p className="mt-4">
              👉 Go back to the{' '}
              <Link
                to="/"
                className="text-coral underline decoration-wavy hover:text-ink"
              >
                LLM guide
              </Link>{' '}
              if you want to re-read anything that connects.
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
        an experiment in explaining JEPA to humans · examples and
        probabilities throughout are illustrative, not measured from any
        specific JEPA implementation.
      </footer>
    </div>
  )
}
