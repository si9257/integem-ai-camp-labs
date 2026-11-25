import { isCorrect, normalizeAnswer, typeOf, written } from "./question.js";
export const firstRight = (round, i) =>
  isCorrect(round.questions[i], round.answers[i], round.selfMarks?.[i]);
export function firstScore(round) {
  return round.questions.reduce(
    (n, item, i) => n + Number(firstRight(round, i)),
    0
  );
}
export function waitingForRetry(round, i) {
  return Boolean(
    round.coached &&
      typeOf(round.questions[i]) !== "short" &&
      round.answers[i] != null &&
      !firstRight(round, i) &&
      round.retryAnswers?.[i] == null
  );
}
export function finalAnswer(round, i) {
  return round.retryAnswers?.[i] ?? round.answers[i];
}
export function recordChoice(round, i, value) {
  const item = round.questions[i];
  if (!item) return false;
  if (written(item)) {
    if (typeof value !== "string" || !value.trim() || value.length > 4000)
      return false;
    value = value.trim();
  } else if (
    !Number.isInteger(value) ||
    value < 0 ||
    value >= item.options.length
  )
    return false;
  if (round.answers[i] == null) round.answers[i] = value;
  else if (
    waitingForRetry(round, i) &&
    normalizeAnswer(round.answers[i]) !== normalizeAnswer(value)
  ) {
    round.retryAnswers ??= round.questions.map(() => null);
    round.retryAnswers[i] = value;
  } else return false;
  return true;
}
export function nextRubric(round) {
  return round.questions.findIndex(
    (item, i) =>
      typeOf(item) === "short" &&
      round.answers[i] != null &&
      !Array.isArray(round.selfMarks?.[i])
  );
}
export function markShort(round, i, marks) {
  const item = round.questions[i];
  if (
    typeOf(item) !== "short" ||
    round.answers[i] == null ||
    round.selfMarks?.[i] ||
    (round.testMode && round.answers.some((a) => a == null)) ||
    marks.length !== item.rubric.length ||
    !marks.every((x) => typeof x === "boolean")
  )
    return false;
  round.selfMarks ??= {};
  round.selfMarks[i] = [...marks];
  return true;
}
export function sourceParagraph(round, i) {
  if (round.questions[i].support === "topic") return 0;
  const parts = round.source.split(/\n\s*\n/);
  return parts.findIndex((p) => p.includes(round.questions[i].evidence)) + 1;
}
