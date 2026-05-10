# How does an LLM actually work?

Two illustrated guides for people who've used a chatbot but don't know
what's going on under the hood. No jargon, no equations — just clickable
demos.

- **[/](https://llm-learning-tool-921137113764.us-central1.run.app/)** —
  *How does an LLM actually work?* (15 chapters)
- **[/jepa](https://llm-learning-tool-921137113764.us-central1.run.app/jepa)** —
  *What if LLMs aren't the answer?* (10 chapters on JEPA, the leading
  alternative paradigm)

**Live:** https://llm-learning-tool-921137113764.us-central1.run.app

## What's inside

A scrollable single-page site with fifteen chapters. Each one builds on the
last and each has a small interactive demo you can poke at:

| #   | Chapter                                | Demo                                             |
| --- | -------------------------------------- | ------------------------------------------------ |
| 1   | It's just guessing the next word        | Pick-a-word with a temperature knob & autoplay   |
| 2   | Words aren't words to it                | Real GPT-4 tokenizer running in your browser     |
| 3   | Meaning lives in space                  | 2D word map + king − man + woman analogy demo    |
| 4   | How did it learn this?                  | Live training visualization, accuracy bar        |
| 5   | Why it confidently makes stuff up       | Spot-the-fake-citation game                      |
| 6   | Paying attention                        | Attention weights over example sentences         |
| 7   | Goldfish memory                         | Draggable context window over a fake chat        |
| 8   | From parrot to assistant                | Base-model vs chat-tuned A/B for the same prompt |
| 9   | Hidden instructions                     | Persona switcher with a "peek behind the curtain"|
| 10  | Beyond just words                       | Step-through of an LLM calling tools             |
| 11  | Thinking out loud                       | Direct vs chain-of-thought on multi-step problems|
| 12  | Show, don't tell                        | Few-shot prompting at 0 / 1 / 3 examples         |
| 13  | Giving it homework                      | Same question with and without RAG retrieval     |
| 14  | Eyes and ears                           | Image patches → vision tokens (chapter 2 redux)  |
| 15  | The honest takeaway                     | "Sure of / still figuring out / watching" cards  |

Mini-recaps sit between the major sections to keep the thread of the story
visible.

### `/jepa` — the second guide

A ten-chapter companion that picks up where the LLM guide leaves off, and
walks through the alternative paradigm championed by Yann LeCun:

| #   | Chapter                                | Demo                                             |
| --- | -------------------------------------- | ------------------------------------------------ |
| 1   | The missing thing                       | Side-by-side: LLM answer vs what a world model needs |
| 2   | Predict the gist, not the words         | Same meaning-map as LLM-ch3, but with a region-prediction blob |
| 3   | The shape of the thing                  | Walk-through animated diagram of the JEPA architecture |
| 4   | Mask part. Predict the rest.            | Train a JEPA in embedding space, watch loss converge |
| 5   | The debate                              | "Pro / con / honest take" cards on the future of AGI |
| 6   | The collapse problem                    | Naive vs asymmetric training — watch encoders collapse |
| 7   | From paper to working system            | Tour of I-JEPA, V-JEPA, V-JEPA 2 with results    |
| 8   | Planning by imagining                   | Grid-world robot: imagine plans → evaluate → execute |
| 9   | The hybrid future                       | Same scenario shown three ways: LLM-only / JEPA-only / combined |
| 10  | What to watch this decade               | Open problems / applications / milestones cards   |

## Stack

- [Vite](https://vitejs.dev/) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) for the playful illustrated styling
- [Framer Motion](https://www.framer.com/motion/) for the animations
- [`gpt-tokenizer`](https://github.com/niieani/gpt-tokenizer) for chapter 2's
  real-tokenizer demo (cl100k_base, the GPT-4 vocab)

The site is purely static — no backend, no API calls. All "model behaviour"
is hand-authored or simulated for teaching purposes. The probability
distributions in chapter 1, the embedding map coordinates in chapter 3, the
attention weights in chapter 6, etc. are illustrative — not measured from a
real model.

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
```

## Deploy

The repo includes a `Dockerfile` and `nginx.conf` for hosting on
[Google Cloud Run](https://cloud.google.com/run):

```bash
gcloud run deploy llm-learning-tool \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

The Dockerfile is a two-stage build: Node compiles the Vite app, then
Nginx serves the static `dist/`. It works anywhere a container runs.

## A note on accuracy

This is a teaching tool, not a textbook. The goal is to give a non-technical
reader a useful working mental model in about fifteen minutes — not to be
exhaustively correct. A few specific liberties:

- **Chapter 3's embedding map is 2D**, but real embeddings have hundreds or
  thousands of dimensions. The 2D coordinates are hand-placed so the
  analogies land where they should.
- **Chapter 4's "accuracy"** metric is `1 − total-variation-distance` to a
  reference distribution, not a real cross-entropy loss. "Accuracy" lands
  faster for a novice.
- **Chapter 6's attention weights** are hand-authored to illustrate the
  point, not extracted from a real transformer.
- **Probability tables in chapter 1** are written by hand to feel real,
  with 3 starter prompts authored several token-steps deep.

If you spot something that's misleading rather than just simplified, please
file an issue.

## License

MIT — do whatever, but don't pretend this is the *full* picture of how LLMs
work. It's a friendly cartoon of one.
