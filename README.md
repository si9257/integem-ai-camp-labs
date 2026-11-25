# Integem AI Camp Labs

Two bilingual student projects for the Integem summer studio. The sites start in English. Select **中文** in the header to switch on this device.

| Lab | Ages | Student project |
| --- | --- | --- |
| [Study Desk](https://si9257.github.io/integem-ai-camp-labs/study/) | 13–17 · one week | Keep subject notebooks, practice personal recall cards, generate evidence-backed quizzes, revisit misses and take a backup home. |
| [Field Trip Atlas](https://si9257.github.io/integem-ai-camp-labs/travel/) | 13–18 · two weeks | Plan 1–7 family days around 36 real sights. Compare live rooms, follow each leg, book admission and share the schedule. |

[Student task walkthrough](STUDENT_WALKTHROUGH.md) · [Bilingual daily curriculum](DAILY_CURRICULUM.md) · [Course home](https://si9257.github.io/integem-ai-camp-labs/) · [中文教师手册](TEACHER_GUIDE.md) · [English teacher guide](TEACHER_GUIDE_EN.md)

For a family showcase, open [a two-day Seattle itinerary](https://si9257.github.io/integem-ai-camp-labs/travel/#trip=sea~2027-01-19~pike-market.aquarium.sculpture~pacsci.mopop.space-needle!2!0930!transit!balanced!maxwell!pike-chowder.armory-food!95,110,45~105,80,60). This teacher-built snapshot includes hotel-to-stop directions, two meals and timed visits.

The student sites are static HTML, CSS and JavaScript under `docs/`. Browser-local practice and manual trip planning work without an AI connection. NWS forecasts require network access. Both labs use a school-supplied OpenAI-compatible Chat Completions endpoint.

For a teacher demo with a long-term provider key, use Node.js 22 or newer. Copy `server.env.example` to `.env`, fill the private file and run `node --env-file=.env relay.mjs`. Open [the local course home](http://127.0.0.1:8787/integem-ai-camp-labs/). The teacher guides cover school hosting, short-lived class access and the one-minute AI checks.

Study Desk opens in **Practice** with two prepared decks. **Notebook** creates a quiz from a student’s source, **Tutor** follows the selected question, and **Progress** exports both attempts. Field Trip Atlas has **Explore**, **Map**, **My trip**, **Weather** and **Bookings**. Open **Edit trip** to set up the family visit. In **My trip**, change the order, compare indoor alternatives and use **Family link** for a read-only snapshot. **Bookings** checks one room against OBO Travel using travel dates and occupancy. It also opens independent hotel websites, agency fares, arrivals and ticket desks. Each visit has a family activity, transfer buffer and door-to-door directions. Teachers can use a [separate practice itinerary](https://si9257.github.io/integem-ai-camp-labs/travel/?practice=1). Students can use the map and live hotel inventory without registering. Visible street tiles require internet access. Map data © OpenStreetMap contributors. [Attribution](https://www.openstreetmap.org/copyright) · [Tile usage policy](https://operations.osmfoundation.org/policies/tiles/)

Integem created the classroom activities, the locally hosted study, city and venue illustrations and original destination descriptions. Forecasts are attributed to the U.S. National Weather Service. Venue names link to their operators in the field guide.
