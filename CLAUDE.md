## gstack (recommended)

This project uses [gstack](https://github.com/garrytan/gstack) for AI-assisted workflows.
Install it for the best experience:

```bash
git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup --team
```

Skills like /qa, /ship, /review, /investigate, and /browse become available after install.
Use /browse for all web browsing. Use ~/.claude/skills/gstack/... for gstack file paths.

## GSD workflow (Get Shit Done)

Non-trivial work follows the GSD framework in [`gsd/`](gsd/README.md): break it into atomic
tasks and run each through **discuss → plan → execute → verify**, advancing only past each
stage gate. Each task carries its own engineered context (files, docs, constraints).

- Reference docs live in [`docs/`](docs) (PRD, TRD, schema, design, rules).
- The live task flow is [`gsd/board.md`](gsd/board.md); per-task files are `gsd/tasks/NNNN-*.md`.
- Start a task from [`gsd/templates/task.md`](gsd/templates/task.md). Don't skip `discuss` —
  define testable success criteria before planning, and never mark `done` without verify evidence.
- Binding rules (security/design/code/verify/git) are in [`docs/rules.md`](docs/rules.md).

## Pinned decisions (don't re-litigate without asking)

- **Backend is Supabase, not Firebase.** The original idea docs (`001 aerobmsce idea.docx`,
  `AeroBMSCE Digital Platform Project.docx` — both migrated to the Obsidian vault inbox)
  specified Firebase/Firestore. The actual build uses Supabase (`supabase/migrations/`,
  `supabase db push` in the deploy flow). Don't propose migrating to Firebase — the docs
  are stale, the repo is the source of truth.
- **Deploy target**: `aerobmsce.vercel.app` via `vercel --prod --yes`. Verify `gh auth`
  status before relying on GitHub CLI for PR/status checks — it has expired mid-session
  before.

## Shipping

Use the `/shipcheck` skill (`~/.claude/skills/shipcheck/SKILL.md`) for the
typecheck→build→deploy→smoke-test loop instead of retyping `npx tsc --noEmit`,
`npm run build`, `vercel --prod`, and curl checks by hand each time — this exact sequence
was the single most-repeated manual workflow across this project in the last 30 days.

## Visual QA — don't regress silently

This project has shipped UI regressions that only surfaced when the user manually caught
them (a removed cursor-trail effect that quietly disappeared; a batch of images the user
asked to be curated down to 5-6 that all got used instead). Before declaring a visual
change done:
- Screenshot before AND after with `preview_screenshot`, not just after.
- If the user references an asset (a Drive link, a zip of logos, a specific photo count),
  re-read their exact request before finishing — "use 5-6 of the best" is a curation
  instruction, not "use all of them."
- Call out any visual behavior you removed or changed that wasn't explicitly requested,
  even if it seemed like a side effect of an unrelated fix.
