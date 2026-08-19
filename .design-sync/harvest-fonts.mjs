// Extracts the brand webfonts out of the Next build so the design system can
// ship them.
//
// The app gets its type from next/font/google, which self-hosts Playfair Display
// and Poppins: it downloads the woff2 files into .next/static/media/ and injects
// the @font-face rules plus the --font-playfair / --font-poppins variables at
// runtime, from a class on <html>. A preview card has neither the runtime nor the
// class, so without this step every card renders in ui-sans-serif — the tokens
// resolve (--font-body is var(--font-playfair), Georgia, ...) but the inner
// variable is undefined, and the fallback silently wins.
//
// So: pull the @font-face blocks out of the compiled CSS, copy the woff2 files
// they point at, rewrite the urls to sit beside them, and define the two
// variables on :root. cfg.extraFonts then parses this stylesheet and copies the
// fonts into the bundle's fonts/ directory.
//
// Output is generated, not committed — it depends on a Next production build
// existing. If .next has no compiled font CSS this script runs `npm run build`
// once to produce it.

import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(REPO, '.ds-sync', 'pkg', 'fonts');

/**
 * The families the design system actually asserts, mapped to the token each one
 * backs. tokens.css defines --font-display as `var(--font-playfair), Georgia,
 * ...`, so the variable's value is a family name only — the fallback chain
 * already lives in the token.
 */
const FAMILIES = {
  'Playfair Display': { variable: '--font-playfair', fallback: 'Georgia, ui-serif, serif' },
  Poppins: { variable: '--font-poppins', fallback: 'ui-sans-serif, system-ui, sans-serif' },
};

// Production chunks only. .next/dev/ carries stale faces from earlier iterations
// of this repo (Fraunces, Instrument Sans are still in there) and would ship
// fonts the design system no longer uses.
function chunkCss() {
  const dir = join(REPO, '.next', 'static', 'chunks');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.css'))
    .map((f) => ({ path: join(dir, f), css: readFileSync(join(dir, f), 'utf8') }))
    .filter((c) => c.css.includes('@font-face'));
}

let chunks = chunkCss();
if (!chunks.length) {
  console.error('[fonts] no compiled font CSS in .next — running the app build to produce it');
  execFileSync('npm', ['run', 'build'], { cwd: REPO, stdio: 'inherit' });
  chunks = chunkCss();
  if (!chunks.length) throw new Error('.next still has no @font-face CSS after a build');
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const blocks = [];
const copied = new Set();
const seenFamilies = new Set();

for (const { path: cssPath, css } of chunks) {
  for (const [block] of css.matchAll(/@font-face\s*\{[^}]*\}/g)) {
    const family = /font-family:\s*(?:"([^"]+)"|'([^']+)'|([^;}]+))/.exec(block);
    const name = (family?.[1] ?? family?.[2] ?? family?.[3] ?? '').trim();
    // "<Family> Fallback" faces are next/font's metric-adjusted local() stand-ins.
    // They reference no file and only matter while a real face is loading, which
    // never happens in a static card — drop them.
    if (!Object.hasOwn(FAMILIES, name)) continue;
    seenFamilies.add(name);

    // Rewrite each url() to sit beside this stylesheet, copying the file across.
    const rewritten = block.replace(/url\(([^)]+)\)/g, (whole, raw) => {
      const rel = raw.trim().replace(/^["']|["']$/g, '');
      const src = resolve(dirname(cssPath), rel);
      if (!existsSync(src)) {
        console.error(`[fonts] ! referenced file missing, leaving url as-is: ${rel}`);
        return whole;
      }
      const base = src.split('/').pop();
      if (!copied.has(base)) {
        copyFileSync(src, join(OUT, base));
        copied.add(base);
      }
      return `url(./${base})`;
    });
    blocks.push(rewritten);
  }
}

const missing = Object.keys(FAMILIES).filter((f) => !seenFamilies.has(f));
if (missing.length) throw new Error(`[fonts] no @font-face found for: ${missing.join(', ')}`);

const header = `/*
 * Brand webfonts — HARVESTED, do not hand-edit.
 *
 * Produced by .design-sync/harvest-fonts.mjs from the Next production build,
 * which is where next/font/google self-hosts these files. Re-run that script
 * after changing the font configuration in app/layout.tsx.
 *
 * The two custom properties below are the ones next/font would otherwise set at
 * runtime from a class on <html>. app/tokens.css builds --font-display and
 * --font-body on top of them, so without these definitions every component
 * silently falls back to a system face.
 */
:root {
${Object.values(FAMILIES).map((f) => `  ${f.variable}: "${Object.keys(FAMILIES).find((k) => FAMILIES[k] === f)}", ${f.fallback};`).join('\n')}
}
`;

writeFileSync(join(OUT, 'fonts.css'), `${header}\n${blocks.join('\n')}\n`);
console.error(
  `[fonts] ${blocks.length} @font-face rules, ${copied.size} woff2 files, families: ${[...seenFamilies].join(', ')}`,
);
