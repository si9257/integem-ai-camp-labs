# Integem AI Camp Labs · Teacher Guide

[中文教师手册](TEACHER_GUIDE.md) · [Course home](https://si9257.github.io/integem-ai-camp-labs/) · [Public repository](https://github.com/si9257/integem-ai-camp-labs)

| Course | Student site | What learners can show a parent |
| --- | --- | --- |
| One week, ages 13–17 | [Study Desk](https://si9257.github.io/integem-ai-camp-labs/study/) | A quiz from their own notes, an evidence quote for an answer, and a conversation about a mistake. |
| Two weeks, ages 13–18 | [Field Trip Atlas](https://si9257.github.io/integem-ai-camp-labs/travel/) | A one- to seven-day family itinerary that names real places, uses the available forecast, and can be edited and exported. |

Students open a link without signing into GitHub. Both projects start in English. The header’s **中文** button switches the interface on that device. You can teach the prepared quiz, live weather and manual planning before connecting a model.

On a phone, the bottom tabs are **Practice / Notebook / Tutor / Progress** and **Explore / Map / My trip / Weather**. The sliders icon opens **AI settings**. The [bilingual daily curriculum](DAILY_CURRICULUM.md#english-teacher-edition) includes the five-day and ten-day teaching sequences.

## 1. Start with a new GitHub account

1. Open the [GitHub Dashboard](https://github.com/dashboard). If prompted, enter credentials and verification codes on the GitHub page. Check the welcome line or the avatar menu. For this release the teacher had already signed into **Edge**. The in-app browser handoff had not appeared on the teacher’s screen. Edge displayed **Welcome to GitHub, si9257!** and **No repositories found**.
2. We used **Getting started → Create your first code project → Create project**. On an established account, the top **+ → New repository** also opens the repository form.
3. Check **Owner**, enter `integem-ai-camp-labs` under **Repository name**, choose **Public** and enable **Add README**. We left **No .gitignore** and **No license** selected on this form, added the private-file exclusions later, and clicked **Create repository**.
4. Check that the repository header shows your account and **Public**, and the branch selector shows **main**. A commit is a saved change with a description and a unique revision ID. This release lives in `si9257/integem-ai-camp-labs`.

To reproduce the project under your own account, use **Code → Download ZIP** in this repository and extract the archive. Do the following steps inside your own new repository. Teachers who want to use the published projects can start in section 4.

## 2. Place and commit the files

| Repository path | What it contains | A classroom edit |
| --- | --- | --- |
| `docs/index.html`, `docs/home.js` | Course home and project links | Reword a course introduction. |
| `docs/study/index.html`, `docs/study.js`, `docs/sample.js` | Study entry, quiz, tutor, and original soil-tray lesson | Replace the sample and verify each quotation against it. |
| `docs/travel/index.html`, `docs/travel.js` | Family brief, controls, AI plan, day editor and export | Refine a planning constraint or a control. |
| `docs/places.js`, `docs/weather.js` | Verified places, official links, NWS lookups and local-date matching | Check a venue source or follow a point-to-grid lookup. |
| `docs/city-map.js`, `docs/cover-*.webp` | Interactive street map, day-order pins and four local illustrations | Venue coordinates live in `guide-data.js`. Keep attribution visible when editing the map. |
| `docs/common.js`, `docs/ai.js`, `docs/camp.css`, `docs/config.js` | Shared navigation, local storage, connection, visual styles and public defaults | Set a public model/address or adjust the palette. |
| `relay.mjs`, `server.env.example`, `.gitignore` | Teacher/school relay, blank environment template and Git exclusions | Populate the private local `.env`. |
| `README.md`, `TEACHER_GUIDE.md`, `TEACHER_GUIDE_EN.md` | Project entry and both teacher guides | Record the class release and checks. |

**We committed through the GitHub website.** There was no `git add`, `git commit` or `git push` used for publication.

1. In **Code → Add file → Create new file**, type `docs/study/index.html` in **File name**. A slash creates the directory. Paste the matching entry page from the extracted project, select **Commit changes...**, enter a **Commit message**, keep **Commit directly to the main branch** and select **Commit changes**. Return to the root and repeat for `docs/travel/index.html`.
2. Inside the repository’s **docs** folder, select **Add file → Upload files → Choose your files**. We selected these eleven direct children: `index.html`, `camp.css`, `config.js`, `common.js`, `ai.js`, `home.js`, `sample.js`, `study.js`, `places.js`, `weather.js` and `travel.js`. Wait until all names appear. Enter a **Commit summary** and select **Commit changes**. The two nested `index.html` files belong inside their course directories.
3. At repository root, use **Create new file** for `.gitignore`. Use **Upload files** for `relay.mjs`, `server.env.example` and `README.md`, then for the two guides. Only the files in `docs/` are published as the student sites.
4. During this release the teacher enabled **Edge extensions → ChatGPT → Details → Allow access to file URLs** so the extension could use the file chooser. For a manual upload, use GitHub’s chooser directly. Check the displayed destination folder and the names in each batch. Only the blank environment example belongs in an upload.

To reproduce the mobile release, use **Code → Download ZIP**, extract it, then upload the complete `docs/` tree with the same relative paths. Keep `mobile.css`, `app-ui.js`, the practice decks in `decks.js`, answer handling in `round.js`, the read-only trip in `family.js`, both `.webmanifest` files and all PNG and WebP assets. Each course directory has its own `index.html`. Put `DAILY_CURRICULUM.md` and the guides at repository root.

## 3. Turn on GitHub Pages

1. Go to **Settings → Pages → Build and deployment**. Set **Source** to **Deploy from a branch**.
2. Under **Branch**, change **None** to **main** and **/ (root)** to **/docs**. Click **Save**. Our confirmation read **GitHub Pages source saved**.
3. Open **Actions → pages build and deployment**. Inspect the build and deploy jobs until **Status** reads **Success**. Return to **Settings → Pages → Your site is live at → Visit site**.
4. Keep the repository name in the URL. Append `study/` or `travel/` to the home address. The sites use relative asset and navigation paths. Replace `si9257` with your username when deploying your own copy.

The classroom build at `2f079cb` was published from `main /docs`. [First deployment](https://github.com/si9257/integem-ai-camp-labs/actions/runs/45549871219) · [Successful classroom release](https://github.com/si9257/integem-ai-camp-labs/actions/runs/45553863816) · [Subsequent runs](https://github.com/si9257/integem-ai-camp-labs/actions)

## 4. Connect AI for the classroom or for home

Both labs send `model` and `messages` to the OpenAI-compatible `POST /v1/chat/completions` endpoint and read `choices[0].message.content`. They share the saved Base URL and model ID on the same origin and browser. A short-lived class credential stays in the current page’s memory. Paste it again after refreshing or switching projects. Notes, results and trips use browser-local storage. An AI action sends the relevant notes or trip context to the specified service. Use the supplied notes and a fictional family for demonstrations.

| What the school has | Teacher setup | Student experience |
| --- | --- | --- |
| A CORS-enabled school AI gateway | Supply its HTTPS base, exact model ID and a limited, short-lived class credential. | Open Pages, select **AI settings**, fill the fields and **Save connection**. |
| A long-term provider key for a classroom demonstration | Run the bundled relay on the teacher’s computer with the key in a private environment file. | The teacher projects the local course site. Both apps receive the relay URL and model automatically. |
| Students need AI at home | Use an internet-reachable school HTTPS gateway, or put this relay behind the school’s existing HTTPS reverse proxy. | Students use the same public Pages URLs and connect to the school gateway. |

### Local demonstration with a private key

Install Node.js 22 or newer. In the extracted repository folder, open PowerShell and run the commands below. On macOS or Linux, use `cp server.env.example .env` and a local text editor. [Download Node.js](https://nodejs.org/en/download)

```powershell
Copy-Item server.env.example .env
notepad .env
```

Fill `UPSTREAM_BASE_URL`, `UPSTREAM_MODEL` and `UPSTREAM_API_KEY` in the private copy. Use a model ID your provider actually enables. The base normally ends in `/v1`. Leave `ALLOWED_ORIGIN`, `CLASS_TOKEN` and `CLASS_TOKEN_EXPIRES` empty for a teacher-only demo. Then run:

```powershell
node --env-file=.env relay.mjs
```

Open [the local course home](http://127.0.0.1:8787/integem-ai-camp-labs/). The relay serves the pages and API from the same origin. Keep the terminal open, stop it with Ctrl+C and restart it after editing the environment. If your compatible provider requires the older output-limit parameter, set `TOKEN_LIMIT_FIELD=max_tokens`. The relay requires no npm packages. Model costs, if any, follow the school’s or teacher’s provider agreement.

### A reachable school gateway for students at home

`127.0.0.1` refers to the device running the student’s browser. Students at home need a reachable school HTTPS address for AI. Pages hosts the student interface. The school gateway holds the long-term provider key.

- **An existing compatible API.** Allow origin `https://si9257.github.io`, methods `OPTIONS` and `POST`, and request headers `Content-Type` and `Authorization`. Give the class your real base, for example in the form `https://ai.school.example/v1`. A bare origin gets `/v1/chat/completions` appended. If the gateway uses a prefix, include its version path, such as `https://ai.school.example/openai/v1`.
- **The supplied relay on a school host.** Keep its loopback listener and run the same Node command there. Set `ALLOWED_ORIGIN=https://si9257.github.io`, use a password manager to generate a random `CLASS_TOKEN` of at least 20 characters, and set a future `CLASS_TOKEN_EXPIRES` in UTC, in `YYYY-MM-DDTHH:mm:ssZ` format. Update the environment and restart to rotate or revoke a class credential. The relay checks origin, credential, expiration, model and a class-wide request cap.
- **Existing NGINX with TLS.** The location below belongs in your school’s already configured HTTPS site. Check and reload it under the school’s usual procedure. `REQUESTS_PER_HOUR` defaults to 60 for the whole class, with the in-memory window restarting when the process restarts. Set a separate provider-side budget if needed.

```nginx
location = /v1/chat/completions {
    proxy_pass http://127.0.0.1:8787;
    proxy_set_header Host 127.0.0.1:8787;
    proxy_set_header Origin $http_origin;
    proxy_read_timeout 65s;
}
```

Public defaults can go in `docs/config.js` so first-time visitors see the school base and model. Settings previously saved in a browser take precedence. Keep the provider key on the server, and distribute the short-lived class credential privately. Treat every file under `docs/` as public. [OpenAI key safety guidance](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety)

## 5. Two first-class demonstrations

### Study Desk · 15 minutes

| Time | Teacher and student actions on a phone | Evidence to collect |
| --- | --- | --- |
| 0–3 min | Open **Practice → Storm lab → Source notes**. Identify what both trays shared and what the field club changed. | Point to the 200 mL treatment and the 45 and 120 mL runoff measurements. |
| 3–7 min | Choose A on question one and tap **Check answer**. Read the hint and refresh. Choose C, tap **Check second answer**, then read the source quotation. Answer B, D and A for the remaining questions. | The first missed choice survives reload. The result is **3/4** correct on the first try and **1** recovered after a hint. Ask students to explain both figures. |
| 7–10 min | Choose **Retry missed questions**, answer C and finish at 1/1. Open **Progress → Export learning record**. Locate both choices and the quote. Let a partner start **Practice → Soundcheck**. | The music example lets the class distinguish an echo timing from an audience preference. Both decks carry the prepared label. |
| 10–15 min, with a model | Open **Notebook**, paste a student’s material and select **Generate quiz from notes**. Submit an answer and select **Ask why**. Ask which sentence supports the explanation, then ask about an unmeasured quantity. | The student can check the source used to create the question and identify a claim the notebook does not support. |

For Thursday’s prototype test, give a classmate a wrong choice and ask them to recover with one hint. For Friday’s demo, introduce fresh material and ask the student to explain a design decision. [Five-day studio schedule](DAILY_CURRICULUM.md#english-teacher-edition)

### Field Trip Atlas · 20 minutes

| Time | Teacher and student actions on a phone | Evidence to collect |
| --- | --- | --- |
| 0–4 min | From the city cover open **Edit trip → Use family example → Apply trip brief**. Choose San Francisco, two days and the travel date, then **Done**. | Locate the selected day, forecast shortcut and venue cards. Compare **Indoors** and **Outdoors**. |
| 4–8 min | Open **Weather**. Find the NWS grid, coverage dates, units and update time. Move the trip two months ahead and back. | Show the explicit out-of-range message. If the browser uses a cached forecast, read its retrieval time. |
| 8–14 min | In **Explore**, choose day one and use the **＋** buttons to add Presidio Tunnel Tops and Golden Gate Park. In **My trip**, pick **Indoor alternatives** on the first stop. Compare both venue descriptions and official links, choose Exploratorium and tap **Replace this stop**. | Golden Gate Park is still second. Move it up one slot, open **Map → Fit day** and verify pins 1 and 2. Reload to check the order. |
| 14–17 min | Select **My trip → Family link → Preview family view**. Return to the planner and choose **Export itinerary**. | A parent can use the link on another phone, switch days and open venue or map links without an account. A link captures the current city, dates and stop order. Make a fresh link after editing. The private brief, budget and class credential stay out of the link. |
| 17–20 min, with a model | From **Explore** select **Plan with AI**. Review the confirmation when the selected dates already contain stops. Ask a parent to change an interest, then have the student adapt a stop. | Each stop belongs to the verified city list. Students explain a reason using preferences or the available forecast. |

For the showcase, open the [two-day San Francisco family example](https://si9257.github.io/integem-ai-camp-labs/travel/#trip=sf~2026-11-29~golden-gate.exploratorium~academy.tunnel-tops). This manually planned snapshot visits Golden Gate Park and Exploratorium on day one, then the California Academy of Sciences and Presidio Tunnel Tops on day two.

In week one, students write an indoor filter and connect map pins to itinerary IDs. In week two, they test a one-stop replacement against the day, position and map. [Ten-day engineering schedule](DAILY_CURRICULUM.md#english-teacher-edition)

### Teach visit order with the map

1. Choose **Seattle → Map → Fit city**. Ask students to find Seattle Aquarium and Pacific Science Center among the twelve lettered pins. Select each pin, read its label and choose **Add to day 1**.
2. Swap the stops in **My trip**, then select **Map → Fit day**. The numbers and dashed line show the visit order for the selected day. Pins represent venues. Check the operator’s site for walking directions, entrances and accessible routes.
3. On a phone, select **Map** for a dedicated view. Drag to pan and pinch or use **+ / −** to zoom. A keyboard user can focus the map, pan with arrow keys and zoom with plus and minus. The selected place includes **OpenStreetMap ↗**. An exported itinerary includes each stop’s map link too.

Students can open the map without an account, key or device-location permission. The browser requests visible street tiles from OpenStreetMap and displays attribution beneath the map. Its community-operated tile service is best effort. Use it interactively and avoid bulk downloads, prefetching or offline tile packs. The school network needs access to `tile.openstreetmap.org`. If streets fail to load, use **Retry map** or keep planning with the pins and place list. [Map data and attribution](https://www.openstreetmap.org/copyright) · [Official tile usage policy](https://operations.osmfoundation.org/policies/tiles/)

## 6. One-minute checks after credentials are ready

**Real model responses are pending credentials.** Open both tabs and enter the short-lived credential on each first. These steps take about a minute to initiate. Allow the provider time to return its answers.

1. **Study Desk**: Open **Notebook → Load example notes**, change a measured number to a value of your choice, then **Generate quiz from notes**. Look for **AI-generated quiz**, answer a question and cross-check its quotation against the edited source. Try a follow-up with **Ask why**. Prepared practice has a separate label.
2. **Field Trip Atlas**: In **Edit trip**, load the family example, select two covered dates and choose **Plan with AI**. Look for **Preview your AI itinerary**, select **Use this itinerary**, and check each date’s schedule, family activity, meal and transfer. Reorder a stop and export.
3. For network-level confirmation use browser developer tools → **Network**. Check the status of `chat/completions`, model ID and response shape. Evidence includes HTTP 200, actual `choices[0].message.content` and newly rendered content. Keep authorization headers and student notes out of shared screenshots.

## 7. Update a project or recover a previous version

- **One file.** Open it on GitHub, use the pencil **Edit this file**, edit and **Commit changes...** with a specific message. For multiple files, enter their target directory and use **Add file → Upload files**.
- **Check a release.** In **Commits**, copy the short revision ID. In **Actions → pages build and deployment**, match it to a successful run. Go back to **Settings → Pages → Visit site** and test the changed feature. For a blank page, check the repository segment of the URL and `docs/index.html` on the publishing branch. Ctrl+F5 reloads assets on Windows.
- **Recover a single file.** Open its **History** and a known-good commit. Use **Browse files** to see the old tree, open the file and copy its text. At the same path on **main**, edit the current file and commit the restored content as a new revision.
- **Undo a whole ordinary commit.** Use a local clone and run the commands below, replacing `BAD_COMMIT_SHA` with the change to undo. `git revert` adds a recovery commit. To stop an unresolved conflict, use `git revert --abort` and inspect the changes. These are recovery instructions for a teacher. A rollback was not performed during this release. [Git revert documentation](https://git-scm.com/docs/git-revert)

```bash
git clone https://github.com/si9257/integem-ai-camp-labs.git
cd integem-ai-camp-labs
git pull --ff-only origin main
git revert --no-edit BAD_COMMIT_SHA
git push origin main
```

## 8. Troubleshooting at the teacher’s desk

| Symptom | What to check |
| --- | --- |
| 404, or only the home page loads | Include the repository name, `/study/` or `/travel/` and the final slash. Check `main /docs`, the latest run and the nested `index.html`. |
| AI settings open unexpectedly, or 401/403 | Check the URL, model and current page’s token. Re-enter it after a refresh or navigation. On the school service check token expiry, allowed origin and provider permissions. |
| 400, 429, 502, 503 or a timeout | For 400 check model/limit parameters. For 429 wait and check the class limit. For 502 check the school host’s upstream connection. For 503 check `UPSTREAM_API_KEY`. If the local page is unreachable, check the terminal and port. |
| A model replied, but the app rejected the result | The quiz must contain four distinct choices and exact source quotations. Trips require matching dates, known place IDs and permitted reasons. Retry with a JSON-capable model. The current trip is preserved until a replacement validates. |
| Forecast timed out, is cached, or misses a date | Use **Refresh forecast**. Compare **NWS updated** with **Retrieved**. Each city keeps its own cache. Plan manually or ask AI to plan with explicitly unknown weather on uncovered dates. |
| Street tiles are missing | Use **Retry map**, check access to `tile.openstreetmap.org` and use **Fit city** to return to the venues. Weather and street tiles come from separate services. |
| A record disappeared | Verify the browser profile and origin. A local site and the Pages site have separate storage. Closing a private window, clearing site data or changing devices affects recovery. Keep a Markdown export for class records. |

## 9. Release record · November 25, 2026

| Key commit | Change |
| --- | --- |
| [f3689bc](https://github.com/si9257/integem-ai-camp-labs/commit/f3689bcd69270ff1d36091673ed9d47a4bfdf180) | Created the public repository and initial README. |
| [c3af4f6](https://github.com/si9257/integem-ai-camp-labs/commit/c3af4f698d896b57929b87f2eb957b39a1285523) · [0ce3d41](https://github.com/si9257/integem-ai-camp-labs/commit/0ce3d4113cda3d62dde6ca46d92aa986e99f5bb9) | Added the individual course entry pages. |
| [94a2688](https://github.com/si9257/integem-ai-camp-labs/commit/94a26881c00b8d94b9cf87bf2660a168e65f6322) | Uploaded both apps and the course home. |
| [e7e8832](https://github.com/si9257/integem-ai-camp-labs/commit/e7e8832940a2bd7f00bf690c8cb1ebbe1743d7b8) · [3c32d48](https://github.com/si9257/integem-ai-camp-labs/commit/3c32d48b6b4b0a3e52813818c0ef7a98d28d9ae4) | Excluded private files and added the Node relay and blank environment example. |
| [2f079cb](https://github.com/si9257/integem-ai-camp-labs/commit/2f079cb52e81a811135bf82cfc41e5f81e5fad63) | Formatted classroom source and gave the pair of NWS requests a 35-second timeout. |
| [01d5367](https://github.com/si9257/integem-ai-camp-labs/commit/01d536732f9cfecade352478d7fd34247a7c151e) | Used **docs → Add file → Upload files** to publish two redesigned workspaces, four original illustrations and a keyless map at the existing URLs. [Pages deployment](https://github.com/si9257/integem-ai-camp-labs/actions/runs/45565872333) |
| [76ed985](https://github.com/si9257/integem-ai-camp-labs/commit/76ed9856230513b37db813ac5a72c91333ece0db) | Remembered the selected trip day and workspace and refined map pin positioning during zoom. [Pages deployment](https://github.com/si9257/integem-ai-camp-labs/actions/runs/45567257669) |

| Check | Observed result |
| --- | --- |
| Pages, languages and layouts | Home and both project paths opened on the public deployment. Desktop 1280×850 and phone 390×844 were exercised, plus a 768×1024 tablet check on Atlas. No horizontal page overflow was observed on the phone. Quiz controls, the connection dialog, forecast cards, stop controls and the language switch were checked. |
| Study Desk | Edited notes and a submitted wrong answer survived a reload. The prepared run scored 3/4 and the missed-question retry scored 1/1. The downloaded `study-desk-record.md` contained edited notes and both scores. |
| Field Trip Atlas | All three cities returned genuine NWS grid forecasts: MTR/85,105, SEW/125,68 and LWX/96,72. We observed a timeout and retry, a timestamped cache and an uncovered-date message. Tested city selection, 1–3 days, add/remove/reorder, save, reload and export. The DC three-day download contained day three, Fahrenheit forecasts, the NWS grid URL and the chosen venue. |
| Redesigned map and classroom exports | On the public site we checked four venue pins per city, loaded street tiles and attribution. In Seattle we added the aquarium and Pacific Science Center from their pins, swapped their order and saw the map numbers change. The two-day plan survived reload. The downloaded Markdown included both days, individual venue map links and the SEW forecast source. We checked 390-, 768- and 1280-pixel layouts. |
| Teacher relay | Node.js 24.22.3 started the relay. In-process request tests covered the static paths, CORS, missing provider key, class authentication and expiry, model restriction, upstream request path and rate cap, using an upstream test fixture. The test environment restricted loopback connections and its Edge-to-localhost check timed out. Recheck on the classroom computer using section 4. |
| Live model | A real credential was not supplied. Section 6 covers actual quiz generation, contextual follow-ups and AI trip generation. |

Integem created the classroom activities, venue descriptions and AI-assisted illustrations. The three city covers, study artwork and thirty-six individual venue illustrations ship with the project. Use the interactive map for geographic detail, and follow each place card to the operator’s website. The map credits © OpenStreetMap contributors. NWS supplies the forecast, which shows its source, time zone and update time. [NWS API](https://www.weather.gov/documentation/services-web-api) · [NWS usage terms](https://www.weather.gov/disclaimer) · [GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

### Mobile release and classroom acceptance

We used **Add file → Upload files → Choose your files** to place 28 mobile app and artwork files in `docs/`, then opened each course subdirectory to update its entry. The shared release is [7ea4187](https://github.com/si9257/integem-ai-camp-labs/commit/7ea4187f41179ed09361bbed60576c80878b2534), the study entry is [265c41d](https://github.com/si9257/integem-ai-camp-labs/commit/265c41dd02615945e2e82f2b1a06f72523f8d34b), and the travel entry is [3931d42](https://github.com/si9257/integem-ai-camp-labs/commit/3931d42ba684d2e7b58e3ee88372b18721373442). [Pages deployment #11](https://github.com/si9257/integem-ai-camp-labs/actions/runs/45580488062) succeeded with both entries. [5dd3103](https://github.com/si9257/integem-ai-camp-labs/commit/5dd31035fe9b5cce5f6ea6f9670375ee8e7f46cd) then refined keyboard navigation and bilingual day labels.

- In the mobile viewport we chose A on the first Storm lab question, read the hint, refreshed and corrected the answer with C. The finished round showed 3/4 on the first try and one recovered after a hint. The missed-only round scored 1/1. The downloaded Markdown kept both attempts. The source sheet and AI connection dialog fit the phone width.
- We switched among San Francisco, Seattle and Washington, DC. In a November 29 San Francisco plan we replaced the first outdoor stop with Exploratorium and kept Golden Gate Park in second position. After reordering, the map and the reloaded list agreed. The weather screen showed NWS grid MTR/85,105 and coverage from November 25 to December 1. A summer date in the following year displayed the explicit out-of-range message.
- A separate tab opened a read-only family link with two correctly ordered stops, operator sites, map links and an empty second day. English and Chinese both worked. The downloaded trip included both dates, order and NWS source. We checked 360- and 390-pixel phone widths, plus 768- and 1280-pixel map layouts in Edge. Physical-device installation and real model responses still require a separate check.

## A family trip from brief to bookings

Open the [class practice itinerary](https://si9257.github.io/integem-ai-camp-labs/travel/?practice=1) for the projector. It saves separately from a family’s regular planner.

| Family request | Demonstrate and verify |
| --- | --- |
| Plan three easy days in San Francisco for two adults | Describe the trip in **Explore**. In **Edit trip** set dates, guests, start time and pace. Use **Plan with AI → Use this itinerary** to adopt a model proposal. **Build a guide itinerary** works without a model and labels its source. |
| Keep the museum and shorten day two | Select **My trip → Day 2**, describe the change under **Revise this day**, and choose **Revise this day with AI**. Review before applying. Compare day one with its previous order. The model sees the current trip, preferences, verified activities and available NWS periods. |
| Find a room for two nights | Open **Bookings**, review dates and guests, then optionally filter by maximum whole-stay total or refundable offers. A parent enters an age for each child in the room. **Search OBO room prices** sends the search details to OBO Travel. Read the total in USD, supplier fee note, time and any partial-result notice. Use **View offer on OBO Travel** for current room terms and final pricing. Students need no account. |
| Leave from the same hotel each day | In **Choose a home base**, compare the three independent hotel websites. **Use as my base** adds routes to the first stop and back after the last stop. **Check my dates** prefills a supported booking engine. Other **Rooms & reservations** pages ask for dates. A day trip has zero nights. |
| Decide which train to take and where to buy admission | Each leg’s **Get directions** link carries both endpoints and travel mode. Under **Bookings → Transportation**, open the agency planner, arrivals or advisories, fare rules, payment and airport links. Timeline transfer minutes are planning estimates. Attraction links distinguish general visitor information, admission and timed reservations. |
| Give the trip to a parent | Type the party’s own lodging, food, admission and transit figures into **My trip → Family budget**. Blank fields count as unfilled. **Export itinerary** includes the daily activities, legs and entered budget. **Family link** shares the schedule, chosen hotel and meal stops. It omits personal notes, head counts, child ages, budget, short-lived room prices and credentials. |

The dashed map line shows stop order. Select a letter or number, or use the place picker, to see the activity, visit length, admission link and add button on the map. Dismiss the card with **×** or Escape. The picker also works while tiles are loading.

### Data and troubleshooting

- OBO Travel allows anonymous read-only searches. Its published anonymous limit is 10 live hotel queries per minute and 150 per day per IP. Project one classroom search. Inventory can arrive in parts. A quote stays in the current tab and expires within 30 minutes of the supplier timestamp. If no verifiable offer returns, use the dated search or an independent hotel’s booking page. Supplier prices stay out of model inputs and exports. [API](https://onebookingonline.com/mcp/) · [Terms](https://onebookingonline.com/api-terms)
- Times use the destination’s local clock. Where the guide has verified regular hours, the schedule can insert a wait or flag an overrun. Confirm special openings on the linked venue page. Transit fares depend on service, rider and payment method. Use the agency’s current departure and advisory tools on the travel day. [San Francisco](https://www.sfmta.com/getting-around/muni/fares) · [Seattle](https://www.soundtransit.org/ride-with-us/how-to-pay/fares) · [Washington, DC](https://www.wmata.com/ridertools)
- Follow the model input in `docs/trip-agent.js`, then check the returned dates, IDs and closures in `trip-engine.js`. Compare this with the live supplier response handled in `live-rates.js`. Venue, dining and hotel links for both languages live in `guide-data.js`. After editing a venue, check its details, position and official site on a phone.

### Publication and acceptance record

[Open the two-day Seattle family itinerary](https://si9257.github.io/integem-ai-camp-labs/travel/#trip=sea~2027-01-19~pike-market.aquarium.sculpture~pacsci.mopop.space-needle!2!0930!transit!balanced!maxwell!pike-chowder.armory-food!95,110,45~105,80,60). This teacher-built example visits Pike Place Market, the aquarium and the sculpture park on day one. Day two groups Pacific Science Center, MoPOP and the Space Needle at Seattle Center. Open each leg and admission link to walk through it with a parent.

1. We kept the existing public repository and `main /docs` Pages setting. In **docs → Add file → Upload files → Choose your files**, we selected 10 code/style files and 24 new venue illustrations and clicked **Commit changes**. [Travel and hotel release ba3400c](https://github.com/si9257/integem-ai-camp-labs/commit/ba3400ce2e6bd853ce5aad81a98e669ce13daf2e)
2. We used the same upload menu under **docs/travel** for `index.html`. Under **Actions → pages build and deployment**, both **build** and **deploy** succeeded in run 15. A newer commit can cancel an earlier pending Pages build. Match the newest commit to its run. [Entry point 916a588](https://github.com/si9257/integem-ai-camp-labs/commit/916a5888372ef4f6cfd093a496af3f9db3886e2c) · [Pages run 15](https://github.com/si9257/integem-ai-camp-labs/actions/runs/45595694163)
3. After testing, we added two museum cafés, checked full-day duration and known closing times, and added **Use itinerary & check rooms** to the preview. We uploaded the five revised sources under **docs**. The guides, README, curriculum and local relay asset list use **Upload files** at the repository root. [Feasibility checks a39dddf](https://github.com/si9257/integem-ai-camp-labs/commit/a39dddf71b02c7d3586adb2f40eb129435d743d5)
4. On public Pages, pointer and keyboard selection both opened the map card at phone width, above the bottom bar. Selection also worked on desktop. A two-adult, two-night Seattle search returned four bookable whole-stay offers from OBO, with fee notes. We followed one to available room types with both dates preserved. The Washington weather page showed NWS grid LWX/96,72, with dated periods and units.
5. In the practice trip we moved a stop, chose a hotel, entered a meal allowance, reloaded and opened the family link. The downloaded Markdown contained three days, directions, the hotel, NWS source and entered amount. The shared URL omitted the budget and live prices. The export omitted supplier quotes.
6. A short-lived model connection was unavailable in the new acceptance tab. A genuine model reply for this release is pending. Run the one-minute AI check above, confirm **Preview your AI itinerary**, then revise one day in **My trip**. Separate response-contract tests covered seven-day batching, retry after an invalid place ID, and a one-day revision.
