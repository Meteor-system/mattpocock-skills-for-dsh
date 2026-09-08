# Matt Pocock Skills for DSH

A portable DeepSeek Harness agent preset that vendors the 25 promoted skills from [mattpocock/skills](https://github.com/mattpocock/skills): grilling, spec/ticket flows, TDD, and review.

This is not Superpowers. There is no "load a skill before every reply" bootstrap, and there is no host plugin.

## Install

```bash
git clone https://github.com/Meteor-system/mattpocock-skills-for-dsh.git
cd mattpocock-skills-for-dsh
node scripts/install-preset.mjs
```

Pass `--force` to back up an existing `mattpocock-skills` preset. Restart the DSH process, start a **new** session, and pick **Matt Pocock Skills**.

Run `/setup-matt-pocock-skills` once per repo.

## Use

Main path (human-started): `/grill-with-docs` → `/to-spec` → `/to-tickets` → `/implement`. Type `/ask-matt` if you are unsure.

User-invoked skills start only from `/name`. Model-invoked skills (`tdd`, `grilling`, …) load through the DSH `skill` tool.

This preset can sit next to SuperPowers for DSH. Sessions do not mix toolsets. Superpowers names may still appear in the catalog if the `superpowers-for-dsh` host plugin is installed; the bootstrap tells the model to ignore them.

## Verify

```bash
node scripts/verify.mjs
```
