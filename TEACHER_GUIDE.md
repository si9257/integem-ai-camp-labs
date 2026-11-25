# Integem AI 夏令营教师手册

[English teacher guide](TEACHER_GUIDE_EN.md) · [课程首页](https://si9257.github.io/integem-ai-camp-labs/) · [公开仓库](https://github.com/si9257/integem-ai-camp-labs)

| 班级 | 学生作品 | 第一节课结束时，学生能做什么 |
| --- | --- | --- |
| 一周，13–17 岁 | [Study Desk](https://si9257.github.io/integem-ai-camp-labs/study/) | 用自己的笔记出题，指出解释所依据的原文，并针对一次错答追问。 |
| 两周，13–18 岁 | [Field Trip Atlas](https://si9257.github.io/integem-ai-camp-labs/travel/) | 为一家人安排 1–7 天游览，解释天气如何影响选点，手动调整并带走行程。 |

学生打开网址即可使用，默认英文，右上角可切换中文。第一堂课可以先做预置题或手动规划。要演示根据任意笔记出题、导师追问和 AI 行程，请先完成下文的 AI 配置。

手机底栏分别是 **Practice / Notebook / Tutor / Progress** 和 **Explore / Map / My trip / Weather / Bookings**。右上角滑杆图标打开 **AI settings**。课堂备课可从[中英逐日课表](DAILY_CURRICULUM.md)挑选当天的学生任务。

## 用自己的作业练一轮（约 12 分钟）

1. 手机点 **Notebook → New notebook**，命名为 *Schoolyard shade*。粘贴下面三行课堂演示数据。请学生说明为什么第三行会影响前两行的比较。

   ```text
   Sunny court: 32 °C
   Shaded bench: 25 °C
   Control: The class used the same thermometer at both sites.
   ```

2. 点 **Make recall cards**。每张卡可改提问和答案，展开 **Source line** 看原句。把第一张的正面改成 *What did the class measure on the sunny court?*。点 **Save & practice**。让学生先说或输入答案，再点 **Reveal answer**。选 **Again** 后十分钟可再练，选 **Remembered** 后第一次间隔一天，再次记住会延长间隔。这里记录学生自己对回忆情况的判断。
3. 回 **Notebook → Manage cards** 可以改题、暂停或恢复一张卡。打开 **Quiz my cards**。用自己的三张卡做选择题。先故意答错，再按提示改答。点 **Find in source** 定位原句，然后 **Ask why** 查看首答、改答、正确项和证据。接好班级 AI 后，可连续追问，例如“这组记录能证明遮荫是唯一原因吗？”。
4. 在 **Quiz setup** 选 **At the end** 做一次先答后评的测验。要让模型出应用题或证据题，再选 **AI question focus**，点 **Generate quiz from notes**。AI 题须在笔记中找到模型引用的原句。材料太少时请补充笔记。卡片测验最多取笔记中可区分的答案数。
5. 在 **Progress** 点以前的一轮，回看首答和错题，再点 **Retry missed questions**。切换科目用 **New notebook**，刷新可恢复。**Notebook files & name → Export notebook backup** 导出一科的笔记、卡片和复习时间；另一台设备可用 **Import a notebook copy** 导入为新本。**Progress → Export learning record** 导出可阅读的 Markdown，包括笔记、作答和导师对话，请由学生决定分享哪份材料。

学生回家仍可用自己的笔记制卡、回忆、做卡片测验和导入备份。到期提醒在打开练习室时显示。需要 AI 追问或生成新题时，学生设备须能访问第 4 节配置的学校网关。实验笔记可改为自选学科；普通段落生成的填空草稿尤其需要学生审题。

完整的分龄任务和实测结果见[学生视角测评](STUDENT_WALKTHROUGH.md)。学习设计参考了 [Quizlet Learn](https://help.quizlet.com/hc/en-us/articles/360030986971-Studying-with-Learn)、[Anki 学习手册](https://docs.ankiweb.net/manual/studying)、[Khan Academy 练习反馈](https://support.khanacademy.org/hc/en-us/articles/115002552631-What-are-Course-and-Unit-Mastery) 和[美国教育科学研究院实践指南](https://ies.ed.gov/ncee/wwc/PracticeGuide/1)。

## 1　从一个新 GitHub 账号到公开仓库

1. 在用于授课的浏览器打开 [GitHub Dashboard](https://github.com/dashboard)。需要时在 GitHub 页面输入账号、密码和验证码。看欢迎语中的用户名，或点右上角头像核对账号。本次实际使用了教师在 **Edge** 已登录的标签。内置浏览器的登录交接未能在教师侧显示。Edge 的欢迎语显示 **si9257**，当时仓库区显示 **No repositories found**。
2. 本次在 Dashboard 的 **Getting started → Create your first code project → Create project** 进入 **Create a new repository**。已有其他仓库的账号也可从右上角 **+ → New repository** 进入。
3. 将 **Owner** 核对为自己的授课账号。**Repository name** 输入 `integem-ai-camp-labs`，**Choose visibility** 选 **Public**，打开 **Add README**。本次保留 **No .gitignore** 和 **No license**，后续单独添加了密钥忽略规则。点击 **Create repository**。
4. 仓库页应出现账号名、仓库名、**Public** 和 **main**。本次的完整名称是 `si9257/integem-ai-camp-labs`。`main` 是发布所使用的分支。每一次 **commit** 都是带说明、时间和编号的一次保存。

复刻到另一个账号时，可在本项目的 **Code → Download ZIP** 下载并解压课堂源码。以下操作在自己的新仓库进行。使用现成作品授课的老师可直接从第 4 节开始。

## 2　提交哪些文件，放到哪里

| 仓库位置 | 职责 | 常见课堂改动 |
| --- | --- | --- |
| `docs/index.html`、`docs/home.js` | 课程入口和两个作品链接 | 改课程介绍 |
| `docs/study/index.html`、`docs/study.js`、`docs/sample.js`、`docs/study-library.js`、`docs/recall-ui.js`、`docs/study-studio.css` | 学习页、出题、判分、导师和原创托盘实验 | 改示例笔记，检查引用是否还能在原文中找到 |
| `docs/travel/index.html`、`docs/travel.js` | 表单、偏好解析、AI 规划、每日排序和导出 | 改规划提示词或行程编辑方式 |
| `docs/places.js`、`docs/weather.js` | 三城景点与官网、NWS 请求和按目的地时区筛选 | 核查景点来源，跟踪 `/points` 返回的预报链接 |
| `docs/city-map.js`、`docs/cover-*.webp` | 等比例街道地图、景点标记、当天连线，以及四张本地封面插画 | 景点经纬度在 `guide-data.js`。调整地图呈现时保留地图署名。 |
| `docs/common.js`、`docs/ai.js`、`docs/camp.css`、`docs/config.js` | 两站的界面、本地保存、AI 连接和样式 | 改公开的网关地址、模型名或配色 |
| `relay.mjs`、`server.env.example`、`.gitignore` | 教师电脑或学校服务的转发程序、空白环境模板、Git 排除规则 | 在学校自己的 `.env` 里配置长期 Key |
| `README.md`、`TEACHER_GUIDE.md`、`TEACHER_GUIDE_EN.md` | 项目入口、中文和英文教师教程 | 记录本班的部署和验收 |

**本次是通过 GitHub 网页提交的。** 没有用 `git add`、`git commit` 或 `git push` 批量提交。下面的文件操作可以在浏览器复现。

1. 在仓库 **Code → Add file → Create new file**，在 **File name** 输入 `docs/study/index.html`。输入斜杠会生成目录。将解压包中同路径文件的内容粘贴到编辑区。点 **Commit changes...**，填写 **Commit message**，保留 **Commit directly to the main branch**，再点 **Commit changes**。回仓库根目录，用同样方法创建 `docs/travel/index.html`。
2. 进入仓库里的 **docs** 文件夹，点 **Add file → Upload files → Choose your files**。本次在这里选了 11 个文件：`index.html`、`camp.css`、`config.js`、`common.js`、`ai.js`、`home.js`、`sample.js`、`study.js`、`places.js`、`weather.js`、`travel.js`。等 11 个文件名全部出现在清单上，在 **Commit summary** 写清改动，再点 **Commit changes**。两个子目录里的 `index.html` 已在上一步创建。
3. 在根目录用 **Create new file** 添加 `.gitignore`。再在根目录用 **Upload files** 提交 `relay.mjs`、`server.env.example` 和 `README.md`，最后上传两份教师教程。首页只加载 `docs/` 内的静态文件，转发程序位于其外。
4. 本次自动操作 Edge 的文件选择器时，老师在 **Edge 扩展 → ChatGPT → 详细信息 → 允许访问文件 URL** 开启了权限。老师自己点击 GitHub 的文件选择器上传时，可以直接选文件。每次核对页面标题中的目标目录和待提交文件名。真实 `.env` 留在本机，网页上传也要手动避开它。

复刻手机版时，先在仓库点 **Code → Download ZIP** 并解压。按解压包内的相对目录上传完整 `docs/`。学员页需要 `mobile.css`、`app-ui.js`、学习题库 `decks.js`、作答逻辑 `round.js`、只读旅行页 `family.js`、两份 `.webmanifest` 和所有 PNG、WebP 文件。两个子目录各有自己的 `index.html`。`DAILY_CURRICULUM.md` 和教师手册放在仓库根目录。

## 3　开启 Pages 并找到网址

1. 打开仓库 **Settings → Pages → Build and deployment**。**Source** 选 **Deploy from a branch**。
2. **Branch** 从 **None** 改成 **main**。文件夹从 **/ (root)** 改成 **/docs**，点 **Save**。本次出现 **GitHub Pages source saved**。
3. 打开 **Actions → pages build and deployment**。任务运行中可以点开查看 `build` 和 `deploy`，直到 **Status** 显示 **Success**。回到 **Settings → Pages**，点击 **Your site is live at** 下的 **Visit site**。
4. 项目网址的中段保留仓库名。复制首页网址后，在末尾接 `study/` 或 `travel/`。本项目入口、样式、脚本和导航都使用相对路径。换账号时，网址中最前面的 `si9257` 也要换成新账号名。

本次网站版本 `2f079cb` 的运行状态为 **Success**。发布源为 `main /docs`。[首次部署记录](https://github.com/si9257/integem-ai-camp-labs/actions/runs/45549871219) · [课堂网站版本的成功部署](https://github.com/si9257/integem-ai-camp-labs/actions/runs/45553863816) · [后续部署列表](https://github.com/si9257/integem-ai-camp-labs/actions)

## 4　根据手中的凭证选择 AI 配置

两个作品调用 OpenAI 兼容的 `POST /v1/chat/completions`，发送 `model` 和 `messages`，读取 `choices[0].message.content`。页面里的 AI 设置在两个作品间共用 Base URL 和模型名。短期班级凭证只在当前页面内存中，刷新、换作品或重新打开后需要再填。笔记、成绩和行程保存在当前浏览器的本地存储。点击 AI 功能时，相应笔记或出行偏好才发给所配置的服务。课堂演示可用示例笔记和虚构家庭偏好。

| 情形 | 老师做什么 | 学生如何使用 |
| --- | --- | --- |
| 学校已有支持跨域的 AI 网关 | 准备 HTTPS Base URL、模型名，以及短期、限额的班级凭证 | 打开 Pages，在 **AI settings** 填好三项并 **Save connection** |
| 老师手中只有长期服务端 Key，先在本机投影 | 按下节启动仓库附带的 Node 转发，Key 放在本机 `.env` | 老师浏览器打开转发程序打印的本机网址，两站自动获得本机接口和模型 |
| 课后学生在家仍需要 AI | 使用学校已有的可联网 HTTPS 服务，或将此转发接在学校的 HTTPS 反向代理后，发短期凭证 | 打开同一个公开 Pages 网址，Base URL 指向学校网关 |

### 在教师电脑上演示

安装 Node.js 22 或更新版本。在解压后的项目根目录打开 PowerShell，执行以下命令。macOS 或 Linux 可用 `cp server.env.example .env`，并用本机文本编辑器打开副本。[Node.js 下载](https://nodejs.org/en/download)

```powershell
Copy-Item server.env.example .env
notepad .env
```

在私有 `.env` 中填写 `UPSTREAM_BASE_URL`、`UPSTREAM_MODEL`、`UPSTREAM_API_KEY`。模型名以学校或服务商账户实际可用的 ID 为准。网址一般以 `/v1` 结尾。本机演示保留模板中空白的 `ALLOWED_ORIGIN`、`CLASS_TOKEN`、`CLASS_TOKEN_EXPIRES`。保存文件后执行：

```powershell
node --env-file=.env relay.mjs
```

浏览器打开 [本机课程入口](http://127.0.0.1:8787/integem-ai-camp-labs/)，再选作品。这个程序同时提供网页和 API，因此本机演示不需要跨域。关闭终端或按 Ctrl+C 会停止服务。修改环境文件后要重启。如果供应商要求旧式输出长度字段，在 `.env` 把 `TOKEN_LIMIT_FIELD` 改为 `max_tokens`。仓库本身没有 npm 依赖，也不要求学生开付费账号。模型用量由老师或学校现有的服务承担。

### 在学生家中使用学校网关

`127.0.0.1` 指向**正在使用网页的那台电脑**。学生回家要访问学校的公网 HTTPS 网关。GitHub Pages 提供前端，学校网关保管长期 Key。

- **已有兼容接口。** 允许来源 `https://si9257.github.io`，支持 `OPTIONS` 和 `POST`，允许请求头 `Content-Type`、`Authorization`。在学生页面填写例如 `https://ai.school.example/v1`。这是示例域名，使用时替换为学校真实地址。纯域名会自动补 `/v1/chat/completions`；含自定义前缀时填入完整版本路径，例如 `https://ai.school.example/openai/v1`。
- **使用随仓转发。** 在学校主机本机运行同一个 Node 命令，保留回环监听。设置 `ALLOWED_ORIGIN=https://si9257.github.io`，用密码管理器生成至少 20 个字符的随机 `CLASS_TOKEN`，在 `CLASS_TOKEN_EXPIRES` 填一个未来的 UTC 时间，如格式 `YYYY-MM-DDTHH:mm:ssZ`。更换或撤销班级凭证时更新环境并重启。校外请求同时受来源、班级凭证、到期时间、模型和班级总请求量限制。
- **已有 NGINX 的学校。** 在已配置公网域名和 TLS 的站点内加入下列 location。按学校流程检查并加载配置。转发端口默认 8787。`REQUESTS_PER_HOUR` 默认是全班共 60 次，重启会重置进程内计数；服务商侧可另设月度预算。

```nginx
location = /v1/chat/completions {
    proxy_pass http://127.0.0.1:8787;
    proxy_set_header Host 127.0.0.1:8787;
    proxy_set_header Origin $http_origin;
    proxy_read_timeout 65s;
}
```

学校可以将公开的 Base URL 与模型名填入 `docs/config.js`，这样新设备打开即可带出这两项。学生用 **AI settings** 保存过的设置优先。长期 Key 放在学校的环境文件或私有密钥管理工具中；班级临时凭证单独发给本班学生。`docs/`、Pages 构建内容和配置模板都公开。[OpenAI 密钥使用指南](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety)

## 5　第一堂课怎么演示

### 一周班 · Study Desk（15 分钟）

| 时间 | 老师和学生在手机上做什么 | 当场验收 |
| --- | --- | --- |
| 0–3 分钟 | 打开 **Practice → Storm lab**。在 **Source notes** 中读托盘实验，找出两盘相同的条件和主动改变的条件。 | 学生从原文指出每盘浇水 200 mL，收集的径流分别是 45 和 120 mL。 |
| 3–7 分钟 | 第一题故意选 A，点 **Check answer**。先读提示，刷新；再选 C，点 **Check second answer**，核对引用。余下三题选 B、D、A。 | 刷新后仍停在首次错答。完成后首答成绩为 **3/4**，**Recovered after a hint** 为 **1**。让学生解释这两个数字各代表什么。 |
| 7–10 分钟 | 点 **Retry missed questions**，选 C，查到 1/1。打开 **Progress → Export learning record**，找出首次选择、第二次选择和原文。换到 **Practice → Soundcheck**，让另一位学生解释乐队实验测了什么。 | 学生能区分“实验测了回声多久”和“听众更喜欢哪一遍”。两套练习均标为预置。 |
| 10–15 分钟（需模型） | 在 **Notebook** 粘贴学生自己的材料，点 **Generate quiz from notes**。提交答案后点 **Ask why**，连续问“哪一句支持这个解释？”和一个原文没有回答的问题。 | 学生能打开出题时的原文，核对导师所引用的句子，并指出哪项缺少证据。 |

周四原型打磨可以直接用“答错 → 看提示 → 再选一次 → 看原文”做验收用例。周五让同学临时换一个主题，检验学生的作品能否处理新材料。[一周五天逐日任务和验收](DAILY_CURRICULUM.md)

### 两周班 · Field Trip Atlas（20 分钟）

| 时间 | 老师和学生在手机上做什么 | 当场验收 |
| --- | --- | --- |
| 0–4 分钟 | 点城市封面上的 **Edit trip → Use family example → Apply trip brief**。选旧金山、两天，设定日期，点 **Done**。 | 在首屏找到当天、天气入口和景点。让学生用 **Indoors / Outdoors** 判断哪两站能作为雨天候选。 |
| 4–8 分钟 | 点底栏 **Weather**，找出 NWS 网格来源、预报覆盖日期、单位和更新时间。把出发日临时改到两个月后，再换回。 | 学生展示预报范围外的逐日提示。有缓存时，读出获取时间。 |
| 8–14 分钟 | 在 **Explore** 选第 1 天，用景点卡的 **＋** 加入 Presidio Tunnel Tops、Golden Gate Park。到 **My trip**，点第一站的 **Indoor alternatives**，对照两个场馆简介与官网，选 Exploratorium，点 **Replace this stop**。 | 第 2 站仍是 Golden Gate Park。用 ↑ 把它移到最前，再到 **Map → Fit day** 检查 1、2 两个图钉，刷新复核。 |
| 14–17 分钟 | 在 **My trip → Family link** 点 **Preview family view**。再回到学生端用 **Export itinerary** 下载可留存的 Markdown。 | 家长可在另一部手机打开链接，无需账号，能切日期、查官网和单站地图。新版链接还记录出发时间、节奏、交通偏好、所选酒店、用餐点和每站时长，修改后可生成新版。预算、家庭描述和班级凭证不进入分享链接。 |
| 17–20 分钟（需模型） | 在 **Explore** 点 **Plan with AI**。已有手动行程时先核对是否替换。请一位家长临时改兴趣，再由学生解释并调整一站。 | 核对当日每一站的 ID 来自当前城市的已查证景点，理由能在偏好或可用预报中找到依据。 |

投屏时可直接打开[旧金山两日家庭展示样例](https://si9257.github.io/integem-ai-camp-labs/travel/#trip=sf~2026-11-29~golden-gate.exploratorium~academy.tunnel-tops)。这份手工样例第一天去 Golden Gate Park 和 Exploratorium，第二天去 California Academy of Sciences 和 Presidio Tunnel Tops。家长可用它练习切换日期和查看场馆地图。

第一周可让学生亲手写室内筛选、连接图钉与行程；第二周用“只替换一站”检验日期、顺序和地图是否一致。每日有单独的代码或测试产出。[两周十天逐日任务和验收](DAILY_CURRICULUM.md)

### 用地图讲“先去哪一站”

1. 选 **Seattle → Map → Fit city**。让学生从十二个字母标记中找到 Seattle Aquarium 和 Pacific Science Center，分别点标记、读名称，然后按 **Add to day 1**。
2. 打开 **My trip** 调换两站顺序，再选 **Map → Fit day**。数字和虚线显示所选日期的游览顺序。场馆图钉标在代表位置；实际步行路线、入口和无障碍通道请核对场馆官网。
3. 手机可用 **Map** 单独查看地图，拖动平移，用双指或 **+ / −** 缩放。桌面也支持点入地图后用方向键和加减键。展开标记详情中的 **OpenStreetMap ↗** 可查看该地点；导出的 Markdown 同样附有地点链接。

学生打开地图即可使用，无需地图账号、Key 或位置权限。地图向 OpenStreetMap 请求当前视野内的街道图块，并在图下显示署名。公共服务为尽力提供，班级按需浏览即可；请勿批量下载、预取或制作离线瓦片包。学校网络需能访问 `tile.openstreetmap.org`。街道加载失败时，可用 **Retry map** 或继续按景点标记和列表排程。[地图数据和署名](https://www.openstreetmap.org/copyright) · [官方图块使用政策](https://operations.osmfoundation.org/policies/tiles/)

## 6　填好凭证后的 1 分钟验收

**本次发布时：真实模型返回待填 Key 后验证。** 可以预先打开两个作品，在各页输入短期凭证。以下操作约一分钟可发起两次调用，返回时间取决于模型。

1. **Study Desk**：打开 **Notebook → Load example notes**，将一个实验数值改为自己选的新值，再点 **Generate quiz from notes**。应看到 **AI-generated quiz**。答一题，核对引用确实来自修改后的笔记。再点 **Ask why** 提一个后续问题。预置练习单独标记，不能代替此项。
2. **Field Trip Atlas**：在 **Edit trip** 使用家庭示例，选择预报覆盖内的两天，点 **Plan with AI**。应出现 **Preview your AI itinerary**；点 **Use this itinerary**，查看两天的当地时间安排、每站活动以及餐饮和交通。改顺序并导出。
3. 教师需要检查调用时，可在浏览器开发者工具 **Network** 只查看 `chat/completions` 的状态、模型名与返回结构。成功证据是 HTTP 200、真实 `choices[0].message.content` 和页面中的新内容。授权请求头与笔记不用于公开截图。

## 7　更新、部署检查和恢复上一版

- **改一个文件。** 在仓库打开目标文件，点铅笔 **Edit this file**，修改后 **Commit changes...**。说明写具体，例如“更新旧金山示例活动”。改多个文件时，先进入对应目录再 **Add file → Upload files**。每次在 Actions 检查新提交对应的任务。
- **确认上线。** 查看仓库的 **Commits**，记下短编号。打开 **Actions → pages build and deployment** 核对编号与 **Success**，再从 **Settings → Pages → Visit site** 实际测试。遇到白屏时先检查项目网址中是否含仓库名，以及 `docs/index.html` 是否在目标分支。强制刷新可用 Ctrl+F5。
- **仅恢复一个文件。** 从文件页点 **History**；打开正常版本对应的提交，再通过 **Browse files** 找到当时的文件，复制原文。在 **main** 打开同一路径，点铅笔粘贴旧内容，作为一次新的提交保存。先确认路径和文件名。
- **恢复整次普通提交。** 在自己的本地克隆里执行下面的 Git 命令，把 `BAD_COMMIT_SHA` 换成要撤销的编号。`git revert` 产生一条新记录。遇到冲突且拿不准，可以 `git revert --abort` 后再检查。这是供老师今后恢复的命令，本次没有执行回滚。[Git revert 文档](https://git-scm.com/docs/git-revert)

```bash
git clone https://github.com/si9257/integem-ai-camp-labs.git
cd integem-ai-camp-labs
git pull --ff-only origin main
git revert --no-edit BAD_COMMIT_SHA
git push origin main
```

## 8　常见故障

| 看到的现象 | 教师可做的检查 |
| --- | --- |
| 学生打开 404 或只有首页能开 | 检查仓库名和 `/study/`、`/travel/` 的结尾斜杠。核对 Pages 的 `main /docs`、最新工作流结果和子目录内的 `index.html`。 |
| 点击 AI 后弹出设置，或 HTTP 401 / 403 | 检查 Base URL、完整模型名和本页临时凭证。换页或刷新后重新输入。学校服务核对临时凭证到期时间、CORS 来源和上游账户权限。 |
| HTTP 400、429、502、503 或连接超时 | 400 核对模型和输出限额字段；429 稍后再试并查班级限额；502 查学校主机到上游的连接；503 查转发程序的 `UPSTREAM_API_KEY`。本机打不开时先看终端是否仍在运行和端口是否一致。 |
| 成功返回，但测验或行程提示无效 | 检查模型是否遵循 JSON 格式。测验必须带笔记中逐字存在的引文。行程的日期、景点 ID 和理由代码需通过本地校验。重试时已有行程会保留到新结果校验通过。 |
| 预报超时、看到缓存或某天没有天气 | 点 **Refresh forecast**，查看 **NWS updated** 和 **Retrieved**。缓存按城市分开；某日期超出已返回时段，就只能手动规划或由 AI 在天气未知的前提下规划。 |
| 地图只有标记或部分街道空白 | 查看图面提示，点 **Retry map**。检查学校网络能否访问 `tile.openstreetmap.org`，点 **Fit city** 回到城市。天气源与地图源分别连接。 |
| 刷新后找不到之前的作业 | 核对浏览器配置文件和网址。本机与线上网站各有独立存储。隐私窗口关闭、清除站点数据、换设备都会影响恢复。课后用导出的 Markdown 留档。 |

## 9　本次发布记录与证据（2026-11-25）

| 关键提交 | 内容 |
| --- | --- |
| [f3689bc](https://github.com/si9257/integem-ai-camp-labs/commit/f3689bcd69270ff1d36091673ed9d47a4bfdf180) | 新账号创建公开仓库和初始 README |
| [c3af4f6](https://github.com/si9257/integem-ai-camp-labs/commit/c3af4f698d896b57929b87f2eb957b39a1285523) · [0ce3d41](https://github.com/si9257/integem-ai-camp-labs/commit/0ce3d4113cda3d62dde6ca46d92aa986e99f5bb9) | 分别创建一周班和两周班的网页入口 |
| [94a2688](https://github.com/si9257/integem-ai-camp-labs/commit/94a26881c00b8d94b9cf87bf2660a168e65f6322) | 批量提交两站源码与课程入口 |
| [e7e8832](https://github.com/si9257/integem-ai-camp-labs/commit/e7e8832940a2bd7f00bf690c8cb1ebbe1743d7b8) · [3c32d48](https://github.com/si9257/integem-ai-camp-labs/commit/3c32d48b6b4b0a3e52813818c0ef7a98d28d9ae4) | 排除本地密钥，加入 Node 转发和环境模板 |
| [2f079cb](https://github.com/si9257/integem-ai-camp-labs/commit/2f079cb52e81a811135bf82cfc41e5f81e5fad63) | 整理课堂源码，将两次 NWS 请求的总等待时间延长至 35 秒 |
| [01d5367](https://github.com/si9257/integem-ai-camp-labs/commit/01d536732f9cfecade352478d7fd34247a7c151e) | 通过 **docs → Add file → Upload files** 提交两站新界面、四张原创插画和免 Key 地图；沿用同一组学生网址。[本次 Pages 部署](https://github.com/si9257/integem-ai-camp-labs/actions/runs/45565872333) |
| [76ed985](https://github.com/si9257/integem-ai-camp-labs/commit/76ed9856230513b37db813ac5a72c91333ece0db) | 增加规划日期和工作区恢复，调整缩放时的标记位置与控件避让。[Pages 部署](https://github.com/si9257/integem-ai-camp-labs/actions/runs/45567257669) |

| 实测项 | 实际结果 |
| --- | --- |
| Pages、语言与视口 | 线上首页和两个子路径均可打开。桌面 1280×850、手机 390×844 均检查过布局，平板 768×1024 检查了旅行页；小屏无页面横向溢出。已检查手机答题、连接弹窗、天气卡、行程控件及中英文切换。 |
| Study Desk | 修改笔记，提交错答后刷新，证据和答案仍在。成绩 3/4；重练 1/1。下载的 `study-desk-record.md` 含修改后的笔记与两轮成绩。 |
| Field Trip Atlas | 三城均收到了 NWS 官方网格预报，实测网格为 MTR/85,105、SEW/125,68、LWX/96,72。看到了超时重试、带时间的缓存和超出范围提示。已核对选城市、1–3 天、增删调序、保存、刷新、下载。华盛顿三日导出含第三天、实际华氏预报、网格来源和景点。 |
| 新版地图与课堂导出 | 在公开网站上核对三城各 4 个景点标记、街道图块和署名。在西雅图用地图加入水族馆与太平洋科学中心，调换顺序后图钉为 1、2。两日计划刷新后恢复，实际下载的 Markdown 含两日标题、每站的地图链接与 SEW 网格预报来源。手机宽度 390、平板宽度 768、桌面宽度 1280 均检查了布局。 |
| 转发程序 | Node.js 24.22.3 启动成功。请求处理器测试覆盖静态入口、CORS、无 Key、临时凭证和过期、模型过滤、目标路径、班级限额。上游为本机测试替身。受执行环境回环连接限制，本次 Edge 到本机端口的端到端访问未通过，应在授课电脑按第 4 节复核。 |
| 真实 AI | 两个网站均未提供真实凭证。出题、连续追问和 AI 旅行规划按第 6 节验收。 |

学生任务与景点简介由 Integem 原创。三张城市封面、学习主题插画和三十六张单站插画均随项目本地加载；城市插画用于辨识目的地，街道与地点坐标可在互动地图核对。景点卡链接到场馆官网，地图署名为 © OpenStreetMap contributors。天气取自美国国家气象局官方返回，页面提供来源、时区和更新时间。[NWS API 说明](https://www.weather.gov/documentation/services-web-api) · [NWS 使用说明](https://www.weather.gov/disclaimer) · [GitHub Pages 发布源说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

### 手机版发布与本次课堂验收

通过 **Add file → Upload files → Choose your files** 将 28 个移动端程序和素材文件提交到 `docs/`。随后分别进入两个课程子目录更新入口页。手机版主要代码为 [7ea4187](https://github.com/si9257/integem-ai-camp-labs/commit/7ea4187f41179ed09361bbed60576c80878b2534)，学习入口为 [265c41d](https://github.com/si9257/integem-ai-camp-labs/commit/265c41dd02615945e2e82f2b1a06f72523f8d34b)，旅行入口为 [3931d42](https://github.com/si9257/integem-ai-camp-labs/commit/3931d42ba684d2e7b58e3ee88372b18721373442)。包含两份入口的 [Pages 部署 #11](https://github.com/si9257/integem-ai-camp-labs/actions/runs/45580488062) 显示成功。随后在 [5dd3103](https://github.com/si9257/integem-ai-camp-labs/commit/5dd31035fe9b5cce5f6ea6f9670375ee8e7f46cd) 改进了键盘跳到正文时的导航和中英文日期标签。

- Edge 手机视口实测，Storm lab 首次错选 A 后只显示提示；刷新后选 C，完成全套得 3/4，提示后答对 1 题。重练错题得 1/1。下载的 Markdown 记录包含两次选择。小屏可展开题目原文和 AI 设置。
- 旅行页在旧金山、华盛顿和西雅图之间切换成功。11 月 29 日的旧金山行程把第一站更换为 Exploratorium，第二站保持 Golden Gate Park。调换顺序后，地图与刷新后的列表一致。天气页显示 NWS MTR/85,105 网格及 11 月 25 日至 12 月 1 日的覆盖日期。选择次年夏日会提示超出范围。
- 在另一个标签打开只读家庭链接，看到了正确的两站、场馆官网及单站地图，第二天为空；英文、中文两种界面均可切换。下载的旅行 Markdown 包含两日、正确顺序及 NWS 来源。手机用 360 和 390 像素宽度检查，地图另在 768 和 1280 像素宽度检查。测试在 Edge 调整视口完成。真机安装和真实模型返回另行验证。

## 家庭旅行规划实操

投屏时打开[课堂练习行程](https://si9257.github.io/integem-ai-camp-labs/travel/?practice=1)。这里单独保存练习，家长平日使用的行程可从作品原网址打开。

| 给学生的委托 | 在成品中的操作与验收 |
| --- | --- |
| 两个成人去旧金山三天，希望少走路 | 在 **Explore** 描述行程，在 **Edit trip** 指定日期、人数、出发时间与节奏。**Plan with AI → Use this itinerary** 采用模型建议。未连接模型时选 **Build a guide itinerary**，预览会注明城市指南来源。 |
| 第 2 天下午走累了 | 选择 **My trip → Day 2**，在 **Revise this day** 输入“保留上午的博物馆，下午减少一站”，点 **Revise this day with AI**。在预览中核对活动，再采用；比较第一天是否保留。每站的标题、时长和活动会传给模型，选择限于当城已核查的地点。 |
| 找两晚住宿，对比价格 | 进 **Bookings**，确认入住、退房与人数，按需填整段住宿的美元上限和可退订筛选。儿童入住需要逐人年龄，由家长本人填入。点 **Search OBO room prices** 会将上述搜索条件发给 OBO Travel。整段总价、查询时间、供应商列出的税费和额外收费随报价显示；点该报价的 **View offer on OBO Travel** 核对当前房型和最终条款。查询无需学生注册。 |
| 设置每天的起点 | 在 **Choose a home base** 对照 3 家独立酒店的街区与客房条件。**Use as my base** 把酒店接到每天首末两段路线。**Check my dates** 为支持日期参数的酒店带入日期和人数；其他官网的 **Rooms & reservations** 需自行选择日期。单日游没有住宿夜。 |
| 坐哪趟车、哪里买票 | 每段 **Get directions** 使用真实起终点及选择的交通方式。**Bookings → Transportation** 进入运营商路线、当前班次／通告、票价、机场接驳及支付页。时间轴上的交通分钟数是含换乘缓冲的估算。景点的订票、免费时段、普通参观按场馆分别给出。 |
| 把计划交给家长 | 在 **My trip → Family budget** 填自家的住宿、用餐、入场和交通费用。空白项单独计数。**Export itinerary** 下载逐站活动、交通链接和填写的预算。**Family link** 分享时间表、酒店、路线和用餐点，私人备注、人数、儿童年龄、预算、短期房价及凭证均留在分享内容之外。 |

地图上的虚线只表达顺序。点字母、数字或用上方下拉框选择景点，可在图内看到活动、停留时间、预约入口和添加按钮。按 **×** 或 Esc 关闭详情。在街道图块暂时未加载时，下拉框仍可用。

### 数据来源与故障排查

- OBO Travel 的只读酒店接口支持匿名查询。供应商当前限制同一 IP 每分钟 10 次、每天 150 次实时价格调用。课堂可由教师投屏查询一次。部分库存会先返回，页面会提示稍后可重试。报价只在当前标签内短时显示，最迟在供应商报价 30 分钟后过期。若未收到报价，页面保留带日期的查询以及各酒店自己的订房入口。酒店数据不进入模型提示或导出文件。[接口说明](https://onebookingonline.com/mcp/) · [使用条款](https://onebookingonline.com/api-terms)
- 所有建议时段均按目的地当地时间排列。已核实的常规开馆时间用于安排等候或提示冲突，节假日与临时变更仍需看场馆官网。交通按线路、乘车人及支付方式计价。到站预测与改道以运营商当日页面为准。[旧金山 Muni](https://www.sfmta.com/getting-around/muni/fares) · [西雅图 Sound Transit](https://www.soundtransit.org/ride-with-us/how-to-pay/fares) · [华盛顿 Metro](https://www.wmata.com/ridertools)
- 带学生看代码时，从 `docs/trip-agent.js` 的模型输入开始，到 `trip-engine.js` 检查景点 ID、日期和闭馆条件，再比较 `live-rates.js` 的真实酒店响应。中英双语景点、餐饮和酒店来源在 `guide-data.js`。修改地点后到手机地图上点它，核对详情、定位和官网。

### 本次上线与实测记录

[西雅图两日家庭行程 · 可直接打开](https://si9257.github.io/integem-ai-camp-labs/travel/#trip=sea~2027-01-19~pike-market.aquarium.sculpture~pacsci.mopop.space-needle!2!0930!transit!balanced!maxwell!pike-chowder.armory-food!95,110,45~105,80,60)。这份教师编排的样例第一天逛派克市场、水族馆与雕塑公园，第二天在西雅图中心参观科学中心、流行文化博物馆与太空针塔。家长可以打开每段交通和门票入口。

1. 保留既有仓库和 Pages 的 `main /docs` 配置。在 GitHub 的 **docs → Add file → Upload files → Choose your files** 选择 10 个程序／样式文件及 24 张新增景点插画，点 **Commit changes**。只选项目文件。[旅行规划与房价功能 ba3400c](https://github.com/si9257/integem-ai-camp-labs/commit/ba3400ce2e6bd853ce5aad81a98e669ce13daf2e)
2. 在 **docs/travel** 用相同菜单提交 `index.html`。到 **Actions → pages build and deployment**，第 15 次运行中 **build** 与 **deploy** 均为绿色。再次提交时 GitHub 可能取消排队中的上一构建，需检查最新提交的那一行。[入口版本 916a588](https://github.com/si9257/integem-ai-camp-labs/commit/916a5888372ef4f6cfd093a496af3f9db3886e2c) · [Pages 第 15 次发布](https://github.com/si9257/integem-ai-camp-labs/actions/runs/45595694163)
3. 根据实测增加两处馆内用餐点，校验每天的交通加游览时长、常规闭馆时间并在预览中增加 **Use itinerary & check rooms**。在 **docs** 上传相关的 5 个源文件。教师手册、README、逐日课程和本机转发的静态文件清单通过仓库根目录 **Upload files** 提交。[行程校验 a39dddf](https://github.com/si9257/integem-ai-camp-labs/commit/a39dddf71b02c7d3586adb2f40eb129435d743d5)
4. 在公开 Pages 用 Edge 验证了手机点图钉和按 Enter 都能显示地点卡；卡片在底栏上方。桌面宽度也能选点。西雅图的两晚、两成人查询从 OBO 返回四条可点击的整段住宿报价，页面展示含税费说明与现场另收费，点其中一条进入相同入住和退房日期的可选房型页。华盛顿预报显示 NWS 的 LWX/96,72 网格和时段。
5. 在单独的课堂行程上移动一站、选酒店、录入餐饮预算、刷新，再打开家庭链接。实际下载的 Markdown 包含三天日期、交通链接、出发酒店、NWS 来源和录入金额。费用与实时房价没有进入家庭分享链接，供应商房价也没有写入导出文件。
6. 这次新版验收页没有可用的短期模型连接。真实模型新返回待填 Key 后验证。上文的一分钟测试应看到 **Preview your AI itinerary**，再到 **My trip** 改一天。程序层另行检查了七天分批、无效景点重试和只改一天的响应契约。

### 分龄走查后的发布

两个学生入口与逐日教学已同步更新。完整过程包括真实症状、升级前后的同一份旧行程、本次打开的官方数据、各年龄的学生任务和仍需在课堂验证的项目。[分龄实测记录](STUDENT_WALKTHROUGH.md)

从 GitHub 仓库 `docs` 的 **Add file → Upload files → Choose your files** 提交本轮改动。新学习模块为 `study-library.js`、`recall-ui.js`、`study-studio.css`；旅行日期解析在 `trip-brief.js`。分别进入 `docs/study`、`docs/travel` 更新各自的 `index.html`。最后在仓库根目录提交中英教师手册、逐日课表、README、分龄报告和更新静态文件清单后的 `relay.mjs`。每次均在网页填写 **Commit summary → Commit changes**，并在 **Actions → pages build and deployment** 查看结果。[应用修复](https://github.com/si9257/integem-ai-camp-labs/commit/b59eb5661ea6444701945701b71bb666474aa8e3) · [学生应用部署 #23](https://github.com/si9257/integem-ai-camp-labs/actions/runs/45604892841)
