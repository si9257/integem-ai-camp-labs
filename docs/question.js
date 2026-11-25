import { t } from "./common.js";

export const typeOf = (item) => item.type || "choice";
export const written = (item) => ["blank", "short"].includes(typeOf(item));
export function typeLabel(type) {
  return (
    {
      choice: t("Multiple choice", "选择题"),
      blank: t("Fill in the blank", "填空题"),
      truefalse: t("True or false", "判断题"),
      short: t("Short answer", "简答题"),
    }[type] || t("Multiple choice", "选择题")
  );
}
export const topicItem = (item) => item.support === "topic";
export const sourceLabel = (item) =>
  topicItem(item)
    ? t("Topic knowledge", "主题拓展")
    : t("From the source", "原文依据");
export const answerText = (item, value) =>
  value == null
    ? t("Unanswered", "未作答")
    : written(item)
    ? String(value)
    : item.options[value] ?? "";
export const correctText = (item) =>
  written(item) ? item.answer : item.options[item.correct];
export const normalizeAnswer = (v) =>
  String(v ?? "")
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[.!?。！？]+$/u, "")
    .trim()
    .replace(/\s+/gu, " ");
export function isCorrect(item, answer, marks) {
  if (answer == null) return false;
  if (typeOf(item) === "short")
    return (
      Array.isArray(marks) &&
      marks.length === item.rubric.length &&
      marks.every(Boolean)
    );
  if (typeOf(item) === "blank")
    return [item.answer, ...item.accepted].some(
      (v) => normalizeAnswer(v) === normalizeAnswer(answer)
    );
  return Number.isInteger(answer) && answer === item.correct;
}
export function formatPlan(count, format = "mixed") {
  const cycle = ["choice", "blank", "truefalse", "short"];
  return Array.from({ length: count }, (_, i) =>
    format === "mixed" || !cycle.includes(format)
      ? cycle[i % cycle.length]
      : format
  );
}
export const references = {
  taxonomy: {
    label: "ITIS · Panthera",
    url: "https://www.itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=180592",
    fact: "Felidae is the cat family. The lion (Panthera leo) and tiger (Panthera tigris) share the genus Panthera and are different species.",
  },
  cheetah: {
    label: "Smithsonian’s National Zoo · Cheetah",
    url: "https://nationalzoo.si.edu/animals/cheetah",
    fact: "A cheetah uses its tail to steer during rapid turns. Its semi-retractable claws provide traction during a sprint.",
  },
  camouflage: {
    label: "San Diego Zoo · Snow leopard",
    url: "https://zoo.sandiegozoo.org/animals/snow-leopard",
    fact: "A snow leopard's gray coat and dark markings help it blend into a rocky mountain background. Its furred paws give traction on snow.",
  },
  lions: {
    label: "Smithsonian’s National Zoo · Lion",
    url: "https://nationalzoo.si.edu/animals/lion",
    fact: "Lions live in groups called prides, cooperate when hunting and raise cubs in groups.",
  },
  tigers: {
    label: "Smithsonian’s National Zoo · Tiger",
    url: "https://nationalzoo.si.edu/animals/tiger",
    fact: "Adult tigers usually live alone outside of mating and when mothers care for young.",
  },
};
export function topicReferences(title, notes) {
  return /猫科|貓科|猎豹|獵豹|雪豹|\b(?:felids?|felidae|cat family|big cats?|cheetahs?|snow leopards?)\b/iu.test(
    title + "\n" + notes
  )
    ? Object.keys(references)
    : [];
}
export const referenceFor = (item) =>
  Object.hasOwn(references, item.referenceId || "")
    ? references[item.referenceId]
    : null;
