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
| Products now | 17, all **ACTIVE and published** (see §2.1 — priced from the client's own live Shopee listing) |
| Collections | **Pants, Tops** — Cardigan/Culottes/Vest all deleted same session, see §2.1 |

Two stale scratch themes (`SCRATCH hero-video verify`, and a first failed attempt
from this session) were deleted. No scratch theme should exist right now —
if `shopify theme list` shows one, it's someone's in-progress work, not litter.

---

## 2. What the client still owes, in the order it hurts

### 2.1 RESOLVED SAME SESSION — prices came from the client's own live Shopee listing

The client pasted their actual live Shopee storefront listing later the same
session, with real current prices for every one of the 17 products. Per their
instruction, the **non-discounted** price was used for the 8 products currently
showing a Shopee -20% badge (159.200 ÷ 0.8 = 199.000), and the plain listed price
for the other 9. All 17 products are now **ACTIVE and published** to the Online
Store — verified live: `/collections/all`, `/collections/pants` and
`/collections/tops` all render real product cards with real prices, and
individual product pages (e.g. `/products/nori-cardigan`) show the correct price.

| Product | Price (Rp) | Product | Price (Rp) |
|---|---|---|---|
| Miu Cardigan | 350.000 | Dalia Wide Pants | 175.000 |
| Nori Cardigan | 350.000 | Milly Stripe Pants | 199.000 |
| Rui Cardigan | 325.000 | Tara Stripe Pants | 199.000 |
| Darla Vest | 199.000 | Moa Pants | 199.000 |
| Basic Linen Culotte | 165.000 | Pallo Pants | 199.000 |
| Pipo Pants | 199.000 | Soso Pants | 199.000 |
| Casual Culotte Zipper | 165.000 | Yora Loose Pants | 165.000 |
| Lilo Pants | 199.000 | Cerra Loose Pants | 159.000 |
| Cerra Loose Pants BIG SIZE | 165.000 | | |

**Categories were also simplified to 2, on instruction** — "keep it simple for
now": every product's `productType` is now either **Tops** (Miu, Nori, Rui,
Darla) or **Pants** (the other 13, including the former Culottes). The
`Cardigan`, `Culottes` and `Vest` automated collections created earlier this
session were all **deleted**; a single new `Tops` collection replaces them,
alongside the surviving `Pants` collection. `snippets/catalogue-filters.liquid`
needed no code change — its category rail iterates live `collections`, so it
picked up the new 2-collection state automatically. The footer's "Tops" link
was repointed from `/collections/cardigan` (deleted) to `/collections/tops`.

**Casual Culotte Zipper vs Casual Culotte Linen — reconfirmed as "Zipper".**
The client's live Shopee listing actually shows "Casual Culotte Linen" as the
current title there, which reopened the question asked earlier — the client
re-confirmed keeping "Zipper" anyway (matching the old store handle), so this is
now settled twice over. `CLAUDE.md` still needs this whole catalogue rewritten
into its own section — it currently describes the pre-2026-09-21 20/126-product
history.

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
a priced catalogue) plus two chat messages of materials, then later their live
Shopee listing for pricing (see §2.1). All 17 are **ACTIVE and published**, vendor
`Wear Label`, `productType` Tops or Pants (see §2.1), with `custom.material` set
and Colour (+ Size where applicable, M/L/XL except Cerra BIG SIZE which is XXL
only) options generating the full variant matrix — **302 variants total**.

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

## 9. Session 2026-09-22 — a copy pass and two content calls, all pushed to live

Three unrelated client instructions, landed and verified live, on top of §1–§8's
state (17-product catalogue, no git remote — still true, see below):

- **Bandung → Bekasi, everywhere, and the free exchange window 14 days → 7
  days.** Every stale "Bandung" mention (footer note default, the theme's
  `brand_description` meta default, the product page's shipping copy, the
  unplaced `service-band` preset) now says Bekasi, matching the Jatibening
  address already on `/pages/contact` (Jatibening is a Bekasi neighbourhood —
  this was already the way §7 of this file leaned). Verified live on
  `/products/basic-linen-culotte`: "Ships from Bekasi within 1–2 working days.
  One free size exchange within 7 days." CLAUDE.md's "Still open" table had
  this as an open question from before this file existed; it's moved to
  "Answered" now.
