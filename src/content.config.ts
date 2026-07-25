// src/content.config.ts
import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    // Last substantive revision. Feeds schema.org dateModified + article:modified_time
    // so freshness-sensitive topics keep a signal after the original publish date.
    updated: z.coerce.date().optional(),
    category: z.string(),
    tags: z.array(z.string()),
    lang: z.enum(['zh-TW', 'en']).default('zh-TW'),
    description: z.string().optional(),
    tldr: z.string().optional(),
    draft: z.boolean().default(false),
    pinned: z.boolean().default(false),
    type: z.enum(['debug', 'deep-dive', 'guide', 'project']).optional(),
    difficulty: z.enum(['入門', '進階', '深度']).optional(),
    readingTime: z.number().optional(),
    // Rendered as a visible FAQ section and emitted as FAQPage structured data.
    // Answers should stand alone — they are what answer engines quote.
    faq: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).optional(),
    glossary: z.array(z.object({
      term: z.string(),
      aliases: z.array(z.string()).optional(),
      definition: z.string().optional(),
      advanced: z.string().optional(),
      context: z.string().optional(),
      links: z.array(z.object({
        label: z.string(),
        url: z.string(),
      })).optional(),
    })).optional(),
    series: z.object({
      name: z.string(),
      order: z.number(),
    }).optional(),
  }),
});

export const collections = { posts };
