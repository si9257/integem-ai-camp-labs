import { t } from "./common.js";
// Each entry describes the part of the site used for this activity.
const stop = (id, point, name, zhName, inside, tags, url, en, zh) => ({
  id,
  point,
  name: t(name, zhName),
  english: name,
  inside,
  tags,
  url,
  description: t(en, zh),
});
export const interests = {
  science: t("Science", "科学"),
  nature: t("Nature", "自然"),
  art: t("Art & design", "艺术设计"),
  history: t("History", "历史"),
};
export const cities = {
  sf: {
    name: t("San Francisco", "旧金山"),
    zone: "America/Los_Angeles",
    coords: "37.7749,-122.4194",
    places: [
      stop(
        "exploratorium",
        [37.8014, -122.3976],
        "Exploratorium",
        "探索博物馆",
        true,
        ["science", "art"],
        "https://www.exploratorium.edu/visit",
        "Try a hands-on exhibit at the waterfront museum. Change one thing and predict what you will see next.",
        "在滨水博物馆选一件动手展品。改变一个条件，预测接下来会观察到什么。"
      ),
      stop(
        "academy",
        [37.7701, -122.4664],
        "California Academy of Sciences",
        "加州科学博物馆",
        true,
        ["science", "nature"],
        "https://www.calacademy.org/",
        "Compare how animals move in the aquarium and rainforest exhibits. Sketch two different adaptations.",
        "在水族馆和雨林展区比较动物的运动方式，画下两种不同的适应特征。"
      ),
      stop(
        "tunnel-tops",
        [37.79806, -122.46583],
        "Presidio Tunnel Tops",
        "普雷西迪奥隧顶公园",
        false,
        ["nature", "art"],
        "https://presidio.gov/explore/attractions/presidio-tunnel-tops",
        "Trace a path through a park built above road tunnels. Look for where a visitor can see both landscapes and infrastructure.",
        "沿着公路隧道上方的公园步行，找一处能同时观察自然景观和城市设施的位置。"
      ),
      stop(
        "golden-gate",
        [37.76972, -122.47694],
        "Golden Gate Park",
        "金门公园",
        false,
        ["nature", "science"],
        "https://www.sfrecpark.org/770/Golden-Gate-Park",
        "Compare the edges of a grove, a lawn and a lake. Draw a tiny field map of the habitats you find.",
        "观察树林、草坪和湖岸的边缘，把找到的栖息地画成一张小地图。"
      ),
    ],
  },
  sea: {
    name: t("Seattle", "西雅图"),
    zone: "America/Los_Angeles",
    coords: "47.6062,-122.3321",
    places: [
      stop(
        "flight",
        [47.51806, -122.29694],
        "The Museum of Flight",
        "飞行博物馆",
        true,
        ["science", "history"],
        "https://www.museumofflight.org/",
        "Use an indoor aircraft gallery to compare wing shapes. Match one design choice to the job of the aircraft.",
        "在室内飞机展厅比较机翼形状，试着把一个设计特点与飞机的用途联系起来。"
      ),
      stop(
        "pacsci",
        [47.6192, -122.3511],
        "Pacific Science Center",
        "太平洋科学中心",
        true,
        ["science"],
        "https://pacificsciencecenter.org/",
        "Turn an interactive exhibit into a family experiment. Make a prediction before anyone touches a control.",
        "把一件互动展品变成家庭实验，操作之前先让每个人作出预测。"
      ),
      stop(
        "sculpture",
        [47.61639, -122.35528],
        "Olympic Sculpture Park",
        "奥林匹克雕塑公园",
        false,
        ["art", "nature"],
        "https://www.seattleartmuseum.org/visit/olympic-sculpture-park",
        "Walk around a sculpture on the waterfront. Sketch how its outline shifts between two viewpoints.",
        "绕着滨水区的一件雕塑走一圈，从两个视角画下它不同的轮廓。"
      ),
      stop(
        "aquarium",
        [47.6075, -122.34306],
        "Seattle Aquarium",
        "西雅图水族馆",
        true,
        ["nature", "science"],
        "https://www.seattleaquarium.org/visit/plan-your-visit/",
        "At an indoor habitat window, observe one animal for a minute. Record how it moves and where it rests.",
        "在室内展缸前观察一种动物一分钟，记录它如何运动，以及在哪里停留。"
      ),
    ],
  },
  dc: {
    name: t("Washington, DC", "华盛顿特区"),
    zone: "America/New_York",
    coords: "38.9072,-77.0369",
    places: [
      stop(
        "natural-history",
        [38.8913, -77.0259],
        "National Museum of Natural History",
        "美国国家自然历史博物馆",
        true,
        ["science", "nature"],
        "https://naturalhistory.si.edu/visit",
        "Compare two specimens in a gallery. List the clues a scientist might use to tell them apart.",
        "在展厅中比较两件标本，列出科学家可能用来区分它们的线索。"
      ),
      stop(
        "air-space",
        [38.88833, -77.02],
        "National Air and Space Museum (DC)",
        "美国国家航空航天博物馆（特区馆）",
        true,
        ["science", "history"],
        "https://www.si.edu/museums/air-and-space-museum",
        "Compare an aircraft and a spacecraft at the National Mall building. What does each need from its environment?",
        "在国家广场馆区比较飞机和航天器，思考两者各自需要怎样的运行环境。"
      ),
      stop(
        "conservatory",
        [38.888, -77.013],
        "U.S. Botanic Garden Conservatory",
        "美国植物园温室",
        true,
        ["nature", "science"],
        "https://www.usbg.gov/visit",
        "Choose two plants from different conservatory habitats. Compare the shapes and surfaces of their leaves.",
        "选取来自两种温室环境的植物，比较叶片的形状与表面。"
      ),
      stop(
        "lincoln",
        [38.889278, -77.050139],
        "Lincoln Memorial plaza",
        "林肯纪念堂广场",
        false,
        ["history", "art"],
        "https://www.nps.gov/linc/index.htm",
        "Stand on the outdoor approach and trace the visual axis of the memorial. Note how the setting frames the building.",
        "从广场的室外步道观察纪念堂轴线，记录周围环境如何衬托建筑。"
      ),
    ],
  },
};
export const setting = (p) =>
  p.inside ? t("Indoors", "室内") : t("Outdoors", "室外");
