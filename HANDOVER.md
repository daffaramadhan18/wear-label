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

### 2.4 ~~Footer links that don't have a page to point at yet~~ — CLOSED 2026-09-27

**Every footer entry now points somewhere, and every destination returns 200.**
All four have been built across two sessions — About on 2026-09-22 (§9b), and
Size Guide, Shipping & Delivery and Returns & Exchanges on 2026-09-27 (§9c).
Verified on the rendered live footer, not on intent.

**Tops** was pointed at `/collections/cardigan` as a best-effort guess at the
time this was written; it is `/collections/tops` now and has been since the
2-collection simplification in §2.1. Nothing outstanding here.

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

### 2.6 EIGHT products still have no photograph — not six

**This said six and it was wrong.** Counted against the live storefront's own
`/products.json` on 2026-09-27: **eight of the seventeen products have zero
images.** Miu, Nori, Rui, Darla, Pipo and Soso were the six already listed;
**Tara Stripe Pants and Cerra Loose Pants BIG SIZE** were missed, and §3's own
table shows both with a dash in the "photo reused from" column, so the table was
right and this paragraph was not.

The other nine reuse existing catalogue photos where the new product's name
matched an old one (see §3). The eight draw the theme's labelled placeholder at
final size. Nine real photographs is the entire product image library on this
store; the whole site has nineteen images including the hero film's stills, the
four B2B cut-outs and two wordmarks.

(The docx's 129 embedded images are all colour swatches, not garment
photography — checked by pixel dimension. There is no shoot waiting to be
processed; there are eight shoots waiting to happen.)

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

## 5. Six traps that cost real time here

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

6. **Liquid's `| default:` filter replaces BLANK, not just missing.** Added
   2026-09-27 after it nearly shipped a wrong size chart. A snippet argument
   that is legitimately allowed to be empty must never be defaulted this way:
   the tops size chart had no rows at the time and that was deliberate, so
   `rows | default: settings...` read that emptiness as "not supplied" and the
   page rendered TROUSER measurements under the headings Length / Chest /
   Shoulder / Sleeve. The page rendered, theme check passed on 90 files, the
   push reported no errors, and the numbers looked plausible. Only reading
   the rendered page found it. Where empty is a meaningful state, branch on
   it explicitly or have the callee pick its own source — see
   `snippets/size-guide.liquid`.

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

## 9c. Session 2026-09-27 — a readiness audit, then five client changes

The session opened as an audit — "ada page yg blm jadi ga?" — and the findings
are in §10 below, because several of them are store configuration nobody has
looked at and two of them stop the shop working entirely. Then five instructions
landed on top of it. All five are pushed to live and verified against the
rendered storefront.

**1. The footer gradient was already there and could not be seen.** The client
asked for it a second time, which was the tell. `from-brand-light to-brand` ran
Rocky `#9c8166` to Camel `#725e4c` — twelve points of lightness between two
browns, which renders as a flat panel. It is `from-brand-light via-brand
to-brand-dark` now, with a new `--color-brand-dark` (taupe-700) in
`app/tokens.css`. **It was widened DOWNWARD on purpose**: cream on the Rocky end
is already at 3.36:1, the lowest ratio the token file accepts anywhere, so a
lighter stop would have taken the footer's own text below it. Every stop added
is darker, so every ratio improved.

**2. Instagram, Shopee and TikTok are live, with their real logos, in three
places.** The URLs the client supplied are schema defaults in
`config/settings_schema.json` under **Social** — theme settings, not footer
settings, because three renderers reading one source is the point.
`snippets/social-links.liquid` renders either a compact row (footer) or a 3-up
card panel (`sections/social-band.liquid`, on home and About).

- **The marks are the owners' official monochrome glyphs, verbatim from
  simple-icons v13**, added to `snippets/icon.liquid` with `fill="currentColor"`
  so they take the palette colour from their parent. The client asked for
  "png transparant... warna sesuai color palette" and got inline SVG instead,
  which is transparent by construction, takes any palette colour with no second
  file, and stays sharp at any size. Say so if they ask why there is no PNG.
