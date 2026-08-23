---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

Follow the `tdd` skill where possible, at pre-agreed seams. Generated code must be TypeScript (`strict`) unless the repo is already JavaScript-only.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, follow the `code-review` skill to review the work.

Do not commit, amend, or push unless the user explicitly asked to commit in this conversation.
