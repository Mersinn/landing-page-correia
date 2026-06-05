// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Force-enable the Nitro deploy plugin with the Vercel preset when building
  // outside a Lovable context (e.g. on Vercel CI). Without this the plugin
  // auto-skips Nitro and Vercel has no server output to run → 404 NOT_FOUND.
  //
  // The Lovable wrapper hardcodes Nitro's output to dist/ + dist/server, which
  // breaks Vercel's Build Output API (the SSR entry lands in static, not as a
  // Function → catch-all 404). Override output to the canonical layout so the
  // Vercel preset emits .vercel/output/functions/__server.func + static.
  nitro: {
    preset: "vercel",
    output: {
      dir: ".vercel/output",
      serverDir: ".vercel/output/functions/__server.func",
      publicDir: ".vercel/output/static",
    },
  },
});
