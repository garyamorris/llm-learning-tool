// Hand-authored "language model" — probability distributions for next-token
// prediction. Keyed by the exact text so far. When the path goes off-map,
// we fall back to a generic distribution. The numbers are made up; the goal
// is to FEEL real and teach the mechanic.

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
  // ── Cat path ────────────────────────────────────────────────────────────
  'The cat sat on the': [
    { token: ' mat', prob: 0.47 },
    { token: ' floor', prob: 0.14 },
    { token: ' couch', prob: 0.11 },
    { token: ' windowsill', prob: 0.09 },
    { token: ' keyboard', prob: 0.06 },
    { token: ' rug', prob: 0.05 },
    { token: ' fence', prob: 0.04 },
    { token: ' roof', prob: 0.04 },
  ],
  'The cat sat on the mat': [
    { token: '.', prob: 0.42 },
    { token: ' and', prob: 0.18 },
    { token: ',', prob: 0.13 },
    { token: ' watching', prob: 0.10 },
    { token: ' purring', prob: 0.08 },
    { token: ' looking', prob: 0.05 },
    { token: ' staring', prob: 0.04 },
  ],
  'The cat sat on the mat and': [
    { token: ' stared', prob: 0.24 },
    { token: ' waited', prob: 0.18 },
    { token: ' purred', prob: 0.16 },
    { token: ' yawned', prob: 0.12 },
    { token: ' watched', prob: 0.11 },
    { token: ' licked', prob: 0.10 },
    { token: ' refused', prob: 0.05 },
    { token: ' meowed', prob: 0.04 },
  ],
  'The cat sat on the mat and stared': [
    { token: ' at', prob: 0.62 },
    { token: ' into', prob: 0.18 },
    { token: ' silently', prob: 0.08 },
    { token: ' menacingly', prob: 0.06 },
    { token: ' out', prob: 0.06 },
  ],
  'The cat sat on the mat and stared at': [
    { token: ' me', prob: 0.34 },
    { token: ' the', prob: 0.28 },
    { token: ' nothing', prob: 0.14 },
    { token: ' a', prob: 0.10 },
    { token: ' something', prob: 0.08 },
    { token: ' you', prob: 0.06 },
  ],
  'The cat sat on the mat and stared at the': [
    { token: ' wall', prob: 0.28 },
    { token: ' door', prob: 0.22 },
    { token: ' window', prob: 0.18 },
    { token: ' ceiling', prob: 0.14 },
    { token: ' fridge', prob: 0.10 },
    { token: ' empty', prob: 0.08 },
  ],
  'The cat sat on the floor': [
    { token: '.', prob: 0.38 },
    { token: ' because', prob: 0.18 },
    { token: ' and', prob: 0.16 },
    { token: ' staring', prob: 0.10 },
    { token: ',', prob: 0.10 },
    { token: ' looking', prob: 0.08 },
  ],
  'The cat sat on the floor because': [
    { token: ' the', prob: 0.32 },
    { token: ' it', prob: 0.30 },
    { token: ' someone', prob: 0.14 },
    { token: ' nobody', prob: 0.10 },
    { token: ' I', prob: 0.08 },
    { token: ' she', prob: 0.06 },
  ],
  'The cat sat on the couch': [
    { token: '.', prob: 0.40 },
    { token: ' and', prob: 0.18 },
    { token: ',', prob: 0.14 },
    { token: ' purring', prob: 0.12 },
    { token: ' watching', prob: 0.10 },
    { token: ' eating', prob: 0.06 },
  ],
  'The cat sat on the windowsill': [
    { token: ',', prob: 0.32 },
    { token: ' watching', prob: 0.24 },
    { token: ' staring', prob: 0.16 },
    { token: '.', prob: 0.14 },
    { token: ' purring', prob: 0.08 },
    { token: ' plotting', prob: 0.06 },
  ],
  'The cat sat on the keyboard': [
    { token: ',', prob: 0.30 },
    { token: ' again', prob: 0.20 },
    { token: ' deleting', prob: 0.18 },
    { token: '.', prob: 0.14 },
    { token: ' and', prob: 0.10 },
    { token: ' refusing', prob: 0.08 },
  ],
  'The cat sat on the roof': [
    { token: ' of', prob: 0.36 },
    { token: ',', prob: 0.22 },
    { token: ' watching', prob: 0.14 },
    { token: '.', prob: 0.12 },
    { token: ' staring', prob: 0.10 },
    { token: ' yelling', prob: 0.06 },
  ],

  // ── Dragon path ─────────────────────────────────────────────────────────
  'Once upon a time, there was a small dragon who': [
    { token: ' lived', prob: 0.28 },
    { token: ' loved', prob: 0.20 },
    { token: ' could', prob: 0.16 },
    { token: ' was', prob: 0.12 },
    { token: ' did', prob: 0.10 },
    { token: ' refused', prob: 0.08 },
    { token: ' collected', prob: 0.06 },
  ],
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
    { token: ' cave', prob: 0.32 },
    { token: ' tiny', prob: 0.18 },
    { token: ' cozy', prob: 0.14 },
    { token: ' teapot', prob: 0.12 },
    { token: ' library', prob: 0.10 },
    { token: ' forest', prob: 0.08 },
    { token: ' sock', prob: 0.06 },
  ],
  'Once upon a time, there was a small dragon who loved': [
    { token: ' to', prob: 0.36 },
    { token: ' books', prob: 0.18 },
    { token: ' tea', prob: 0.14 },
    { token: ' nothing', prob: 0.10 },
    { token: ' nobody', prob: 0.08 },
    { token: ' singing', prob: 0.08 },
    { token: ' baking', prob: 0.06 },
  ],
  'Once upon a time, there was a small dragon who could': [
    { token: ' not', prob: 0.32 },
    { token: ' fly', prob: 0.22 },
    { token: ' breathe', prob: 0.18 },
    { token: ' speak', prob: 0.12 },
    { token: ' barely', prob: 0.10 },
    { token: ' juggle', prob: 0.06 },
  ],

  // ── Email path ──────────────────────────────────────────────────────────
  'Dear boss, I am writing to ask for': [
    { token: ' a', prob: 0.48 },
    { token: ' your', prob: 0.22 },
    { token: ' some', prob: 0.12 },
    { token: ' time', prob: 0.08 },
    { token: ' permission', prob: 0.06 },
    { token: ' clarification', prob: 0.04 },
  ],
  'Dear boss, I am writing to ask for a': [
    { token: ' raise', prob: 0.38 },
    { token: ' day', prob: 0.20 },
    { token: ' few', prob: 0.16 },
    { token: ' promotion', prob: 0.10 },
    { token: ' meeting', prob: 0.08 },
    { token: ' new', prob: 0.04 },
    { token: ' dragon', prob: 0.04 },
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
  'Dear boss, I am writing to ask for your': [
    { token: ' approval', prob: 0.32 },
    { token: ' help', prob: 0.22 },
    { token: ' advice', prob: 0.18 },
    { token: ' guidance', prob: 0.14 },
    { token: ' feedback', prob: 0.10 },
    { token: ' patience', prob: 0.04 },
  ],
}

// Generic fallback distribution for any unauthored state. Slightly varies
// based on whether the last char is end-punctuation, opening a new sentence.
export function getFallback(textSoFar: string): TokenChoice[] {
  const last = textSoFar.trim().slice(-1)
  const endsSentence = last === '.' || last === '!' || last === '?'

  if (endsSentence) {
    return [
      { token: ' The', prob: 0.22 },
      { token: ' It', prob: 0.18 },
      { token: ' She', prob: 0.14 },
      { token: ' But', prob: 0.12 },
      { token: ' And', prob: 0.10 },
      { token: ' Then', prob: 0.10 },
      { token: ' Suddenly', prob: 0.08 },
      { token: ' Meanwhile', prob: 0.06 },
    ]
  }
  return [
    { token: ' the', prob: 0.20 },
    { token: ' and', prob: 0.16 },
    { token: ',', prob: 0.14 },
    { token: '.', prob: 0.12 },
    { token: ' a', prob: 0.10 },
    { token: ' to', prob: 0.10 },
    { token: ' of', prob: 0.10 },
    { token: ' was', prob: 0.08 },
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
