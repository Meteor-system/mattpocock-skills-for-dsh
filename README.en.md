# Matt Pocock Skills for DSH

A portable DeepSeek Harness agent preset that vendors the 25 promoted skills from [mattpocock/skills](https://github.com/mattpocock/skills): grilling, spec/ticket flows, TDD, and review.

This is not Superpowers. There is no "load a skill before every reply" bootstrap, and there is no host plugin.

中文: [README.md](README.md)

## Install

```bash
git clone https://github.com/Meteor-system/mattpocock-skills-for-dsh.git
cd mattpocock-skills-for-dsh
node scripts/install-preset.mjs
```

Pass `--force` to back up an existing `mattpocock-skills` preset. Restart the DSH process, start a **new** session, and pick **Matt Pocock Skills**.

Run `/setup-matt-pocock-skills` once per repo (issue tracker, triage labels, `CONTEXT.md` layout). Engineering skills read `docs/agents/*.md`; if those files are missing the model will ask you to type that command, it will not start it for you.

## How to use it

Skills split on one axis: **who can start them**.

| Kind | How it starts | In the model catalog? |
|---|---|---|
| **User-invoked** | You type `/skill-name` | No. DSH injects the full body from the slash |
| **Model-invoked** | You type `/name`, or the model loads it with the `skill` tool | Yes |

A user-invoked skill may call a model-invoked skill. Nothing may start another user-invoked skill. If setup is missing, the model tells you to type `/setup-matt-pocock-skills`.

### Main path: idea → ship

In a repo with a working directory:

1. **`/grill-with-docs`** interviews you and writes/updates `CONTEXT.md` and ADRs.
2. If a design question needs a runnable answer: **`/handoff`** out, **`/prototype`** in a fresh session, handoff back.
3. Fits in one session → **`/implement`**. Too big → **`/to-spec`**, then **`/to-tickets`**, then one **`/implement`** per ticket in a fresh session.
4. **`/implement`** drives **`tdd`**, finishes with **`code-review`**, then commits.

Unsure which flow? **`/ask-matt`**.

No working directory? **`/grill-me`** (same interview, no docs). If a repo is there, always prefer `/grill-with-docs`.

### Other on-ramps

| Situation | Start here |
|---|---|
| Incoming bugs/requests on the tracker | `/triage` |
| Hard, slow, or intermittent failure | describe it; the model should load `diagnosing-bugs` |
| Too large for one session (greenfield or huge feature) | `/wayfinder`, then `/to-spec` when the map is clear |
| Spare time, make the codebase deeper for agents | `/improve-codebase-architecture` |
| The last message did not land | `/wait-what` |
| New directory, new harness, or a colleague | `/handoff` |
| The missing answer lives in someone else's head | `/to-questionnaire` |
| Only a human can click the dashboard / secrets / cutover | the model should load `wizard` |

## All 25 skills

### Engineering · user-invoked

| Slash | What it does | When to use it |
|---|---|---|
| `/ask-matt` | Router over the flows in this preset | You do not know which skill to start |
| `/setup-matt-pocock-skills` | Configure this repo's issue tracker, triage labels, and domain-doc layout | **Once per repo**, before other engineering skills |
| `/grill-with-docs` | Relentless interview that also writes `CONTEXT.md` and ADRs | You have a repo and need alignment |
| `/to-spec` | Turn what you already discussed into a spec on the tracker; no new interview | After grilling or wayfinder, before build |
| `/to-tickets` | Split a plan/spec into tracer-bullet tickets with blocking edges | Spec exists; you need slices you can queue |
| `/implement` | Build from a spec or tickets; drives TDD, then code-review, then commit | The work is already written down |
| `/triage` | Move incoming issues/PRs through triage roles into agent-ready briefs | Work you did not create (not `/to-tickets` output) |
| `/wayfinder` | Map huge work as **decision tickets** on the tracker and resolve them one by one | One session cannot see the destination; output is decisions, not code |
| `/improve-codebase-architecture` | Scan for deepening opportunities, HTML report, then grill the one you pick | Codebase health, not a new feature |

### Engineering · model-invoked

These appear in DSH `available_skills`. The model loads them with the `skill` tool; you can also type `/name`.

| Name | What it does | When to use it |
|---|---|---|
| `tdd` | Red-green loop, one vertical slice at a time | Test-first work, "red-green-refactor", integration tests. `/implement` calls it |
| `code-review` | Two-axis review since a fixed point: Standards + Spec, parallel sub-agents | Review a branch, PR, WIP, or "review since X". `/implement` closes with it |
| `diagnosing-bugs` | Build a feedback loop that goes red on *this* bug, then minimise, hypothesise, instrument, fix, regression-test | Hard bugs, performance regressions, flakes |
| `research` | Background agent reads primary sources and writes a cited Markdown file | Docs/API facts while you keep working |
| `prototype` | Throwaway prototype for one design question (single HTML for logic, toggleable UI variants) | You cannot settle it on paper |
| `domain-modeling` | Sharpen domain language, ADRs, `CONTEXT.md` | Terminology work. `/grill-with-docs` drives it |
| `codebase-design` | Deep-module vocabulary: module, interface, depth, seam, adapter | Interface design, deepening, testability. Used by `tdd` and architecture review |
| `resolving-merge-conflicts` | Resolve an in-progress merge/rebase hunk by hunk by intent; never `--abort` | You are already in a conflict |
| `wizard` | Generate an interactive bash wizard for steps only a human can take | Infra, secrets, unfamiliar dashboards, one-off cutovers. On Windows run the script in Git Bash or WSL |

### Productivity · user-invoked

| Slash | What it does | When to use it |
|---|---|---|
| `/grill-me` | Same interview as `/grill-with-docs`, **no local docs** | No working directory |
| `/handoff` | Compact this conversation into a handoff file for another agent | New harness, new directory, a colleague, or a mid-phase fork |
| `/teach` | Teach a concept across sessions in this directory | You want to learn and keep a learning record |
| `/to-questionnaire` | Write a questionnaire for someone else; it grills you about the send, not the subject | The blocker is in another person's head |
| `/wait-what` | Re-pitch the last message in plain language using `CONTEXT.md` | Mid-conversation, the last message did not land |

### Productivity · model-invoked

| Name | What it does | When to use it |
|---|---|---|
| `grilling` | Interview primitive: rounds over the design-tree frontier | Engine under `/grill-me`, `/grill-with-docs`, `/triage`, `/wayfinder`, architecture review. Load it directly only if you want the interview with no wrapper |
| `writing-for-agents` | Writing docs agents consume: skills, `AGENTS.md` / `CLAUDE.md` | Creating or editing those files |

## Living next to Superpowers

Sessions do not mix toolsets. Superpowers names may still appear in the catalog if the `superpowers-for-dsh` host plugin is installed; the bootstrap tells the model to ignore them. This preset sets `includeDefaultRoots: false`, so it does not scan `~/.agents/skills`.

## Verify

```bash
node scripts/verify.mjs
```

Pinned to mattpocock/skills `1.2.3` / `3cca18b`. See [UPSTREAM.md](UPSTREAM.md).
