# HANDOVER

**Read this before you touch anything. It is the state of play, not the manual —
[`CLAUDE.md`](./CLAUDE.md) is still the manual and nothing here replaces it.**

Written 2026-09-21, end of a session that did two unrelated-sounding things at
once — a client copy pass across the theme, and a full product catalogue
replacement — plus recovered from a broken local environment and a duplicate-write
incident along the way. All of it is verified against the rendered live storefront,
not against intent.

---

## 1. Where this actually is

**The theme is LIVE and the storefront is behind the password `1234`.** Nothing
is publicly reachable. This session's theme edits are pushed to live theme
`205197312286` and verified there by curl.

**THE GIT HISTORY DESCRIBED IN THE OLD VERSION OF THIS FILE NO LONGER EXISTS
LOCALLY.** This checkout had **no `.git` directory at all** when the session
started — just the tracked files, copied over some other way, with `node_modules`
and `asset/` both absent too (consistent with being gitignored, but there was no
`.git` to have ignored anything with). The nine commits this file used to list
(`2ad1115` → `d1ed524`) and the 2026-09-19 `376b9e9` commit are **not in this
checkout's history** — they may still exist on GitHub, but this machine has no
remote configured and no way to discover one (no `gh` CLI, no saved git config).

**What this session did about it:** ran `git init`, committed the current working
tree as a fresh initial commit on `main`, and stopped there. **This has NOT been
pushed anywhere — there is no remote.** Ask the client for the GitHub URL (or
confirm there genuinely isn't one yet) before anyone assumes this is backed up.
Until then, this machine's `main` is the only copy of today's work.

**THE STORE HAD ZERO PRODUCTS WHEN THIS SESSION STARTED**, not the 20 the old
version of this file claimed. Confirmed two independent ways: `productsCount`
returned 0 via the Admin API, and `/collections/all` on the live storefront
rendered nothing but placeholder cards. Nobody in this session deleted anything —
it was already empty. Read that as a fact to flag to the client, not a mystery to
solve tonight: something happened to the catalogue between 2026-09-13 (when the
old HANDOVER was written, describing 20 products) and now, outside this session.
**The `asset/_backup/deleted-products-2026-09-13.json` backup this file used to
point to is therefore not relevant to recovering anything from that gap** — it
only covers the 106 products deleted in the 2026-09-13 cull, not whatever removed
the remaining 20 afterward.

| | |
|---|---|
| Store | `kbysza-bk.myshopify.com` |
| Live theme | `205197312286` |
| Products now | 17, all **DRAFT** (not published to Online Store — see §2.1) |
| Collections | Pants, Cardigan, Culottes (survived), **Vest (new this session)** |

Two stale scratch themes (`SCRATCH hero-video verify`, and a first failed attempt
from this session) were deleted. No scratch theme should exist right now —
if `shopify theme list` shows one, it's someone's in-progress work, not litter.

---

## 2. What the client still owes, in the order it hurts

### 2.1 Prices for all 17 new products — nothing goes live without this

The client sent a full catalogue replacement (docx + two colour/material lists)
with **no prices anywhere**. This repo's own rule is never to invent commercial
data, so all 17 new products were created as **DRAFT** and were **never published**
to the Online Store channel — they exist in Admin only. The moment the client
sends prices: `productVariantsBulkUpdate` per product, then `publishablePublish`
against `gid://shopify/Publication/377657065758`. Until then the storefront
correctly shows an empty-looking catalogue, which is honest, not broken.

The 17 products, their materials and sizes are all live in Shopify Admin now —
see `CLAUDE.md`'s catalogue section (needs updating — this session's product data
is not written up there yet, only here and in git history).

### 2.2 Lilo Pants' fifth colour — the client flagged this as unfinished

Lilo Pants shipped with 5 colours: Black, Ivory, Grey, Blue, **Choco**. The client
added "Choco" verbally while confirming the docx's colour split and said **"gpp,
placeholder dulu aja, nanti remind me again"** — so treat that fifth colourway as
provisional and ask again before treating it as final.

### 2.3 Swatch colours are unset for every new colourway

The theme paints swatches from Shopify's native Color-swatch system
(`value.swatch.color`, set per option value in Admin), not from a Liquid file.
No hex values were supplied for any of the ~80 new colour names (Milo, Coksu,
Broken white+furing, and so on), so none were guessed — every swatch currently
falls back to the theme's flat `bg-tone` rectangle. Ask for hex codes or reference
photos per colour if accurate swatches matter before launch.

### 2.4 Footer links that don't have a page to point at yet

The client's footer copy (`Company` / `Shop` / `Customer Care`) is live, but four
entries render as label-only plain text because nothing exists to link to:

