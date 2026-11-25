import { t } from "./common.js";

import { correctText } from "./question.js";
const uid = () => crypto.randomUUID();
export function newBook(title, text = "") {
  return {
    id: uid(),
    title: title.trim() || t("Untitled notebook", "未命名笔记本"),
    text,
    chat: [],
    updated: new Date().toISOString(),
  };
}
export function openLibrary(legacy, sample) {
  const s = legacy && typeof legacy === "object" ? legacy : {};
  if (!Array.isArray(s.books) || !s.books.length) {
    const text = typeof s.notes === "string" ? s.notes : "";
    const book = newBook(
      text === sample
        ? t("Storm lab notes", "雨后实验笔记")
        : t("My first notebook", "我的第一本笔记"),
      text
    );
    book.chat = Array.isArray(s.history) ? s.history : [];
    s.books = [book];
    s.activeBook = book.id;
  }
  if (!s.books.some((b) => b.id === s.activeBook)) s.activeBook = s.books[0].id;
  s.rounds = Array.isArray(s.rounds) ? s.rounds : [];
  s.quiz = s.quiz || null;
  s.cards = Array.isArray(s.cards) ? s.cards : [];
  s.review = s.review || null;
  s.options = {
    count: 4,
    depth: "mixed",
    style: "coach",
    coverage: "expand",
    format: "mixed",
    ...s.options,
  };
  s.scope = s.scope === "notebook" ? "notebook" : s.quiz ? "quiz" : "notebook";
  for (const round of [...s.rounds, ...(s.quiz ? [s.quiz] : [])]) {
    round.id ||= uid();
    round.chat ||= [];
    if (!Object.hasOwn(round, "bookId"))
      round.bookId =
        round.kind === "ai"
          ? s.books.find((b) => b.text === round.source)?.id || ""
          : "";
  }
  delete s.notes;
  delete s.history;
  return s;
}
export const activeBook = (s) =>
  s.books.find((b) => b.id === s.activeBook) || s.books[0];
export const allRounds = (s) => [...s.rounds, ...(s.quiz ? [s.quiz] : [])];
export const bookCards = (s, id, includePaused = false) =>
  s.cards.filter((c) => c.bookId === id && (includePaused || !c.paused));
export const dueCards = (s, now = Date.now()) =>
  s.cards
    .filter((c) => !c.paused && c.due <= now)
    .sort((a, b) => a.due - b.due);
