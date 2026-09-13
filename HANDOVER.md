# HANDOVER

**Read this before you touch anything. It is the state of play, not the manual —
[`CLAUDE.md`](./CLAUDE.md) is still the manual and nothing here replaces it.**

Written 2026-09-13 at the end of a nine-commit session (`2ad1115` → `d1ed524`).
Everything below is verified against the rendered storefront, not against
intent. Where something is unverified it says so.

---

## 1. Where this actually is

**The theme is LIVE and the storefront is behind the password `1234`.** Nothing
is publicly reachable. Taking the password off is the launch decision now — not
publishing, which already happened.

Everything from this session is on the live theme `205197312286` and in
`origin/main`. Nothing of mine is sitting in a branch or a working tree.

**A PARALLEL SESSION SHARES THIS REPO AND ITS FILES ARE NOT YOURS.** The branch
`worktree-integrate-floating-paths` is theirs, and `theme/` carries their
untracked `sections/scroll-sequence.liquid`, `assets/scroll-sequence.js`,
`assets/gsap.min.js`, `assets/gsap-scrolltrigger.min.js` and 55
`assets/sequence-*.webp`. Do not commit them, do not delete them, and do not
"fix" the eslint errors in the two GSAP files — **a clean eslint run here is
"10 errors, all in GSAP", not zero.** Nothing on any committed template
references them.

| | |
|---|---|
| Store | `kbysza-bk.myshopify.com` |
| Live theme | `205197312286` |
| Products | 20, all ACTIVE, all in stock |
| Variants | 394 |
| Product media | 43, all READY |
| Collections | 3 — Pants 14, Cardigan 4, Culottes 2 |

**There is a scratch theme, `205940490526` ("SCRATCH hero-video verify"), and it
should probably be deleted.** It was used to verify every change this session.
`npx shopify theme delete --store kbysza-bk.myshopify.com --theme 205940490526 --force`.

---

## 2. What the client owes, in the order it hurts

This is the real content of this handover. Everything else is done.

### 2.1 Four size rows are missing and the gap is invisible

The size chart is live with **M, L and XL**. Every trouser offers **XS, S, M, L,
XL, XXL, 3XL**. So four of the seven sizes a shopper can add to a bag have no
measurements, and nothing on the page says so — the table simply has three rows.

**Ask for XS, S, XXL and 3XL.** Theme settings → Size guide → Rows, one size per
line, pipe separated, **centimetres only** (the inch column is computed).

### 2.2 Three client names

`selected-projects` on the home page's Custom & business view has four projects.
Only **Salna** is named. The hospital programme, the institutional shirt and the
tote render the labelled `CLIENT` placeholder.

The studio authorised naming clients. The names are embroidered into the
photographs at a few pixels tall and could not be read with certainty. **Do not
read a name off a blurry crop and publish it.** Typing them in is a theme-editor
edit on `templates/index.json`.

### 2.3 The store is still called `My Store`

`shop.name` is Shopify's default. It is in the browser tab, in order emails, and
in anything else `shop.name` feeds. **Settings → Store details**, one field.

The hero's screen-reader h1 is pinned to the literal "Wear Label" in
`templates/index.json` precisely so the page's one heading did not inherit it.
Remove that pin once the field is right.

### 2.4 Every product weighs 0 kg

Not a theme problem, and the first thing that will break when the store opens.
Indonesian couriers quote from weight. With every product at 0 kg, either the
rate is wrong or checkout refuses.

### 2.5 Two HEIC files cannot be opened

`asset/Pallo/IMG_0223.heic` and `IMG_2051.heic`. The static ffmpeg build
available here answers "Invalid data found when processing input". They are the
only two files in the drop folder still unused. **Ask for JPEGs.**

### 2.6 Six products have no photograph

The four cardigans, `barrel-pants` and `tara-stripe-pants`. None of them has a
folder in `asset/` either, so this is six shoots waiting to happen, not a job
left undone.

### 2.7 Open questions raised and not yet answered

- **Darla Vest is on Shopee and not on the store.** It was sold out at import and
  went with the cull; it is in the backup (§4). Recreating it is one mutation.
- **`Casual Culotte Zipper` (web) vs `Casual Culotte Linen` (Shopee)** — same
  price, possibly the same piece under a different Shopee title. Not assumed.
- **`Aiko Cardigan` is on the store and not on Shopee.** Delisted, or hidden?
- **Six products are 12% cheaper on Shopee than on the web right now** —
  Rp 175.120 against Rp 199.000 on Lilo, Milly, Moa, Pallo, Pipo and Soso. A
  shopper who compares finds the web store more expensive. **Miu Cardigan goes
  the other way**: Rp 325.000 on the web against Rp 350.000 on Shopee. This is a
  pricing decision and was left alone.

---

## 3. What changed this session

Nine commits, and the commit messages carry the reasoning — read them before
re-deciding anything. In order:

| Commit | What |
|---|---|
| `2ad1115` | Hero carousel → one looping film. No copy, no CTA |
| `7efd743` | Two-panel B2B/B2C split; page tinted off white (`--color-ground`) |
| `fdf1661` | Split replaced by a two-view switch; WhatsApp number in |
| `b2ffc67` | `/pages/custom` created; the WSL browser-auth recipe written down |
| `2881bd0` | 106 sold-out products deleted; product tabs → one page; sizes to 3XL |
| `82252ed` | B2B photography cut to transparency; 32 product photos uploaded |
| `1bfb94f` | Home opened on Custom & business; B2B hero h1 made readable |
| `8e6a567` | Header made to actually stick; views swapped back |
| `d1ed524` | Size chart filled; phone fixes; category rail; quote → WhatsApp |

