import {
  el,
  btn,
  small,
  field,
  sheet,
  notice,
  message,
  t,
  prettyTime,
} from "./app-ui.js";
import { draftCards, gradeRecall } from "./study-library.js?v=subjects3";

export function showQuote(title, paragraph, quote) {
  sheet(title, (body) => {
    const p = el("p", { cls: "source-text" }),
      i = paragraph.indexOf(quote);
    if (i < 0 || !quote) p.append(paragraph);
    else
      p.append(
        paragraph.slice(0, i),
        el("mark", {}, quote),
        paragraph.slice(i + quote.length)
      );
    body.append(p);
  });
}

export function editCards(book, onSave) {
  const source = book.text;
  sheet(t("Make recall cards", "制作回忆卡"), (body, close) => {
    const drafts = draftCards(source);
    const list = el("div", { cls: "draft-cards" }),
      status = notice(),
      items = [];
    function addRow(proposal) {
      const front = el("input", { value: proposal.front, maxlength: 750 });
      const back = el("textarea", {
        value: proposal.back,
        rows: 2,
        maxlength: 600,
      });
      const evidence = el("textarea", {
        value: proposal.evidence,
        rows: 2,
        maxlength: 1400,
      });
      const include = el("input", { type: "checkbox", checked: true });
      const row = el(
        "article",
        { cls: "draft-card" },
        el(
          "label",
          { cls: "check-line" },
          include,
          t("Keep card", "保留这张卡")
        ),
        field(t("Prompt", "卡片正面"), front),
        field(t("Answer", "答案"), back),
        el(
          "details",
          {},
          el("summary", {}, t("Source line", "笔记原句")),
          field(t("Exact quote from your notes", "笔记中的原句"), evidence)
        )
      );
      list.append(row);
      items.push({ front, back, evidence, include });
      return front;
    }
    drafts.forEach(addRow);
    if (!drafts.length) addRow({ front: "", back: "", evidence: "" });
    body.append(
      small(
        t(
          "Check the prompt and answer. Each card keeps the original line from your notebook.",
          "检查每张卡的问题和答案。卡片会保存笔记中的原句。"
        )
      ),
      list,
      btn(t("Write another card", "再写一张卡"), () =>
        addRow({ front: "", back: "", evidence: "" }).focus()
      ),
      status,
      btn(
        t("Save & practice", "保存并练习"),
        () => {
          const chosen = items
            .filter((v) => v.include.checked)
            .map(({ front, back, evidence }) => ({
              front: front.value.trim(),
              back: back.value.trim(),
              evidence: evidence.value.trim(),
            }));
          if (
            !chosen.length ||
            chosen.some(
              (c) =>
                !c.front ||
                !c.back ||
                !c.evidence ||
                !source.includes(c.evidence)
            )
          ) {
            message(
              status,
              t(
                "Keep at least one card. Each needs a prompt, an answer and an exact source line.",
                "至少保留一张卡，每张卡需有问题、答案和一段与笔记完全一致的原句。"
              ),
              true
            );
            return;
          }
          close();
          onSave(chosen);
        },
        "primary"
      )
    );
  });
}
export function renderRecall(body, s, { save, home, notes }) {
  const r = s.review,
    c = r && s.cards.find((k) => k.id === r.ids[r.index]);
  const heading = el(
    "header",
    { cls: "page-title" },
    el("h1", {}, t("Recall practice", "回忆练习"))
  );
  if (!r || !c) {
    const dueTimes = s.cards.filter((c) => !c.paused).map((v) => v.due),
      earliest = dueTimes.length ? Math.min(...dueTimes) : 0;
    body.replaceChildren(
      heading,
      el(
        "div",
        { cls: "panel recall-end" },
        el(
          "h2",
          {},
          r
            ? t("Review complete", "本轮复习完成")
            : t("Start with your notes", "从你的笔记开始")
        ),
        r
          ? el(
              "p",
              {},
              t("You marked ", "你标记了 ") +
                r.known +
                t(" remembered · ", " 张记住 · ") +
                r.again +
                t(" to review again.", " 张需再练。")
            )
          : null,
        earliest
          ? small(
              earliest <= Date.now()
                ? t(
                    "You have other cards ready to review.",
                    "还有其他卡片到期可练。"
                  )
                : t("Next review · ", "下次复习 · ") +
                    prettyTime(new Date(earliest).toISOString())
            )
          : null,
        btn(t("Practice room", "练习室"), home, "primary"),
        btn(t("Open notebook", "打开笔记"), notes)
      )
    );
    return;
  }
  const typed = el("input", {
    maxlength: 500,
    value: r.typed,
    placeholder: t(
      "Think it through or type a guess",
      "先回想，也可以输入你的答案"
    ),
    oninput: () => {
      r.typed = typed.value;
      save();
    },
  });
  function rate(good) {
    if (gradeRecall(s, c.id, good)) {
      save();
      renderRecall(body, s, { save, home, notes });
      window.scrollTo(0, 0);
    }
  }
  const tile = el(
    "article",
    { cls: "recall-face" },
    el(
      "p",
      { cls: "kicker" },
      (s.books.find((b) => b.id === c.bookId)?.title || c.label) +
        " · " +
        (r.index + 1) +
        " / " +
        r.ids.length
    ),
    el("h2", {}, c.front)
  );
  if (!r.flipped) {
    const reveal = () => {
      r.flipped = true;
      save();
      renderRecall(body, s, { save, home, notes });
      body.querySelector(".recall-answer")?.focus();
    };
    typed.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        reveal();
      }
    });
    tile.append(
      field(t("Your recall (optional)", "先写下你记得的内容（可选）"), typed),
      btn(t("Reveal answer", "查看答案"), reveal, "lime-button")
    );
  } else {
    const days = [1, 3, 7, 14, 30][c.step] || 1;
    tile.append(
      r.typed ? small(t("Your recall · ", "你的回忆 · ") + r.typed) : "",
      el(
        "div",
        { cls: "recall-answer", tabindex: -1 },
        el("small", {}, t("ANSWER", "答案")),
        el("p", {}, c.back)
      ),
      el("blockquote", {}, c.evidence),
      el(
        "div",
        { cls: "recall-rate" },
        btn(t("Again · 10 min", "再练 · 10 分钟"), () => rate(false)),
        btn(
          t("Remembered · ", "记住了 · ") +
            days +
            t(days === 1 ? " day" : " days", " 天"),
          () => rate(true),
          "primary"
        )
      )
    );
  }
  body.replaceChildren(
    heading,
    tile,
    btn(t("Back to practice", "回到练习室"), home, "subtle")
  );
}

