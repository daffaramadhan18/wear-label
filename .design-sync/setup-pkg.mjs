// Builds the throwaway DS package the design-sync converter reads from.
//
// Why this exists: wear-label is a Next.js APP, not a published component
// library — no dist/, no .d.ts tree, and 14 of its 21 synced components import
// next/link, next/image or next/navigation, none of which run in the plain
// browser the preview cards render in. Rather than bend the app's own
// package.json into a library manifest, this script assembles a disposable
// package under .ds-sync/pkg/ that looks like one:
//
//   package.json   name + `types` so the converter finds the .d.ts entry
//   index.ts       the DS surface — re-exports the 21 in-scope components
//   node_modules/  symlinks to the app's real react/react-dom/motion, plus a
//                  hand-written `next` shim (see NEXT_SHIM below)
//   types/         emitted by tsc, so props come from real declarations
//
// Everything here is generated and gitignored. Re-run it any time; it is
// idempotent. The component list is the single place scope is decided.

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PKG = join(REPO, '.ds-sync', 'pkg');

/**
 * The synced DS surface: exported name → source file, relative to the repo.
 *
 * Scope decision (user-confirmed): ui + layout + shop. The components/motion
 * wrappers (Reveal, Stagger, PageTransition, MotionProvider) are deliberately
 * out — they are scroll- and route-triggered animation plumbing, they cannot
 * render statically in a preview, and they are not parts a design agent
 * composes with.
 */
const SURFACE = {
  // ui — the reusable vocabulary
  Alert: 'components/ui/alert.tsx',
  Badge: 'components/ui/badge.tsx',
  Button: 'components/ui/button.tsx',
  ButtonLink: 'components/ui/button.tsx',
  Container: 'components/ui/container.tsx',
  Copy: 'components/ui/copy.tsx',
  MenuIcon: 'components/ui/icons.tsx',
  CloseIcon: 'components/ui/icons.tsx',
  Media: 'components/ui/media.tsx',
  Price: 'components/ui/price.tsx',
  Section: 'components/ui/section.tsx',
  Eyebrow: 'components/ui/section.tsx',
  PageHeading: 'components/ui/section.tsx',
  SectionHeading: 'components/ui/section.tsx',
  // layout — site chrome
  SiteHeader: 'components/layout/site-header.tsx',
  SiteFooter: 'components/layout/site-footer.tsx',
  Wordmark: 'components/layout/wordmark.tsx',
  // shop — catalogue parts
  ProductCard: 'components/shop/product-card.tsx',
  CatalogueFilters: 'components/shop/catalogue-filters.tsx',
  CardHover: 'components/shop/card-hover.tsx',
  CardMedia: 'components/shop/card-hover.tsx',
};

// ── next/* shims ────────────────────────────────────────────────────────────
// The app's components are written against Next. In a preview there is no
// router, no image optimizer and no server, so each Next module is replaced
// with the plainest DOM equivalent that preserves what the component is
// actually demonstrating:
//
//   next/link       -> <a href>. Anchors look and style identically; only
//                      client-side navigation is lost, which a static card
//                      never exercises.
//   next/image      -> <img>. Next-only props (fill/priority/sizes/quality/
//                      placeholder/loader) are stripped so React doesn't warn
//                      about unknown DOM attributes; `fill` is translated to
//                      the absolute-inset style Next itself applies, because
//                      Media relies on it for its aspect-ratio crop.
//   next/navigation -> usePathname() returns "/" and the router is a no-op, so
//                      SiteHeader renders its real active-nav state instead of
//                      crashing on a missing router context.
//
// public/ is not part of the upload layout, so runtime image paths like
// "/brand/wordmark.png" would 404 in a card. The 7 brand PNGs (56 KB total)
// are inlined as data URIs at setup time, which makes Wordmark render its real
// artwork — the one component whose whole purpose is that artwork.
function brandDataUris() {
  const dir = join(REPO, 'public', 'brand');
  const out = {};
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.png'))) {
    out[`/brand/${f}`] = `data:image/png;base64,${readFileSync(join(dir, f)).toString('base64')}`;
  }
  return out;
}

