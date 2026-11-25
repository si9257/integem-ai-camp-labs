export function firstScore(round) {
  return round.answers.filter(
    (answer, i) => answer === round.questions[i].correct
  ).length;
}
export function waitingForRetry(round, i) {
  const a = round.answers[i];
  return Boolean(
    round.coached &&
      a != null &&
      a !== round.questions[i].correct &&
      round.retryAnswers?.[i] == null
  );
}
export function finalAnswer(round, i) {
  return round.retryAnswers?.[i] ?? round.answers[i];
}
export function recordChoice(round, i, choice) {
  const item = round.questions[i];
  if (
    !item ||
    !Number.isInteger(choice) ||
    choice < 0 ||
    choice >= item.options.length
  )
    return false;
  if (round.answers[i] == null) round.answers[i] = choice;
  else if (waitingForRetry(round, i) && round.answers[i] !== choice) {
    round.retryAnswers ??= round.questions.map(() => null);
    round.retryAnswers[i] = choice;
  } else return false;
  return true;
}
export function sourceParagraph(round, i) {
  const parts = round.source.split(/\n\s*\n/);
  const quote = round.questions[i].evidence;
  return parts.findIndex((p) => p.includes(quote)) + 1;
}
