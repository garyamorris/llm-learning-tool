import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SketchDefs } from '../components/SketchDefs'
import { Recap } from '../components/Recap'
import { WorldModelGap } from '../components/jepa/WorldModelGap'
import { GistPrediction } from '../components/jepa/GistPrediction'
import { ArchitectureDiagram } from '../components/jepa/ArchitectureDiagram'
import { MaskAndPredict } from '../components/jepa/MaskAndPredict'
import { DebateCards } from '../components/jepa/DebateCards'
import { CollapseDemo } from '../components/jepa/CollapseDemo'
import { ImplementationsTour } from '../components/jepa/ImplementationsTour'
import { PlanningDemo } from '../components/jepa/PlanningDemo'
import { HybridDemo } from '../components/jepa/HybridDemo'
import { WatchCards } from '../components/jepa/WatchCards'
import { HierarchicalDemo } from '../components/jepa/HierarchicalDemo'
import { ActionConditionedDemo } from '../components/jepa/ActionConditionedDemo'
import { CousinsTour } from '../components/jepa/CousinsTour'
import { BrainEchoes } from '../components/jepa/BrainEchoes'
import { LimitsCards } from '../components/jepa/LimitsCards'

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

      {/* ── INTERLUDE ─────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-12 text-center">
        <div className="font-display text-4xl text-teal mb-4">
          let's go further.
        </div>
        <p className="font-body text-lg text-ink/80 max-w-2xl mx-auto leading-relaxed">
          You've seen what JEPA is and why it exists. The next five chapters
          go a level deeper: <em>why it almost doesn't work</em>, what's
          actually been built, the endgame vision, and where this likely
          goes next.
        </p>
      </section>

      {/* ── CHAPTER 6 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={6} label="the collapse problem" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Why this almost doesn't work.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Here's a question that bothered researchers for years: if you
            train two encoders by minimizing the distance between their
            outputs... what stops them from{' '}
            <strong className="text-coral">both outputting the same
            constant</strong>?
          </p>
          <p>
            That would technically achieve perfect loss. Distance between
            two identical vectors is zero. The model is also useless — it
            has discarded all information about what was different between
            different inputs. The dreaded{' '}
            <strong className="text-coral">representational collapse</strong>.
          </p>
          <p>
            This is the central technical problem that any JEPA-style
            architecture has to solve. The fix is elegant and a little
            magical:
          </p>
        </div>

        <CollapseDemo />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            By making the target encoder a slow-moving copy of the context
            encoder (no gradient flowing back through it), the model is{' '}
            <em>prevented</em> from racing both encoders to a trivial
            solution. The context encoder has to do real work to make its
            outputs match the (slow, lagging) target. The only way to keep
            up is to actually learn structure.
          </p>
          <p className="font-hand text-2xl text-ink">
            <span className="text-teal">An ugly hack with a beautiful effect.</span>{' '}
            Several related self-supervised methods (BYOL, DINO, SimSiam)
            use variations on this same asymmetry trick.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── CHAPTER 7 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={7} label="from paper to working system" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          What's actually been built.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            JEPA is more than a paper-shaped theory. Meta's FAIR group has
            shipped a handful of concrete implementations, each pushing the
            recipe further. None of them is a household name — there's no
            "ChatGPT moment" for JEPA yet — but the research trajectory
            is real, and it's pointed somewhere specific.
          </p>
          <p>Here's the lineage:</p>
        </div>

        <ImplementationsTour />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Notice the arc: images → video → robotics. Each generation
            scales up and pushes toward a more ambitious goal. The bet is
            that this trajectory eventually arrives somewhere transformative
            — a general-purpose world model that becomes the perceptual
            backbone for embodied AI.
          </p>
          <p>
            The bet might also fizzle. We won't know for a few years.
          </p>
        </div>
      </section>

      <Recap
        chapters="chapters 6–7"
        title="the bits that make it real"
        points={[
          '<strong>Why it doesn\'t collapse:</strong> the target encoder is a slow-moving copy of the context encoder, no gradient through it. Asymmetry forces actual learning.',
          '<strong>What actually exists today:</strong> I-JEPA (images), V-JEPA (video), V-JEPA 2 (robotics). All Meta FAIR. Real benchmark results, no household-name product yet.',
          '<strong>The trajectory:</strong> the recipe is being pushed from image features → video understanding → world models for embodied agents.',
        ]}
        next="next: what could you actually DO with a learned world model?"
      />

      <ChapterDivider />

      {/* ── CHAPTER 8 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={8} label="planning by imagining" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          What you can do with a world model.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Here's why LeCun keeps pitching JEPA: once you have a model that
            knows how the world evolves, you can use it for{' '}
            <strong className="text-teal">planning</strong>.
          </p>
          <p>
            The idea: instead of jumping straight to action, an agent first{' '}
            <em>imagines</em> the consequences of several candidate plans —
            running them through its internal world model. It evaluates the
            imagined outcomes, picks the best one, and then acts.
          </p>
          <p>
            This isn't a new idea. "Model-based reinforcement learning" has
            done this for decades. What's new is having a world model
            that's actually any good — one that was learned from raw
            video, without hand-engineered features, and that predicts in
            useful embedding-space rather than in pixel-space.
          </p>
          <p>Watch a robot do it:</p>
        </div>

        <PlanningDemo />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            This is LeCun's "objective-driven AI": an agent has a goal, a
            world model that predicts consequences, a scorer that evaluates
            imagined outcomes against the goal, and a planner that picks
            the best plan. The whole thing sits on top of a JEPA-style
            perceptual model trained from raw observation.
          </p>
          <p>
            It's exactly the kind of thing autoregressive LLMs are
            <em> not</em> built to do. LLMs commit to one token at a time,
            in the order they speak. They don't naturally "imagine three
            options and pick the best." (You can fake it with sampling and
            chain-of-thought, but the architecture isn't designed for it.)
          </p>
          <p className="font-hand text-2xl text-ink">
            <span className="text-teal">Imagine, evaluate, act.</span>{' '}
            That's the playbook the JEPA-camp thinks gets us past the
            current LLM ceiling.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── CHAPTER 9 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={9} label="the hybrid future" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Probably not either-or.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            The "LLMs vs JEPAs" framing makes for good arguments at
            conferences. The actual future of AI is much more likely to be{' '}
            <em>both</em>.
          </p>
          <p>
            LLMs are extraordinary at language. They have absorbed an
            enormous amount of human knowledge through text. They can
            reason about abstract symbols, follow instructions, and
            communicate. Their failure modes are the ones we covered in
            chapter 1: physics, planning, embodiment — anything where you
            need an actual model of the world rather than a model of words.
          </p>
          <p>
            JEPAs are extraordinary at perception. They can build rich
            internal world models from raw video. Their failure modes are
            the opposite: they have no built-in way to communicate, follow
            symbolic instructions, or use the accumulated knowledge in
            human text.
          </p>
          <p>
            The obvious move: glue them together. Use a JEPA for
            world-modeling and perception, an LLM for language and symbolic
            reasoning, and let them share information through embeddings.
            See the difference:
          </p>
        </div>

        <HybridDemo />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Several research labs are publicly working on architectures
            like this. The exact form is still being worked out — should
            they share a representation? Should one drive the other? Are
            they two systems in conversation, or one unified one? — but the
            direction is widely agreed on.
          </p>
          <p className="font-hand text-2xl text-ink">
            <span className="text-teal">A model that perceives the world</span>{' '}
            <span className="text-coral">+ a model that talks about it</span>{' '}
            <span className="text-mustard">= an AI that does both well.</span>
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── CHAPTER 10 ──────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={10} label="what to watch this decade" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Where this likely goes.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            JEPA is a research bet. Like any bet, it could pay off
            spectacularly, fizzle quietly, or — most likely — partially work
            and get absorbed into something bigger that nobody quite calls
            JEPA. Here's a clear-eyed look at the things to keep an eye on:
          </p>
        </div>

        <WatchCards />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-4">
          <p>
            The honest stance, again, is{' '}
            <strong>curious but not credulous</strong>. JEPA is the
            best-articulated alternative to the autoregressive-token
            paradigm that's currently dominating AI. It's worth following.
            It's also unproven at consumer-product scale, and the LLM
            camp's "just keep scaling" empirical case is genuinely strong.
            We'll know more in a few years.
          </p>
          <p>
            Whichever way it shakes out, you now have the vocabulary to
            follow the arguments. That's the whole point of this guide.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── INTERLUDE 3 ───────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-12 text-center">
        <div className="font-display text-4xl text-teal mb-4">
          one more level down.
        </div>
        <p className="font-body text-lg text-ink/80 max-w-2xl mx-auto leading-relaxed">
          The last five chapters go a layer deeper:{' '}
          <em>how to stack JEPAs</em>,{' '}
          <em>how to make them act</em>,{' '}
          <em>which methods they're related to</em>,{' '}
          <em>where their ideas come from</em>, and{' '}
          <em>what they fundamentally don't try to do</em>.
        </p>
      </section>

      {/* ── CHAPTER 11 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={11} label="thinking at every scale" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          One JEPA is not enough.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            A single JEPA learns to predict at one timescale — usually
            "what happens in the next short window." But real intelligence
            doesn't work that way. When you watch someone cooking dinner,
            you're predicting at <em>several</em> timescales at once: the
            next knife stroke (milliseconds), the next dish prep step
            (seconds), the meal as a whole (minutes). Each prediction is
            useful, and they reinforce each other.
          </p>
          <p>
            LeCun's proposed answer:{' '}
            <strong className="text-teal">hierarchical JEPA</strong>, or
            H-JEPA. Stack JEPA modules at different abstraction levels.
            Lower levels predict small, frequent things. Higher levels
            predict big, rare things. Lower levels summarize up; higher
            levels constrain down.
          </p>
        </div>

        <HierarchicalDemo />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            H-JEPA, in 2025, is more aspiration than shipping product. The
            tricky parts are coordinating the levels (when does the
            high-level decide a "next plan step"?) and training them
            without each level interfering with the others. These are
            active research problems, not solved ones.
          </p>
          <p className="font-hand text-2xl text-ink">
            <span className="text-teal">If you only remember one slogan:</span>{' '}
            real-world prediction is multi-scale, so the architecture
            should be too.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── CHAPTER 12 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={12} label="adding actions" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          What happens if I do this?
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Up to now, the JEPA we've described predicts{' '}
            <em>what comes next</em> in a passive sense — as if the model
            were watching a movie. For a passive observer, that's enough.
            For an agent, it isn't.
          </p>
          <p>
            An agent doesn't just want "what comes next" — it wants{' '}
            <strong className="text-teal">"what comes next if I do X"</strong>.
            The fix is small: feed the predictor an action alongside the
            current embedding. Now the same starting state can yield
            different predicted next-states under different actions:
          </p>
        </div>

        <ActionConditionedDemo />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            This is the variant V-JEPA 2 trains explicitly. It's also the
            ingredient that makes JEPA usable for planning (chapter 8):
            with an action-conditioned predictor, the agent can simulate
            "what if I tried plan A? plan B?" in its head before committing.
          </p>
          <p className="font-hand text-2xl text-ink">
            <span className="text-teal">
              From "I see what's about to happen" to "I see what would
              happen if I acted."
            </span>{' '}
            A small change in inputs. A huge change in usefulness.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── CHAPTER 13 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={13} label="cousins in the family" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          JEPA isn't alone in the woods.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            JEPA is the most ambitious member of a broader family of
            self-supervised learning methods that has been quietly very
            successful over the past five years. Many of these methods
            preceded JEPA and inspired specific tricks. Some are arguably
            <em> more practically used</em> today than JEPA itself.
          </p>
          <p>
            If you're trying to follow the AI literature, this is the
            family tree you'll see referenced. A quick tour:
          </p>
        </div>

        <CousinsTour />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Two of these — DINOv2 and MAE — are probably used in more
            real-world systems today than JEPA. The story of "which
            self-supervised method wins" is still being written. JEPA is
            the boldest theoretical bet; whether it produces the boldest
            empirical result remains to be seen.
          </p>
        </div>
      </section>

      <Recap
        chapters="chapters 11–13"
        title="JEPA in its broader context"
        points={[
          '<strong>H-JEPA:</strong> stack JEPAs across timescales so the model can predict the next frame, next event, and next plan all at once.',
          '<strong>Action-conditioned JEPA:</strong> add an action input to the predictor. Now the model can answer "what if I do X?" — the prerequisite for planning.',
          '<strong>Cousin methods (SimCLR, BYOL, DINO, MAE):</strong> the family of self-supervised methods JEPA emerged from. Each chose a different way to avoid collapse and learn structure from raw observation.',
        ]}
        next="next: what is JEPA borrowing from neuroscience? And what won't it ever be able to do?"
      />

      <ChapterDivider />

      {/* ── CHAPTER 14 ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={14} label="echoes of how brains work" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          This idea didn't come out of nowhere.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            LeCun likes to point out that JEPA's core recipe —{' '}
            <em>predict what comes next, learn from your prediction
            errors</em> — is not a fresh invention. Neuroscientists and
            cognitive scientists have been describing the brain in
            essentially these terms for decades.
          </p>
          <p>
            Four parallels worth knowing:
          </p>
        </div>

        <BrainEchoes />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Whether brains literally "do JEPA" is open to debate. Brains
            do many things current AI doesn't — sleep, dream, forget,
            embody, age — and they aren't trained on Common Crawl. But the
            family resemblance to predictive coding and free-energy
            theories is suggestive enough that "is intelligence just very
            good prediction?" has become a respectable question in both
            AI and neuroscience.
          </p>
          <p className="font-hand text-2xl text-ink">
            <span className="text-teal">
              JEPA's bet is partly an empirical one
            </span>{' '}
            and partly a bet that brains have been quietly telling us
            something for thirty years.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* ── CHAPTER 15 ──────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={15} label="the honest limits" />

        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          What JEPA isn't trying to be.
        </h2>

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            We've spent fifteen chapters making the JEPA case. Time to
            close with the opposite: an honest list of what JEPA{' '}
            <em>doesn't do</em>, even in principle. Some of these are
            current limits that may be solved. Others are baked-in to the
            paradigm — they live where JEPA's ambitions end and some other
            system has to begin.
          </p>
        </div>

        <LimitsCards />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-4">
          <p>
            None of these are damning. A well-designed AI system might
            never need a single model that does everything — the same way
            you don't expect your eyes to also do logic puzzles. A
            future that combines a JEPA-shaped world model, an LLM-shaped
            language model, a calculator, a search index, and a few other
            specialized tools is{' '}
            <em>completely consistent</em> with JEPA being a real,
            important advance — and not the whole show.
          </p>
          <p className="font-hand text-2xl text-ink">
            <span className="text-teal">No paradigm does everything.</span>{' '}
            The interesting question is which combination of paradigms
            does the most useful work — and JEPA has earned a strong
            place in that combination.
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
