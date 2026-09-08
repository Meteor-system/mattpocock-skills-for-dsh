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

每个仓库先跑一次 `/setup-matt-pocock-skills`。

## 怎么用

主路径（人打 slash）：

`/grill-with-docs` → `/to-spec` → `/to-tickets` → `/implement`

不确定用哪个就 `/ask-matt`。

- **User-invoked**（只有人打 `/name`）：`ask-matt`、`grill-me`、`grill-with-docs`、`setup-matt-pocock-skills`、`triage`、`improve-codebase-architecture`、`to-spec`、`to-tickets`、`implement`、`wayfinder`、`handoff`、`teach`、`to-questionnaire`、`wait-what`
- **Model-invoked**（模型可用 `skill` 工具加载）：`grilling`、`tdd`、`diagnosing-bugs`、`research`、`prototype`、`domain-modeling`、`codebase-design`、`code-review`、`resolving-merge-conflicts`、`wizard`、`writing-for-agents`

这不是 Superpowers：没有「任何回复前必须 load skill」。

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