export function manageCards(s, book, cards, onChange) {
  sheet(t("Manage cards", "管理卡片"), (body) => {
    const search = el("input", {
        type: "search",
        placeholder: t("Find a prompt or answer", "查找问题或答案"),
      }),
      list = el("div", { cls: "draft-cards" }),
      status = notice();
    function render() {
      const query = search.value.trim().toLocaleLowerCase();
      const matching = cards.filter((c) =>
        [c.front, c.back].some((value) =>
          value.toLocaleLowerCase().includes(query)
        )
      );
      list.replaceChildren(
        ...matching.map((c) => {
          const front = el("input", { value: c.front, maxlength: 750 }),
            back = el("textarea", { value: c.back, maxlength: 600, rows: 2 });
          const run = (fn) => {
            fn();
            onChange();
            render();
          };
          const edit = btn(
            t("Save card", "保存卡片"),
            () => {
              if (!front.value.trim() || !back.value.trim()) {
                message(
                  status,
                  t(
                    "Enter both a prompt and an answer.",
                    "请同时填写问题与答案。"
                  ),
                  true
                );
                return;
              }
              run(() => {
                if (
                  c.front !== front.value.trim() ||
                  c.back !== back.value.trim()
                ) {
                  c.step = 0;
                  c.due = Date.now();
                }
                c.front = front.value.trim();
                c.back = back.value.trim();
                message(status, t("Card updated.", "卡片已更新。"));
              });
            },
            "primary"
          );
          const pause = btn(
            c.paused
              ? t("Resume reviews", "恢复复习")
              : t("Pause reviews", "暂停复习"),
            () =>
              run(() => {
                c.paused = !c.paused;
                if (c.paused && s.review) {
                  const r = s.review,
                    at = r.ids.indexOf(c.id, r.index);
                  if (at >= 0) {
                    r.ids.splice(at, 1);
                    if (at === r.index) {
                      r.flipped = false;
                      r.typed = "";
                    }
                  }
                }
                message(
                  status,
                  c.paused
                    ? t("Reviews paused for this card.", "已暂停复习这张卡。")
                    : t("Card back in rotation.", "卡片已恢复复习。")
                );
              })
          );
          return el(
            "details",
            { cls: "draft-card" },
            el(
              "summary",
              {},
              c.front + (c.paused ? t(" · paused", " · 已暂停") : "")
            ),
            field(t("Prompt", "卡片正面"), front),
            field(t("Answer", "答案"), back),
            el("blockquote", {}, c.evidence),
            el("div", { cls: "actions" }, edit, pause)
          );
        })
      );
      if (!matching.length)
        list.append(small(t("No matching cards.", "没有匹配的卡片。")));
    }
    search.addEventListener("input", render);
    body.append(
      small(book.title),
      field(t("Search cards", "搜索卡片"), search),
      status,
      list
    );
    render();
  });
}
