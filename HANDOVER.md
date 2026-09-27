# HANDOVER

**Read this first, before CLAUDE.md and before any code.** CLAUDE.md is the
manual. This is the state of play: what is live right now, what is blocked, and
what the client still owes.

Rewritten fresh on 2026-09-28. Everything before that date is in `git log`,
which is where a changelog belongs. This file is not one.

**Keep it current.** A session that changes what is live, what is blocked or
what the client owes, and leaves this file describing yesterday, has not
finished.

---

## 1. Where this is

**The theme is LIVE on a password-protected storefront, and the catalogue is
complete.** The last real gap, a store full of products with no photographs and
no copy, closed on 2026-09-27.

| | |
|---|---|
| Store | `kbysza-bk.myshopify.com`, named **Wear Label** |
| Theme | `205197312286`, role **live** |
| Storefront password | `1234` (recorded by the owner's explicit instruction) |
| Repo remote | `https://github.com/daffaramadhan18/wear-label` |

**The catalogue, verified against the store on 2026-09-28:**

| | |
|---|---|
| Products | **17**, all `ACTIVE`, all published, all in stock |
| Variants | **317**, none inventory-tracked, none unavailable |
| Media | **162**, all `READY`, **10 of them films** |
| Variants carrying their own photograph | **317 of 317** |
| Descriptions | **17 of 17**, the studio's own Shopee copy |
| Collections | `pants` (13), `tops` (4) |
| Product metafields defined | `custom.material`, `custom.size_chart`, `custom.size_note` |
| Pages | `about`, `contact`, `custom`, `size-guide`, `shipping-delivery`, `returns-exchanges` |

All of that came from the studio's own Shopee listings.
**[`SHOPEE-IMPORT.md`](./SHOPEE-IMPORT.md) is how, and the scripts are in
[`tools/shopee/`](./tools/shopee/).** Read it before trying to repeat it:
Shopee cannot be scraped the obvious way and every obvious way fails
differently.

---

## 2. What the client still owes, in the order it hurts

1. **A payment gateway.** Shopify Payments does not exist in Indonesia, so a
   third party is required and none is configured. **The store cannot take
   money.** This is the launch blocker.
2. **A courier app** (RajaOngkir or Biteship). Rates are quoted during checkout
   and the bag says "Calculated at checkout" because nothing here can know them.
3. **Contact details.** Email, studio address and opening hours are blocks on
   `templates/page.contact.json` with blank values, by instruction, so each
   renders a labelled placeholder at final size. An address is the one string a
   reader acts on.
4. **Per-product Shopee URLs.** `custom.shopee_url` is undefined and
   `settings.shopee_shop_url` is blank, so "Buy on Shopee" does not render at
   all. Decision already taken: per-product URLs with the shop URL as fallback.
5. **Trouser measurements for XS, S, XXL and 3XL.** The shared chart has M, L
   and XL. Every trouser sells seven sizes. **The gap is invisible**: the table
   simply has three rows. The tops do not have this problem any more; they carry
   their own charts.
6. **Three cardigans' worth of nothing.** Actually nothing is missing here any
   more. Kept as a line only to say so explicitly: every product has media.

---

## 3. What is live and worth knowing before you touch it

### The product page

- **No Details section.** It opened on the description, which since the Shopee
  import is the whole listing (fabric, sizes, care) and duplicated Fabric & care
  below it. The page starts on Size & fit.
- **No material line and no fit block.** Both removed 2026-09-28. `custom.fit`
  was never defined and drew placeholder bars on every page.
- **The gallery has no thumbnail rail.** The shots *are* the colourways, so a
  rail of 23 near-identical trousers duplicated the picker below it.
  **Consequence:** nothing now reaches a slot the picker cannot select, so on a
  product with a film the main photograph is only reachable by choosing a
  colourway.
- **The film leads, a chosen colourway wins.** Opening a product plays the film;
  `?variant=` shows that colourway instead.
- **Every colourway is fetched on page load** (`preload`: eager at low priority)
  so switching is instant. **Yora pulls roughly 12 MB.** Deliberate trade.
- **Switching a colourway does not reload the page.** The chips are still links,
  intercepted by `initVariantSwap` in `theme.js`, with the URL written by
  `replaceState`. The link is the fallback for anything the matrix cannot answer.

### Size charts

- **Trousers share one chart** from theme settings. Thirteen products, one size
  system.
- **Each top carries its own**, in `custom.size_chart`, first line headings and
  every line after it a row, pipe separated. `custom.size_note` is the line
  under it.
- **Rui Cardigan is a two-piece set.** Its sweater and cardigan measure
  differently, which is why a shared tops table could never have been right.
- `/pages/size-guide` is **trousers and culottes only**.
- A top with no chart draws the **placeholder**, never the trouser chart. A
  wrong table is worse than a missing one.

### Copy

- **No em dashes and no en dashes anywhere in copy.** House style, instruction
  2026-09-28. Replace by the punctuation doing the job: commas or brackets for a
  parenthetical, a full stop or colon for a trailing clause, a hyphen for a
  range or a data cell. Code comments are not copy and were left alone.
- **The portfolio names no clients.** The setting is gone and so is the one
  filled entry. The category is each card's heading now.
- Descriptions are normalised **at upload**, not in `asset/shopee/*/_copy.json`,
  which stays a faithful record of what Shopee served.

### Tooling

- **graphify is removed.** Its `PreToolUse` hooks pointed at a WSL path while the
  tooling runs from Windows, so every Bash, Grep, Read and Glob call printed
  "No such file or directory" first. Ignore any instruction, global config
  included, that asks for it.

---

## 4. Traps that have each cost real time

1. **`theme.js` is EIGHT separate IIFEs, each with its own `init()`.** A function
   added beside the wrong one is a `ReferenceError` at runtime that
   `node --check` passes and `eslint` does not flag.
2. **A sticky element cannot leave its `.shopify-section` wrapper.** Declare it
   on the wrapper with `:has()`. Test by scrolling and reading
   `getBoundingClientRect().top`, never by reading the computed `position`.
3. **`theme check` does not check a schema's own limits.** `max_blocks` is
   enforced by the store at push time, which **completes** while silently
   dropping the extra blocks. Read the `--json` push output.
4. **A class name assembled at runtime does not exist.** Tailwind scans the
   Liquid and JS as text. Write every utility longhand, then grep the built CSS.
5. **`render` takes no filters and no expressions.** A filter is caught by theme
   check; an expression is a parse error caught by nothing.
6. **Inside `{% liquid %}` a comment is `#`, and a stray `%}` closes the tag.**
7. **Prove a no-reload claim with a marker**, not by watching. Plant something on
   `window` before the click; if it survives, no document was replaced. The page
   looks identical either way.
8. **The Shopify CLI refuses a UNC path on Windows.** A WSL checkout is one.
   `net use W: \\wsl.localhost\Ubuntu` first.

---

## 5. How to see what you built

```bash
# authenticate against the password-protected storefront
curl -s -c cj.txt -b cj.txt -o /dev/null -X POST \
  https://kbysza-bk.myshopify.com/password \
  --data-urlencode form_type=storefront_password \
  --data-urlencode password=1234

# then reuse the jar
curl -s -b cj.txt https://kbysza-bk.myshopify.com/products/yora-loose-pants
```

For a preview theme, set the cookie first by fetching
`/?preview_theme_id=<id>` with `-L` and the same jar.

**Verify against what the store rendered, never against intent.** That step has
caught a real bug in every session that ran it.

---

## 6. Decided, do not reopen

- **Bekasi, not Bandung.** Every mention corrected 2026-09-22.
- **No made-to-order.** The studio does not offer it. B2B custom apparel is a
  different service and does not reopen it.
- **No invented commerce data.** No fabricated rates, review counts, stock
  numbers, countdowns or discount depths, not even as placeholder polish.
- **The site is a till as well as a credibility surface**, but legitimacy is the
  primary job and custom apparel is the half that was being under-said.
- **Real quotations are allowed where a score is not.** The voices wall carries
  twenty real Shopee reviews verbatim. Never edit, tidy or translate one.
- **The storefront password is written down here**, by the owner's explicit
  instruction after being told the repo is public. Do not re-litigate it and do
  not quietly remove it.

---

## 7. The git situation, which is not normal

The GitHub remote was added on 2026-09-27 and the two histories **shared no
common ancestor**: `git merge-base` exited 1. This checkout was `git init`-ed on
2026-09-21 rather than cloned, while GitHub held 59 commits ending 2026-09-19.

`main` was **force-pushed** on the owner's explicit instruction, with the
trade-off stated first. The old lineage survives **only as the local tag
`github-main-2026-09-19` (`cf3b6cc`), which has not been pushed.** If this clone
is lost, those 59 commits are lost. Pushing that tag is one command and nobody
has asked for it yet.

---

## 8. If you are picking this up cold

1. Read this file, then `CLAUDE.md` for the parts of the manual you need today.
2. `SHOPEE-IMPORT.md` if anything touches the catalogue's photographs, films,
   descriptions or variants.
3. `BRIEF.pdf` is the client's own brief and the authority on scope.
4. `PRODUCT.md` is who this is for and what it claims.
5. **`asset/` is gitignored and not in a fresh clone.** It holds 111 MB of Shopee
   masters under `asset/shopee/`. The camera originals that used to sit beside
   them are **gone from this machine**; the Shopee files are compressed
   derivatives and are no use for re-deriving the 16:9 hero film. Ask the studio
   for the masters again if anything needs them.
