# Matt Pocock Skills (DSH preset)

User-authored DSH preset. It copies the full `standard` coding agent and vendors [mattpocock/skills](https://github.com/mattpocock/skills).

## Use it

1. Start a **new** session.
2. Pick **Matt Pocock Skills** in the preset picker.
3. In each repo, run `/setup-matt-pocock-skills` once (issue tracker, triage labels, `CONTEXT.md` layout).
4. Drive work with slash skills. The main path is `/grill-with-docs` → `/to-spec` → `/to-tickets` → `/implement`. Type `/ask-matt` if you are unsure which flow fits.

User-invoked skills only start when you type `/name`. Model-invoked skills (`tdd`, `grilling`, `diagnosing-bugs`, …) show up in the skill catalog and load on demand.

This preset sets `includeDefaultRoots: false`, so it does not scan `~/.agents/skills` or project skill folders. If the `superpowers-for-dsh` **host plugin** is installed in the profile, those 14 Superpowers names can still appear in the merged catalog (global layer). The bootstrap tells the model to ignore them. Removing that host plugin is the only way to hide the names entirely; it is not something a preset can unregister.

## Layout

- `skills/engineering/` and `skills/productivity/`: vendored upstream bundles (one skill per directory, as DSH discovery requires).
- `mattpocock-bootstrap.mjs`: short prompt section for invocation rules and DSH tool names.
- `UPSTREAM.md`: commit pin.

This is not Superpowers. There is no "load a skill before every reply" bootstrap.