const clean = (s) => s.trim().replace(/\s+/g, " ").toLocaleLowerCase();
function glossary(line) {
  const match = line.match(
    /^(.{1,100}?)\s*(?:::|：|:\s+|\s[—–]\s)\s*(.{2,450})$/u
  );
  return (
    match && { front: match[1].trim(), back: match[2].trim(), evidence: line }
  );
}
function hidePhrase(line) {
  const number = line.match(
    /(?<![\p{L}\d])[-+]?\d+(?:[.,]\d+)?(?:\s*(?:°\s?[CF]|%|mL|kg|km|cm|mm|mg|miles?|minutes?|seconds?|hours?|grams?|meters?|liters?|mL|毫升|厘米|千米|分钟|秒钟|克|度))(?![a-z])/iu
  );
  const defined = line.match(
    /^(.{2,70}?)\s+(?:is|are|means|refers to)\s+(.{4,220})[.!?]?$/i
  );
  const numeric = line.match(/\b\d+(?:\.\d+)?\b/);
  let answer = number?.[0] || defined?.[1] || numeric?.[0];
  if (!answer) {
    const chunks = line
      .replace(/[.。!！?？]+$/u, "")
      .split(/[,，;；]/)
      .map((s) => s.trim());
    const tail = chunks.at(-1) || "";
    if (
      chunks.length > 1 &&
      tail.length >= 3 &&
      tail.length < line.length * 0.8
    )
      answer = tail;
    else if (/[\u3400-\u9fff]/u.test(line)) {
      const part = line.match(
        /(?:是|指|为|产生|称为|表示|叫做|包括)([^。！？；，]{2,28})[。！？]?$/u
      );
      answer = part?.[1];
    } else {
      const words = [...line.matchAll(/\b[A-Za-z][A-Za-z'-]*\b/g)];
      if (words.length >= 4)
        answer = words
          .slice(-Math.min(3, Math.max(1, Math.floor(words.length / 4))))
          .map((w) => w[0])
          .join(" ");
    }
  }
  if (!answer || !line.includes(answer) || answer.length >= line.length - 2)
    return null;
  const prompt = line.replaceAll(answer, "[…]");
  return { front: prompt, back: answer, evidence: line };
}
export function draftCards(text) {
  const rows = [],
    seen = new Set();
  for (const raw of text.split(/\r?\n/u)) {
    const line = raw.trim().replace(/^[-*•]\s+/, "");
    if (!line) continue;
    const pair = glossary(line);
    const sentences = pair
      ? []
      : typeof Intl.Segmenter === "function"
      ? Array.from(
          new Intl.Segmenter(undefined, { granularity: "sentence" }).segment(
            line
          ),
          (v) => v.segment.trim()
        )
      : line.split(/(?<=[.!?。！？])\s+/);
    for (const card of pair
      ? [pair]
      : sentences
          .filter((x) => x.length >= 8 && x.length <= 600)
          .map(hidePhrase)) {
      if (
        !card ||
        !card.back ||
        !text.includes(card.evidence) ||
        seen.has(clean(card.front))
      )
        continue;
      rows.push(card);
      seen.add(clean(card.front));
      if (rows.length >= 12) return rows;
    }
  }
  return rows;
}
export function keepCard(s, bookId, label, proposal, now = Date.now()) {
  const existing = s.cards.find(
    (c) =>
      c.bookId === bookId &&
      clean(c.front) === clean(proposal.front) &&
      clean(c.back) === clean(proposal.back) &&
      c.evidence === proposal.evidence
  );
  if (existing) return existing;
  const c = {
    id: uid(),
    bookId,
    label,
    front: proposal.front.trim(),
    back: proposal.back.trim(),
    evidence: proposal.evidence,
    support: proposal.support === "topic" ? "topic" : "notes",
    referenceId: proposal.referenceId || "",
    step: 0,
    due: now,
    last: 0,
    reviews: 0,
  };
  s.cards.push(c);
  return c;
}
export function startRecall(s, cards) {
  const ids = [...new Set(cards.map((c) => c.id))];
  if (!ids.length) return false;
  s.review = { ids, index: 0, flipped: false, typed: "", known: 0, again: 0 };
  return true;
}
export function gradeRecall(s, id, good, now = Date.now()) {
  const r = s.review,
    c = s.cards.find((v) => v.id === id);
  if (!r || !c || !r.flipped || r.ids[r.index] !== id) return false;
  const steps = [1, 3, 7, 14, 30];
  const old = Math.max(0, Math.min(steps.length - 1, c.step || 0));
  c.due = now + (good ? steps[old] * 86400000 : 600000);
  c.step = good ? Math.min(old + 1, steps.length - 1) : 0;
  c.last = now;
  c.reviews = (c.reviews || 0) + 1;
  r[good ? "known" : "again"]++;
  r.index++;
  r.flipped = false;
  r.typed = "";
  return true;
}
const shuffled = (items, rand) => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
export function cardQuiz(cards, limit = 6, rand = Math.random) {
  const unique = [],
    seen = new Set(),
    fronts = new Set();
  for (const c of cards) {
    const k = clean(c.back);
    const front = clean(c.front);
    if (!seen.has(k) && !fronts.has(front)) {
      fronts.add(front);
      unique.push(c);
      seen.add(k);
    }
  }
  if (unique.length < 2) return [];
  return shuffled(unique, rand)
    .slice(0, limit)
    .map((c) => {
      const other = shuffled(
        unique.filter((x) => x !== c),
        rand
      )
        .slice(0, 3)
        .map((x) => x.back);
      const options = shuffled([c.back, ...other], rand);
      return {
        question: c.front,
        options,
        correct: options.indexOf(c.back),
        evidence: c.evidence,
        explanation: t(
          "Compare your answer with the source line below.",
          "对照下面的笔记原句核查答案。"
        ),
        cardId: c.id,
        support: c.support || "notes",
        referenceId: c.referenceId || "",
      };
    });
}
export function questionSource(round, index) {
  const quote = round.questions[index].evidence;
  return round.source.split(/\n\s*\n/u).find((p) => p.includes(quote)) || quote;
}
export function rememberQuestion(s, q, i) {
  const item = q.questions[i];
  if (!item || q.answers[i] == null) return null;
  return keepCard(
    s,
    q.bookId || "",
    s.books.find((b) => b.id === q.bookId)?.title || q.name,
    {
      front: item.question,
      back: correctText(item),
      evidence: item.evidence,
      support: item.support,
      referenceId: item.referenceId,
    }
  );
}
export function packBook(s, book) {
  return {
    format: "integem-study-notebook",
    version: 1,
    title: book.title,
    notes: book.text,
    cards: bookCards(s, book.id, true).map(
      ({
        front,
        back,
        evidence,
        support,
        referenceId,
        step,
        due,
        last,
        reviews,
        paused,
      }) => ({
        support: support === "topic" ? "topic" : "notes",
        referenceId: referenceId || "",
        paused: !!paused,
        front,
        back,
        evidence,
        step,
        due,
        last,
        reviews,
      })
    ),
  };
}
export function importBook(s, data) {
  const str = (v, max) => typeof v === "string" && v.length <= max;
  if (
    data?.format !== "integem-study-notebook" ||
    data.version !== 1 ||
    !str(data.title, 80) ||
    !data.title.trim() ||
    typeof data.notes !== "string" ||
    !Array.isArray(data.cards) ||
    data.cards.some(
      (c) =>
        !c ||
        !str(c.front, 750) ||
        !c.front.trim() ||
        !str(c.back, 600) ||
        !c.back.trim() ||
        !str(c.evidence, 1400) ||
        !c.evidence.trim() ||
        (c.support != null && !["topic", "notes"].includes(c.support)) ||
        (c.referenceId != null && !str(c.referenceId, 48)) ||
        (c.paused != null && typeof c.paused !== "boolean") ||
        !Number.isInteger(c.step) ||
        c.step < 0 ||
        c.step > 4 ||
        !Number.isFinite(c.due) ||
        c.due < 0 ||
        c.due > 8640000000000000 ||
        !Number.isFinite(c.last) ||
        c.last < 0 ||
        !Number.isSafeInteger(c.reviews) ||
        c.reviews < 0
    )
  )
    throw Error(
      t(
        "Choose a valid Study Desk notebook backup.",
        "请选择有效的 Study Desk 笔记本备份。"
      )
    );
  let title = data.title,
    copy = 1;
  while (s.books.some((b) => b.title === title)) {
    const suffix =
      t(" (copy", "（副本") + (copy > 1 ? " " + copy : "") + t(")", "）");
    title = data.title.slice(0, 80 - suffix.length) + suffix;
    copy++;
  }
  const b = newBook(title, data.notes);
  s.books.push(b);
  for (const c of data.cards) {
    const target = keepCard(s, b.id, b.title, c);
    Object.assign(target, {
      step: c.step,
      due: c.due,
      last: c.last,
      reviews: c.reviews,
      paused: c.paused === true,
    });
  }
  s.activeBook = b.id;
  s.scope = "notebook";
  return b;
}
