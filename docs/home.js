import {el,$,init,t} from "./common.js";
init("home");
function course(kind,title,meta,description,action) {
  const cover=el("div",{cls:"cover "+kind,"aria-hidden":"true"},el("div",{cls:"emblem"},el("i"),el("b"),el("span")));
  return el("a",{cls:"course "+kind,href:kind+"/"},cover,el("div",{cls:"course-copy"},el("p",{cls:"eyebrow"},meta),el("h2",{},title),el("p",{},description),el("strong",{},action+"  ↗")));
}
$("#app").append(el("section",{cls:"home-intro"},el("p",{cls:"eyebrow"},"INTEGEM   /   "+t("SUMMER STUDIO","夏季工作室")),
 el("h1",{},t("AI Camp Labs","AI 夏令营实验室")),el("p",{cls:"intro"},t("Bring a page of notes or a place you want to explore. Choose a lab to start building.","带上一页笔记，或一个想去的目的地。选一门课，开始动手。"))),
 el("div",{cls:"course-grid"},
 course("study","Study Desk",t("1 WEEK  /  AGES 13–17","一周班  /  13–17 岁"),t("Turn your own notes into a quiz, then ask a tutor to unpack the answers.","把自己的笔记变成测验，再和导师一起弄懂错题。"),t("Open study desk","进入学习桌")),
 course("travel","Field Trip Atlas",t("2 WEEKS  /  AGES 13–18","两周班  /  13–18 岁"),t("Build a family itinerary with real places and a National Weather Service forecast.","结合真实景点和美国国家气象局预报，设计家庭行程。"),t("Open field atlas","打开旅行图册"))));
