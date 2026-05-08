// Hand-authored "language model" — probability distributions for next-token
// prediction. Keyed by the exact text so far. When the path goes off-map,
// we fall back to a generic distribution. The numbers are made up; the goal
// is to FEEL real and to let temperature meaningfully change what comes out.

export type TokenChoice = { token: string; prob: number }

export type Prompt = {
  id: string
  label: string
  starter: string
}

export const PROMPTS: Prompt[] = [
  {
    id: 'cat',
    label: 'A cat story',
    starter: 'The cat sat on the',
  },
  {
    id: 'dragon',
    label: 'A fairy tale',
    starter: 'Once upon a time, there was a small dragon who',
  },
  {
    id: 'email',
    label: 'An email',
    starter: 'Dear boss, I am writing to ask for',
  },
]

// Distributions are keyed by the entire text-so-far (whitespace-sensitive).
// Tokens include their leading space when appropriate (LLMs really do this).
const DATA: Record<string, TokenChoice[]> = {
  // ═══════════════════════════════════════════════════════════════════════
  // ── CAT PATH ───────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════
  'The cat sat on the': [
    { token: ' mat', prob: 0.40 },
    { token: ' floor', prob: 0.13 },
    { token: ' couch', prob: 0.10 },
    { token: ' windowsill', prob: 0.09 },
    { token: ' keyboard', prob: 0.07 },
    { token: ' rug', prob: 0.05 },
    { token: ' counter', prob: 0.04 },
    { token: ' fence', prob: 0.04 },
    { token: ' roof', prob: 0.04 },
    { token: ' bed', prob: 0.04 },
  ],

  // ── MAT branch ────────────────────────────────────────────────────────
  'The cat sat on the mat': [
    { token: ' and', prob: 0.30 },
    { token: '.', prob: 0.20 },
    { token: ',', prob: 0.18 },
    { token: ' watching', prob: 0.10 },
    { token: ' purring', prob: 0.08 },
    { token: ' staring', prob: 0.07 },
    { token: ' quietly', prob: 0.04 },
    { token: ' for', prob: 0.03 },
  ],
  'The cat sat on the mat and': [
    { token: ' stared', prob: 0.20 },
    { token: ' waited', prob: 0.14 },
    { token: ' purred', prob: 0.13 },
    { token: ' yawned', prob: 0.10 },
    { token: ' watched', prob: 0.10 },
    { token: ' licked', prob: 0.09 },
    { token: ' refused', prob: 0.06 },
    { token: ' meowed', prob: 0.05 },
    { token: ' blinked', prob: 0.05 },
    { token: ' sighed', prob: 0.04 },
    { token: ' began', prob: 0.04 },
  ],
  'The cat sat on the mat and stared': [
    { token: ' at', prob: 0.62 },
    { token: ' into', prob: 0.14 },
    { token: ' silently', prob: 0.08 },
    { token: ' menacingly', prob: 0.06 },
    { token: ' out', prob: 0.05 },
    { token: ' up', prob: 0.05 },
  ],
  'The cat sat on the mat and stared at': [
    { token: ' me', prob: 0.30 },
    { token: ' the', prob: 0.28 },
    { token: ' nothing', prob: 0.14 },
    { token: ' a', prob: 0.10 },
    { token: ' something', prob: 0.08 },
    { token: ' you', prob: 0.05 },
    { token: ' us', prob: 0.03 },
    { token: ' her', prob: 0.02 },
  ],
  'The cat sat on the mat and stared at me': [
    { token: ',', prob: 0.30 },
    { token: '.', prob: 0.25 },
    { token: ' until', prob: 0.15 },
    { token: ' with', prob: 0.10 },
    { token: ' for', prob: 0.08 },
    { token: ' expectantly', prob: 0.06 },
    { token: ' silently', prob: 0.06 },
  ],
  'The cat sat on the mat and stared at me,': [
    { token: ' unblinking', prob: 0.20 },
    { token: ' waiting', prob: 0.20 },
    { token: ' judging', prob: 0.16 },
    { token: ' demanding', prob: 0.10 },
    { token: ' silently', prob: 0.10 },
    { token: ' expectantly', prob: 0.10 },
    { token: ' refusing', prob: 0.08 },
    { token: ' as', prob: 0.06 },
  ],
  'The cat sat on the mat and stared at me, unblinking': [
    { token: '.', prob: 0.55 },
    { token: ',', prob: 0.25 },
    { token: ' and', prob: 0.20 },
  ],
  'The cat sat on the mat and stared at me, waiting': [
    { token: ' for', prob: 0.55 },
    { token: ' patiently', prob: 0.18 },
    { token: ' quietly', prob: 0.12 },
    { token: ' expectantly', prob: 0.10 },
    { token: ' silently', prob: 0.05 },
  ],
  'The cat sat on the mat and stared at me, waiting for': [
    { token: ' breakfast', prob: 0.30 },
    { token: ' attention', prob: 0.22 },
    { token: ' someone', prob: 0.18 },
    { token: ' me', prob: 0.15 },
    { token: ' food', prob: 0.10 },
    { token: ' the', prob: 0.05 },
  ],
  'The cat sat on the mat and stared at me, waiting for breakfast': [
    { token: '.', prob: 0.50 },
    { token: ',', prob: 0.25 },
    { token: ' with', prob: 0.12 },
    { token: ' to', prob: 0.08 },
    { token: ' patiently', prob: 0.05 },
  ],
  'The cat sat on the mat and stared at me, waiting for attention': [
    { token: '.', prob: 0.65 },
    { token: ',', prob: 0.20 },
    { token: ' that', prob: 0.10 },
    { token: ' or', prob: 0.05 },
  ],
  'The cat sat on the mat and stared at me, judging': [
    { token: ' me', prob: 0.45 },
    { token: ' my', prob: 0.30 },
    { token: ' silently', prob: 0.15 },
    { token: '.', prob: 0.10 },
  ],
  'The cat sat on the mat and stared at me, judging me': [
    { token: '.', prob: 0.50 },
    { token: ' silently', prob: 0.25 },
    { token: ',', prob: 0.15 },
    { token: ' for', prob: 0.10 },
  ],
  'The cat sat on the mat and stared at me until': [
    { token: ' I', prob: 0.55 },
    { token: ' breakfast', prob: 0.20 },
    { token: ' something', prob: 0.10 },
    { token: ' the', prob: 0.10 },
    { token: ' someone', prob: 0.05 },
  ],
  'The cat sat on the mat and stared at me until I': [
    { token: ' moved', prob: 0.30 },
    { token: ' looked', prob: 0.25 },
    { token: ' got', prob: 0.20 },
    { token: ' relented', prob: 0.10 },
    { token: ' fed', prob: 0.10 },
    { token: ' gave', prob: 0.05 },
  ],
  'The cat sat on the mat and stared at me until I gave': [
    { token: ' in', prob: 0.50 },
    { token: ' up', prob: 0.30 },
    { token: ' it', prob: 0.20 },
  ],
  'The cat sat on the mat and stared at me until I gave in': [
    { token: '.', prob: 0.85 },
    { token: ',', prob: 0.15 },
  ],
  'The cat sat on the mat and stared at the': [
    { token: ' wall', prob: 0.25 },
    { token: ' door', prob: 0.20 },
    { token: ' window', prob: 0.18 },
    { token: ' ceiling', prob: 0.13 },
    { token: ' fridge', prob: 0.10 },
    { token: ' empty', prob: 0.07 },
    { token: ' bird', prob: 0.07 },
  ],
  'The cat sat on the mat and stared at the wall': [
    { token: '.', prob: 0.40 },
    { token: ' for', prob: 0.20 },
    { token: ',', prob: 0.18 },
    { token: ' until', prob: 0.12 },
    { token: ' in', prob: 0.10 },
  ],
  'The cat sat on the mat and stared at the wall for': [
    { token: ' hours', prob: 0.40 },
    { token: ' a', prob: 0.25 },
    { token: ' what', prob: 0.18 },
    { token: ' ages', prob: 0.10 },
    { token: ' minutes', prob: 0.07 },
  ],
  'The cat sat on the mat and stared at the wall for hours': [
    { token: '.', prob: 0.55 },
    { token: ',', prob: 0.20 },
    { token: ' on', prob: 0.13 },
    { token: ' before', prob: 0.12 },
  ],
  'The cat sat on the mat and stared at the door': [
    { token: '.', prob: 0.35 },
    { token: ',', prob: 0.25 },
    { token: ' expectantly', prob: 0.20 },
    { token: ' until', prob: 0.12 },
    { token: ' as', prob: 0.08 },
  ],
  'The cat sat on the mat and stared at the window': [
    { token: '.', prob: 0.30 },
    { token: ',', prob: 0.30 },
    { token: ' watching', prob: 0.25 },
    { token: ' for', prob: 0.10 },
    { token: ' as', prob: 0.05 },
  ],
  'The cat sat on the mat and stared at the ceiling': [
    { token: '.', prob: 0.40 },
    { token: ',', prob: 0.25 },
    { token: ' contemplating', prob: 0.20 },
    { token: ' as', prob: 0.10 },
    { token: ' silently', prob: 0.05 },
  ],
  'The cat sat on the mat and stared at the bird': [
    { token: '.', prob: 0.20 },
    { token: ' outside', prob: 0.30 },
    { token: ' through', prob: 0.20 },
    { token: ',', prob: 0.20 },
    { token: ' with', prob: 0.10 },
  ],
  'The cat sat on the mat and stared at nothing': [
    { token: '.', prob: 0.30 },
    { token: ' in', prob: 0.30 },
    { token: ',', prob: 0.20 },
    { token: ' for', prob: 0.20 },
  ],
  'The cat sat on the mat and stared at nothing in': [
    { token: ' particular', prob: 0.85 },
    { token: ' the', prob: 0.10 },
    { token: ' fact', prob: 0.05 },
  ],
  'The cat sat on the mat and stared at nothing in particular': [
    { token: '.', prob: 0.80 },
    { token: ',', prob: 0.20 },
  ],
  'The cat sat on the mat and waited': [
    { token: ' for', prob: 0.50 },
    { token: ' patiently', prob: 0.20 },
    { token: ' silently', prob: 0.12 },
    { token: ' quietly', prob: 0.10 },
    { token: ' in', prob: 0.08 },
  ],
  'The cat sat on the mat and waited for': [
    { token: ' breakfast', prob: 0.30 },
    { token: ' someone', prob: 0.22 },
    { token: ' me', prob: 0.18 },
    { token: ' the', prob: 0.12 },
    { token: ' food', prob: 0.10 },
    { token: ' hours', prob: 0.08 },
  ],
  'The cat sat on the mat and waited for breakfast': [
    { token: '.', prob: 0.55 },
    { token: ',', prob: 0.20 },
    { token: ' with', prob: 0.15 },
    { token: ' patiently', prob: 0.10 },
  ],
  'The cat sat on the mat and waited for someone': [
    { token: ' to', prob: 0.70 },
    { token: '.', prob: 0.15 },
    { token: ',', prob: 0.10 },
    { token: ' who', prob: 0.05 },
  ],
  'The cat sat on the mat and waited for someone to': [
    { token: ' notice', prob: 0.40 },
    { token: ' feed', prob: 0.30 },
    { token: ' open', prob: 0.15 },
    { token: ' arrive', prob: 0.10 },
    { token: ' come', prob: 0.05 },
  ],
  'The cat sat on the mat and purred': [
    { token: '.', prob: 0.45 },
    { token: ' softly', prob: 0.20 },
    { token: ' loudly', prob: 0.15 },
    { token: ',', prob: 0.12 },
    { token: ' contentedly', prob: 0.08 },
  ],
  'The cat sat on the mat and yawned': [
    { token: '.', prob: 0.45 },
    { token: ' widely', prob: 0.20 },
    { token: ',', prob: 0.20 },
    { token: ' loudly', prob: 0.15 },
  ],
  'The cat sat on the mat and watched': [
    { token: ' me', prob: 0.30 },
    { token: ' the', prob: 0.28 },
    { token: ' us', prob: 0.18 },
    { token: ' carefully', prob: 0.12 },
    { token: ' silently', prob: 0.12 },
  ],
  'The cat sat on the mat and watched me': [
    { token: '.', prob: 0.30 },
    { token: ',', prob: 0.25 },
    { token: ' work', prob: 0.20 },
    { token: ' with', prob: 0.15 },
    { token: ' carefully', prob: 0.10 },
  ],
  'The cat sat on the mat and watched the': [
    { token: ' door', prob: 0.30 },
    { token: ' window', prob: 0.25 },
    { token: ' world', prob: 0.20 },
    { token: ' bird', prob: 0.15 },
    { token: ' kitchen', prob: 0.10 },
  ],
  'The cat sat on the mat and licked': [
    { token: ' its', prob: 0.45 },
    { token: ' his', prob: 0.18 },
    { token: ' her', prob: 0.15 },
    { token: ' a', prob: 0.12 },
    { token: ' itself', prob: 0.10 },
  ],
  'The cat sat on the mat and licked its': [
    { token: ' paws', prob: 0.40 },
    { token: ' fur', prob: 0.30 },
    { token: ' whiskers', prob: 0.15 },
    { token: ' face', prob: 0.10 },
    { token: ' tail', prob: 0.05 },
  ],
  'The cat sat on the mat and licked its paws': [
    { token: '.', prob: 0.55 },
    { token: ',', prob: 0.25 },
    { token: ' slowly', prob: 0.12 },
    { token: ' before', prob: 0.08 },
  ],
  'The cat sat on the mat and licked its paws,': [
    { token: ' indifferent', prob: 0.30 },
    { token: ' satisfied', prob: 0.25 },
    { token: ' slowly', prob: 0.20 },
    { token: ' content', prob: 0.15 },
    { token: ' as', prob: 0.10 },
  ],
  'The cat sat on the mat watching': [
    { token: ' me', prob: 0.35 },
    { token: ' the', prob: 0.30 },
    { token: ' us', prob: 0.18 },
    { token: ' everything', prob: 0.10 },
    { token: ' silently', prob: 0.07 },
  ],
  'The cat sat on the mat watching me': [
    { token: ',', prob: 0.30 },
    { token: '.', prob: 0.25 },
    { token: ' with', prob: 0.20 },
    { token: ' carefully', prob: 0.15 },
    { token: ' work', prob: 0.10 },
  ],
  'The cat sat on the mat purring': [
    { token: ' softly', prob: 0.30 },
    { token: '.', prob: 0.25 },
    { token: ',', prob: 0.20 },
    { token: ' loudly', prob: 0.15 },
    { token: ' contentedly', prob: 0.10 },
  ],

  // ── FLOOR branch (shorter, converges to a clean ending) ────────────────
  'The cat sat on the floor': [
    { token: ',', prob: 0.30 },
    { token: '.', prob: 0.28 },
    { token: ' because', prob: 0.18 },
    { token: ' staring', prob: 0.10 },
    { token: ' looking', prob: 0.08 },
    { token: ' refusing', prob: 0.06 },
  ],
  'The cat sat on the floor,': [
    { token: ' refusing', prob: 0.30 },
    { token: ' glaring', prob: 0.22 },
    { token: ' tail', prob: 0.18 },
    { token: ' silent', prob: 0.15 },
    { token: ' as', prob: 0.15 },
  ],
  'The cat sat on the floor, refusing': [
    { token: ' to', prob: 0.95 },
    { token: ',', prob: 0.05 },
  ],
  'The cat sat on the floor, refusing to': [
    { token: ' move', prob: 0.50 },
    { token: ' meet', prob: 0.25 },
    { token: ' acknowledge', prob: 0.15 },
    { token: ' look', prob: 0.10 },
  ],
  'The cat sat on the floor, refusing to move': [
    { token: '.', prob: 0.85 },
    { token: ',', prob: 0.15 },
  ],
  'The cat sat on the floor, glaring': [
    { token: ' at', prob: 0.85 },
    { token: ' silently', prob: 0.15 },
  ],
  'The cat sat on the floor, glaring at': [
    { token: ' me', prob: 0.55 },
    { token: ' the', prob: 0.30 },
    { token: ' everyone', prob: 0.15 },
  ],
  'The cat sat on the floor, glaring at me': [
    { token: '.', prob: 0.75 },
    { token: ',', prob: 0.15 },
    { token: ' silently', prob: 0.10 },
  ],
  'The cat sat on the floor because': [
    { token: ' the', prob: 0.32 },
    { token: ' it', prob: 0.30 },
    { token: ' someone', prob: 0.14 },
    { token: ' nobody', prob: 0.10 },
    { token: ' I', prob: 0.08 },
    { token: ' she', prob: 0.06 },
  ],
  'The cat sat on the floor because the': [
    { token: ' couch', prob: 0.40 },
    { token: ' bed', prob: 0.20 },
    { token: ' chair', prob: 0.15 },
    { token: ' rug', prob: 0.15 },
    { token: ' mat', prob: 0.10 },
  ],

  // ── COUCH branch ─────────────────────────────────────────────────────
  'The cat sat on the couch': [
    { token: ',', prob: 0.30 },
    { token: '.', prob: 0.25 },
    { token: ' and', prob: 0.20 },
    { token: ' purring', prob: 0.12 },
    { token: ' watching', prob: 0.08 },
    { token: ' eating', prob: 0.05 },
  ],
  'The cat sat on the couch,': [
    { token: ' purring', prob: 0.30 },
    { token: ' kneading', prob: 0.25 },
    { token: ' watching', prob: 0.20 },
    { token: ' refusing', prob: 0.15 },
    { token: ' as', prob: 0.10 },
  ],
  'The cat sat on the couch, purring': [
    { token: ' softly', prob: 0.40 },
    { token: '.', prob: 0.30 },
    { token: ' loudly', prob: 0.20 },
    { token: ' contentedly', prob: 0.10 },
  ],
  'The cat sat on the couch, kneading': [
    { token: ' the', prob: 0.85 },
    { token: ' a', prob: 0.10 },
    { token: ' it', prob: 0.05 },
  ],
  'The cat sat on the couch, kneading the': [
    { token: ' cushion', prob: 0.50 },
    { token: ' fabric', prob: 0.25 },
    { token: ' blanket', prob: 0.15 },
    { token: ' pillow', prob: 0.10 },
  ],

  // ── WINDOWSILL branch ─────────────────────────────────────────────────
  'The cat sat on the windowsill': [
    { token: ',', prob: 0.32 },
    { token: ' watching', prob: 0.24 },
    { token: ' staring', prob: 0.16 },
    { token: '.', prob: 0.12 },
    { token: ' purring', prob: 0.08 },
    { token: ' plotting', prob: 0.08 },
  ],
  'The cat sat on the windowsill,': [
    { token: ' watching', prob: 0.40 },
    { token: ' tail', prob: 0.20 },
    { token: ' eyes', prob: 0.20 },
    { token: ' silently', prob: 0.12 },
    { token: ' as', prob: 0.08 },
  ],
  'The cat sat on the windowsill, watching': [
    { token: ' the', prob: 0.50 },
    { token: ' birds', prob: 0.25 },
    { token: ' squirrels', prob: 0.15 },
    { token: ' people', prob: 0.10 },
  ],
  'The cat sat on the windowsill, watching the': [
    { token: ' birds', prob: 0.30 },
    { token: ' world', prob: 0.25 },
    { token: ' rain', prob: 0.20 },
    { token: ' street', prob: 0.15 },
    { token: ' garden', prob: 0.10 },
  ],
  'The cat sat on the windowsill, watching the birds': [
    { token: '.', prob: 0.40 },
    { token: ',', prob: 0.30 },
    { token: ' outside', prob: 0.20 },
    { token: ' with', prob: 0.10 },
  ],
  'The cat sat on the windowsill watching': [
    { token: ' the', prob: 0.60 },
    { token: ' birds', prob: 0.25 },
    { token: ' squirrels', prob: 0.15 },
  ],

  // ── KEYBOARD branch (humorous) ────────────────────────────────────────
  'The cat sat on the keyboard': [
    { token: ',', prob: 0.30 },
    { token: ' again', prob: 0.20 },
    { token: ' deleting', prob: 0.18 },
    { token: '.', prob: 0.14 },
    { token: ' and', prob: 0.10 },
    { token: ' refusing', prob: 0.08 },
  ],
  'The cat sat on the keyboard,': [
    { token: ' deleting', prob: 0.35 },
    { token: ' refusing', prob: 0.25 },
    { token: ' typing', prob: 0.20 },
    { token: ' purring', prob: 0.12 },
    { token: ' as', prob: 0.08 },
  ],
  'The cat sat on the keyboard, deleting': [
    { token: ' my', prob: 0.50 },
    { token: ' an', prob: 0.20 },
    { token: ' the', prob: 0.20 },
    { token: ' three', prob: 0.10 },
  ],
  'The cat sat on the keyboard, deleting my': [
    { token: ' essay', prob: 0.40 },
    { token: ' email', prob: 0.30 },
    { token: ' work', prob: 0.20 },
    { token: ' code', prob: 0.10 },
  ],
  'The cat sat on the keyboard, deleting my essay': [
    { token: '.', prob: 0.85 },
    { token: ',', prob: 0.15 },
  ],
  'The cat sat on the keyboard again': [
    { token: '.', prob: 0.50 },
    { token: ',', prob: 0.30 },
    { token: ' and', prob: 0.20 },
  ],

  // ── RUG / FENCE / ROOF / COUNTER / BED short branches ─────────────────
  'The cat sat on the rug': [
    { token: ',', prob: 0.30 },
    { token: '.', prob: 0.30 },
    { token: ' watching', prob: 0.20 },
    { token: ' purring', prob: 0.20 },
  ],
  'The cat sat on the fence': [
    { token: ',', prob: 0.40 },
    { token: '.', prob: 0.30 },
    { token: ' watching', prob: 0.20 },
    { token: ' yelling', prob: 0.10 },
  ],
  'The cat sat on the roof': [
    { token: ' of', prob: 0.36 },
    { token: ',', prob: 0.22 },
    { token: ' watching', prob: 0.14 },
    { token: '.', prob: 0.12 },
    { token: ' staring', prob: 0.10 },
    { token: ' yelling', prob: 0.06 },
  ],
  'The cat sat on the roof of': [
    { token: ' the', prob: 0.85 },
    { token: ' my', prob: 0.10 },
    { token: ' a', prob: 0.05 },
  ],
  'The cat sat on the roof of the': [
    { token: ' shed', prob: 0.30 },
    { token: ' garage', prob: 0.25 },
    { token: ' house', prob: 0.20 },
    { token: ' car', prob: 0.15 },
    { token: ' barn', prob: 0.10 },
  ],
  'The cat sat on the counter': [
    { token: ',', prob: 0.40 },
    { token: '.', prob: 0.30 },
    { token: ' eating', prob: 0.15 },
    { token: ' watching', prob: 0.15 },
  ],
  'The cat sat on the bed': [
    { token: ',', prob: 0.35 },
    { token: '.', prob: 0.30 },
    { token: ' purring', prob: 0.20 },
    { token: ' kneading', prob: 0.15 },
  ],

  // ═══════════════════════════════════════════════════════════════════════
  // ── DRAGON PATH ────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════
  'Once upon a time, there was a small dragon who': [
    { token: ' lived', prob: 0.26 },
    { token: ' loved', prob: 0.18 },
    { token: ' could', prob: 0.16 },
    { token: ' was', prob: 0.10 },
    { token: ' did', prob: 0.08 },
    { token: ' refused', prob: 0.07 },
    { token: ' collected', prob: 0.05 },
    { token: ' had', prob: 0.05 },
    { token: ' dreamed', prob: 0.05 },
  ],

  // ── lived branch ─────────────────────────────────────────────────────
  'Once upon a time, there was a small dragon who lived': [
    { token: ' in', prob: 0.62 },
    { token: ' alone', prob: 0.14 },
    { token: ' on', prob: 0.10 },
    { token: ' beneath', prob: 0.08 },
    { token: ' high', prob: 0.06 },
  ],
  'Once upon a time, there was a small dragon who lived in': [
    { token: ' a', prob: 0.46 },
    { token: ' the', prob: 0.32 },
    { token: ' an', prob: 0.10 },
    { token: ' caves', prob: 0.06 },
    { token: ' mountains', prob: 0.06 },
  ],
  'Once upon a time, there was a small dragon who lived in a': [
    { token: ' cave', prob: 0.30 },
    { token: ' tiny', prob: 0.18 },
    { token: ' cozy', prob: 0.14 },
    { token: ' teapot', prob: 0.12 },
    { token: ' library', prob: 0.10 },
    { token: ' forest', prob: 0.08 },
    { token: ' sock', prob: 0.06 },
    { token: ' tower', prob: 0.02 },
  ],
  'Once upon a time, there was a small dragon who lived in a cave': [
    { token: ' with', prob: 0.30 },
    { token: ',', prob: 0.22 },
    { token: '.', prob: 0.18 },
    { token: ' full', prob: 0.15 },
    { token: ' near', prob: 0.10 },
    { token: ' deep', prob: 0.05 },
  ],
  'Once upon a time, there was a small dragon who lived in a cave with': [
    { token: ' a', prob: 0.45 },
    { token: ' his', prob: 0.20 },
    { token: ' her', prob: 0.15 },
    { token: ' seven', prob: 0.10 },
    { token: ' hundreds', prob: 0.10 },
  ],
  'Once upon a time, there was a small dragon who lived in a cave with a': [
    { token: ' collection', prob: 0.30 },
    { token: ' library', prob: 0.22 },
    { token: ' hoard', prob: 0.20 },
    { token: ' single', prob: 0.15 },
    { token: ' very', prob: 0.13 },
  ],
  'Once upon a time, there was a small dragon who lived in a cave with a collection': [
    { token: ' of', prob: 0.95 },
    { token: '.', prob: 0.05 },
  ],
  'Once upon a time, there was a small dragon who lived in a cave with a collection of': [
    { token: ' books', prob: 0.30 },
    { token: ' teacups', prob: 0.22 },
    { token: ' pebbles', prob: 0.18 },
    { token: ' buttons', prob: 0.12 },
    { token: ' maps', prob: 0.10 },
    { token: ' poems', prob: 0.08 },
  ],
  'Once upon a time, there was a small dragon who lived in a cave with a collection of books': [
    { token: '.', prob: 0.55 },
    { token: ' that', prob: 0.20 },
    { token: ',', prob: 0.15 },
    { token: ' he', prob: 0.10 },
  ],
  'Once upon a time, there was a small dragon who lived in a cave with a collection of teacups': [
    { token: '.', prob: 0.55 },
    { token: ',', prob: 0.20 },
    { token: ' that', prob: 0.15 },
    { token: ' he', prob: 0.10 },
  ],
  'Once upon a time, there was a small dragon who lived in a teapot': [
    { token: '.', prob: 0.45 },
    { token: ',', prob: 0.25 },
    { token: ' on', prob: 0.20 },
    { token: ' which', prob: 0.10 },
  ],
  'Once upon a time, there was a small dragon who lived in a tiny': [
    { token: ' cave', prob: 0.40 },
    { token: ' cottage', prob: 0.25 },
    { token: ' village', prob: 0.20 },
    { token: ' library', prob: 0.15 },
  ],
  'Once upon a time, there was a small dragon who lived in a cozy': [
    { token: ' cave', prob: 0.40 },
    { token: ' cottage', prob: 0.30 },
    { token: ' nook', prob: 0.20 },
    { token: ' attic', prob: 0.10 },
  ],
  'Once upon a time, there was a small dragon who lived in a sock': [
    { token: '.', prob: 0.85 },
    { token: ',', prob: 0.10 },
    { token: ' drawer', prob: 0.05 },
  ],

  // ── loved branch ─────────────────────────────────────────────────────
  'Once upon a time, there was a small dragon who loved': [
    { token: ' to', prob: 0.36 },
    { token: ' books', prob: 0.18 },
    { token: ' tea', prob: 0.14 },
    { token: ' nothing', prob: 0.10 },
    { token: ' nobody', prob: 0.08 },
    { token: ' singing', prob: 0.08 },
    { token: ' baking', prob: 0.06 },
  ],
  'Once upon a time, there was a small dragon who loved to': [
    { token: ' read', prob: 0.25 },
    { token: ' bake', prob: 0.20 },
    { token: ' sing', prob: 0.15 },
    { token: ' collect', prob: 0.12 },
    { token: ' nap', prob: 0.10 },
    { token: ' garden', prob: 0.10 },
    { token: ' knit', prob: 0.08 },
  ],
  'Once upon a time, there was a small dragon who loved to bake': [
    { token: '.', prob: 0.30 },
    { token: ' tiny', prob: 0.30 },
    { token: ' cakes', prob: 0.20 },
    { token: ' bread', prob: 0.15 },
    { token: ',', prob: 0.05 },
  ],
  'Once upon a time, there was a small dragon who loved to bake tiny': [
    { token: ' cakes', prob: 0.40 },
    { token: ' cookies', prob: 0.30 },
    { token: ' pies', prob: 0.20 },
    { token: ' loaves', prob: 0.10 },
  ],
  'Once upon a time, there was a small dragon who loved to bake tiny cakes': [
    { token: '.', prob: 0.55 },
    { token: ' for', prob: 0.30 },
    { token: ',', prob: 0.15 },
  ],
  'Once upon a time, there was a small dragon who loved to read': [
    { token: '.', prob: 0.30 },
    { token: ' poetry', prob: 0.25 },
    { token: ' books', prob: 0.20 },
    { token: ' alone', prob: 0.15 },
    { token: ',', prob: 0.10 },
  ],

  // ── could branch ─────────────────────────────────────────────────────
  'Once upon a time, there was a small dragon who could': [
    { token: ' not', prob: 0.32 },
    { token: ' fly', prob: 0.22 },
    { token: ' breathe', prob: 0.18 },
    { token: ' speak', prob: 0.12 },
    { token: ' barely', prob: 0.10 },
    { token: ' juggle', prob: 0.06 },
  ],
  'Once upon a time, there was a small dragon who could not': [
    { token: ' fly', prob: 0.40 },
    { token: ' breathe', prob: 0.25 },
    { token: ' yet', prob: 0.15 },
    { token: ' read', prob: 0.10 },
    { token: ' speak', prob: 0.10 },
  ],
  'Once upon a time, there was a small dragon who could not fly': [
    { token: '.', prob: 0.65 },
    { token: ',', prob: 0.20 },
    { token: ' yet', prob: 0.15 },
  ],
  'Once upon a time, there was a small dragon who could fly': [
    { token: '.', prob: 0.40 },
    { token: ' backwards', prob: 0.25 },
    { token: ',', prob: 0.20 },
    { token: ' but', prob: 0.15 },
  ],
  'Once upon a time, there was a small dragon who could breathe': [
    { token: ' fire', prob: 0.40 },
    { token: ' bubbles', prob: 0.25 },
    { token: ' tiny', prob: 0.20 },
    { token: ' underwater', prob: 0.15 },
  ],

  // ── refused branch ───────────────────────────────────────────────────
  'Once upon a time, there was a small dragon who refused': [
    { token: ' to', prob: 0.95 },
    { token: ',', prob: 0.05 },
  ],
  'Once upon a time, there was a small dragon who refused to': [
    { token: ' breathe', prob: 0.30 },
    { token: ' fly', prob: 0.25 },
    { token: ' speak', prob: 0.20 },
    { token: ' eat', prob: 0.15 },
    { token: ' wake', prob: 0.10 },
  ],
  'Once upon a time, there was a small dragon who refused to breathe': [
    { token: ' fire', prob: 0.85 },
    { token: '.', prob: 0.10 },
    { token: ',', prob: 0.05 },
  ],
  'Once upon a time, there was a small dragon who refused to breathe fire': [
    { token: '.', prob: 0.85 },
    { token: ',', prob: 0.15 },
  ],
  'Once upon a time, there was a small dragon who collected': [
    { token: ' teacups', prob: 0.30 },
    { token: ' books', prob: 0.25 },
    { token: ' stamps', prob: 0.15 },
    { token: ' pebbles', prob: 0.15 },
    { token: ' regrets', prob: 0.10 },
    { token: ' shiny', prob: 0.05 },
  ],
  'Once upon a time, there was a small dragon who collected teacups': [
    { token: '.', prob: 0.55 },
    { token: ' from', prob: 0.25 },
    { token: ',', prob: 0.20 },
  ],

  // ═══════════════════════════════════════════════════════════════════════
  // ── EMAIL PATH ─────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════
  'Dear boss, I am writing to ask for': [
    { token: ' a', prob: 0.48 },
    { token: ' your', prob: 0.22 },
    { token: ' some', prob: 0.12 },
    { token: ' time', prob: 0.08 },
    { token: ' permission', prob: 0.06 },
    { token: ' clarification', prob: 0.04 },
  ],
  'Dear boss, I am writing to ask for a': [
    { token: ' raise', prob: 0.36 },
    { token: ' day', prob: 0.20 },
    { token: ' few', prob: 0.16 },
    { token: ' promotion', prob: 0.10 },
    { token: ' meeting', prob: 0.08 },
    { token: ' new', prob: 0.04 },
    { token: ' dragon', prob: 0.03 },
    { token: ' personal', prob: 0.03 },
  ],
  'Dear boss, I am writing to ask for a raise': [
    { token: '.', prob: 0.36 },
    { token: ',', prob: 0.22 },
    { token: ' because', prob: 0.18 },
    { token: ' of', prob: 0.14 },
    { token: ' based', prob: 0.10 },
  ],
  'Dear boss, I am writing to ask for a raise.': [
    { token: ' I', prob: 0.42 },
    { token: ' Over', prob: 0.16 },
    { token: ' For', prob: 0.14 },
    { token: ' My', prob: 0.14 },
    { token: ' As', prob: 0.08 },
    { token: ' Please', prob: 0.06 },
  ],
  'Dear boss, I am writing to ask for a raise. I': [
    { token: ' have', prob: 0.30 },
    { token: ' believe', prob: 0.22 },
    { token: ' feel', prob: 0.18 },
    { token: ' would', prob: 0.15 },
    { token: ' think', prob: 0.10 },
    { token: ' am', prob: 0.05 },
  ],
  'Dear boss, I am writing to ask for a raise. I have': [
    { token: ' been', prob: 0.45 },
    { token: ' worked', prob: 0.20 },
    { token: ' consistently', prob: 0.15 },
    { token: ' contributed', prob: 0.10 },
    { token: ' delivered', prob: 0.10 },
  ],
  'Dear boss, I am writing to ask for a raise. I have been': [
    { token: ' with', prob: 0.30 },
    { token: ' a', prob: 0.20 },
    { token: ' working', prob: 0.20 },
    { token: ' here', prob: 0.15 },
    { token: ' an', prob: 0.15 },
  ],
  'Dear boss, I am writing to ask for a raise. I have been working': [
    { token: ' here', prob: 0.50 },
    { token: ' tirelessly', prob: 0.20 },
    { token: ' on', prob: 0.15 },
    { token: ' hard', prob: 0.15 },
  ],
  'Dear boss, I am writing to ask for a raise. I believe': [
    { token: ' my', prob: 0.50 },
    { token: ' I', prob: 0.30 },
    { token: ' the', prob: 0.20 },
  ],
  'Dear boss, I am writing to ask for a raise. I believe my': [
    { token: ' contributions', prob: 0.40 },
    { token: ' performance', prob: 0.30 },
    { token: ' work', prob: 0.20 },
    { token: ' time', prob: 0.10 },
  ],
  'Dear boss, I am writing to ask for a raise, because': [
    { token: ' I', prob: 0.40 },
    { token: ' my', prob: 0.30 },
    { token: ' the', prob: 0.15 },
    { token: ' over', prob: 0.15 },
  ],
  'Dear boss, I am writing to ask for a day': [
    { token: ' off', prob: 0.85 },
    { token: ' of', prob: 0.10 },
    { token: ',', prob: 0.05 },
  ],
  'Dear boss, I am writing to ask for a day off': [
    { token: '.', prob: 0.40 },
    { token: ' next', prob: 0.30 },
    { token: ' on', prob: 0.18 },
    { token: ',', prob: 0.12 },
  ],
  'Dear boss, I am writing to ask for a day off next': [
    { token: ' week', prob: 0.55 },
    { token: ' Friday', prob: 0.25 },
    { token: ' Monday', prob: 0.15 },
    { token: ' month', prob: 0.05 },
  ],
  'Dear boss, I am writing to ask for a day off next week': [
    { token: '.', prob: 0.55 },
    { token: ',', prob: 0.20 },
    { token: ' to', prob: 0.15 },
    { token: ' for', prob: 0.10 },
  ],
  'Dear boss, I am writing to ask for a few': [
    { token: ' days', prob: 0.55 },
    { token: ' weeks', prob: 0.20 },
    { token: ' minutes', prob: 0.10 },
    { token: ' hours', prob: 0.10 },
    { token: ' things', prob: 0.05 },
  ],
  'Dear boss, I am writing to ask for a few days': [
    { token: ' off', prob: 0.65 },
    { token: ' of', prob: 0.20 },
    { token: '.', prob: 0.10 },
    { token: ',', prob: 0.05 },
  ],
  'Dear boss, I am writing to ask for a promotion': [
    { token: '.', prob: 0.40 },
    { token: ',', prob: 0.25 },
    { token: ' to', prob: 0.20 },
    { token: ' based', prob: 0.15 },
  ],
  'Dear boss, I am writing to ask for a meeting': [
    { token: '.', prob: 0.30 },
    { token: ' to', prob: 0.30 },
    { token: ' next', prob: 0.20 },
    { token: ' at', prob: 0.10 },
    { token: ',', prob: 0.10 },
  ],
  'Dear boss, I am writing to ask for a dragon': [
    { token: '.', prob: 0.50 },
    { token: ' to', prob: 0.25 },
    { token: ',', prob: 0.15 },
    { token: ' as', prob: 0.10 },
  ],
  'Dear boss, I am writing to ask for your': [
    { token: ' approval', prob: 0.32 },
    { token: ' help', prob: 0.22 },
    { token: ' advice', prob: 0.18 },
    { token: ' guidance', prob: 0.14 },
    { token: ' feedback', prob: 0.10 },
    { token: ' patience', prob: 0.04 },
  ],
  'Dear boss, I am writing to ask for your approval': [
    { token: ' on', prob: 0.40 },
    { token: ' for', prob: 0.30 },
    { token: '.', prob: 0.20 },
    { token: ',', prob: 0.10 },
  ],
  'Dear boss, I am writing to ask for some': [
    { token: ' time', prob: 0.40 },
    { token: ' advice', prob: 0.25 },
    { token: ' clarification', prob: 0.20 },
    { token: ' flexibility', prob: 0.15 },
  ],
}

