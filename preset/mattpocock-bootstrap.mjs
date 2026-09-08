export const name = 'mattpocock-bootstrap'
export const inject = ['systemPrompt']

const BOOTSTRAP = `mattpocock-skills:bootstrap:v2

This session uses Matt Pocock's engineering skills (vendored from github.com/mattpocock/skills). They are small and composable. Do not invent a Superpowers-style "load a skill before every reply" rule.

## Allowed skills (only these)

User-invoked (human types /name; never load with the skill tool): ask-matt, grill-me, grill-with-docs, setup-matt-pocock-skills, triage, improve-codebase-architecture, to-spec, to-tickets, implement, wayfinder, handoff, teach, to-questionnaire, wait-what.

Model-invoked (load with the DSH skill tool, one name per call): grilling, tdd, diagnosing-bugs, research, prototype, domain-modeling, codebase-design, code-review, resolving-merge-conflicts, wizard, writing-for-agents.

If a skill_content block for a user-invoked skill is already injected, follow it. Do not reload it.

When a skill says "Call the Skill tool with X", call the DSH skill tool with name X. One name per call. Never call the skill tool for a user-invoked skill.

If a skill names /tdd, /code-review, /grilling, or another model-invoked skill, load it with the skill tool. If it names a user-invoked skill as a precondition (especially setup-matt-pocock-skills), tell the human to type /setup-matt-pocock-skills; do not try to start it yourself.

## Foreign skills: ignore

The catalog may still list skills this preset did not vendor. That includes Superpowers names (using-superpowers, brainstorming, writing-plans, test-driven-development, systematic-debugging, writing-skills, and the rest of that set) and anything from ~/.agents/skills. Do not load them. Do not follow their "invoke before any reply" rules. This is not a Superpowers session.

## Per-repo setup

Engineering skills that touch issues, specs, tickets, or triage read docs/agents/*.md. If docs/agents/issue-tracker.md is missing and the current task needs the tracker, tell the user to run /setup-matt-pocock-skills first.

The usual idea-to-ship path (human-started): /grill-with-docs, then /to-spec, then /to-tickets, then /implement. /ask-matt routes when the human is unsure.

## DSH tool mapping

Skills were written harness-neutral, with a few Claude Code leftovers. Map them:

- Skill tool -> skill
- AskUserQuestion -> ask_user_question
- Task / sub-agent / background agent -> subagent (background by default; use subagent_fork when the child should inherit this conversation)
- Bash -> pwsh on Windows, bash on POSIX
- /clear -> ask the user to start a new session; there is no clear tool
- /compact -> the session compact command, not a model tool
- wizard writes a bash script; on Windows tell the user to run it in Git Bash or WSL
- Opening an HTML report: Start-Process on Windows, open on macOS, xdg-open on Linux

Read CONTEXT.md when it exists. Do not build or rewrite it unless domain-modeling or grill-with-docs is in play.
`

export function apply(ctx) {
  ctx.systemPrompt.section({ name: 'mattpocock:bootstrap', order: 90, text: BOOTSTRAP })
}

export default { name, inject, apply }
