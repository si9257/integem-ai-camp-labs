import { t } from "./common.js";
const en = [
  "Two trays after a storm",
  "Our field club filled two identical trays with equal amounts of dry soil. We planted grass in Tray A and left Tray B bare. Both trays stood on the same gentle slope.",
  "We poured 200 mL of water over each tray in 30 seconds. A cup at the lower edge collected water that ran off the soil.",
  "Tray A produced 45 mL of runoff. Tray B produced 120 mL. The bare tray's cup also held more visible grains of soil.",
  "In this trial the grass-covered tray lost less water as runoff. We did not measure evaporation or changes in soil moisture. A repeat trial would help us decide whether the difference is consistent.",
];
const zh = [
  "雨后的两个托盘",
  "田野社在两个相同的托盘中放入等量干土。A 盘种草，B 盘保留裸土。两个托盘放在同样的缓坡上。",
  "我们在 30 秒内向每个托盘浇了 200 毫升水。下端的杯子接住了从土面流走的水。",
  "A 盘流出 45 毫升水，B 盘流出 120 毫升水。裸土托盘的杯子里还能看到更多土粒。",
  "这次实验中，草地托盘通过径流损失的水较少。我们没有测量蒸发量或土壤湿度的变化。重复实验有助于判断差异是否稳定。",
];
export const sample = t(en, zh).join("\n\n");
const q = (question, options, correct, explanation, evidence) => ({
  question,
  options,
  correct,
  explanation,
  evidence,
});
export const prepared = t(
  [
    q(
      "What was deliberately changed between the trays?",
      [
        "The amount of water",
        "The slope",
        "The soil covering",
        "The pouring time",
      ],
      2,
      "The group changed the surface covering while keeping the setup alike.",
      "We planted grass in Tray A and left Tray B bare."
    ),
    q(
      "How much more runoff did the bare tray produce?",
      ["45 mL", "75 mL", "120 mL", "165 mL"],
      1,
      "Subtract the grass tray's 45 mL from the bare tray's 120 mL.",
      "Tray A produced 45 mL of runoff. Tray B produced 120 mL."
    ),
    q(
      "Which conclusion is supported by this trial?",
      [
        "Grass stopped all runoff",
        "The bare tray absorbed everything",
        "Grass increased evaporation",
        "The grass tray produced less runoff",
      ],
      3,
      "Both cups contained runoff. The grass tray's cup held less.",
      "In this trial the grass-covered tray lost less water as runoff."
    ),
    q(
      "Which measurement would need a new experiment?",
      [
        "The change in soil moisture",
        "The water poured",
        "Tray B runoff",
        "The time spent pouring",
      ],
      0,
      "Soil moisture change was outside the measurements taken.",
      "We did not measure evaporation or changes in soil moisture."
    ),
  ],
  [
    q(
      "两个托盘之间主动改变了什么？",
      ["浇水量", "坡度", "地表覆盖", "浇水时间"],
      2,
      "社团改变了土壤表面是否有草覆盖。",
      "A 盘种草，B 盘保留裸土。"
    ),
    q(
      "裸土托盘比草地托盘多流出多少水？",
      ["45 毫升", "75 毫升", "120 毫升", "165 毫升"],
      1,
      "用裸土托盘的 120 毫升减去草地托盘的 45 毫升。",
      "A 盘流出 45 毫升水，B 盘流出 120 毫升水。"
    ),
    q(
      "本次实验支持哪个结论？",
      [
        "草阻止了所有径流",
        "裸土吸收了所有水",
        "种草增加了蒸发",
        "草地托盘的径流较少",
      ],
      3,
      "两个托盘都有径流，草地托盘的径流较少。",
      "这次实验中，草地托盘通过径流损失的水较少。"
    ),
    q(
      "哪项测量需要做新实验？",
      ["土壤湿度的变化", "浇水量", "B 盘径流", "浇水时间"],
      0,
      "实验没有记录土壤湿度的变化。",
      "我们没有测量蒸发量或土壤湿度的变化。"
    ),
  ]
);
