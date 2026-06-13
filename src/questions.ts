export type Answer = {
  text: string;
  points: number;
};

export type Question = {
  id: string;
  round: number;
  set: string;
  prompt: string;
  answers: Answer[];
};

const setName = "Main Set";

export const questions: Question[] = [
  {
    id: "fridge-complain",
    round: 1,
    set: setName,
    prompt: "Name something your fridge would complain about if it could talk.",
    answers: [
      { text: "Expired food", points: 30 },
      { text: "Opening it too often", points: 25 },
      { text: "Not cleaning spills", points: 20 },
      { text: "Ignoring vegetables", points: 15 },
      { text: "Weird leftovers", points: 10 },
    ],
  },
  {
    id: "oops-place",
    round: 2,
    set: setName,
    prompt: "Name a place you'd hate to hear someone say, \"Oops.\"",
    answers: [
      { text: "Operating room", points: 35 },
      { text: "Airplane", points: 25 },
      { text: "Nuclear power plant", points: 20 },
      { text: "Library", points: 10 },
      { text: "Job interview", points: 5 },
    ],
  },
  {
    id: "pretend-asleep",
    round: 3,
    set: setName,
    prompt: "Name a reason someone might pretend to be asleep.",
    answers: [
      { text: "Avoid dishes", points: 30 },
      { text: "Dodge a phone call", points: 25 },
      { text: "Escape conversation", points: 20 },
      { text: "Avoid chores", points: 15 },
      { text: "Boring meeting", points: 10 },
    ],
  },
  {
    id: "worst-place-asleep",
    round: 4,
    set: setName,
    prompt: "Name the worst place to accidentally fall asleep.",
    answers: [
      { text: "Behind the wheel", points: 60 },
      { text: "Work/meeting", points: 17 },
      { text: "Bus/train", points: 11 },
      { text: "Church", points: 11 },
    ],
  },
  {
    id: "backpack-unneeded",
    round: 5,
    set: setName,
    prompt: "Name something you can fit in a backpack but absolutely don't need in there.",
    answers: [
      { text: "Burrito", points: 28 },
      { text: "Carton of eggs", points: 20 },
      { text: "Small instrument", points: 15 },
      { text: "Pet", points: 15 },
      { text: "Baby sibling", points: 12 },
      { text: "Toaster", points: 10 },
    ],
  },
  {
    id: "sing-dont-know-words",
    round: 6,
    set: setName,
    prompt: "Name something you do when you want to sing along but don't know the words.",
    answers: [
      { text: "Hum", points: 66 },
      { text: "Mumble", points: 18 },
      { text: "Pretend to know", points: 6 },
      { text: "Whistle", points: 4 },
      { text: "Lip sync", points: 4 },
    ],
  },
  {
    id: "cant-cook-thanksgiving",
    round: 7,
    set: setName,
    prompt: "Name something a person who can't cook should bring to Thanksgiving.",
    answers: [
      { text: "Drinks", points: 25 },
      { text: "Salad", points: 20 },
      { text: "Dessert", points: 20 },
      { text: "Rolls", points: 17 },
      { text: "Cranberry sauce", points: 15 },
    ],
  },
  {
    id: "bad-dinner-manners",
    round: 8,
    set: setName,
    prompt: "Name something people do at the dinner table even though it's bad manners.",
    answers: [
      { text: "Burp", points: 41 },
      { text: "Elbows on table", points: 32 },
      { text: "Talk with full mouth", points: 18 },
      { text: "Eat with hands", points: 3 },
      { text: "Chew with mouth open", points: 3 },
    ],
  },
  {
    id: "morning-routine-broken",
    round: 9,
    set: setName,
    prompt: "Name something you'd hate to discover wasn't working during your morning routine.",
    answers: [
      { text: "Shower", points: 33 },
      { text: "Toilet", points: 20 },
      { text: "Coffee maker", points: 17 },
      { text: "Hair dryer", points: 12 },
      { text: "Toothbrush", points: 8 },
    ],
  },
  {
    id: "slow-vehicle",
    round: 10,
    set: setName,
    prompt: "Name a slow vehicle you hate getting stuck behind.",
    answers: [
      { text: "Bus", points: 34 },
      { text: "Semi truck", points: 26 },
      { text: "Tractor", points: 23 },
      { text: "Garbage truck", points: 6 },
      { text: "Dump truck", points: 4 },
    ],
  },
  {
    id: "spend-too-much-impress",
    round: 11,
    set: setName,
    prompt: "Name something people spend too much money on just to impress others.",
    answers: [
      { text: "Clothes", points: 41 },
      { text: "Car", points: 40 },
      { text: "House", points: 10 },
      { text: "Haircut", points: 3 },
      { text: "Jewelry", points: 3 },
    ],
  },
  {
    id: "elevator-alone",
    round: 12,
    set: setName,
    prompt: "Name something people do in elevators when they think no one is watching.",
    answers: [
      { text: "Dance", points: 35 },
      { text: "Check themselves out", points: 20 },
      { text: "Practice speech", points: 15 },
      { text: "Stare at buttons", points: 5 },
    ],
  },
  {
    id: "cereal-box-surprise",
    round: 13,
    set: setName,
    prompt: "Name something you don't want to find in your cereal box.",
    answers: [
      { text: "Live bug", points: 30 },
      { text: "Socks", points: 25 },
      { text: "Love letter from milk carton", points: 20 },
      { text: "GPS tracker", points: 15 },
      { text: "Smaller cereal box", points: 10 },
    ],
  },
  {
    id: "full-of-holes",
    round: 14,
    set: setName,
    prompt: "Name something that might be full of holes.",
    answers: [
      { text: "Swiss cheese", points: 40 },
      { text: "Clothes/socks", points: 16 },
      { text: "Alibi/story", points: 14 },
      { text: "Net", points: 9 },
      { text: "Strainer", points: 8 },
    ],
  },
  {
    id: "snowmen-nightmares",
    round: 15,
    set: setName,
    prompt: "Name something snowmen might have nightmares about.",
    answers: [
      { text: "Sun/beach weather", points: 62 },
      { text: "Fire", points: 14 },
      { text: "Blow dryer", points: 3 },
      { text: "Rain", points: 3 },
      { text: "Snowplow", points: 3 },
    ],
  },
];
