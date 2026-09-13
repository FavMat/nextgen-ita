# CiaoMirta and NextGen Ita

Shared context for any coding agent (Antigravity, Claude Code, Cursor).
Keep this file true. If you find it wrong, fix it in the same change.

Workspace wide working rules live one level up in `../AGENTS.md`. If your
workspace root is this folder rather than its parent, open that file manually
once: it carries the git handoff rules and the lessons already paid for.

## What this repo is

One repo, two public sites, both static HTML on Vercel.

- `ciaomirta.it` is the hub: toolbox, AI Bits, Cool Apps, account pages
- `nextgenitaly.it` serves `nextgen-ita.html` as its home (see the host based
  redirect in `vercel.json`). Podcast, events, coaching.

A third property, **Agentry**, lives in a **separate repo** at
`../agentry` and deploys to `agents.ciaomirta.it`. It is a React SPA plus a
Cloudflare Worker. Do not try to merge it in here: this site has no build step
and Agentry ships roughly 1.5 MB of JS.

## Deploy

Push to `main`. Vercel deploys both projects automatically. There is no build
step, no framework, no bundler. Plain HTML, CSS and JS.

Vercel projects: `favmats-projects/ciaomirta` and `favmats-projects/nextgen-ita`.

## Hard won gotchas

Read these before touching anything. Each one cost real debugging time.

**`cleanUrls: true` breaks relative asset paths in subfolder apps.**
Vercel serves `/molecule-viewer` without the trailing slash, so the browser
resolves `assets/app.js` against the root and gets a 404. The page renders
blank while still returning HTTP 200, so it looks alive in any status check.
Subfolder apps must use absolute paths: `/molecule-viewer/assets/app.js`.
This bit MoleculeViewer and Italian NHS Monitor, months apart.

**HTTP 200 does not mean a page works.** See above. Verify by rendering and
reading the text, or by checking that assets load, never by status code alone.

**Supabase free projects pause after 7 days of inactivity.** Supabase counts
*database* activity, so pinging an auth or health endpoint does not reset the
timer. A real table read does, and the trigger has to come from outside the
project. This is now automated by the health check in the Agentry Worker, which
reads one row from each project every 48 hours. If you add a Supabase project,
add it to `SUPABASE_KEEPALIVE` in `../agentry/worker/index.js` or it will fall
asleep and take its app down with it.

**Auth is dormant on purpose.** `middleware.js` has an empty `PROTECTED` array.
Supabase, login, account, consent logging and RLS all still work, they just
gate nothing, because the three paths they used to gate were never built. To
add a real members area, put its pattern back in the array.

**RLS policies must not query their own table.** A policy on `profiles` that
did `EXISTS (SELECT 1 FROM profiles ...)` caused infinite recursion and took
down every profile read. Use a `SECURITY DEFINER` function instead.

## Structure

```
index.html          ciaomirta.it home
nextgen-ita.html    nextgenitaly.it home
toolbox.html        12 skill buttons, deep link to claude.ai with a prompt
apps.html           Cool Apps catalogue, cards by category
bits.html           AI Bits index, links to bit.html?id=N
bit.html            the real article reader, driven by posts-data.js
bit-0N.html         orphan static copies, nothing links to them
login/account/onboarding.html   Supabase auth, currently gating nothing
assets/ng.css       design system
assets/ng.js        canvas, nav shrink, hamburger, reveal animations
assets/auth.js      Supabase client
middleware.js       Vercel edge auth gate, currently dormant
api/                serverless: admin basic auth, account deletion
cgt-radar/ molecule-viewer/ salute/ women-health/   subfolder apps
```

Apps in subfolders are prebuilt bundles. Their source is not in this repo, so
you can edit their HTML shell but you cannot rebuild them.

## Design system

Dark theme. Tokens live in `assets/ng.css`, use them rather than hardcoding.

- Background `--bg` `#0a0d0c`, panels `--bg-1`
- Accent `--green`, secondary `--amber`, plus `--bordeaux` for headings
- Fonts: **Instrument Serif** for display and headings, **Geist** for body,
  **JetBrains Mono** for labels, counters and tags
- Nav is `.ng-nav` with `.ng-links`. Below 900px the links hide and `ng.js`
  builds a hamburger from them, so adding a nav item needs no mobile work.

The nav appears in all 15 public pages. Changing it means editing all of them.

## Editorial rules, do not violate

- **Never use an em-dash (`—`)** in anything a user can read. Use a comma, a
  colon or a full stop. This applies to copy, alt text and visible labels.
- Site language is **English**. Agent output can be Italian or English.
- No AI hype vocabulary: revolutionary, game changer, unlock, harness,
  transformative, cutting edge.
- Tone is factual and direct. No swagger, no manifesto claims.

## Related systems

| Thing | Where |
|---|---|
| Agentry app and Worker | `../agentry`, see its `tasks/STATUS.md` |
| Supabase, ciaomirta auth | project ref `vpqnyogmsipugvdhgaxj` |
| Supabase, cgt-radar | `vqpiqnwcxlsvvcltnmtk`, though the live app reads `trials_db.json` |
| Contact | matteo@ciaomirta.it |

## Working alongside another agent

This repo is edited by more than one AI tool. To avoid conflicts:

1. `git pull` before starting and `git push` when done. Do not leave work
   uncommitted across a tool switch.
2. Check `git status` before editing. If another tool left changes, read them
   before overwriting.
3. Keep this file current. It is the shared memory between tools, and it is
   cheaper to update than to rediscover.
