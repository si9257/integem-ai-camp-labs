# Integem 青少年 AI 夏令营逐日课表

中文教师版和英文教师版合订。建议按周一至周五排课。一周班适合 13–17 岁，两周班适合 13–18 岁。以下为 Integem 的授课设计建议，线上作品可供教师示范。

[Study Desk](https://si9257.github.io/integem-ai-camp-labs/study/) · [Field Trip Atlas](https://si9257.github.io/integem-ai-camp-labs/travel/) · [建仓、发布与 AI 配置教程](https://github.com/si9257/integem-ai-camp-labs/blob/main/TEACHER_GUIDE.md)

手机版现场演示可从 **Practice → Storm lab** 体验提示后重答，或在 **My trip → Indoor alternatives** 替换一站，再用 **Family link** 从家长角度验收。

## 一周班怎样用同一份作业做出五天的作品

| 天 | 学生制作什么 | 下课前的检验 |
| --- | --- | --- |
| 周一 | 用同一份课堂笔记分别写“考我”和一份带目标、输出格式、证据要求的提示。给三行观察做卡片。 | 合上答案，口头回忆，再回笔记核对；辨认测量值和推断。 |
| 周二 | 两人一组，一位写卡，一位只看手机做题。把问法有歧义的一张改到同学能独立回答。 | 保存首答和改答，说明为什么选择题比自由回忆容易。 |
| 周三 | 做第二个科目的笔记本，设计一套应用或证据题；给同伴交换一份 JSON 副本。 | 同伴导入后能找到同样的原文；检查一条超出笔记范围的问题。 |
| 周四 | 为另一个年龄的学生修改复习或反馈流程。用 **At the end** 完成一次测验，再把错题带回回忆练习。 | 刷新、切换科目、重开旧轮次。记录一个发现的问题，以及修复后同伴怎样验证。 |
| 周五 | 向家长演示昨天到期的一张卡和一次能引用证据的纠错。交付自己的网址、笔记备份和演示。 | 家长能独立打开作品并做完一道题；学生能区分自评、首次得分和改答。 |

**Five-day build.** Monday compares two prompts on the same observations and produces a source-backed recall card. Tuesday pairs a card author with a phone tester to repair an ambiguous prompt. Wednesday creates a second subject, exchanges a notebook copy and tries an unsupported question. Thursday builds and verifies a delayed-feedback quiz, including refresh and an older round. Friday shows a parent a due card and a corrected answer, then shares the student's own site and notebook backup.

## 两个班怎样拉开难度

| | 一周班 · No-Code App Studio with AI Agents | 两周班 · AI App Engineering Studio |
| --- | --- | --- |
| 学生负责 | 定义用户、分解需求、审阅 AI 的开发计划、测试和发布 | 在左列能力上，再加入读写 JavaScript、核查数据、处理故障和团队代码评审 |
| 演示作品 | Study Desk，输入笔记后做测验，带着错答追问 | Field Trip Atlas，查真实天气、在地图上选点、生成或编辑多日行程 |
| 建议学生带走 | 一个小组限时作品，一个体现个人兴趣的应用，附网址、测试记录与简短演示 | 一个团队数据原型，一份能代表个人贡献的毕业作品，附数据来源、代码改动与演示 |

iD Tech 的一周班公开介绍把从笔记出题的学习助手列为示例，并安排了提示、团队挑战、快速原型、完善和展示。两周班把有实时天气的旅行规划器列为毕业项目示例，并明确从第一周开始接触代码与 GitHub 协作。下列逐日任务、学生案例和验收方式由 Integem 设计。[一周课程说明](https://www.idtech.com/courses/ai-agents-prompt-engineering-and-app-development) · [两周课程说明](https://www.idtech.com/courses/ai-academy-vibe-coding-and-app-dev-with-ai-agents)

## 开课前，老师先走一遍学生要走的路

1. **准备开发环境。** 给每组准备能通过自然语言创建或修改项目文件，并能预览和保存的 AI 开发工作区。让它给一个空白页面加按钮，检查改动，保存一个版本。学校已有合适工具即可。网站里的 AI 导师负责解释学习内容。学生要指挥 AI 修改作品时，打开教师准备的开发工作区。
2. **分发起步材料。** 完整网站留给老师示范。一周班的学生副本建议只给空白页面、一个原创示例和已经接好的班级 AI 调用入口。两周班另给一张有官网和经纬度的地点卡、一份 NWS 返回样例及字段说明。各组使用自己的副本或教师班级仓库里的独立目录，给学生保留设计和实现的空间。
3. **核对真实 AI。** 目前上线记录中的真实模型返回仍待填 Key 后验证。教师按部署教程接好学校网关，用本人新写的笔记生成一次题目，再用一次家庭需求生成行程。长期 Key 留在服务端。没有模型时可以先上界面、地图、预置练习和手动排程。正式讲 AI 生成前要拿到真实返回。
4. **安排一天的节奏。** 若有约 4 小时项目时间，可用 20 分钟演示、50 分钟小组实验、90 分钟个人或结对制作、45 分钟陌生同学试用、35 分钟修订和保存。全天营的午餐、休息和户外活动另排。

## 一周班 · 用自然语言做出自己的应用

| 日程 | 上午老师讲什么 | 下午学生做什么 | 当天验收 |
| --- | --- | --- | --- |
| 周一 · 让 AI 听懂需求 | 现场发两种提示给同一模型。让学生圈出用户、输入、输出和依据。演示删掉无关上下文如何节约 token。有多个获准模型时，用同一任务比较一次引用准确性和等待时间。 | 两人读原创托盘笔记。先问哪盘径流更多，再问哪盘蒸发得更多。各改一版提示，要求模型只用笔记、指出缺少的证据。 | 保存两版提示和对应输出。另一组能看出哪句是证据，哪项实验数据没有测。 |
| 周二 · 小组限时开发 | 发一个真实对象会用的小委托，例如“机器人社新人总忘记赛前装备”。示范让开发 Agent 先提计划，再一次做一个动作。 | 两人做一个能选活动、勾装备、看到遗漏项的单屏应用。半程交换指挥和测试角色。请隔壁组按实际场景试用，再提交首版和修订版。 | 小组得到可运行的迷你应用和两次 GitHub 记录。能指出哪条同伴意见改变了产品。 |
| 周三 · 个人原型 | 老师用 Study Desk 演示“输入材料 → 完成任务 → 得到反馈”。讲如何把大点子缩成一条当天能跑完的流程。 | 学生选自己的用户和主题。例：给篮球队新生做战术测验、给机器人社做器材训练、给乐团做读谱练习。指挥 Agent 做第一版，换一份材料请同学试。 | 一位没听过项目介绍的同学能独立做完一轮。作者记录一件同学卡住的事。 |
| 周四 · 把一个功能打磨好 | 用一条能重复的故障描述演示调试：做了什么、期望什么、实际发生什么。演示如何读一条控制台错误，再让 Agent 提出小范围修改。 | 按昨天反馈做一个真正改变体验的功能。例如学生版增加“第一次答错只给提示，再答一次才显示答案”。在手机上用正常、缺少依据和空白三种输入复测，留下修订前后记录。 | 作者能现场复现原问题，再用相同输入证明修好。三个用例的预期和实际结果都已记录。 |
| 周五 · 发布与家庭展示 | 示范用 2 分钟讲“谁需要它、我改了什么、怎么知道有效”。讲解发布网址、版本记录和家庭现场试用的区别。 | 上午发布并排练。下午让家长提供一小段新材料，现场体验孩子的应用，再由学生解释一个设计决定。 | 个人作品网址、测试记录和三页展示材料。每人能独立回答一次“为什么这样设计”。 |

**周一教师可以直接用的材料。** 两个托盘各浇水 200 mL，草盘收集到 45 mL 径流，裸土盘收集到 120 mL。实验没有测蒸发量。先让学生预测模型会怎样回答“哪盘蒸发得更多”。等看过回答，再让学生自己写出“只用笔记证据”的改进指令。

**两句不同用途的英文提示。** 给学习助手：“Which tray had more runoff? Quote one sentence. Could these notes tell us which tray lost more water to evaporation?” 给开发 Agent：“When a player misses a question, offer one hint and a second try. Reveal the answer after the retry. Show me your plan before editing.” 让学生指出哪一句会改变网页的行为。

## 两周班 · 做出经得起真实数据变化的应用

| 日程 | 上午老师讲什么 | 下午学生做什么 | 当天验收 |
| --- | --- | --- | --- |
| 第 1 周周一 · 读懂一张卡 | 从一个景点卡看 HTML、CSS、JavaScript 各负责什么。示范读一个含字段与标签数组的地点对象。 | 结对选城市，核对一个场馆官网。每人亲手改一项地点数据和一条 JavaScript 显示逻辑，互相解释差别。 | 浏览器展示核查过的真实地点。每人能找到自己的改动。 |
| 周二 · 数据决定界面 | 用两个地点示范数组、条件和 `filter`。 | 补齐四张地点卡，每人亲写或补完“只看室内”的筛选逻辑。 | 切换筛选后，对应地点出现或消失。用全为室外的数据试一次空结果。 |
| 周三 · 读一份真的天气预报 | 一起读美国国家气象局返回的日期、时区和单位。将某一天的预报与用户的出行日期对齐。 | 接入一个城市的真实 NWS 预报。分别试一个在预报范围内的日期和两个月后的日期，设计两种显示方式。 | 同学能找到来源、更新时间、单位及超出范围提示。 |
| 周四 · 让地图和行程说同一件事 | 讲经纬度、地点 ID 与当天顺序。用两个位置相近的场馆演示“地理位置”和“第几站”的区别。 | 接入免 Key 地图，在第 1 天加入两站、换序，再给第 2 天加一站。两人分别负责地图和列表。 | 新顺序同时反映在清单和地图上。切换日期不会串站。 |
| 周五 · 团队合并与试玩 | 示范读一次 GitHub 改动、留一条具体评审意见、合并后复测。 | 组内交换检查天气与地图模块，让另一组根据“两个孩子、两天、喜欢科学”的委托排出一天行程。 | 发布第一周可用的手动原型。每名学生留下一处个人代码改动和一条团队评审。 |
| 第 2 周周一 · 毕业选题 | 用真实家庭的取舍定义需求。一个小组可以沿用旅行主题，另一组可以把已学到的地图与数据能力用到科学社出游。 | 访问一位“委托人”，画两种界面草图，只选一个主问题。例：“家长想一键换掉可能遇雨的室外一站。” | 一页需求书，含用户、输入、成功条件和分工。 |
| 周二 · 让 AI 根据事实排计划 | 将偏好、已核查的地点 ID 和有覆盖的预报发给模型。示范只接收名单内地点，并检查模型返回的日期。 | 小组接入真实 AI。各试一份有预报的委托和一份远期委托。用一份明示为测试数据的陌生地点返回，检验程序是否保留原行程。 | 两次真实返回有记录。受控测试中，程序识别了未知地点。 |
| 周三 · 做一个组里独有的功能 | 把选择权交给学生。讨论“偏好下雨去室内”和“当天预报确认下雨”要怎样分别呈现。 | 完成一个有实际操作的扩展。例如选中一站，比较两个有官网依据的室内备选，学生决定是否替换，地图和当天清单随之更新。 | 别组学生能在手机上完成替换，并说出保留或放弃原景点的理由。 |
| 周四 · 接受陌生用户测试 | 示范检查断网、预报过期、超出日期和刷新后的状态。让学生决定哪一处亲手修，哪一处请 AI 协助。 | 让另一组从零操作。挑一个影响使用的问题，保存可复现步骤，修复后用同一组输入复测。 | 一条完整的故障报告、对应改动、修后结果和每人一句贡献说明。 |
| 周五 · 用新委托展示 | 示范用数据来源支持决定，并用一句话说清产品的限制。 | 发布毕业版。家长临场换一个日期或兴趣。学生当场改行程，解释天气、地图或 AI 如何影响决定，再展示自己的代码。 | 可访问网址、一次真实数据演示、导出行程和每人一项可追溯的贡献。 |

## English teacher edition

For a live phone demo, open **Practice → Storm lab** for a hint and retry, or **My trip → Indoor alternatives** for a one-stop change. Open **Family link** to show the result as a parent would see it.

Use **Study Desk** and **Field Trip Atlas** as instructor demos. Students start with a thin project of their own. In the one-week camp they direct a development agent, review its plan and test what it builds. In the two-week academy they also write JavaScript, inspect data and review teammates’ changes. The published sites use AI for quizzes, tutoring and trip planning. Set up a separate development workspace that can edit, preview and save a student project. Test a real quiz and a real itinerary through the school gateway before teaching those activities. Teacher credentials belong on the server.

Allow roughly four project hours when the camp day permits. One workable split is 20 minutes of demonstration, 50 minutes of guided experiments, 90 minutes of building, 45 minutes of peer testing and 35 minutes to revise and save. Schedule lunch, breaks and outdoor time separately.

### One week · No-Code App Studio with AI Agents

| Day | Teach and build | What students show |
| --- | --- | --- |
| Monday | Compare two prompts on the same soil-tray notes. Both trays received 200 mL. The grass tray produced 45 mL of runoff. The bare tray produced 120 mL. Ask about runoff, then evaporation, which was not measured. Discuss the audience, evidence and how extra context uses tokens. Compare models if the school already offers a choice. | Two prompts, two responses and a student explanation of an unsupported claim. |
| Tuesday | Give pairs a small client brief. A robotics club wants a checklist for first-time competitors. Ask the agent for a plan, build the checklist, swap driver and tester, and make one revision after a neighboring team tries it. | A working mini-app and two versions saved to GitHub. |
| Wednesday | Show one complete input-to-feedback interaction in Study Desk. Students pick their own audience, such as basketball rookies, robotics club members or beginning musicians. Build one usable interaction and ask a classmate to try it with fresh material. | A personal prototype, one observed obstacle and feedback in the tester’s own words. |
| Thursday | Teach students to describe a reproducible bug and read a console message. Add one meaningful behavior, such as offering a hint and a retry before revealing the answer. Test normal, insufficient and empty input on a phone. | A before-and-after example and three test cases with expected and observed results. |
| Friday | Publish, rehearse a two-minute pitch and invite a family member to try the app with unfamiliar material. Each student answers a design question. | A working link, three slides and a test record. |

### Two weeks · AI App Engineering Studio

| Day | Build in class | What students show |
| --- | --- | --- |
| Week 1, Monday | Read the HTML, CSS and JavaScript behind a venue card. Check the venue’s official site. Each student changes a data field and a line of display logic. | A verified card and a personal change the student can explain. |
| Tuesday | Write a small JavaScript filter for indoor venues, then test it with four cards and an all-outdoor set. | Correct filtered results and an understandable empty state. |
| Wednesday | Read a genuine National Weather Service response. Match a forecast to a local travel date and try a date two months ahead. | Source, update time, units and an explicit out-of-range state. |
| Thursday | Connect map markers and itinerary entries using stable venue IDs. Place two stops on one day, swap them, then add a stop on a different day. | The map and list agree about order and day. |
| Friday | Review a teammate’s GitHub change and merge the team prototype. Another team plans a day for a family interested in science. | A working manual planner, a code contribution and a review from each student. |
| Week 2, Monday | Interview a mock client. Sketch two interfaces and choose one problem, such as replacing an outdoor stop when the family wants a rainy-day alternative. | A one-page brief, a measurable success condition and named owners. |
| Tuesday | Give the model only verified venues and available forecasts. Try a covered and an uncovered date. Separately test an unknown venue ID with a labeled fixture. | Two real model runs and a test showing the app safely keeps the previous plan on invalid input. |
| Wednesday | Build one original interaction. For example, compare two verified indoor alternatives, let the visitor choose and update the list and the map. | A peer successfully uses the new feature on a phone. |
| Thursday | Invite fresh users to test network failure, dates beyond coverage and recovery after a refresh. Record and fix one reproducible issue. | A bug report, a linked change, a retest and each student’s contribution. |
| Friday | Publish the capstone. A family member changes the brief on the spot. Students adapt the trip, explain one decision using the source data and show code they wrote. | A live link, an exported itinerary, a sourced demonstration and traceable individual contributions. |

[English deployment and AI setup guide](https://github.com/si9257/integem-ai-camp-labs/blob/main/TEACHER_GUIDE_EN.md)

## 两周毕业项目扩展 · Family travel agent

第 6 天，把“带家人玩三天”的委托写成日期、人数、节奏、兴趣、预算与交通条件。第 7 天，用旅行页 **Bookings** 比较真实住宿总价与酒店另收费用，核对一个可订的票务入口。第 8 天，用地图和相邻两站的路线链接核查午餐或换乘是否合理。第 9 天，让另一组在手机上只改一天，验证其他日期是否保留，并测试没有房价、没有天气和凭证到期这三种情况。第 10 天，把只读行程发给家长，解释一个真实报价、一项计划估算，以及最后订票前要对照的官方来源。

On days 6–10, turn a family brief into dates and constraints, compare live room totals with extra charges, check inter-stop directions and lunch placement, revise one day on a phone, then present a read-only trip. Ask each student to identify one supplier quote, one planning estimate and one operator link a parent should check before booking.
