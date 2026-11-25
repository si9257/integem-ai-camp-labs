import { el, btn, field, t } from "./common.js";

import {
  written,
  typeOf,
  typeLabel,
  correctText,
  sourceLabel,
  referenceFor,
} from "./question.js";
import { firstRight } from "./round.js?v=class2";
const letter = (i) => String.fromCharCode(65 + i);
const checkbox = (label, onchange) => {
  const input = el("input", { type: "checkbox", onchange });
  return { input, label: el("label", { cls: "paper-check" }, input, label) };
};
function header(title, type, detail) {
  return el(
    "header",
    { cls: "paper-heading" },
    el("p", {}, "INTEGEM  /  STUDY DESK"),
    el("h2", {}, title),
    el("p", {}, type + (detail ? " · " + detail : ""))
  );
}
function studentFields() {
  return el(
    "div",
    { cls: "paper-fields" },
    el("span", {}, t("Name", "姓名"), el("i")),
    el("span", {}, t("Date", "日期"), el("i"))
  );
}
function quizPages(q, mode, missed) {
  const items = q.questions
    .map((item, i) => ({ item, i }))
    .filter(
      ({ item, i }) => !missed || (q.answers[i] != null && !firstRight(q, i))
    );
  const n =
    items.length + t(items.length === 1 ? " question" : " questions", " 道题");
  const pages = [];
  if (mode !== "key")
    pages.push(
      el(
        "article",
        { cls: "paper-section" },
        header(q.name, t("Practice worksheet", "练习卷"), n),
        studentFields(),
        el(
          "p",
          { cls: "paper-directions" },
          t(
            "Circle choices, fill in missing words, and write explanations in the spaces provided.",
            "选择与判断题请圈选答案，填空与简答题请在留白处书写。"
          )
        ),
        ...items.map(({ item, i }) =>
          el(
            "section",
            { cls: "paper-question" },
            el("h3", {}, i + 1 + ". " + item.question),
            written(item)
              ? el("small", {}, typeLabel(typeOf(item)))
              : el(
                  "ul",
                  { cls: "paper-choices" },
                  ...item.options.map((o, k) =>
                    el("li", {}, el("b", {}, letter(k) + "."), o)
                  )
                ),
            ...Array.from({ length: typeOf(item) === "short" ? 4 : 1 }, () =>
              el("div", { cls: "paper-write-line", "aria-hidden": "true" })
            )
          )
        )
      )
    );
  if (mode !== "quiz")
    pages.push(
      el(
        "article",
        { cls: "paper-section answer-section" },
        header(q.name, t("Teacher answer key", "教师答案"), n),
        ...items.map(({ item, i }) =>
          el(
            "section",
            { cls: "paper-question" },
            el("h3", {}, i + 1 + ". " + item.question),
            el(
              "p",
              { cls: "key-choice" },
              (written(item) ? "" : letter(item.correct) + ". ") +
                correctText(item)
            ),
            el("p", {}, item.explanation),
            ...(item.rubric || []).map((p) => el("p", {}, "• " + p)),
            el("blockquote", {}, sourceLabel(item) + " · " + item.evidence),
            referenceFor(item)
              ? el(
                  "small",
                  {},
                  referenceFor(item).label + " · " + referenceFor(item).url
                )
              : null
          )
        )
      )
    );
  return pages;
}
function cardPage(title, cards, blank, includeSource) {
  return el(
    "article",
    { cls: "paper-section" },
    header(
      title,
      blank
        ? t("Written recall", "回忆默写单")
        : t("Cut & fold recall cards", "可裁剪折叠的回忆卡"),
      cards.length + t(cards.length === 1 ? " card" : " cards", " 张卡片")
    ),
    el(
      "p",
      { cls: "paper-directions" },
      blank
        ? t(
            "Cover your notes. Write each answer from memory in the space on the right.",
            "合上笔记，凭记忆把答案写在右边。"
          )
        : t(
            "Print single-sided. Cut along the dotted outlines. Fold each card down the middle, with the words facing out.",
            "请单面打印。沿虚线剪开每张卡，沿中线对折，让有字的一面朝外。"
          )
    ),
    ...cards.map((c, i) =>
      el(
        "section",
        { cls: "fold-card" },
        el(
          "div",
          { cls: "card-side" },
          el("span", {}, t("PROMPT", "问题") + " " + (i + 1)),
          el("p", {}, c.front)
        ),
        el(
          "div",
          { cls: "card-side" },
          el(
            "span",
            {},
            blank ? t("YOUR ANSWER", "我的答案") : t("ANSWER", "答案")
          ),
          blank
            ? el("div", { cls: "recall-lines", "aria-hidden": "true" })
            : el("p", {}, c.back),
          !blank && includeSource
            ? el("blockquote", {}, sourceLabel(c) + " · " + c.evidence)
            : null
        )
      )
    )
  );
}
export function printStudio(returnTo) {
  if (!document.querySelector("link[data-study-print]"))
    document.head.append(
      el("link", {
        rel: "stylesheet",
        href: new URL("./study-print.css", import.meta.url).href,
        "data-study-print": "",
      })
    );
  const panel = el("section", {
    cls: "paper-studio",
    hidden: true,
    "aria-label": t("Print preview", "打印预览"),
  });
  let previous = "practice";
  function show(model, from) {
    previous = from;
    const paper = el("div", { cls: "paper-document" }),
      controls = el("div", { cls: "paper-controls" }),
      select = el("select", { onchange: draw });
    const missed = checkbox(
      t("First-try misses only", "只印首次答错的题"),
      draw
    );
    const quote = checkbox(
      t("Include the source on the answer side", "答案面附笔记原句"),
      draw
    );
    const choices =
      model.kind === "quiz"
        ? [
            ["quiz", t("Student worksheet", "学生练习卷")],
            ...(!model.round.testMode || model.round.complete
              ? [
                  ["key", t("Teacher answer key", "教师答案")],
                  ["both", t("Worksheet + separate key", "练习卷和独立答案页")],
                ]
              : []),
          ]
        : [
            ["fold", t("Cut & fold cards", "裁剪折叠卡")],
            ["blank", t("Written recall sheet", "回忆默写单")],
          ];
    if (model.kind !== "notes") {
      select.append(...choices.map(([v, n]) => el("option", { value: v }, n)));
      controls.append(field(t("Print format", "打印内容"), select));
      if (model.kind === "cards") controls.append(quote.label);
      else if (
        model.round.complete &&
        model.round.questions.some(
          (q, i) =>
            model.round.answers[i] != null && !firstRight(model.round, i)
        )
      )
        controls.append(missed.label);
    }
    function draw() {
      if (model.kind === "quiz")
        paper.replaceChildren(
          ...quizPages(model.round, select.value, missed.input.checked)
        );
      else if (model.kind === "cards") {
        quote.label.hidden = select.value === "blank";
        paper.replaceChildren(
          cardPage(
            model.title,
            model.cards,
            select.value === "blank",
            quote.input.checked
          )
        );
      } else
        paper.replaceChildren(
          el(
            "article",
            { cls: "paper-section" },
            header(model.title, t("Notebook notes", "笔记原文"), ""),
            el("div", { cls: "paper-notes" }, model.text)
          )
        );
    }
    draw();
    panel.replaceChildren(
      el(
        "div",
        { cls: "paper-tools" },
        btn(t("Back", "返回"), () => returnTo(previous), "subtle"),
        el("h1", {}, t("Print preview", "打印预览")),
        btn(
          t("Print / Save PDF", "打印／存为 PDF"),
          () => window.print(),
          "primary"
        )
      ),
      controls,
      paper
    );
  }
  return { panel, show, empty: () => !panel.querySelector(".paper-document") };
}