const NEXT_SHIM = {
  'package.json': JSON.stringify(
    { name: 'next', version: '16.3.1', types: './index.d.ts' },
    null,
    2,
  ),
  'index.d.ts': 'export {};\n',

  'link.js': `import { createElement, forwardRef } from "react";
// href may be a UrlObject in Next; a card only ever passes strings, but be safe.
const toHref = (h) => (typeof h === "string" ? h : h && typeof h === "object"
  ? \`\${h.pathname ?? ""}\${h.query ? "?" + new URLSearchParams(h.query) : ""}\` : "#");
const Link = forwardRef(function Link(
  { href, children, prefetch, replace, scroll, shallow, locale, legacyBehavior, passHref, ...rest },
  ref,
) {
  return createElement("a", { ...rest, ref, href: toHref(href) }, children);
});
export default Link;
`,
  'link.d.ts': `import type { AnchorHTMLAttributes, ReactNode } from "react";
export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children?: ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
}
declare const Link: (props: LinkProps) => any;
export default Link;
`,

  'image.js': `import { createElement } from "react";
const BRAND = __BRAND__;
export default function Image({
  src, alt = "", fill, priority, sizes, quality, placeholder, blurDataURL, loader,
  unoptimized, onLoadingComplete, overrideSrc, style, ...rest
}) {
  // Static imports come through as { src }; runtime strings map through BRAND.
  const raw = typeof src === "object" && src ? src.src : src;
  const resolved = BRAND[raw] ?? raw;
  // Next applies exactly this when \`fill\` is set — Media's crop depends on it.
  const fillStyle = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }
    : null;
  return createElement("img", { ...rest, alt, src: resolved, style: { ...fillStyle, ...style } });
}
`,
  'image.d.ts': `import type { ImgHTMLAttributes } from "react";
export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}
declare const Image: (props: ImageProps) => any;
export default Image;
`,

  // A card is a single static route. "/" makes SiteHeader's active-link
  // comparison resolve honestly rather than throwing on a null pathname.
  'navigation.js': `const noop = () => {};
export const usePathname = () => "/";
export const useSearchParams = () => new URLSearchParams();
export const useRouter = () => ({
  push: noop, replace: noop, back: noop, forward: noop, refresh: noop, prefetch: noop,
});
export const useParams = () => ({});
export const useSelectedLayoutSegment = () => null;
export const useSelectedLayoutSegments = () => [];
export const redirect = noop;
export const notFound = noop;
`,
  'navigation.d.ts': `export declare function usePathname(): string;
export declare function useSearchParams(): URLSearchParams;
export declare function useRouter(): Record<string, (...a: any[]) => void>;
export declare function useParams(): Record<string, string>;
`,

  // next/font/google — called at module scope in app/layout.tsx. Not needed by
  // any synced component, but present so a stray import cannot break the build.
  'font/google.js': `const face = (v) => ({ className: "", style: {}, variable: v?.variable ?? "" });
export const Playfair_Display = face;
export const Poppins = face;
export default new Proxy({}, { get: () => face });
`,
};

// ── assemble ────────────────────────────────────────────────────────────────
rmSync(PKG, { recursive: true, force: true });
mkdirSync(join(PKG, 'node_modules'), { recursive: true });

writeFileSync(
  join(PKG, 'package.json'),
  JSON.stringify(
    {
      name: 'wear-label',
      version: JSON.parse(readFileSync(join(REPO, 'package.json'), 'utf8')).version,
      private: true,
      types: './types/index.ts',
    },
    null,
    2,
  ) + '\n',
);

// index.ts — the DS surface. Grouped re-exports, one line per source file.
const byFile = new Map();
for (const [name, file] of Object.entries(SURFACE)) {
  if (!existsSync(join(REPO, file))) throw new Error(`SURFACE: ${file} does not exist`);
  (byFile.get(file) ?? byFile.set(file, []).get(file)).push(name);
}
const entry = [
  '// GENERATED by .design-sync/setup-pkg.mjs — the synced design-system surface.',
  '',
  ...[...byFile].map(([file, names]) => {
    const spec = JSON.stringify(join(REPO, file).replace(/\.tsx?$/, ''));
    return `export { ${names.join(', ')} } from ${spec};`;
  }),
  '',
].join('\n');
writeFileSync(join(PKG, 'index.ts'), entry);

// tokens.css, copied in verbatim so the design system ships its annotated token
// source — the contrast ratios, the three documented AA exceptions, the reasoning
// behind the ramps. The compiled VALUES already reach designs through
// _ds_bundle.css; this is the readable original, for an agent that wants to know
// why a token is what it is.
//
// copyTokens() only runs when cfg.tokensPkg is set and resolves the package from
// node_modules, so this package is symlinked into its own node_modules under its
// own name. cfg.tokensGlob is then a plain filename, and must be a STRING — it is
// .split('/') internally, so an array silently does nothing.
cpSync(join(REPO, 'app', 'tokens.css'), join(PKG, 'tokens.css'));

