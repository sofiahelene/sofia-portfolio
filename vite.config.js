import { defineConfig } from 'vite';

function fontPreloadPlugin() {
  return {
    name: 'font-preload',
    transformIndexHtml: {
      enforce: 'post',
      transform(html, ctx) {
        if (!ctx.bundle) return html;
        const tags = Object.keys(ctx.bundle)
          .filter(f => f.endsWith('.woff2') && /inter-latin/.test(f))
          .map(f => ({
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: true, href: `/${f}` },
            injectTo: 'head',
          }));
        return { html, tags };
      },
    },
  };
}

export default defineConfig({
  build: {
    outDir: 'docs',
  },
  plugins: [fontPreloadPlugin()],
});