**Four things were built, seen and reverted or replaced in the same day.** They
are kept in the repo, unplaced, with the argument at the top of each file:
`two-ways` (the two-panel split), `hero-carousel`, `service-band`,
`category-mosaic`. Re-placing any of them is one edit to a template.

**`category-mosaic`'s blocker expired.** It was unplaced because twelve of
fifteen collections were sold out end to end. After the cull all three remaining
collections are full. What is left is a taste question — whether three tiles is a
section or an embarrassment — and nobody has answered it.

---

## 4. The deletion backup — do not lose this

```
asset/_backup/deleted-products-2026-09-13.json
```

106 products were **permanently deleted** on instruction, with the trade-off
stated first (archiving would have looked identical to a shopper and stayed
reversible). Shopify has no undo. That file holds every deleted product's title,
handle, productType, vendor, tags and variant price, plus the names of the twelve
collections deleted with them.

It lives under `asset/`, which is **gitignored** — so it is on this machine and
**not in a fresh clone**. If it is gone, the data is gone.

---

## 5. Five traps that cost real time here

Each of these rendered fine, passed every check, and was wrong. They are all
written up properly in CLAUDE.md; this is the index.

1. **A sticky element cannot leave its `div.shopify-section`.** The header was
   `sticky top-0` for weeks and never stuck — computed style said
   `position: sticky` the whole time. **Test a sticky by scrolling and reading
   `getBoundingClientRect().top`, never by reading computed `position`.**
2. **Headings do not inherit colour.** `base.css` gives `h1, h2` their own
   `color: var(--color-ink)`, which beats a section's `text-ink-invert`. The B2B
   page's h1 was drawing espresso on espresso — contrast about 1:1 — and the
   aurora behind it left just enough ghost that it looked deliberate. **On a dark
   band, colour every heading and every link explicitly.**
3. **A class assembled at runtime generates no CSS.** `aria-[current]:bg-brand`
   is not a variant Tailwind knows; the chips rendered unstyled. Write utilities
   longhand in a Liquid `if`. **Rebuild and grep the built CSS after adding any
   unusual utility.**
4. **`shopify store auth` cannot open a browser here and does not say so.** It
   prints one line and hangs forever — no `xdg-open` under WSL, and the
   PowerShell fallback is invoked with an EN DASH instead of a hyphen. The
   hook-and-decode workaround is in CLAUDE.md §3. Also: `shopify store execute`
   refuses every mutation without `--allow-mutations`.
5. **`?preview_theme_id=` sets a cookie.** Every later request on that jar keeps
   previewing the scratch theme. A "live" check made this way is not a live
   check — it was reported wrong once. **Use a fresh cookie jar for live.**

---

## 6. How to see what you built

There is no excuse for shipping blind here. Both of these work.

**Fetch the rendered page** — the storefront password is `1234`:

```bash
curl -s -c cj.txt -b cj.txt -o /dev/null -X POST \
  https://kbysza-bk.myshopify.com/password \
  --data-urlencode form_type=storefront_password --data-urlencode password=1234
curl -s -b cj.txt https://kbysza-bk.myshopify.com/pages/custom
```

**Drive a real browser.** Chromium is bundled with Playwright and needs five
libraries that are absent system-wide; unpacking them needs no root:

```bash
cd <scratchpad>/libs
apt-get download libnspr4 libnss3 libasound2t64
for d in *.deb; do dpkg -x "$d" root/; done
export LD_LIBRARY_PATH="$PWD/root/usr/lib/x86_64-linux-gnu"
npm i playwright-core          # in the scratchpad, never in the repo
# then chromium.launch({ executablePath: ~/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome })
```

The Playwright **MCP** server fails here (it wants Chrome at
`/opt/google/chrome/chrome`). Drive it yourself.

**There is no ffmpeg and no root.** A static build unpacks without privileges:
`curl -sL -o ffmpeg https://github.com/eugeneware/ffmpeg-static/releases/download/b6.0/ffmpeg-linux-x64`.
It cannot decode HEIC. numpy is available; PIL is not.

---

## 7. Things that are decided — do not reopen

- **The site's primary job is credibility, and custom apparel is the half that
  was being under-said.** The till is still being built and is still a launch
  blocker, but that is the ordering.
- **The home page opens on Ready-to-wear.** It was swapped to Custom & business
  and swapped back within the hour, both on instruction. Both moves are on the
  record so the positioning note above is not read as intent.
- **106 products were deleted rather than archived**, knowingly.
- **No invented commerce data, ever** — no price, stock number, review score,
  shipping rate, client count or category that did not come from the client. A
  blank renders a labelled placeholder at final size; that is a feature.
- **Reviews are quoted verbatim and stay Indonesian.** Never edit, tidy or
  translate one. The phone shows ten of the twenty because of how a seamless
  marquee works, not because any were dropped.

---

## 8. If you are picking this up cold

Read in this order:

1. This file.
2. [`CLAUDE.md`](./CLAUDE.md) — the manual. Long, and every paragraph in it was
   paid for.
3. [`PRODUCT.md`](./PRODUCT.md) — who this is for and what it claims.
4. [`theme/README.md`](./theme/README.md) — port status and deviations.
5. `git log` — the reasoning lives in the commit messages, not only in the code.

Then run `npm run theme:check` and `npm run theme:css` before believing anything
renders, and **land your work the same turn you do it**: verify, commit onto
`main`, push. The working agreement in CLAUDE.md is not optional.
