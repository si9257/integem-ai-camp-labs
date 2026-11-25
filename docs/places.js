import { t } from "./common.js";
import { destinations } from "./guide-data.js";
const local = (value) => (Array.isArray(value) ? t(value[0], value[1]) : value);
export const interests = {
  science: t("Science", "科学"),
  nature: t("Nature", "自然"),
  art: t("Art & design", "艺术设计"),
  history: t("History", "历史"),
};
export const cities = Object.fromEntries(
  Object.entries(destinations).map(([id, city]) => [
    id,
    {
      ...city,
      id,
      name: local(city.name),
      english: city.name[0],
      places: city.places.map((p) => ({
        ...p,
        name: local(p.name),
        english: p.name[0],
        area: local(p.area),
        description: local(p.activity),
        tip: local(p.detail),
        admission: local(p.admission),
      })),
      hotels: city.hotels.map((h) => ({
        ...h,
        area: local(h.area),
        why: local(h.why),
      })),
      meals: city.meals.map((m) => ({
        ...m,
        english: m.name[0],
        name: local(m.name),
        area: local(m.area),
        detail: local(m.detail),
      })),
      transit: {
        ...city.transit,
        description: local(city.transit.description),
        fareNote: local(city.transit.fareNote),
        extras: (city.transit.extras || []).map(([label, url]) => [
          local(label),
          url,
        ]),
      },
    },
  ])
);
export const setting = (p) =>
  p.inside ? t("Indoors", "室内") : t("Outdoors", "室外");