- **The three `custom-services` cards on `/pages/custom` no longer draw
  placeholders.** They now reuse the same B2B cut-out photography
  `selected-projects` already carries: `project-hospital.webp` → Uniforms,
  `project-corporate.webp` (the Salna shirt) → Custom Apparel,
  `project-merchandise.webp` (the tote) → Merchandise & Special Projects. This
  was the one open item left in CLAUDE.md's "Still open" table under
  "B2B photography" — it's answered now too. `custom-services.liquid` gained
  the same `Shipped asset filename` block field `selected-projects` has, and
  renders through `media-asset` with `fit: 'contain'` because these are alpha
  cut-outs, not 4:5 photographs.
- **The home page's "Ready to Wear" door (in `two-ways.liquid`) is brown, not
  black.** Client: "yg kiri hitam jd coklat". Added a third tone, `brand`
  (`bg-brand`/`text-on-brand` — Camel, `#75604F`), rather than repointing the
  shared `--color-invert` token the footer and voices wall also use, which
  would have turned both of those brown as a side effect. Verified live: the
  panel's class list reads `bg-brand`, not `bg-invert`.
- **The client supplied a colour-palette reference image**, saved to
  `design/color-palette.jpg` (committed — unlike the gitignored `asset/`
  drop folder, this is meant to be a durable pointer) and linked from
  CLAUDE.md's Design sources. Its named colours (Rocky `#A48568`, Camel
  `#75604F`, Light Orange `#DCCCC0`, Light Creme `#F8F0EA`) are near-identical
  to primitives `app/tokens.css` already has — it reads as a naming reference
  for the existing palette, not a request to re-theme. Worth rereading before
  anyone uses it to justify changing a *shared* token rather than one
  section's setting.

**One push during this session silently no-opped on a single file.** The
first `theme push --allow-live` for the custom-services change reported
success with no errors, but a `theme pull` immediately after showed
`templates/page.custom.json` unchanged on the remote — every other file in
that same push (including `sections/custom-services.liquid`) landed
correctly. A second, targeted `theme push --only "templates/page.custom.json"`
fixed it and a re-pull confirmed the content matched. **Read this as "verify
by pulling the specific file back, not just by reading the push JSON's error
map" for a JSON template specifically** — the existing pipeline step ("read
the push output") catches a `max_blocks` rejection but would not have caught
this, since the push reported no error at all.

