# Integem AI Camp Labs · Teacher Guide

[中文教师手册](TEACHER_GUIDE.md) · [Course home](https://si9257.github.io/integem-ai-camp-labs/) · [Public repository](https://github.com/si9257/integem-ai-camp-labs)

| Course | Student site | What learners can show a parent |
| --- | --- | --- |
| One week, ages 13–17 | [Study Desk](https://si9257.github.io/integem-ai-camp-labs/study/) | A quiz from their own notes, an evidence quote for an answer, and a conversation about a mistake. |
| Two weeks, ages 13–18 | [Field Trip Atlas](https://si9257.github.io/integem-ai-camp-labs/travel/) | A one- to three-day family itinerary that names real places, uses the available forecast, and can be edited and exported. |

Students open a link without signing into GitHub. Both projects start in English. The header’s **中文** button switches the interface on that device. You can teach the prepared quiz, live weather and manual planning before connecting a model.

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
| `docs/common.js`, `docs/ai.js`, `docs/camp.css`, `docs/config.js` | Shared navigation, local storage, connection, visual styles and public defaults | Set a public model/address or adjust the palette. |
| `relay.mjs`, `server.env.example`, `.gitignore` | Teacher/school relay, blank environment template and Git exclusions | Populate the private local `.env`. |
| `README.md`, `TEACHER_GUIDE.md`, `TEACHER_GUIDE_EN.md` | Project entry and both teacher guides | Record the class release and checks. |

**We committed through the GitHub website.** There was no `git add`, `git commit` or `git push` used for publication.

1. In **Code → Add file → Create new file**, type `docs/study/index.html` in **File name**. A slash creates the directory. Paste the matching entry page from the extracted project, select **Commit changes...**, enter a **Commit message**, keep **Commit directly to the main branch** and select **Commit changes**. Return to the root and repeat for `docs/travel/index.html`.
2. Inside the repository’s **docs** folder, select **Add file → Upload files → Choose your files**. We selected these eleven direct children: `index.html`, `camp.css`, `config.js`, `common.js`, `ai.js`, `home.js`, `sample.js`, `study.js`, `places.js`, `weather.js` and `travel.js`. Wait until all names appear. Enter a **Commit summary** and select **Commit changes**. The two nested `index.html` files belong inside their course directories.
3. At repository root, use **Create new file** for `.gitignore`. Use **Upload files** for `relay.mjs`, `server.env.example` and `README.md`, then for the two guides. Only the files in `docs/` are published as the student sites.
4. During this release the teacher enabled **Edge extensions → ChatGPT → Details → Allow access to file URLs** so the extension could use the file chooser. For a manual upload, use GitHub’s chooser directly. Check the displayed destination folder and the names in each batch. Only the blank environment example belongs in an upload.

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

| Time | Teacher action | Ask the class |
| --- | --- | --- |
| 0–3 min | **Load example notes**. Read the two-tray field experiment. Identify the set-up, the change and the measurements. | “What do the cups tell us? Did anyone measure evaporation?” |
| 3–7 min | **Try prepared practice**. Deliberately choose A on question one, then **Check answer**. Read the quotation, refresh and continue. Answer B, D, A for the remaining three. | “Which line challenges our first answer?” The score should be 3/4. |
| 7–10 min | **Retry missed questions**, answer C, finish with 1/1 and **Export learning record**. Open the Markdown. | “What can you find from the first attempt and the retry?” |
| 10–15 min, with AI | Paste a learner’s short notes, **Generate quiz from notes**, answer one and select **Ask why**. Ask why the response was wrong, then ask which line supports the reasoning. Ask about a measurement absent from the notes. | “Did the tutor cite the correct source? How did it handle missing evidence?” |

A five-day build can cover the student journey on day one, input and persistence on day two, structured questions and citation checking on day three, contextual tutoring on day four, and peer testing and presentation on day five.

### Field Trip Atlas · 20 minutes

| Time | Teacher action | Evidence to examine |
| --- | --- | --- |
| 0–4 min | **Use family example**, or type “Two days in San Francisco with two kids. We like science and want indoor activities if it rains.” Use **Apply trip brief**, then adjust dates and budget. | The destination, duration and interests are reflected in editable controls. |
| 4–8 min | Read **Weather window**. Identify source, coverage, temperature unit, NWS update time and retrieval time. Select a date several months away, then restore a covered date. | The app labels uncovered days. Night periods can span midnight and show their start and end. Official forecast wording remains in English. |
| 8–13 min | In **Field guide → Add places to**, choose day one. Add the Exploratorium and the California Academy of Sciences, move one up and remove one. Add a place to day two. Refresh and **Export itinerary**. | Day, order and source links remain. The exported file includes forecast provenance. |
| 13–20 min, with AI | **Plan with AI**. If there are existing stops the app asks whether to replace the selected dates. Check a reason each day, then edit the plan manually. | Match each stop to a verified card, explain an indoor choice and check practical details with the venue. |

Use week one for the family brief, a three-city source catalog, place cards, NWS lookups and cache/failure handling. Use week two for constrained AI output, place and reason validation, day editing, mobile tests and family presentations.

## 6. One-minute checks after credentials are ready

**Real model responses are pending credentials.** Open both tabs and enter the short-lived credential on each first. These steps take about a minute to initiate. Allow the provider time to return its answers.

1. **Study Desk**: Load the sample, change a measured number to a value of your choice, then **Generate quiz from notes**. Look for **AI-generated quiz**, answer a question and cross-check its quotation against the edited source. Try a follow-up with **Ask why**. Prepared practice has a separate label.
2. **Field Trip Atlas**: Load the family example, select two covered dates and choose **Plan with AI**. Look for **AI itinerary saved**, a section for each date, and reasons attached to verified places. Reorder a stop and export.
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
| A record disappeared | Verify the browser profile and origin. A local site and the Pages site have separate storage. Closing a private window, clearing site data or changing devices affects recovery. Keep a Markdown export for class records. |

## 9. Release record · November 25, 2026

| Key commit | Change |
| --- | --- |
| [f3689bc](https://github.com/si9257/integem-ai-camp-labs/commit/f3689bcd69270ff1d36091673ed9d47a4bfdf180) | Created the public repository and initial README. |
| [c3af4f6](https://github.com/si9257/integem-ai-camp-labs/commit/c3af4f698d896b57929b87f2eb957b39a1285523) · [0ce3d41](https://github.com/si9257/integem-ai-camp-labs/commit/0ce3d4113cda3d62dde6ca46d92aa986e99f5bb9) | Added the individual course entry pages. |
| [94a2688](https://github.com/si9257/integem-ai-camp-labs/commit/94a26881c00b8d94b9cf87bf2660a168e65f6322) | Uploaded both apps and the course home. |
| [e7e8832](https://github.com/si9257/integem-ai-camp-labs/commit/e7e8832940a2bd7f00bf690c8cb1ebbe1743d7b8) · [3c32d48](https://github.com/si9257/integem-ai-camp-labs/commit/3c32d48b6b4b0a3e52813818c0ef7a98d28d9ae4) | Excluded private files and added the Node relay and blank environment example. |
| [2f079cb](https://github.com/si9257/integem-ai-camp-labs/commit/2f079cb52e81a811135bf82cfc41e5f81e5fad63) | Formatted classroom source and gave the pair of NWS requests a 35-second timeout. |

| Check | Observed result |
| --- | --- |
| Pages, languages and layouts | Home and both project paths opened on the public deployment. Desktop 1280×850 and phone 390×844 were exercised, plus a 768×1024 tablet check on Atlas. No horizontal page overflow was observed on the phone. Quiz controls, the connection dialog, forecast cards, stop controls and the language switch were checked. |
| Study Desk | Edited notes and a submitted wrong answer survived a reload. The prepared run scored 3/4 and the missed-question retry scored 1/1. The downloaded `study-desk-record.md` contained edited notes and both scores. |
| Field Trip Atlas | All three cities returned genuine NWS grid forecasts: MTR/85,105, SEW/125,68 and LWX/96,72. We observed a timeout and retry, a timestamped cache and an uncovered-date message. Tested city selection, 1–3 days, add/remove/reorder, save, reload and export. The DC three-day download contained day three, Fahrenheit forecasts, the NWS grid URL and the chosen venue. |
| Teacher relay | Node.js 24.22.3 started the relay. In-process request tests covered the static paths, CORS, missing provider key, class authentication and expiry, model restriction, upstream request path and rate cap, using an upstream test fixture. The test environment restricted loopback connections and its Edge-to-localhost check timed out. Recheck on the classroom computer using section 4. |
| Live model | A real credential was not supplied. Section 6 covers actual quiz generation, contextual follow-ups and AI trip generation. |

Original student activities, venue descriptions and CSS illustrations were written for Integem. The field guide links directly to each operator. NWS data is free to use and is attributed with source, timestamps and time zone. The student sites load no third-party pictures, fonts, maps or paid plug-ins. [NWS API](https://www.weather.gov/documentation/services-web-api) · [NWS usage terms](https://www.weather.gov/disclaimer) · [GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