// node_modules: real deps by symlink, next by shim.
symlinkSync(PKG, join(PKG, 'node_modules', 'wear-label'), 'dir');
for (const dep of ['react', 'react-dom', 'motion', 'scheduler']) {
  const from = join(REPO, 'node_modules', dep);
  if (existsSync(from)) symlinkSync(from, join(PKG, 'node_modules', dep), 'dir');
}
// projectFor() walks up from pkgDir hunting node_modules/@types/react to resolve
// React utility types. Point it at the app's copy — the same one tsc used above,
// so ComponentProps<"button"> resolves to one identity rather than two.
symlinkSync(join(REPO, 'node_modules', '@types'), join(PKG, 'node_modules', '@types'), 'dir');
const brand = JSON.stringify(brandDataUris());
for (const [rel, body] of Object.entries(NEXT_SHIM)) {
  const dest = join(PKG, 'node_modules', 'next', rel);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, body.replace('__BRAND__', brand));
}

// ── Tailwind safelist ───────────────────────────────────────────────────────
// Tailwind only emits a utility it has SEEN in scanned source. That is correct
// for an app, and wrong for a design system: the design agent writes NEW markup
// against these tokens, and a rendered design receives only the compiled
// styles.css. Any token utility the app happens not to use today (shadow-md,
// bg-invert-hover, ease-entrance, text-ink-invert-muted …) would resolve to
// nothing in the agent's output — a class in the DOM with no rule behind it, and
// no error anywhere.
//
// So the whole token-derived vocabulary is safelisted, derived from tokens.css
// itself rather than hand-listed, so it cannot drift when a token is added.
function safelist() {
  const css = readFileSync(join(REPO, 'app', 'tokens.css'), 'utf8');
  // Only the @theme block defines Tailwind-visible tokens; the :root primitives
  // above it (--wl-*) are raw values and produce no utilities.
  const theme = /@theme\s*\{([\s\S]*)\}/.exec(css);
  if (!theme) throw new Error('tokens.css: no @theme block found');
  const names = (prefix) => [
    ...new Set(
      [...theme[1].matchAll(new RegExp(`--${prefix}-([a-z0-9-]+)\\s*:`, 'g'))].map((m) => m[1]),
    ),
  ];
  const out = [];
  const add = (prefixes, tokens) => {
    for (const t of tokens) for (const p of prefixes) out.push(`${p}-${t}`);
  };
  add(['bg', 'text', 'border', 'ring', 'fill', 'stroke', 'accent'], names('color'));
  add(['text'], names('text'));
  add(['leading'], names('leading'));
  add(['tracking'], names('tracking'));
  add(['font'], names('font'));
  add(['rounded'], names('radius'));
  add(['shadow'], names('shadow'));
  add(['ease'], names('ease'));
  add(['max-w'], names('container'));
  add(
    ['p', 'px', 'py', 'pt', 'pb', 'm', 'mt', 'mb', 'my', 'gap', 'gap-x', 'gap-y'],
    names('spacing'),
  );
  // The conventions header tells the design agent that ordinary numeric layout
  // utilities are fine to use. That promise has to be backed by real CSS: the
  // app only happens to use a handful of steps, so a plain `mt-8` or
  // `grid-cols-4` in agent-authored markup would otherwise resolve to nothing.
  // A modest, common range — not the full Tailwind space, which would bloat the
  // stylesheet for no one's benefit.
  const STEPS = ['0', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '8', '10', '12', '16', '20', '24'];
  add(
    ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'm', 'mx', 'my', 'mt', 'mb',
     'gap', 'gap-x', 'gap-y', 'space-y', 'space-x'],
    STEPS,
  );
  for (const n of ['1', '2', '3', '4', '5', '6', '12']) out.push(`grid-cols-${n}`);
  for (const n of ['1', '2', '3', '4', '5', '6', '12']) out.push(`lg:grid-cols-${n}`);
  for (const n of ['1', '2', '3', '4']) out.push(`md:grid-cols-${n}`);
  for (const w of ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'prose']) out.push(`max-w-${w}`);
  return [...new Set(out)];
}

// tw-input.css — the Tailwind entry. Lives here (rather than being hand-kept)
// because this script wipes the directory, so anything not regenerated vanishes.
// See .design-sync/prepare.sh for the compile step that consumes it.
writeFileSync(
  join(PKG, 'tw-input.css'),
  `/*
 * GENERATED by .design-sync/setup-pkg.mjs — Tailwind entry for the DS bundle.
 *
 * The app ships no static stylesheet: app/globals.css is \`@import "tailwindcss"\`
 * plus tokens, and utilities are generated on demand by the Next build. Preview
 * cards have no build step, so every utility the components use must be
 * materialized ahead of time.
 *
 * source(none) disables Tailwind's heuristic content detection, which would
 * start from this file's directory inside .ds-sync/ and find nothing; the
 * explicit globs below scan the real trees. globals.css is imported verbatim so
 * the output is the app's actual cascade, not a reconstruction of it.
 *
 * The previews/ glob is easy to miss and its absence fails silently: a utility
 * used only in a preview (a w-56 wrapper, a max-w-xl measure) is simply never
 * generated, so the class lands in the DOM with no rule behind it and the card
 * renders unconstrained — no error, just a wrong-looking preview.
 */
@import "tailwindcss" source(none);
@source "${join(REPO, 'components')}/**/*.{ts,tsx}";
@source "${join(REPO, 'app')}/**/*.{ts,tsx}";
@source "${join(REPO, '.design-sync', 'previews')}/**/*.tsx";
@source inline("${safelist().join(' ')}");
@import "${join(REPO, 'app', 'globals.css')}";
`,
);

