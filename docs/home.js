import { el, $, init, t, coverURL } from "./common.js";
init("home");
function course(path, art, meta, title, description, action) {
  return el(
    "a",
    { cls: "course " + path, href: path + "/" },
    el(
      "div",
      { cls: "course-image" },
      el("img", { src: coverURL(art), width: 768, height: 512, alt: "" })
    ),
    el(
      "div",
      { cls: "course-copy" },
      el("p", { cls: "eyebrow" }, meta),
      el("h2", {}, title),
      el("p", {}, description),
      el(
        "span",
        { cls: "course-action" },
        action,
        el("span", { "aria-hidden": "true" }, "↗")
      )
    )
  );
}
$("#app").append(
  el(
    "section",
    { cls: "home-intro" },
    el("h1", {}, t("AI Camp Labs", "AI 夏令营实验室")),
    el(
      "p",
      { cls: "intro" },
      t(
        "Turn class notes into a quiz or map out a family adventure. Pick a project to make your own.",
        "把课堂笔记变成测验，或把全家的旅行画上地图。选一个项目，动手试试。"
      )
    )
  ),
  el(
    "div",
    { cls: "course-grid" },
    course(
      "study",
      "study",
      t("ONE WEEK  /  AGES 13–17", "一周班  /  13–17 岁"),
      "Study Desk",
      t(
        "Quiz yourself on your notes. Then talk through a tricky answer with your AI tutor.",
        "用自己的笔记出题，和 AI 导师一起弄懂错题。"
      ),
      t("Open study desk", "进入学习桌")
    ),
    course(
      "travel",
      "sf",
      t("TWO WEEKS  /  AGES 13–18", "两周班  /  13–18 岁"),
      "Field Trip Atlas",
      t(
        "Explore real places on a map. Use the forecast to plan a day that works for your family.",
        "在地图上找真实景点，根据天气为全家安排一天的行程。"
      ),
      t("Open trip planner", "打开旅行规划器")
    )
  )
);
