# Integem AI 夏令营教师手册

[English teacher guide](TEACHER_GUIDE_EN.md) · [课程首页](https://si9257.github.io/integem-ai-camp-labs/) · [公开仓库](https://github.com/si9257/integem-ai-camp-labs)

| 班级 | 学生作品 | 第一节课结束时，学生能做什么 |
| --- | --- | --- |
| 一周，13–17 岁 | [Study Desk](https://si9257.github.io/integem-ai-camp-labs/study/) | 用自己的笔记出题，指出解释所依据的原文，并针对一次错答追问。 |
| 两周，13–18 岁 | [Field Trip Atlas](https://si9257.github.io/integem-ai-camp-labs/travel/) | 为一家人安排 1–3 天游览，解释天气如何影响选点，手动调整并带走行程。 |

学生打开网址即可使用，默认英文，右上角可切换中文。第一堂课可以先做预置题或手动规划。要演示根据任意笔记出题、导师追问和 AI 行程，请先完成下文的 AI 配置。

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
| `docs/study/index.html`、`docs/study.js`、`docs/sample.js` | 学习页、出题、判分、导师和原创托盘实验 | 改示例笔记，检查引用是否还能在原文中找到 |
| `docs/travel/index.html`、`docs/travel.js` | 表单、偏好解析、AI 规划、每日排序和导出 | 改规划提示词或行程编辑方式 |
| `docs/places.js`、`docs/weather.js` | 三城景点与官网、NWS 请求和按目的地时区筛选 | 核查景点来源，跟踪 `/points` 返回的预报链接 |
| `docs/common.js`、`docs/ai.js`、`docs/camp.css`、`docs/config.js` | 两站的界面、本地保存、AI 连接和样式 | 改公开的网关地址、模型名或配色 |
| `relay.mjs`、`server.env.example`、`.gitignore` | 教师电脑或学校服务的转发程序、空白环境模板、Git 排除规则 | 在学校自己的 `.env` 里配置长期 Key |
| `README.md`、`TEACHER_GUIDE.md`、`TEACHER_GUIDE_EN.md` | 项目入口、中文和英文教师教程 | 记录本班的部署和验收 |

**本次是通过 GitHub 网页提交的。** 没有用 `git add`、`git commit` 或 `git push` 批量提交。下面的文件操作可以在浏览器复现。

1. 在仓库 **Code → Add file → Create new file**，在 **File name** 输入 `docs/study/index.html`。输入斜杠会生成目录。将解压包中同路径文件的内容粘贴到编辑区。点 **Commit changes...**，填写 **Commit message**，保留 **Commit directly to the main branch**，再点 **Commit changes**。回仓库根目录，用同样方法创建 `docs/travel/index.html`。
2. 进入仓库里的 **docs** 文件夹，点 **Add file → Upload files → Choose your files**。本次在这里选了 11 个文件：`index.html`、`camp.css`、`config.js`、`common.js`、`ai.js`、`home.js`、`sample.js`、`study.js`、`places.js`、`weather.js`、`travel.js`。等 11 个文件名全部出现在清单上，在 **Commit summary** 写清改动，再点 **Commit changes**。两个子目录里的 `index.html` 已在上一步创建。
3. 在根目录用 **Create new file** 添加 `.gitignore`。再在根目录用 **Upload files** 提交 `relay.mjs`、`server.env.example` 和 `README.md`，最后上传两份教师教程。首页只加载 `docs/` 内的静态文件，转发程序位于其外。
4. 本次自动操作 Edge 的文件选择器时，老师在 **Edge 扩展 → ChatGPT → 详细信息 → 允许访问文件 URL** 开启了权限。老师自己点击 GitHub 的文件选择器上传时，可以直接选文件。每次核对页面标题中的目标目录和待提交文件名。真实 `.env` 留在本机，网页上传也要手动避开它。

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

### 一周班：Study Desk（约 15 分钟）

| 时间 | 老师操作 | 给学生的问题 |
| --- | --- | --- |
| 0–3 分钟 | 点 **Load example notes**。一起读两个托盘实验，找出相同条件和被改变的条件。 | “两个杯子里分别有多少径流？笔记能回答蒸发量吗？” |
| 3–7 分钟 | 点 **Try prepared practice**。第一题故意选 A，点 **Check answer**，读出正确答案和原文。刷新，再继续。余下三题选 B、D、A。 | “哪个证据能推翻刚刚的选择？”这次结果应为 3/4。 |
| 7–10 分钟 | 点 **Retry missed questions**，选 C，完成一题并看到 1/1。点 **Export learning record**，打开 Markdown 找到两轮成绩。 | “第一次与第二次作答各留下了什么？” |
| 10–15 分钟（需 AI） | 粘贴学生自己的短笔记，点 **Generate quiz from notes**。答一题后点 **Ask why**，连续问“为什么我这题错了？”和“哪一句支持你的解释？”。再问一项原文未测量的数据。 | “导师引用了哪一句？资料不足时，它怎样说明？” |

建议一周进度：第 1 天完成学生流程；第 2 天制作输入和保存；第 3 天设计出题格式与证据检查；第 4 天把作答接入导师；第 5 天请同学交叉测试并演示。

### 两周班：Field Trip Atlas（约 20 分钟）

| 时间 | 老师操作 | 要观察的证据 |
| --- | --- | --- |
| 0–4 分钟 | 点 **Use family example**，或输入“带两个孩子去旧金山玩两天，喜欢科学，下雨想安排室内活动”。选 **Apply trip brief**，调整日期和预算。 | 目的地、天数、兴趣会体现出来，表单仍可改。 |
| 4–8 分钟 | 看 **Weather window** 的来源、覆盖期、温度单位、NWS 更新时间和获取时间。把日期改到几个月后，再改回来。 | 超出预报范围会逐日提示。夜间时段可能横跨两日，卡片上列有起止时间。NWS 原文保留英文。 |
| 8–13 分钟 | 在 **Field guide → Add places to** 选第 1 天，加入 Exploratorium 和 California Academy of Sciences。用 ↑ 调换顺序，移除一站，给第 2 天另加一站。 | 刷新后顺序和日期仍在。**Export itinerary** 中有景点官网及当次天气来源。 |
| 13–20 分钟（需 AI） | 点 **Plan with AI**。已有人工作品时会先询问是否替换所选日期。检查每一天的景点和理由，再手动调整。 | 对照 4 张官方景点卡和当日预报，解释一项室内选择。预算或通行条件需到场馆官网核实。 |

建议两周进度：第 1 周完成需求、三个城市的来源表、地点卡、NWS 查询、缓存与失败状态。第 2 周完成结构化提示词、受限景点与理由校验、每日编辑、移动端验收和家庭演示。

## 6　填好凭证后的 1 分钟验收

**本次发布时：真实模型返回待填 Key 后验证。** 可以预先打开两个作品，在各页输入短期凭证。以下操作约一分钟可发起两次调用，返回时间取决于模型。

1. **Study Desk**：加载示例，将一个实验数值改为自己选的新值，再点 **Generate quiz from notes**。应看到 **AI-generated quiz**。答一题，核对引用确实来自修改后的笔记。再点 **Ask why** 提一个后续问题。预置练习单独标记，不能代替此项。
2. **Field Trip Atlas**：用家庭示例，选择预报覆盖内的两天，点 **Plan with AI**。应出现 **AI itinerary saved**，有两个日期，每站均在当城手册中，理由符合给出的兴趣或天气。改顺序并导出。
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
| 刷新后找不到之前的作业 | 核对浏览器配置文件和网址。本机与线上网站各有独立存储。隐私窗口关闭、清除站点数据、换设备都会影响恢复。课后用导出的 Markdown 留档。 |

## 9　本次发布记录与证据（2026-11-25）

| 关键提交 | 内容 |
| --- | --- |
| [f3689bc](https://github.com/si9257/integem-ai-camp-labs/commit/f3689bcd69270ff1d36091673ed9d47a4bfdf180) | 新账号创建公开仓库和初始 README |
| [c3af4f6](https://github.com/si9257/integem-ai-camp-labs/commit/c3af4f698d896b57929b87f2eb957b39a1285523) · [0ce3d41](https://github.com/si9257/integem-ai-camp-labs/commit/0ce3d4113cda3d62dde6ca46d92aa986e99f5bb9) | 分别创建一周班和两周班的网页入口 |
| [94a2688](https://github.com/si9257/integem-ai-camp-labs/commit/94a26881c00b8d94b9cf87bf2660a168e65f6322) | 批量提交两站源码与课程入口 |
| [e7e8832](https://github.com/si9257/integem-ai-camp-labs/commit/e7e8832940a2bd7f00bf690c8cb1ebbe1743d7b8) · [3c32d48](https://github.com/si9257/integem-ai-camp-labs/commit/3c32d48b6b4b0a3e52813818c0ef7a98d28d9ae4) | 排除本地密钥，加入 Node 转发和环境模板 |
| [2f079cb](https://github.com/si9257/integem-ai-camp-labs/commit/2f079cb52e81a811135bf82cfc41e5f81e5fad63) | 整理课堂源码，将两次 NWS 请求的总等待时间延长至 35 秒 |

| 实测项 | 实际结果 |
| --- | --- |
| Pages、语言与视口 | 线上首页和两个子路径均可打开。桌面 1280×850、手机 390×844 均检查过布局，平板 768×1024 检查了旅行页；小屏无页面横向溢出。已检查手机答题、连接弹窗、天气卡、行程控件及中英文切换。 |
| Study Desk | 修改笔记，提交错答后刷新，证据和答案仍在。成绩 3/4；重练 1/1。下载的 `study-desk-record.md` 含修改后的笔记与两轮成绩。 |
| Field Trip Atlas | 三城均收到了 NWS 官方网格预报，实测网格为 MTR/85,105、SEW/125,68、LWX/96,72。看到了超时重试、带时间的缓存和超出范围提示。已核对选城市、1–3 天、增删调序、保存、刷新、下载。华盛顿三日导出含第三天、实际华氏预报、网格来源和景点。 |
| 转发程序 | Node.js 24.22.3 启动成功。请求处理器测试覆盖静态入口、CORS、无 Key、临时凭证和过期、模型过滤、目标路径、班级限额。上游为本机测试替身。受执行环境回环连接限制，本次 Edge 到本机端口的端到端访问未通过，应在授课电脑按第 4 节复核。 |
| 真实 AI | 两个网站均未提供真实凭证。出题、连续追问和 AI 旅行规划按第 6 节验收。 |

景点介绍、学生任务和 CSS 图形为本项目原创。景点官网可从每张卡片打开。NWS 数据免费使用，页面标明来源、时区与时间。温度和预报直接取自官方返回，行程是学生或 AI 的建议。网站没有加载外部图片、字体、地图或付费插件。[NWS API 说明](https://www.weather.gov/documentation/services-web-api) · [NWS 使用说明](https://www.weather.gov/disclaimer) · [GitHub Pages 发布源说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