// types/ — real declarations, so <Name>.d.ts carries the actual props instead
// of `any`. tsc runs over the surface with the app's own path aliases.
// This one file serves two consumers, which is why the paths map matters twice:
// tsc reads it to emit declarations, and the converter reads it (as cfg.tsconfig)
// so esbuild's tsconfig-paths plugin resolves the same way.
//
// The `next/*` entry is the load-bearing part. Node resolution walks UP from each
// importing file, so `import Link from "next/link"` inside components/ui/button.tsx
// finds the app's real Next in /node_modules long before it would ever consult
// this package's node_modules — the shims would be silently bypassed and the real
// Next would be bundled, which throws ReferenceError: process is not defined on
// every card. An explicit alias resolves before node resolution runs, so the
// shims actually win. It also makes tsc read link.d.ts for ButtonLink's props,
// which is why that contract lists anchor attributes rather than Next internals
// like `shallow` and `legacyBehavior`.
const nextAlias = { 'next/*': [join(PKG, 'node_modules', 'next') + '/*'] };
const paths = { '@/*': ['./*'], ...nextAlias };
const tsconfig = {
  compilerOptions: {
    target: 'ES2020',
    lib: ['dom', 'dom.iterable', 'esnext'],
    jsx: 'react-jsx',
    module: 'esnext',
    moduleResolution: 'bundler',
    strict: true,
    skipLibCheck: true,
    esModuleInterop: true,
    declaration: true,
    emitDeclarationOnly: true,
    outDir: './types',
    baseUrl: REPO,
    paths,
    typeRoots: [join(REPO, 'node_modules', '@types')],
  },
  files: ['./index.ts'],
};
writeFileSync(join(PKG, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2) + '\n');

// The converter gets a SEPARATE tsconfig carrying only the next/* alias, and
// deliberately not `@/*`. esbuild already discovers the app's own tsconfig by
// walking up from each source file and resolves `@/lib/shopify` correctly from
// it; the converter's tsconfig-paths plugin, which runs first and would shadow
// that, tries bare `existsSync(stem)` before any extension — so a mapped `@/*`
// import that names a DIRECTORY (`@/lib/shopify`, a folder with an index.ts)
// resolves to the directory itself and esbuild fails with "is a directory".
// Narrowing the plugin to next/* keeps the alias that node resolution cannot
// provide, and leaves the alias esbuild already handles to esbuild.
writeFileSync(
  join(PKG, 'tsconfig.bundle.json'),
  JSON.stringify({ compilerOptions: { baseUrl: REPO, paths: nextAlias } }, null, 2) + '\n',
);

console.error(`[setup] ${Object.keys(SURFACE).length} components across ${byFile.size} source files`);
try {
  execFileSync(
    join(REPO, 'node_modules', '.bin', 'tsc'),
    ['-p', join(PKG, 'tsconfig.json')],
    { stdio: 'inherit', cwd: PKG },
  );
} catch {
  // tsc exits non-zero on any type error but still emits declarations. The
  // app's own `npm run build` is the authority on type health; here a partial
  // emit is strictly better than none, so report and continue.
  console.error('[setup] tsc reported errors — declarations emitted anyway (see above)');
}

// The emitted tree mirrors the source layout under a repo-rooted path, so the
// real entry is types/<...>/index.d.ts, not types/index.d.ts. Find it and point
// package.json `types` at it.
const found = [];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.d.ts') found.push(p);
  }
})(join(PKG, 'types'));
if (!found.length) throw new Error('tsc emitted no index.d.ts — cannot continue');
// Shallowest wins: that is the declaration for index.ts itself.
found.sort((a, b) => a.split('/').length - b.split('/').length);
const typesRel = './' + found[0].slice(PKG.length + 1);
const pj = JSON.parse(readFileSync(join(PKG, 'package.json'), 'utf8'));
pj.types = typesRel;
writeFileSync(join(PKG, 'package.json'), JSON.stringify(pj, null, 2) + '\n');
console.error(`[setup] types entry: ${typesRel}`);
console.error('[setup] done');
