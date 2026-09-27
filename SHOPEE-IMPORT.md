# Importing from Shopee

How the studio's own Shopee listings were pulled back and put on the Shopify
store: 236 photographs, 11 films, 17 descriptions and the full option matrix,
on 2026-09-27.

**Read this before trying it again.** Shopee cannot be scraped the obvious way.
Every obvious way was tried first and each one fails differently, so most of
this file is about what does not work and why, which is the part that costs a
whole afternoon to rediscover.

The scripts are in [`tools/shopee/`](./tools/shopee/). They are plain Node with
no dependencies; Node 22 or newer, because they use the global `fetch` and
`WebSocket`.

---

## 1. What does not work, and how each one fails

| Attempt | What happens |
|---|---|
| `WebFetch` on a product URL | Comes back empty. The page is a client-rendered SPA |
| `curl` on a product URL | HTTP 200 and ~158 KB of shell. **No `og:` meta, no `ld+json`**, no product data in the markup at all |
| `curl` on `/api/v4/pdp/get_pc` | **HTTP 403** |
| Headless Chrome, `--dump-dom` | Renders the chrome of the page and nothing else. Detected |
| Headless Chrome with a spoofed user agent | Gets further, then lands on **"Masuk Diperlukan"**: a login wall |
| Copying Chrome's cookie database into a fresh profile | Cookies copy, and are **undecryptable**. See below |
| `fetch('/api/v4/...')` from inside a logged-in page | HTTP 200 with `{"error": 90309999}`, their anti-bot signature error, **and it bounces the tab to `/verify/traffic/error`**, which costs a captcha to undo |

Two of those deserve spelling out because nothing tells you:

**Chrome 127+ App-Bound Encryption.** Copying `User Data/Default/Network/Cookies`
and `Local State` into another `--user-data-dir` gives you a cookie database the
browser cannot decrypt. The session reads as logged out, with no error. While
Chrome is running the file is locked anyway (`Device or resource busy`), so the
copy fails outright.

**Chrome 136+ refuses `--remote-debugging-port` on the default profile.** The
port simply never opens. Automation needs its own `--user-data-dir`, which means
it starts logged out, which means somebody has to log in.

---

## 2. What does work

A **real, headed Chrome on its own profile**, driven over the DevTools protocol,
with the owner logging in by hand once.

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" \
  --remote-debugging-port=9222 \
  --user-data-dir="C:\\Users\\<you>\\AppData\\Local\\Temp\\chrome-cdp" \
  --no-first-run --no-default-browser-check --window-size=1400,1000 \
  "https://shopee.co.id/buyer/login"
