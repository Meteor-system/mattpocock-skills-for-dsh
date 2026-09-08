# Matt Pocock Skills (installed DSH preset)

This folder is the live copy under `~/.dsh/.agent-presets/mattpocock-skills`.

The full list of all 25 skills, what each is for, and how to start them lives in the source README: [Meteor-system/mattpocock-skills-for-dsh](https://github.com/Meteor-system/mattpocock-skills-for-dsh).

## Use

1. Start a **new** session and pick **Matt Pocock Skills**.
2. Once per repo: `/setup-matt-pocock-skills`.
3. Main path: `/grill-with-docs` → `/to-spec` → `/to-tickets` → `/implement`. Unsure: `/ask-matt`.

User-invoked skills start only when you type `/name`. Model-invoked skills (`tdd`, `grilling`, `diagnosing-bugs`, …) load on demand.

This is not Superpowers. There is no "load a skill before every reply" bootstrap.

This preset sets `includeDefaultRoots: false`. Superpowers names may still appear if the `superpowers-for-dsh` host plugin is installed; the bootstrap tells the model to ignore them.
