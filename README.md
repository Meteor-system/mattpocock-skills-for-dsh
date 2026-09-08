# Matt Pocock Skills for DSH

将 [mattpocock/skills](https://github.com/mattpocock/skills) 接到 DeepSeek Harness：grilling、spec/ticket 流、TDD、code review，作为**独立 Agent 预设**，不接管 host、也不和 Superpowers 混装。

English: [README.en.md](README.en.md)

## 安装

不需要 `dsh plugin add`。这是用户预设，不是 host bundle。

```bash
git clone https://github.com/Meteor-system/mattpocock-skills-for-dsh.git
cd mattpocock-skills-for-dsh
node scripts/install-preset.mjs
```

已有同名预设时加 `--force`（会先打时间戳备份）。

然后**重启 DSH 进程**，新开会话，预设选 **Matt Pocock Skills**。

每个仓库先跑一次 `/setup-matt-pocock-skills`（issue tracker、triage 标签、`CONTEXT.md` 布局）。工程流会读 `docs/agents/*.md`；缺文件时模型会请你自己打这个命令，不会代启动。

## 该怎么用

这套技能分两类，**谁能启动**是唯一轴：

| 类型 | 怎么启动 | 模型目录里看不看得到 |
|---|---|---|
| **User-invoked** | 你在输入框打 `/技能名` | 看不到。DSH 用斜杠注入完整指令 |
| **Model-invoked** | 你打 `/名`，或模型用 `skill` 工具按名字加载 | 看得到 |

一条规则：user-invoked 技能可以去调 model-invoked 技能；反过来、以及 skill 之间互相斜杠调用 user-invoked，都不行。缺 setup 时，模型只会让你自己打 `/setup-matt-pocock-skills`。

这不是 Superpowers：没有「任何回复前必须 load skill」。

### 主路径：想法 → 上线

在**有工作目录的仓库**里，人按这条走：

1. **`/grill-with-docs`** 把想法问清楚，同时写/改 `CONTEXT.md` 和 ADR。
2. 纸上说不清的设计问题：先 **`/handoff`** 出去，新会话 **`/prototype`**，再 handoff 回来。
3. 一轮会话装得下 → 直接 **`/implement`**。装不下 → **`/to-spec`** 写成规格，再 **`/to-tickets`** 拆成带阻塞边的工单，每个工单新开一轮 **`/implement`**。
4. **`/implement`** 内部会跑 **`tdd`**，收尾跑 **`code-review`**，然后提交。

不确定走哪条就 **`/ask-matt`**。

没有仓库、只想把计划问清楚：用 **`/grill-me`**（不写文档）。有仓库时永远优先 `/grill-with-docs`。

### 其它入口

| 你现在的情况 | 打这个 |
|---|---|
| 外来 bug / 需求堆在 tracker 里 | `/triage` |
| 很难复现、很慢、回归查不出来 | 让模型 load `diagnosing-bugs`，或直接描述症状 |
| 大到一轮会话看不清全貌（新项目或巨型功能） | `/wayfinder`，地图清楚后再 `/to-spec` |
| 空闲时想让代码更好改、更好给 AI 用 | `/improve-codebase-architecture` |
| 刚说的话没听懂 | `/wait-what` |
| 要换目录、换 harness、交给别人 | `/handoff` |
| 决策在别人脑子里，需要问卷 | `/to-questionnaire` |
| 只有人能点的第三方后台 / 密钥 / 一次性切换 | 模型会 load `wizard` |

## 全部 25 个 skill

### 工程 · 人触发（14 个里的工程部分）

| 斜杠 | 干什么 | 什么时候用 |
|---|---|---|
| `/ask-matt` | 路由器：对照当前处境指出该走哪条流 | 不知道从哪开始 |
| `/setup-matt-pocock-skills` | 配置本仓库的 issue tracker、triage 标签、领域文档布局 | **每个仓库一次**，在其它工程 skill 之前 |
| `/grill-with-docs` | 穷尽式审问，边问边写 `CONTEXT.md` 和 ADR | 有仓库、要对齐一次改动 |
| `/to-spec` | 把**已经谈过**的内容收成规格，发到 tracker；不再面试 | grilling / wayfinder 之后，准备开工 |
| `/to-tickets` | 把计划/规格拆成 tracer-bullet 工单，每张声明阻塞边 | 规格有了，要拆成可并行/可排队的切片 |
| `/implement` | 按规格或工单实现；内部跑 TDD，收尾 code-review，再 commit | 东西已经写清楚，可以写代码 |
| `/triage` | 把外来 issue / PR 推过状态机，写成 agent 可接的 brief | 别人提的 bug/需求，不是 `/to-tickets` 产出来的单 |
| `/wayfinder` | 把超大工作铺成 tracker 上的**决策票**地图，一张一张拍板 | 一轮会话看不见终点；产出是决策，不是代码 |
| `/improve-codebase-architecture` | 扫描加深模块的机会，写成 HTML 报告，再对你选的那条 grilling | 维护代码健康，不是做新功能 |

### 工程 · 模型可调用

这些会出现在 DSH 的 `available_skills` 里。匹配任务时模型会 `skill` 加载；你也可以打 `/名`。

| 名字 | 干什么 | 什么时候用 |
|---|---|---|
| `tdd` | 红-绿循环，一次一条垂直切片 | 要测试先行、提到 red-green-refactor、或要集成测试。`/implement` 会内部调用 |
| `code-review` | 相对某个定点做两轴审查：Standards + Spec，并行子代理 | 审分支、PR、WIP，或「从 X 开始 review」。`/implement` 收尾会跑 |
| `diagnosing-bugs` | 先做出对这个 bug 变红的反馈环，再缩小、假设、打点、修、回归 | 难 bug、性能回退、间歇失败 |
| `research` | 后台代理查一手来源，写成带引用的 Markdown | 要把文档/API 事实查清楚，自己还继续干别的 |
| `prototype` | 一次性原型：回答一个设计问题（状态/逻辑用单 HTML，UI 用可切换变体） | 纸上决定不了，需要看见或跑起来 |
| `domain-modeling` | 打磨领域语言：质疑术语、写 ADR、更新 `CONTEXT.md` | 在谈术语、改词汇表。`/grill-with-docs` 会内部调用 |
| `codebase-design` | 深模块词汇：module / interface / depth / seam / adapter | 设计接口、找加深点、让代码可测。`tdd` 和架构扫描都用它 |
| `resolving-merge-conflicts` | 按双方意图逐 hunk 解冲突，做完合并/rebase，绝不 `--abort` | 已经卡在 merge/rebase 冲突里 |
| `wizard` | 生成交互式 bash 向导，带人走完只有人能做的步骤 | 开通基础设施、填密钥、点陌生后台、一次性切换。Windows 上请在 Git Bash 或 WSL 里跑生成的脚本 |

### 效率 · 人触发

| 斜杠 | 干什么 | 什么时候用 |
|---|---|---|
| `/grill-me` | 和 `/grill-with-docs` 同一套审问，**不写本地文档** | 没有工作目录，只想把计划问清楚 |
| `/handoff` | 把当前对话压成交接文档，给另一个 agent 接着干 | 换 harness、换目录、交给同事、中途拆旁路 |
| `/teach` | 在当前目录里跨多轮教一个概念 | 要学东西，并留下学习记录 |
| `/to-questionnaire` | 给**另一个人**写问卷；审问的是「寄给谁、要什么回来」，不是题目本身 | 卡住的不是你也不是代码，是别人脑子里的信息 |
| `/wait-what` | 上一句没落地：用 `CONTEXT.md` 词汇、用白话再讲一遍 | 任何技能中途，话没听懂就打 |

### 效率 · 模型可调用

| 名字 | 干什么 | 什么时候用 |
|---|---|---|
| `grilling` | 审问原语：按设计树一轮一轮问 frontier | `/grill-me`、`/grill-with-docs`、`/triage`、`/wayfinder`、架构扫描的内部引擎。直接 load 表示只要审问、不要外壳 |
| `writing-for-agents` | 写给 agent 读的文档：skill、`AGENTS.md` / `CLAUDE.md` | 在写或改这些文件 |

## 和 Superpowers 并存

可以。一次会话只挂一个预设，工具和 bootstrap 不会叠。

如果 profile 里装着 `superpowers-for-dsh` **host 插件**，Matt Pocock 会话的技能目录里仍可能看到那 14 个 Superpowers 名字。bootstrap 会让模型忽略它们。要目录也干净，只能卸掉那个 host 插件。

本预设关闭了默认技能根（`includeDefaultRoots: false`），不会扫 `~/.agents/skills`。

## 校验

```bash
node scripts/verify.mjs
```

## 上游

钉在 mattpocock/skills `1.2.3` / `3cca18b`。详见 [UPSTREAM.md](UPSTREAM.md)。技能正文 MIT，Copyright Matt Pocock；DSH 接线是本仓库的适配。