- **`social_*_url` are `type: text`, NOT `type: url`, and that is load-bearing.**
  Shopify's `url` setting rejected `https://www.tiktok.com/@wear.label` as an
  invalid default — the `@` does not pass its validator — and the push reported
  it as an error on the whole settings file **while completing anyway**. That is
  exactly the failure CLAUDE.md warns about under "theme push reports errors
  theme check cannot see". Do not change these back to `url`.
- **`instagram-strip` came off the home page** to make room, and that swap is
  the argument for the section existing. The strip was headed "Follow us on
  Instagram", was in fact a marquee of the catalogue's own product photos with
  no link on any of them, and was drawing eight grey placeholders out of eleven
  tiles because eight products have no photograph. It promised a destination and
  went nowhere. It is unplaced, not deleted — one edit to `templates/index.json`
  plus a key in the `home-tabs` block puts it back.

**3. Fabric & care is written, on all seventeen products.** It was a grey
placeholder on every one of them. It is now keyed by the product's own
`custom.material` through a **fabric glossary** in theme settings — eight
paragraphs covering the whole catalogue, because seventeen products share eight
fabrics. `snippets/fabric-care.liquid` owns the lookup and the precedence, which
is the same shape as the size chart's: a product's own `custom.care` metafield
beats the glossary, the glossary beats a labelled placeholder. A new product
inherits its fabric's copy for free; a material spelled a new way matches
nothing and draws the placeholder, which is correct rather than a bug.

⚠ **THE CARE SENTENCES ARE NOT FROM A CARE LABEL.** The descriptions are drawn
from the material names the studio themselves supplied; the care lines are
conservative for the fibre — cold, shade, low iron, dry flat for knits — and
nobody has sent a real care label for any of these. Wrong care copy ruins a
garment. **Ask the studio to read the eight lines before launch.**

**4. The About page has the statement band.** `sections/statement-band.liquid`
runs "WORLDWIDE SHIPPING • FROM INDONESIA TO YOU" as a ticker across a Camel
band, using the `.wl-marquee` CSS the Instagram strip already had, so it cost no
new CSS and no JavaScript. The phrase is rendered once screen-reader-only and
six times `aria-hidden`; six because two halves of one phrase is ~1800px and a
desktop viewport is wider than that, which would park a gap in the band.

⚠ **THE BAND MAKES A CLAIM THE STORE DOES NOT BACK — see §10.1.**

**5. Size Guide, Shipping & Delivery and Returns & Exchanges exist.** Three new
Shopify pages, three templates, two new sections:

| Handle | Template suffix | Page ID |
|---|---|---|
| `size-guide` | `size-guide` | `gid://shopify/Page/743912341790` |
| `shipping-delivery` | `shipping` | `gid://shopify/Page/743912374558` |
| `returns-exchanges` | `returns` | `gid://shopify/Page/743912407326` |

`sections/policy-page.liquid` serves the two policy pages — one section, two
templates, because they are the same shape and would drift apart as two.
`sections/size-guide-page.liquid` renders `size-guide.liquid` twice.

**The policy copy was generated on instruction and is built only out of facts
already on record** — dispatch in 1–2 working days from Kota Bekasi, the free
7-day size exchange, rates calculated at checkout, free over Rp 750.000.
Everything NOT on record — couriers, transit times, refund terms, who pays
return postage — is written as "message the studio" rather than as a term,
because a term nobody has set is an invented commitment. **Two things still want
the studio's sign-off**: the returns "what condition it needs to be in" block is
a real policy term written by us, and the refunds block defers a decision that
should eventually be a decision.

### The bug this session nearly shipped, and how it was caught

`size-guide.liquid` was first given `columns` and `rows` arguments that fell back
to the theme settings with `| default:`. **Liquid's `default` filter replaces a
BLANK value, not just a missing one.** The tops rows are deliberately empty — the
studio has never supplied top measurements — so the tops chart fell back to the
TROUSER rows and rendered `98 / 62-90 / 115 / 60` underneath the headings
`Length / Chest / Shoulder / Sleeve`. A waist presented as a chest, on a live
page, which is precisely the class of content this repo refuses.