- **About Wear Label** — `/pages/about` still 404s. Unlike `/pages/custom`
  earlier this project, nobody has given this page any copy yet.
- **Size Guide**, **Shipping & Delivery**, **Returns & Exchanges** — none of
  these are pages on the store.

**Tops** was pointed at `/collections/cardigan` as a best-effort guess (no "Tops"
type exists in the new catalogue) — confirm this is the right destination or
correct it.

### 2.5 The "What We Do" section merges two things the client sent separately

The client pasted a hero-redirected positioning line ("READY-TO-WEAR & CUSTOM
APPAREL / Designed for Everyday, Made for You. / Versatile womenswear...") and a
separate "What We Do" explainer with two panel descriptions, in two different
messages. This session used the eyebrow from the first as the section's eyebrow,
and the "What We Do" heading + explainer body as the section's visible
heading/body — reading them as describing the same one section rather than two
stacked ones, since the client confirmed the positioning line should sit "di
bawah video" (directly under the video) at the same time they approved reusing
`two-ways.liquid` for "What We Do". **This was an editorial merge, not a literal
transcription — show the client the live result and confirm it reads the way they
meant.**

### 2.6 Six products still have no photograph

Miu, Nori, Rui, Darla, Pipo and Soso — six of the seventeen new products have no
photo (the docx's 129 embedded images are all colour swatches, not garment
photography; checked their pixel dimensions to confirm). They draw the theme's
labelled placeholder at final size. The other 11 reuse existing catalogue photos
where the new product's name matches an old one (see §3).

### 2.7 The store's own name is still Shopify's default

`shop.name` is still "My Store" — one field in Settings → Store details, still
unfixed, still the reason the hero's h1 is pinned to a literal "Wear Label"
string instead of inheriting the shop name.

---

## 3. The new catalogue — full replacement, 17 products

The client sent `katalog product wear label.docx` (a colour-swatch reference, not
a priced catalogue) plus two chat messages of materials. All 17 are live in Admin
as DRAFT, vendor `Wear Label`, with `custom.material` set and Colour (+ Size where
applicable, M/L/XL except Cerra BIG SIZE which is XXL only) options generating the
full variant matrix — **302 variants total**.

| Product | Type | Material | Photo reused from |
|---|---|---|---|
| Miu Cardigan | Cardigan | knit | — |
| Nori Cardigan | Cardigan | knit | — |
| Rui Cardigan | Cardigan | knit | — |
| Darla Vest | Vest | Linen | — |
| Basic Linen Culotte | Culottes | linen | `basic-linen-cullote.webp` (old typo'd filename) |
| Pipo Pants | Pants | semiwool | — |
| Casual Culotte Zipper | Culottes | linen | `casual-culotte-zipper.webp` |
| Lilo Pants | Pants | light weight semiwool | `lilo-pants.webp` |
| Cerra Loose Pants | Pants | crepe stretch | `cerra-loose-pants.webp` |
| Cerra Loose Pants BIG SIZE | Pants | crepe stretch | — |
| Dalia Wide Pants | Pants | woven twill | `dalia-wide-pants.webp` |
| Milly Stripe Pants | Pants | semiwool stripe | `milly-stripe-pants.webp` |
| Tara Stripe Pants | Pants | semiwool stripe | — |
| Moa Pants | Pants | semiwool | `moa-pants.webp` |
| Pallo Pants | Pants | semiwool | `pallo-pants.webp` |
| Soso Pants | Pants | light weight semiwool | — |
| Yora Loose Pants | Pants | Torino Premium | `yora-loose-pants.webp` |

**Lilo Pants and Tara Stripe Pants exist because two colour blocks in the docx had
no product-name header** — the docx's text ran a small swatch image immediately
before each colour's name with no separator between entries, and two of those
runs had no heading before them at all. The client confirmed both reconstructions
directly (Lilo's colours had drifted under "Casual Culotte"'s list; Tara's under
"Soso"'s). If the next session ever re-parses this docx, know that the swatch
images are the only reliable delimiter — plain text extraction concatenates every
colour name in a product into one unbroken string.

**A duplicate-write incident happened creating these and was caught and fixed
before anything shipped.** A background fork agent, told explicitly not to touch
the product catalogue, went ahead and created its own full set of 17 products
concurrently with this session's own batched creation — every one of the 17 got
created twice. All 34 were audited by handle (`productByHandle`, since the
`products()` list query was unreliable — see §5), 17 duplicates deleted, and the
6 survivors that had ended up with `ACTIVE` status (from the fork's copies)
patched back to `DRAFT`. Final state was re-verified clean: 17 products, each
appearing exactly once, correct colours/sizes/material on every one. **If you spawn
a background agent near this store again, say explicitly what it must not touch,
and verify afterward — an instruction not to do something is not the same as it
not happening.**

---

## 4. The old deletion backup — still there, no longer the relevant one

```
asset/_backup/deleted-products-2026-09-13.json
```

Still describes the 106 products deleted in the 2026-09-13 cull, if that data is
ever needed. It does **not** describe whatever removed the remaining 20 products
some time after that — nobody knows what happened there (see §1). It lives under
`asset/`, gitignored, **not in a fresh clone**.

---

## 5. Five traps that cost real time here (four carried over, one new)

Each of these rendered fine, passed every check, and was wrong.

1. **A sticky element cannot leave its `div.shopify-section`.** Test a sticky by
   scrolling and reading `getBoundingClientRect().top`, never computed `position`.
2. **Headings do not inherit colour.** `base.css` gives `h1, h2` their own
   colour. On a dark band, colour every heading and every link explicitly.
3. **A class assembled at runtime generates no CSS.** Rebuild and grep the built
   CSS after adding any unusual utility.
4. **`shopify store auth`'s browser-based OAuth cannot complete unattended, but
   often you don't need it.** On this machine `store auth` always re-triggers the
   full interactive flow and hangs waiting for a click nobody can give it — but
   if a token for the store already exists with the scopes you need, `--verbose`
   shows "Loaded stored session... Resolved current remote scopes" confirming it,
   and you can skip straight to `shopify store execute` without re-authing at
   all. Also: a failed/abandoned `store auth` attempt leaves an orphaned `node.exe`
   holding port 13387 that persists across separate tool calls (not just across
   commands in one call) — `Get-NetTCPConnection -LocalPort 13387` finds it,
   `Stop-Process` clears it.
5. **`shopify`'s Windows CLI shim breaks on a UNC working directory.** Running
   from `\\wsl.localhost\...` makes the bundled `cmd.exe` wrapper silently
   default to `C:\Windows`, so `--path theme` resolves to `C:/Windows/theme` and
   fails with a confusing "path doesn't exist". Fix: `subst Z: '\\wsl.localhost\...'`
   once, then run every `npx shopify` / `npm run theme:*` command from `Z:\`.
   Plain file edits (Read/Edit/Write) don't need this — only the CLI does.

**Also new this session:** ~400 Windows `Zone.Identifier` NTFS stub files had
leaked into the working tree, including inside `theme/assets/` — Shopify's push
validator rejects them outright ("contains illegal characters"), which looked
like a real theme error until traced to these. They're deleted and now gitignored
(`*Zone.Identifier`), but if a fresh drop of files ever lands in this repo the
same way, check for them before trusting a push failure's error list.

---

## 6. How to see what you built

**Fetch the rendered page** — the storefront password is `1234`:

```bash
curl -s -c cj.txt -b cj.txt -o /dev/null -X POST \
  https://kbysza-bk.myshopify.com/password \
  --data-urlencode form_type=storefront_password --data-urlencode password=1234
curl -s -b cj.txt https://kbysza-bk.myshopify.com/pages/custom
```

**`?preview_theme_id=` sets a cookie that persists on that jar** — a later
request reusing the same cookie file keeps previewing the scratch theme even
after you think you've moved on to checking live. Use a fresh cookie jar per
theme you're checking.

---

## 7. Things that are decided — do not reopen

- **The site's primary job is credibility, and custom apparel is the half that
  was being under-said.** The home page opens on Ready-to-wear; this was swapped
  and swapped back within the hour once already, on instruction.
- **No invented commerce data, ever** — no price, stock number, review score,
  swatch colour, shipping rate, client count or category that did not come from
  the client. A blank renders a labelled placeholder at final size.
- **The studio's address is Jatibening, Indonesia** — this session's contact-page
  copy resolves the Bandung/Bekasi ambiguity the old version of this file used to
  flag as open. If another mention of Bekasi or Bandung shows up somewhere else
  in the theme, it's stale and should be corrected to match.
- **Reviews are quoted verbatim and stay Indonesian.** Never edit, tidy or
  translate one.

---

## 8. If you are picking this up cold

1. This file.
2. [`CLAUDE.md`](./CLAUDE.md) — the manual. It has not been updated with this
   session's catalogue change yet (still describes the old 20/126-product
   history) — read it for everything except the current product list, which is
   §3 above and the live Admin.
3. [`PRODUCT.md`](./PRODUCT.md) — who this is for and what it claims.
4. `git log` — one commit right now (`git init` happened this session). Ask
   about the remote before assuming history is safe anywhere but this machine.

Then run `npm run theme:check` and `npm run theme:css` before believing anything
renders, and get the client's price list before publishing a single one of the
17 new products.
