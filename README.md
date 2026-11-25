# Integem AI Camp Labs

Two bilingual student projects for the Integem summer studio. The sites start in English. Select **中文** in the header to switch on this device.

| Lab | Ages | Student project |
| --- | --- | --- |
| [Study Desk](https://si9257.github.io/integem-ai-camp-labs/study/) | 13–17 · one week | Generate a quiz from notes, check the evidence and discuss a missed answer. |
| [Field Trip Atlas](https://si9257.github.io/integem-ai-camp-labs/travel/) | 13–18 · two weeks | Build an editable family itinerary using a keyless interactive street map, verified places and an official NWS forecast. |

[Course home](https://si9257.github.io/integem-ai-camp-labs/) · [中文教师手册](TEACHER_GUIDE.md) · [English teacher guide](TEACHER_GUIDE_EN.md)

The student sites are static HTML, CSS and JavaScript under `docs/`. Browser-local practice and manual trip planning work without an AI connection. NWS forecasts require network access. Both labs use a school-supplied OpenAI-compatible Chat Completions endpoint.

For a teacher demo with a long-term provider key, use Node.js 22 or newer. Copy `server.env.example` to `.env`, fill the private file and run `node --env-file=.env relay.mjs`. Open [the local course home](http://127.0.0.1:8787/integem-ai-camp-labs/). The teacher guides cover school hosting, short-lived class access and the one-minute AI checks.

Study Desk uses a dark notebook and quiz workspace. In Field Trip Atlas, choose Explore, Map, Itinerary or Weather. Select a city and day, add a place from its map pin and reorder the stops. Changes appear on the map and exported itinerary. Students do not register for the map. Visible street tiles require internet access. Map data © OpenStreetMap contributors. [Attribution](https://www.openstreetmap.org/copyright) · [Tile usage policy](https://operations.osmfoundation.org/policies/tiles/)

Integem created the classroom activities, four locally hosted AI-assisted illustrations and original destination descriptions. Forecasts are attributed to the U.S. National Weather Service. Venue names link to their operators in the field guide.