**Nothing caught it but looking at the rendered page.** The page rendered, theme
check passed on 90 files with no offences, the push reported no errors, and the
numbers looked entirely plausible. The snippet now takes `chart: 'tops'` and
reads its own settings, so there is no argument that can be blank and no
fallback to be wrong about. **Add this to the traps in §5** — it generalises:
`| default:` on anything that is legitimately allowed to be empty is a silent
wrong answer waiting to happen.

Two other things changed in that snippet and in `assets/theme.js` to let two
charts share a page: a `uid` for the radio group name (two radio groups sharing
a name outside a form are ONE group) and a `data-size-guide` scope for
`initUnitSwitch`, which used to find its table with a document-wide
`querySelector` and would have driven the trouser table from both switches.

---

## 9d. Same day — the tops measurements arrived, and they were not the shape anyone expected

The studio sent figures for three tops, each as a small table of its own, and
suggested averaging them into one row: "skrg kan ada 3 product tops kan, tp tuh
size nya beda2, maybe lo ambil dari average disiniii ya".

| Piece | Panjang Atasan | Lingkar Dada | Panjang Lengan | Size given as |
|---|---|---|---|---|
| Darla Vest | 62 | 110 | — | All Size |
| Rui Cardigan | 59 | 104 | 53 | All Size |
| Nori Cardigan | 57 | 94-100 | 54 | All Size Fit to L |

**THE AVERAGE WAS NOT TAKEN, and this is the entry to read before anyone takes
it later.** Averaged, the row would be Length 59.3 / Chest 103.7 / Sleeve 53.5 —
which is **6.3cm too small at the chest for Darla Vest and 6.7cm too big for
Nori**. On a top that is a whole size, and fit is the decision this catalogue is
actually bought on: PRODUCT.md records it, and nearly every one of the twenty
customer reviews on the site names a height and a weight before it names a size.
One averaged row would have been a number true of none of the three garments,
stated confidently on four product pages.

**The rows are PIECES instead**, which is not a workaround — it is the shape the
data actually has. All three came back "All Size", and the store agrees: none of
the four tops carries a Size option in Shopify at all, only Colour. So there are
no size rows to build. The chart's first column is headed **Piece**, and the
parsing needed no change, because `size-guide.liquid` treats the first cell as a
row header whatever it names.

The Indonesian headings were translated (Panjang Atasan → Length, Lingkar Dada →
Chest, Panjang Lengan Baju → Sleeve) because the site is English. Darla Vest's
sleeve is a dash because a vest has no sleeve — not because a number is missing.

**MIU CARDIGAN HAS NO FIGURES.** The studio said "3 product tops"; there are
**four** — Miu, Nori, Rui and Darla. Miu renders a row of dashes rather than
being left out, so the gap is visible to a shopper instead of looking like Miu
is not a top. **Ask for Miu's three numbers.**

### The bug this turned up: four product pages were showing the wrong chart

Until this change `product-detail.liquid` rendered the one shared chart for
every product, so **the four tops were showing trouser measurements** — Waist,
Hip and Thigh against sizes M, L and XL that those products do not sell. It had
been that way since the chart landed on 2026-09-13 and nothing reported it. The
snippet now picks by `product.type`:

```liquid
assign shared_chart = ''
if product.type == 'Tops'
  assign shared_chart = 'tops'
endif
```

**That literal `'Tops'` is the only coupling in the theme to a `product_type`
value in the Shopify admin.** Rename the type and this falls back silently to
the trouser chart rather than erroring, so the two have to move together. It is
commented as such in the file.

The tops chart also got its own note setting (`size_guide_tops_note`), which
reversed a decision made an hour earlier that the note should be shared. Shared
was right while the note was about how a garment is measured; it stopped being
right once the tops chart needed to say that its pieces are one size and that
Nori fits to L, neither of which is true of a trouser.

