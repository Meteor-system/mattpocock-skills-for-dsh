# Matt Pocock Skills for DSH

这是 [Matt Pocock 的技能集](https://github.com/mattpocock/skills) 的 DSH 移植版：grilling、spec/ticket 流程、TDD、code review。做成一个可安装的 bundle + 一个独立 Agent 预设，可以和 Superpowers 并存。

English: [README.en.md](README.en.md)

## 安装

### 1. 装 bundle（把 25 个技能注册到全局技能层）

```powershell
npx @deepseek-ai/dsh plugin --profile web add github:Meteor-system/mattpocock-skills-for-dsh
```

也可以从本地 clone 装：

```powershell
git clone https://github.com/Meteor-system/mattpocock-skills-for-dsh.git
npx @deepseek-ai/dsh plugin --profile web add C:\path\to\mattpocock-skills-for-dsh
```

### 2. 装预设模板

在本仓库目录里跑：

```bash
node scripts/install-preset.mjs
```

预设会装到 `%USERPROFILE%\.dsh\.agent-presets\mattpocock-skills`。已有同名预设时加 `--force`，脚本会先备份一份带时间戳的旧版。

### 3. 重启，新开会话

bundle 在 profile 启动时挂载。**重启 DSH**，刷新页面，新开一个会话，预设选 **Matt Pocock Skills**。旧会话保留原来那代预设，不能拿来验收。

进新仓库之后先跑一次 `/setup-matt-pocock-skills`，它会配置这个仓库的 issue tracker、triage 标签和 `CONTEXT.md` 布局。后面一堆工程技能都要读 `docs/agents/*.md`，缺了它模型会停下来让你手动跑，不会自作主张。

## 怎么用

25 个技能就分两类，区别只在于**谁能启动**：

| 类型 | 启动方式 | 模型目录里看得见吗 |
|---|---|---|
| **User-invoked** | 你自己在输入框打 `/技能名` | 看不见，打斜杠时 DSH 会把完整指令注入 |
| **Model-invoked** | 你打 `/名`，或者模型觉得合适时用 `skill` 工具加载 | 看得见 |

一条硬规则：user-invoked 可以调 model-invoked；反过来不行，model-invoked 之间也不能替你把 user-invoked 拉起来。所以缺 setup 的时候，模型只会提醒你手动跑。

另外说清楚：这里没有 Superpowers 那种「每句话之前先 load 一个 skill」的规定。

### 主流程：想法 → 上线

在正经的代码仓库里，按这个顺序走：

1. 先 `/grill-with-docs`，把需求一层层问透。问的过程中它顺手把术语沉淀进 `CONTEXT.md`，把关键决定写成 ADR。
2. 有那种纸上谈不拢的设计问题（状态机、交互），`/handoff` 把上下文打包，开个新会话跑 `/prototype` 验证一下，再 handoff 回来。
3. 一次会话装得下的活，直接 `/implement`。装不下的，先 `/to-spec` 整理成规格文档，再 `/to-tickets` 拆成一张张带依赖关系的工单，然后每张工单开个新会话 `/implement`。
4. `/implement` 内部会自动走 `tdd`，收尾自动跑 `code-review`，通过之后才提交。

不知道现在该走哪条，就 `/ask-matt`，它会告诉你。

不在仓库里、只想把脑子里的方案逼问清楚：用 `/grill-me`，同一套拷问，但不落盘。只要在仓库里，就优先 `/grill-with-docs`。

### 其他入口

| 你现在的处境 | 该用什么 |
|---|---|
| tracker 里堆了一堆别人提的 bug 和需求 | `/triage` |
| bug 很难复现、性能莫名变慢、回归查不出 | 直接描述症状，模型会去加载 `diagnosing-bugs` |
| 活大到一次会话根本铺不开（新项目、巨型功能） | `/wayfinder`，地图理清之后再 `/to-spec` |
| 想顺手让代码结构更清晰、更好测试、更好给 AI 导航 | `/improve-codebase-architecture` |
| 上一句话没接住，想让模型换个说法再讲一遍 | `/wait-what` |
| 要换目录、换工具、交接给别人 | `/handoff` |
| 卡点在别人脑子里，需要找人来填一份问卷 | `/to-questionnaire` |
| 只有人类能操作：配密钥、点第三方后台、一次性迁移 | 模型会加载 `wizard` |

## 25 个技能一览

### 工程 · 人来触发

| 技能 | 做什么 | 什么时候用 |
|---|---|---|
| `/ask-matt` | 路由：看你现在的处境，指出该走哪条流程 | 不知道从哪下手 |
| `/setup-matt-pocock-skills` | 配置当前仓库的 issue tracker、triage 标签、领域文档布局 | **每个仓库一次**，其他工程技能的前置 |
| `/grill-with-docs` | 刨根问底的访谈，边问边写 `CONTEXT.md` 和 ADR | 在仓库里，需要把一件事彻底对齐 |
| `/to-spec` | 把**已经聊完**的内容整理成规格，发到 tracker，不再重新访谈 | grill 或 wayfinder 之后，准备开工 |
| `/to-tickets` | 把计划/规格拆成带阻塞依赖的工单 | 规格有了，要拆成能排队、能并行的活 |
| `/implement` | 按规格或工单实现；内部走 TDD，收尾 code-review，然后提交 | 要写的活已经定义清楚 |
| `/triage` | 把外来 issue/PR 过一遍状态机，写成 agent 能直接接的 brief | 处理别人提的活，`/to-tickets` 的产物不用再过 |
| `/wayfinder` | 把超大规模的工作在 tracker 上铺成**决策地图**，一张一张定 | 目标太远、一轮会话望不到头；产出是决策不是代码 |
| `/improve-codebase-architecture` | 扫一遍代码，找出哪些模块太浅、值得加深，输出 HTML 报告，再对你选的那个深入 grilling | 想做架构级维护，不是加新功能 |

### 工程 · 模型可调用

这几个会出现在 DSH 的 `available_skills` 里，任务对得上时模型会自己加载，你也可以直接打 `/名`。

| 技能 | 做什么 | 什么时候用 |
|---|---|---|
| `tdd` | 红-绿循环，一次一条垂直切片 | 测试先行、提到 red-green-refactor、要写集成测试。`/implement` 内部会调 |
| `code-review` | 相对某个提交点做两轴审查：规范（Standards）+ 规格（Spec），并行开子代理 | 审分支、PR、未提交的改动。`/implement` 收尾会跑 |
| `diagnosing-bugs` | 先搭一个能稳定复现这个 bug 的反馈环，再缩小范围、假设、打点、修复、回归 | 疑难 bug、性能回退、偶发失败 |
| `research` | 让后台代理去查一手资料，整理成带引用的 Markdown | 需要查文档/API 事实，同时自己接着干活 |
| `prototype` | 搭一次性原型回答一个设计问题：逻辑用单个 HTML 验证，UI 做可切换的变体 | 光靠想拿不准，得看见或者跑起来 |
| `domain-modeling` | 打磨领域语言：挑战模糊术语、写 ADR、维护 `CONTEXT.md` | 在聊术语、改词汇表的时候。`/grill-with-docs` 内部会调 |
| `codebase-design` | 设计词汇表：module、interface、depth、seam、adapter | 设计接口、找加深点、让代码可测试。`tdd` 和架构扫描都依赖它 |
| `resolving-merge-conflicts` | 按双方意图逐 hunk 解 merge/rebase 冲突，解完继续，绝不 `--abort` | 已经卡在冲突里 |
| `wizard` | 生成交互式 bash 向导，领着人走完只有人能做的步骤 | 开通基础设施、填密钥、点陌生后台、一次性切换。Windows 上生成的脚本要放 Git Bash 或 WSL 里跑 |

### 效率 · 人来触发

| 技能 | 做什么 | 什么时候用 |
|---|---|---|
| `/grill-me` | 和 `/grill-with-docs` 同一套访谈，**不写本地文档** | 不在仓库里，只想把方案问透 |
| `/handoff` | 把当前对话压成一份交接文档，给另一个 agent 接着干 | 换工具、换目录、交给同事、中途拆出去做旁路 |
| `/teach` | 在当前目录里跨多轮教会一个概念 | 想学新东西，并留下学习记录 |
| `/to-questionnaire` | 把问题做成问卷发给**别人**填；它审的是「发给谁、要什么」，不是题目本身 | 卡点不在你、不在代码，而在别人脑子里的信息 |
| `/wait-what` | 用 `CONTEXT.md` 的词汇、用大白话把上一条重新讲一遍 | 任何时候觉得话没接上，直接打 |

### 效率 · 模型可调用

| 技能 | 做什么 | 什么时候用 |
|---|---|---|
| `grilling` | 访谈原语：把决策树一轮一轮问干净 | `/grill-me`、`/grill-with-docs`、`/triage`、`/wayfinder`、架构扫描的底层引擎。单独加载它 = 只要访谈，不要外壳 |
| `writing-for-agents` | 写给 agent 看的文档：skill、`AGENTS.md` / `CLAUDE.md` | 在写或改这些文件 |

## 和 Superpowers 的关系

两个预设可以共存。一次会话只挂一个预设，工具和 prompt 不会互相叠加。

两边的技能都以 host 插件的形式全局注册，所以：

- Superpowers 会话的技能目录里会看到本套的 11 个 model-invoked 技能名（`tdd`、`grilling`…）；
- Matt Pocock 会话的目录里会看到 Superpowers 那 14 个名字。

各自的 bootstrap 会让模型忽略对方的名字。user-invoked 技能（那 14 个斜杠）两边都不会进模型目录，只有人打 `/名` 才出现。

本预设自己关掉了默认技能根（`includeDefaultRoots: false`），不会去扫 `~/.agents/skills` 之类的个人目录。

想让目录彻底干净，只能二选一：不装其中一套的 host 插件，或者接受「名字在、不 follow」。

## 校验

```bash
node scripts/verify.mjs
```

## 上游

技能内容来自 mattpocock/skills，钉在 `1.2.3` / `3cca18b`，详见 [UPSTREAM.md](UPSTREAM.md)。技能正文 MIT，版权归 Matt Pocock；DSH 这边的接线和文档是这个仓库自己写的。