```

Then **the owner logs in in that window.** Not the script. Shopee sends a
verification link over WhatsApp and then shows a slide-to-complete puzzle
captcha, and neither is something to automate: the captcha is an anti-bot
control, and the password is the owner's to type.

**The verification link must be opened in that same Chrome window.** Clicking it
on the PC opens the default browser (Edge, here), the token is single use, and
the attempt is burned. Copy the link and paste it into the automated window's
address bar, or tap it on the phone and leave the window alone.

**Do not navigate the tab while it is waiting on verification.** Doing that kills
the pending flow; it looks like the link failed.

Once past it, everything else is **DOM only**. Never call `/api/v4/*` from the
page: it trips the anti-bot and costs another captcha. Every script here reads
the rendered DOM instead.

---

## 3. The image and video CDN is wide open

This is the part that makes the whole thing worth doing. `down-id.img.susercontent.com`
needs **no session at all**. The login exists only to learn the file ids.

**Strip the size suffix for the original.** A thumbnail id ends `@resize_w48_nl.webp`;
remove everything from the `@` and the CDN serves the full-resolution original.

```
.../file/id-11134201-81ztj-mt8avjp7x7npd3@resize_w48_nl.webp   916 B   webp
.../file/id-11134201-81ztj-mt8avjp7x7npd3                    185 KB   jpeg
```

**Video lives on a different host** and is not on the image CDN at all:
`down-tx-id.vod.susercontent.com` / `mms.vod.susercontent.com`. Each clip is
served as 3 to 9 renditions sharing one base id and differing by a numeric
suffix, plus a `.default`.

⚠ **`.default` is the SMALLEST, not the largest.** On Yora it is 1.10 MB against
2.06 MB for the best rendition. `vbatch.mjs` therefore HEADs every rendition and
keeps the biggest. Picking `.default` because it sounds canonical gives you the
worst copy.

---

## 4. The pipeline

Run in this order. Every script talks to the Chrome on port 9222 and writes into
`asset/shopee/<product>/`, which is gitignored.

| Step | Script | What it does |
|---|---|---|
| 1 | `links.mjs <shopId> <pages>` | Walks the shop listing, collects every product URL. Writes `links.json` |
| 2 | `batch.mjs <links.json> <out> [n]` | Per product: main image, gallery strip, one photograph per colourway. Writes `_source.json` |
| 3 | `fixvariants.mjs <out>` | Repair pass. **Run it.** See the bug below |
| 4 | `vbatch.mjs <links.json> <out> [n]` | Product films, best rendition. Writes `_video.json` |
| 5 | `dbatch.mjs <links.json> <out> [n]` | Description and specification block. Writes `_copy.json` and `deskripsi.md` |
| 6 | `matrix.mjs <links.json> <out> [n]` | Option axes and every option value. Writes `_matrix.json` |

Then, against Shopify:

| Step | Script | What it does |
|---|---|---|
| 7 | `plan.mjs <scratch> <asset>` | Matches colour names to files, reports anything unmatched, writes `plan.json`. **Read its output before step 8** |
| 8 | `upload.mjs <scratch> <asset> stage` | `stagedUploadsCreate` plus the multipart POST |
| 9 | `upload.mjs <scratch> <asset> attach` | `productCreateMedia`, product by product |
| 10 | `upload.mjs <scratch> <asset> link` | `productVariantsBulkUpdate`, setting each variant's `mediaId` |
| 11 | `desc.mjs <scratch> <asset>` | Writes the descriptions with `productUpdate` |

Steps 8 to 10 are checkpointed to `staged.json` and `attached.json`, so a
failure resumes instead of re-uploading.

Diagnostics, when something is not where you expect it: `cdp.mjs <url> <waitMs>`
prints a page's title, first text and CDN image list; `inspect.mjs` adds the
geometry and a short DOM path for every image, which is how the gallery strip
was told apart from the recommendation rails; `probe.mjs <path>` fetches a
same-origin API path and describes the shape that comes back, which is how the
`90309999` wall was identified. `mp4info.mjs <file...>` reads an MP4's duration
and pixel size without ffmpeg.

### Environment

`upload.mjs` and `desc.mjs` shell out to the Shopify CLI, which resolves itself
from the repo's `node_modules` and therefore needs the repo as its cwd. **On
Windows the CLI refuses a UNC path**, which is what a WSL checkout is, so map it
to a drive letter first:

```bash
net use W: \\wsl.localhost\Ubuntu
```

Both scripts read `WL_REPO` and `WL_STORE` from the environment; the defaults
are this project's.

Shopify mutations need `--allow-mutations` on `shopify store execute` or every
one is refused with "Mutations are disabled by default".

---

## 5. The bug that will happen again

The first download **deduplicated by CDN file id across the whole product**. A
colourway photograph that also appeared in the gallery strip was written once
under its gallery name and never under its colour name, so six colours silently
had no file. Nothing errored. It surfaced only because `plan.mjs` matches colour
names to filenames and reported the misses.

Nothing was lost, because `_source.json` holds every colour's URL, and
`fixvariants.mjs` re-fetches whatever is missing. **Dedupe by id and name by role
do not mix.** Always run step 3, and always read step 7's output.

---

## 6. What the data looks like

Per product, in `asset/shopee/<product>/`:

```
main-01.jpg              the listing's main photograph
gallery-01..NN.jpg       the strip under it
warna-<colour>.jpg       one per colourway, named from the swatch label
video.mp4                the film, best rendition, where there is one
_source.json             every image URL, per colour
_video.json              the rendition chosen and the ones rejected
_matrix.json             option axes and values
_copy.json               description and specification, verbatim
deskripsi.md             the same, readable
```

**`asset/` is gitignored and is not in a fresh clone**, on purpose: it is 111 MB
and none of it is what the store serves. Re-running the pipeline is how you get
it back.

### Two things the descriptions turned out to be worth

The listing copy carries **fabric and per-size measurements** that were not
anywhere else. Two store facts came straight out of it:

- the material on every product, which replaced the design project's values
- the size chart for all four tops, including Miu, whose figures the studio had
  never sent separately. Rui also turned out to be a **two-piece set** whose
  sweater and cardigan measure differently, which one shared tops table could
  never have said

### Normalise at upload, not in the archive

`desc.mjs` strips em and en dashes on the way to Shopify (house style, see
CLAUDE.md) and leaves `_copy.json` alone. **Keep it that way.** The archive is
the record of what Shopee actually served; the store is where the house style
applies.

---

## 7. What this does not cover

- **Price.** Shopee reveals a per-variant price only after selecting a
  combination, and clicking through 23 x 3 of them per product is slow and a
  good way to get blocked. Prices on the store came from elsewhere
- **Stock.** Shopee states availability, never a quantity. Inventing one is what
  this repo refuses, so every variant is untracked
- **Reviews.** Deliberately not imported. A score is the one placeholder that
  cannot be labelled as one
