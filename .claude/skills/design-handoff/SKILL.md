---
name: design-handoff
description: >
  Import a Claude-design handoff ZIP from design-handoff/ by replacing the
  design/ directory wholesale, reviewing the diff, and committing. Use when
  the user says "import the design handoff", "new handoff zip", "apply the
  handoff", or invokes /design-handoff. The skill argument is the commit
  message to use.
user-invocable: true
---

# Design handoff import

Each handoff ZIP is a **complete snapshot** of the `design/` directory, not a
patch. Nothing in `design/` is ever hand-edited locally, so the correct import
is a wholesale replace: delete `design/`, move the snapshot in, commit. This
clears files the designer deleted or renamed, which a plain unzip-over-top
would leave behind as orphans.

The argument passed to this skill is the commit message (subject line, or
subject + body). Example:

```
fix(design): split-slate overlap and email copy

Constrain split-slate left panels to min-content so display
headlines can't overlap the divider. Drop the no-marketing
promise and fix leftover phone copy on web identity check.
```

## Procedure

Work from the repo root. All steps are Bash; prefer one step per command so
failures are obvious.

### 1. Preflight

- Run `git status --porcelain`. If anything is **staged** outside `design/`,
  stop and tell the user — the import commit must contain only the handoff.
  Unstaged/untracked changes elsewhere are fine.
- List `design-handoff/*.zip`:
  - **None** → tell the user to drop the handoff zip into `design-handoff/`
    and stop.
  - **One** → use it.
  - **Several** → use the newest by modification time and tell the user which
    one you picked and which you ignored.

### 2. Extract and normalize

Extract into a fresh temp directory (use the session scratchpad, never the
repo), then:

- Remove any `__MACOSX/` directory and all `.DS_Store` files.
- Determine the snapshot root: if the extraction contains exactly one
  top-level directory (its name varies per handoff, e.g.
  `design_handoff_hoopruns_core_loop`), that directory is the snapshot root;
  otherwise the extraction root itself is.

### 3. Sanity-check the snapshot

The snapshot root must contain `README.md`, `assets/`, and `system/`. If any
are missing, **abort without touching `design/`** and report what was found —
it is probably the wrong zip. (`system/` resolves images from its sibling
`assets/`, so this structure is load-bearing.)

### 4. Replace wholesale

- `rm -rf design` — only ever the repo-root `design/` directory, nothing else.
- Move the snapshot root to `./design`.

### 5. Stage and review

- `git add -A design`
- Show the user `git diff --stat --cached` plus a one-line summary of anything
  notable (renames, large add/delete swings, new or removed top-level dirs).
  This is the review step — the stat output is the ground truth of what the
  handoff changed.

### 6. Commit

- Commit with the message the user passed as the skill argument.
- If no message was provided, draft one in the project's conventional style
  (`fix(design): ...` / `feat(design): ...` subject, optional wrapped body
  describing the visible changes) from the diff, show it to the user, and get
  confirmation before committing.
- If the diff is empty, say so, skip the commit, and still do cleanup.

### 7. Cleanup and report

- After a successful commit, delete the imported zip from `design-handoff/`
  and the temp extraction directory.
- Report the commit hash and the stat summary.
