import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import { site } from './site.config.ts'

export default defineConfig({
  site: site.url,
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
})