**Still no git remote — `git push origin main` still fails with "'origin'
does not appear to be a git repository."** All of this session's commits
exist only on this machine's `main`, same as §1 already flagged. Get the
GitHub URL from the client (or confirm there isn't one) before treating this
work as backed up anywhere else.

## 9b. Later the same session — the announcement bar, a plate fix, "Kota Bekasi", and the About page

Four more instructions after §9, same session:

- **The announcement bar ("Free shipping on orders...") was also black.**
  Missed in the first colour pass because it wasn't in any screenshot shown
  at the time. Same fix as `two-ways.liquid`: `bg-brand`/`text-on-brand` in
  place of `bg-invert`/`text-ink-invert`, scoped to this one section.
- **The custom-services photos looked bad with the tone plate behind them**
  ("jelek banget... ga sesuai theme"). Added `plate: false` to their
  `media-asset` call — `selected-projects` uses the same flag, just wrapped
  in its own padded plate div, which this section doesn't have. Verified
  live: the wrapping div's class list no longer includes `bg-tone`.
- **"Bekasi" → "Kota Bekasi", scoped to the product page's shipping line
  only** ("jgn bekasi doang"). The footer note and the `brand_description`
  meta default still say plain "Bekasi" — not touched, because the
  instruction named the shipping copy specifically. Ask before changing
  those too if the same precision is wanted everywhere.
- **The About page was built end to end** — it was the last 404'ing route
  (§1/CLAUDE.md's page-status table both had it as "create it"). New:
  `sections/about-story.liquid` (one section — photograph, heading,
  paragraph, per brief §13's "singkat dan visual") and
  `templates/page.about.json`. The Shopify Page itself is
  `gid://shopify/Page/743676870942`, handle `about`, template suffix
  `about`. Copy sticks to exactly brief §13's four facts (founded 2020,
  Indonesian womenswear label, comfortable/versatile/wearable, custom
  apparel alongside ready-to-wear) plus the brief's own hero example line
  as the heading ("Everyday Pieces, Made for You.") — nothing else, per
  PRODUCT.md's rule against fabricating founder/team/volume facts. The
  photograph reuses `door-shop.webp`, unreferenced since `two-ways.liquid`
  dropped its photography 2026-09-21. The footer's "About Wear Label" link,
  blank since the footer copy landed, is now wired to it.

**Creating this page needed a full re-authentication.** The stored Shopify
CLI token in this environment had `read_products` etc. but not
`read_content`/`write_content` — HANDOVER's earlier claim that "it does now"
(from the 2026-09-13 session, before this environment's git/auth state was
rebuilt from scratch per §1) no longer held. Re-ran `shopify store auth`
with the full scope list from CLAUDE.md's table plus `read_content,write_content`;
the interactive-browser problem CLAUDE.md documents is still exactly as
described (PowerShell fallback invoked with an en dash, hangs forever with
no URL printed) and the hook-and-decode workaround in CLAUDE.md's item 3
still works verbatim. New token confirmed working via
`pages(first: 5) { nodes { handle } }` before creating anything.
`pageCreate` needed **`--variable-file`, not `--variables`**, to pass a JSON
file on this shell without quoting corruption — `--variables` with an inline
`Get-Content -Raw` value silently ate the `--allow-mutations` flag that
followed it.

**About Us was revised again the same session, before anyone else even saw
it.** The photo and single paragraph above were reversed within the hour:
"foto nya gausah di page about" (no photo) and "copywriting nya masih
kurang bgt, pls generate more" (write more). `about-story.liquid` is now
text-only — the `image`/`asset` field and the two-column layout were
removed, not hidden behind a setting — with three paragraphs instead of
one. The extra two paragraphs are brief §14's own design-direction words
(modern, feminine, minimal, timeless) applied to the ready-to-wear line and
PRODUCT.md's documented studio responsiveness ("admin ramah", "responsif")
applied to the custom-apparel close — no new fact was invented, only more
said about facts already on record. `door-shop.webp` is unreferenced again.

**The footer got a gradient background from the client's colour palette**,
same session: "warna gradasi sesuai color palette... dari kanan ke kiri".
`bg-linear-to-l from-brand-light to-brand` (Rocky at the right, Camel at
the left — `design/color-palette.jpg`) replaced `bg-invert`. New token:
`--color-brand-light` (taupe-500) in `app/tokens.css`, paired with the
existing `--color-brand`. Two things had to change to keep it readable:
the aurora came off (its `invert` veil is hardcoded to espresso and would
have drawn a visible rectangle over the new gradient — see `aurora.liquid`'s
own warning about this exact bug), and the footer's base/link text moved
from `text-ink-invert-muted` (calibrated for espresso, drops to 2.4:1 on
this lighter ground) to full cream (3.36–5.63:1, the low end matching a
ratio `tokens.css` already accepts elsewhere). **Tailwind v4 renamed
`bg-gradient-to-*` to `bg-linear-to-*`** — confirmed by grepping the built
CSS, not assumed; worth knowing before writing another gradient anywhere else.

**Docs reconciled the same session**, not left for next time: CLAUDE.md's
page-status table, theme port table, routes table, and Still-open/Answered
lists; PRODUCT.md's Brand Commitments and Operating Context. Both had
several claims (About Us unwritten, Bandung/Bekasi open, brand voice
unsettled) that this session's own work made false, so they were fixed
alongside the code rather than left for the next session to notice were wrong.

---

## 10. If you are picking this up cold

1. This file.
2. [`CLAUDE.md`](./CLAUDE.md) — the manual. It has not been updated with this
   session's catalogue change yet (still describes the old 20/126-product
   history) — read it for everything except the current product list, which is
   §3 above and the live Admin. Everything else in it (routes, page status,
   Still-open/Answered) is current as of §9b above.
3. [`PRODUCT.md`](./PRODUCT.md) — who this is for and what it claims. Current
   as of §9b.
4. `git log` — several commits right now (`git init` happened 2026-09-21). Ask
   about the remote before assuming history is safe anywhere but this machine
   — there still isn't one configured.

Then run `npm run theme:check` and `npm run theme:css` before believing anything
renders, and get the client's price list before publishing a single one of the
17 new products.