**Verified live on all six relevant product pages** plus `/pages/size-guide`:
the four tops render Piece / Length / Chest / Sleeve, the trousers still render
Size / Length / Waist / Hip / Thigh, the two charts on the Size Guide page carry
independent radio groups, and no placeholder remains on that page.

### Collision check, because a second session is working on media and the catalogue

Run before touching anything, at the studio's request. All three came back
clean:

- **Live theme vs local: no drift.** Pulled theme `205197312286` to a scratch
  directory and compared. Every `.liquid`, `.js` and `.css` file identical;
  every `.json` identical once Shopify's auto-generated comment header is
  stripped (that header is why a plain `diff -rq` lights up every template —
  it is not drift, and it will mislead the next person who checks this way).
- **Catalogue unchanged** — still 17 products, 9 images, same prices, same
  variants, same types as earlier the same day.
- **No scratch themes on the store.** Only `Wear Label` (live) and `Horizon`.

**The surfaces do not overlap**: this session touches theme files and theme
settings only, and never products, media or metafields.

⚠ **THE RISK THAT REMAINS IS ONE-WAY AND CANNOT BE FIXED FROM HERE.** If the
other session pushes the theme from a checkout that predates commit `fdfbb56`,
it will overwrite everything from 2026-09-27 without warning — `theme push`
replaces, it does not merge. Anyone pushing the theme from another checkout
must pull or rebase first.

---

## 9e. Same day — the Shopee media harvest, and the catalogue stopped being bare

**The store now carries real photography and real copy on every product.**
Before this: 9 products with one image each, 8 with none, nothing on any
variant, and all 17 descriptions empty. After: **162 media, all `READY`, 10 of
them films, and 317 of 317 variants carry their own colourway photograph.**
All 17 descriptions are the studio's own Shopee copy, verbatim.

**Where it came from, and why it took a whole session.** The studio asked for
their Shopee listings to be pulled back. Shopee is not scrapable from here:
the page is a client-rendered SPA with no `og:` tags and no `ld+json`, the
`/api/v4/*` endpoints answer **HTTP 403** from outside and **`error:
90309999`** from inside the page without a signed anti-bot header, and a fresh
browser is bounced to `/verify/traffic/error`. The route that worked:

1. Chrome on Windows, headed, `--remote-debugging-port` against a **separate**
   `--user-data-dir` (Chrome 136+ refuses the flag on the default profile),
   driven over CDP.
2. The owner logged in **in that window** — password never left their hands —
   through a WhatsApp link challenge and a slide-puzzle captcha, which is not
   something to automate and was not.
3. Everything after that is **DOM only**. Touching the API from the page trips
   the anti-bot and costs another captcha; it happened once and cost one.

Two things that will save the next person a round trip. **Copying the cookie
database does not work** — Chrome 127+ App-Bound Encryption means the copy is
present but undecryptable, so the session reads as logged out. And **the
verification link must be opened in that same Chrome window**: clicking it on
the PC opens the default browser (Edge here), the token is single-use, and the
attempt is burned.

**The masters are on the image CDN and it is wide open.** `down-id.img.
susercontent.com` needs no session at all — only the file ids, which is what
the login was for. Strip the `@resize_w48_nl.webp` suffix and the original
comes back: **185 KB against 916 bytes** on the same file. For video, Shopee
serves 3–9 renditions of one base id and **`.default` is the SMALLEST** (1.10 MB
against 2.06 MB on Yora), so every rendition is HEADed and the largest wins.

Everything landed in **`asset/shopee/<product>/`** — 236 photographs, 11 films,
17 `deskripsi.md`, plus `_source.json`, `_matrix.json`, `_copy.json` and
`_video.json` per product so none of this needs re-scraping. It is **111 MB and
gitignored**, like every other master.

**What changed on the store, in order:**

- `casual-culotte-zipper` gained **5 colourways** it was missing — Grey, Black
  (Lilo), Ivory (Lilo), Grey (Lilo), Blue (Lilo) — taking it from 15 variants to
  **30**. `Choco new` was also renamed `Choco (New)` to match the listing.
  The studio confirmed this product is Shopee's "Casual Culotte Linen"; nothing
  else was matched across that name gap by guesswork.