// Slightly smarter fallback — if we go off-script, bias toward ending the
// sentence quickly rather than rambling. Also varies based on context.
export function getFallback(textSoFar: string): TokenChoice[] {
  const trimmed = textSoFar.trimEnd()
  const last = trimmed.slice(-1)
  const endsSentence = last === '.' || last === '!' || last === '?'
  const endsComma = last === ','

  if (endsSentence) {
    return [
      { token: ' The', prob: 0.18 },
      { token: ' It', prob: 0.16 },
      { token: ' She', prob: 0.12 },
      { token: ' He', prob: 0.10 },
      { token: ' But', prob: 0.10 },
      { token: ' And', prob: 0.10 },
      { token: ' Then', prob: 0.10 },
      { token: ' Suddenly', prob: 0.08 },
      { token: ' Meanwhile', prob: 0.06 },
    ]
  }
  if (endsComma) {
    return [
      { token: ' and', prob: 0.22 },
      { token: ' but', prob: 0.18 },
      { token: ' so', prob: 0.14 },
      { token: ' which', prob: 0.12 },
      { token: ' as', prob: 0.10 },
      { token: ' while', prob: 0.10 },
      { token: ' looking', prob: 0.08 },
      { token: ' waiting', prob: 0.06 },
    ]
  }
  // Otherwise, lean toward ending the sentence.
  return [
    { token: '.', prob: 0.36 },
    { token: ',', prob: 0.18 },
    { token: ' and', prob: 0.10 },
    { token: ' the', prob: 0.10 },
    { token: ' a', prob: 0.08 },
    { token: ' to', prob: 0.06 },
    { token: ' of', prob: 0.06 },
    { token: ' with', prob: 0.06 },
  ]
}

export function getDistribution(textSoFar: string): {
  choices: TokenChoice[]
  authored: boolean
} {
  const exact = DATA[textSoFar]
  if (exact) return { choices: exact, authored: true }
  return { choices: getFallback(textSoFar), authored: false }
}
