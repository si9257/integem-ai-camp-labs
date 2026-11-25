import { t } from "./common.js";
import { sample, prepared } from "./sample.js";
const soundNotes = t(
  [
    "Mic check at rehearsal",
    "The band played the same eight-bar loop three times. The drummer and the recorder stayed in place. Only the foam panel moved.",
    "With no panel, the clap echo lasted 1.2 seconds. With the panel behind the drummer, it lasted 0.7 seconds. With the panel by the door, it lasted 0.9 seconds.",
    "The group timed the echo with the same recorder. Nobody measured loudness or asked listeners which take they preferred.",
  ].join("\n\n"),
  [
    "排练室的声音测试",
    "乐队将相同的八小节乐句演奏了三次。鼓手和录音设备的位置不变，只有泡沫板的位置发生变化。",
    "没有泡沫板时，拍手回声持续 1.2 秒。板放在鼓手身后时为 0.7 秒，放在门边时为 0.9 秒。",
    "小组用同一台录音设备测量回声时间。没有人测量响度，也没有询问听众更喜欢哪次演奏。",
  ].join("\n\n")
);
const soundQuestions = [
  {
    question: t(
      "What did the band change between takes?",
      "乐队每次演奏时改变了什么？"
    ),
    options: t(
      [
        "The loop length",
        "The recorder",
        "The foam panel setup",
        "The drummer",
      ],
      ["乐句长度", "录音设备", "泡沫板的摆放", "鼓手"]
    ),
    correct: 2,
    evidence: t("Only the foam panel moved.", "只有泡沫板的位置发生变化。"),
    explanation: t(
      "The band held the loop, drummer and recorder constant.",
      "乐句、鼓手和录音设备保持不变。"
    ),
    hint: t(
      "Separate what stayed put from what the band moved.",
      "分清哪些条件保持不变，哪一样移动了。"
    ),
  },
  {
    question: t(
      "How much shorter was the echo with the panel behind the drummer than with no panel?",
      "与没有泡沫板相比，板放在鼓手身后时回声缩短了多少？"
    ),
    options: t(
      ["0.2 seconds", "0.5 seconds", "0.7 seconds", "1.9 seconds"],
      ["0.2 秒", "0.5 秒", "0.7 秒", "1.9 秒"]
    ),
    correct: 1,
    evidence: t(
      "With no panel, the clap echo lasted 1.2 seconds. With the panel behind the drummer, it lasted 0.7 seconds.",
      "没有泡沫板时，拍手回声持续 1.2 秒。板放在鼓手身后时为 0.7 秒，放在门边时为 0.9 秒。"
    ),
    explanation: t(
      "Subtract the shorter interval from the longer one: 1.2 − 0.7 = 0.5 seconds.",
      "用较长时间减去较短时间可得 1.2 − 0.7 = 0.5 秒。"
    ),
    hint: t(
      "You need the difference between two timings, not a single timing.",
      "题目问的是两个时长的差。"
    ),
  },
  {
    question: t(
      "Which new question would require a different kind of evidence?",
      "哪个新问题需要收集不同类型的证据？"
    ),
    options: t(
      [
        "How long did the first echo last?",
        "Where was the recorder?",
        "Which setup had the shortest echo?",
        "Which take did listeners like most?",
      ],
      [
        "第一次回声持续多久？",
        "录音设备的位置是否改变？",
        "哪个摆法的回声最短？",
        "听众最喜欢哪次演奏？",
      ]
    ),
    correct: 3,
    evidence: t(
      "Nobody measured loudness or asked listeners which take they preferred.",
      "没有人测量响度，也没有询问听众更喜欢哪次演奏。"
    ),
    explanation: t(
      "The band collected timings. A preference needs feedback from listeners.",
      "乐队记录了时间。要了解喜好，还需询问听众。"
    ),
    hint: t(
      "Check what kind of observations the group actually recorded.",
      "看看小组到底记录了哪一类观察结果。"
    ),
  },
];
const soilHints = t(
  [
    "Look for the one condition the club changed on purpose.",
    "Compare the two collected amounts. The question asks for their difference.",
    "Check which measurements the cup actually recorded.",
    "List the measurements the group made, then look for a different one.",
  ],
  [
    "找一找社团主动改变的那一个条件。",
    "比较两杯收集的水量，题目问的是差值。",
    "想一想杯子里实际收集和测量了什么。",
    "列出小组实际记录的量，再找出另一类测量。",
  ]
);
export const decks = [
  {
    id: "soil",
    name: t("Storm lab", "雨后实验"),
    topic: t("Earth science", "地球科学"),
    art: "place-tunnel-tops.webp",
    source: sample,
    questions: prepared.map((item, i) => ({ ...item, hint: soilHints[i] })),
  },
  {
    id: "sound",
    name: t("Soundcheck", "排练室测音"),
    topic: t("Music & sound", "音乐与声音"),
    art: "cover-study.webp",
    source: soundNotes,
    questions: soundQuestions,
  },
];