- **153 files uploaded** through `stagedUploadsCreate` → multipart POST →
  `productCreateMedia`, then `productVariantsBulkUpdate` to set each variant's
  `mediaId`.
- **17 descriptions** written with `productUpdate`, verbatim, paragraphs only.

**One bug worth knowing about, because it will recur.** The first download
deduplicated by CDN file id across a whole product, so a colourway photograph
that *also* appeared in the gallery strip was written under its gallery name
and never under its colour name — 6 colours silently had no file. Nothing was
lost (`_source.json` holds every colour's URL) and a repair pass fixed it, but
**dedupe by id and name by role do not mix.**

**Gallery behaviour is live** — see the commit. The film leads on a product
page, a colourway chosen with `?variant=` wins over it, and `theme.js` pauses
and rewinds the film when the reader switches to a still. Verified on the live
storefront: 25 slots on `yora-loose-pants`, one `<video>`, and with the
espresso variant selected slot 8 is the only one open.

**Still open out of this session:**

- **The repo has NO git remote.** `git remote -v` is empty, so the working
  agreement's `git push origin main` cannot run and the gallery commit is
  local only. Somebody needs to add the remote; guessing the URL was not on.
- **Three products were scraped and deliberately NOT created**, on instruction:
  `basic-pants`, `barrel-pants`, `taka-flare-pants`. Their photography, copy
  and — for `basic-pants` — a film are all sitting in `asset/shopee/`.
- **Gallery shots were skipped on purpose.** Only the main photograph, the
  film and one image per colourway were uploaded. The `gallery-*.jpg` files
  are in the drop folder if that call is ever reversed.
- **`custom.care` is still undefined.** The fabric and measurement detail is
  inside each description now, so it reads correctly on the page, but it is
  prose rather than a metafield.
- **`asset/` lost its camera masters.** Before this session it held only
  `_backup/`, 108 KB; CLAUDE.md still describes 81 MB of camera originals and
  films. The Shopee files do **not** replace them — they are 720x1280
  re-compressions, no use for the 16:9 hero film. Ask for the masters again.
- **The backup filename in CLAUDE.md is wrong** — the file is
  `deleted-products-2026-09-21.json`, not `-2026-09-13.json`.

---

## 9f. Same day — the product page stopped reloading to change colour

Three changes, in the order they were asked for, all live and all verified on
the live storefront.

**The thumbnail rail came off.** On this catalogue it had become a duplicate
control: the shots ARE the colourways, so a rail of 23 near-identical trousers
sat directly above a picker that selected the same thing. The consequence to
know: there is no longer any control reaching a slot the picker cannot select,
so on a product with a film the main photograph is reachable only by choosing a
colourway, the film being what opens.

**Every colourway is fetched on page load.** This needed a third fetch state in
`media.liquid`, not a wider `priority`:

| state | `loading` | `fetchpriority` | for |
|---|---|---|---|
| `priority` | eager | high | the slot actually open |
| `preload` | eager | low | hidden slots — fetched now, queued behind it |
| neither | lazy | auto | everything else, so card grids stay lazy |

`priority` also moved from the FIRST shot to the OPEN one; with a variant
selected those are not the same slot. **The cost is real and deliberate** —
Yora is 23 colourways, so its page pulls roughly 12 MB where it pulled one
image. The `sizes` attribute is identical on hidden and open slots ON PURPOSE:
differ and the browser picks a different srcset candidate, the URL differs, the
cache misses and the preload buys nothing.

**Choosing a colourway no longer reloads the page.** The chips are still links
to `?variant=` — that is what keeps the picker working with script off and the
choice shareable — and `initVariantSwap` in `theme.js` intercepts the click and
applies the change in the document, writing the URL with `replaceState`.

`product-purchase.liquid` emits the variant matrix as a JSON script tag. **The
price in it is formatted by the `money` filter before it reaches the page**, and
that is not incidental: formatting an amount in JavaScript is computing it, and
this repo does not compute money. The gallery slot is matched on media id
(`data-gallery-image`), never on position.

**The fallback is the link.** A combination missing from the matrix, a sold-out
target, a modified click or a missing slot is left alone and the browser
navigates to a server-rendered page. All 317 variants are available and none are
inventory-tracked, so the sold-out path is dormant rather than exercised.

**Two traps this turned up, both worth the next person's time:**

- **`theme.js` is EIGHT separate IIFEs, each with its own `init()`.** A function
  added beside the wrong one is a `ReferenceError` at runtime that `node --check`
  passes cleanly and `eslint` does not flag. It happened here and was caught
  before it shipped.
- **Verify a no-reload claim with a marker, not by watching.** `window.__wlMarker`
  is planted before the click; if it survives, no document was replaced. Nothing
  else proves it — the page looks identical either way. Driven through the CDP
  Chrome already open for the Shopee work; the script is in the scratchpad.

Verified on the LIVE theme, twice: `yora-loose-pants` (69 variants) black →
choco (semiwool), and `cerra-loose-pants` (39) Black → Milo. In both the marker
survived, the URL gained `?variant=`, the frame changed to that colourway's
file, the posted variant id changed and the colour line followed.

**The material line and fit information came off the product page.** Both had
stopped earning their place: the material line above the title was a one-word
label duplicating the fabric paragraph every description now opens with, and
Fit information read `custom.fit`, which was never defined, so it drew a
heading over two grey placeholder bars on every product page.
`custom.material` is untouched and the catalogue card still reads it.

**NO EM OR EN DASHES IN ANY STOREFRONT COPY, by instruction.** 63 replacements
across 30 files plus a re-upload of all 17 product descriptions. A dash is
punctuation doing a job, so each was replaced by whatever does that job:
paired dashes became commas, or brackets where the phrase itself contains
commas; a single trailing dash became a full stop, or a colon where a list
followed; a dash used as a DATA value became a hyphen, because the tops size
chart writes one for "does not apply" and an empty cell is a different
statement; ranges like "1-2 working days" lost their en dash.

**Three sentences needed rewriting rather than repunctuating**, all caught by
reading the output rather than by any check: "custom apparel. Uniforms,
merchandise..." is a fragment and takes a colon; the returns page had a dash
joining a conditional to its imperative, where a full stop leaves the first
half sentenceless and starts a link in lower case; and one social-band line
ended on a fragment. **A conversion bug was caught the same way** and is the
one to remember: a cleanup rule meant to collapse a doubled full stop also
stripped the stop before every closing `</p>`, quietly eating the last
sentence's punctuation on two pages.

The product descriptions are normalised AT UPLOAD, not by editing the scrape:
`asset/shopee/*/_copy.json` stays a faithful record of what Shopee served.
**Keep this rule going.** Verified on the live storefront: product, About,
Returns, Shipping and home all render zero em dashes and zero en dashes.

**Also this session: graphify is gone.** Its `PreToolUse` hooks in
`.claude/settings.json` shelled out to `/home/daffa/.local/bin/graphify`, a WSL
path, while the tooling runs from Windows — so every Bash, Grep, Read and Glob
call printed "No such file or directory" first. Non-blocking, but constant. The
hooks, the `## graphify` section of CLAUDE.md and the `graphify update .` step
of the working agreement are all removed. `graphify-out/` is left on disk,
gitignored.

**And the repo has a remote again.** It is
`https://github.com/daffaramadhan18/wear-label`. The two histories shared **no
common ancestor** — `git merge-base` exited 1 — because this checkout was
`git init`-ed on 2026-09-21 rather than cloned, while GitHub held 59 commits
ending 2026-09-19. Force-pushed onto `main` on the owner's explicit instruction,
with the trade-off stated first. **The old lineage survives only as the local
tag `github-main-2026-09-19` (`cf3b6cc`), which has NOT been pushed** — if this
clone is lost, those 59 commits are lost.

---

## 10. What the audit found, and it is mostly not code

Fetched every route on the live storefront with the password, read the rendered
HTML, and checked the store's own JSON. `theme check`: 90 files, no offences. No
Liquid errors on any page. All 19 image assets return 200. Every route returns
200. **Everything below is content or Shopify configuration.**

### 10.1 The shop cannot take an order — two settings, both in the admin

Verified by adding Lilo Pants to a cart and loading the real checkout:

1. **No payment method is configured.** The checkout renders
   `PaymentMethods:[]`. A shopper reaches the checkout page and has no way to
   pay. Shopify Payments is unavailable in Indonesia (see CLAUDE.md, Platform
   constraints), so this needs a third-party gateway chosen and connected.
2. **The store does not ship to Indonesia.** `/meta.json`'s
   `ships_to_countries` lists 28 countries — AE, AT, AU, CA, CH, CZ, DE, DK, ES,
   FI, FR, GB, HK, IE, IL, IT, JP, KR, MY, NL, NO, NZ, PL, PT, SE, SG, US — and
   **`ID` is not among them.** The checkout offers Singapore as the only
   shipping country. The store's own address is Kota Bekasi and its currency is
   IDR. This is a shipping-zone setting nobody has touched since the store was
   created.

**Two pieces of live copy depend on fixing the second one**: the announcement
bar's "Free shipping on orders over Rp 750.000", and the new About page band's
"WORLDWIDE SHIPPING • FROM INDONESIA TO YOU". Both are the client's own words
and both are currently false for a reader in Indonesia.

### 10.2 The 404 page is empty

`templates/404.json` has `"settings": {}`, so a mistyped URL renders the word
"404" and two grey placeholder bars — no heading, no explanation, no link back
to the shop. It is the worst-looking page on the site and the one nobody
reviews. Writing three lines of copy into the theme editor fixes it.

### 10.3 Product data that reads as unfinished

- **No product has a description.** `body_html` is empty on all seventeen, so
  the Details section renders a placeholder on every product page. Fabric & care
  and Size & fit are now filled (§9c); **Details and Fit information are not**,
  and `custom.fit` is still an undefined metafield.
- **Colour swatches are all flat grey.** No hex is set for any of the ~80 colour
  names (§2.3), so every swatch falls back to `bg-tone`.
- **Some colour names read as internal notes.** Yora carries `choco (semiwool)`,
  `Grey (LW semiwool)`, `caramel (new)`; Soso carries `Black (soso)`,
  `Ivory (Soso)`; Casual Culotte carries `Choco new`. **Milly Stripe Pants
  carries a colour called `Black (Tara)`** — another product's name, which looks
  like a leak from the docx parse described in §3. These are all customer-facing
  on the product page.
- **Cerra Loose Pants BIG SIZE offers XXL only** and the trouser chart has M, L
  and XL — so the one product whose entire premise is a bigger size has no row
  for the size being bought. Still open; ask for XXL. (The tops chart, which
  this bullet used to say was empty, was filled on 2026-09-27 — see §9d.)

### 10.4 Sharing a link shows nothing

There are **no Open Graph or Twitter tags anywhere in the theme** and no meta
description on any page, so a link pasted into WhatsApp — this studio's main
channel — renders as a bare URL with no image and no title. There is no favicon
either. `settings.brand_description` exists and its own `info` text claims it is
"used for the meta description and Open Graph"; `layout/theme.liquid` never
reads it. That is a real gap and it is not in scope of anything done this
session.

### 10.5 Resolved since this file last described them

- **`shop.name` is "Wear Label"**, not "My Store" — §2.7 is closed. The hero's
  h1 is still pinned to a literal string and could now inherit it instead.
- **Every footer link points at a live page** — §2.4 is closed.
- **Fabric & care is written on all 17 products** — §9c.

### 10.6 Still no git remote

`git remote -v` is still empty. Every commit in this repository exists only on
this machine, which §1 and §9 have both flagged and nobody has answered. **Get
the GitHub URL from the client, or confirm there isn't one.**

---

## 11. If you are picking this up cold

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
