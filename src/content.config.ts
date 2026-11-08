import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const track = z.enum(['ai', 'quant_dev', 'quant_research', 'quant_grad']);

const schema = z.object({
  title: z.string(),
  short_title: z.string().optional(),
  tagline: z.string().optional(),
  slug: z.string(),
  summary: z.string(),
  period: z.string().optional().default(''),
  role: z.string().optional().default(''),
  status: z.string().optional().default(''),
  code: z.enum(['public', 'private', 'none']).default('private'),
  tracks: z.array(track).min(1),
  order: z.number(),
  featured: z.boolean().default(false),
  page: z.enum(['case', 'project', 'none']).default('case'),
  gated: z.union([z.literal(false), z.string()]).default(false),
  stack: z.array(z.string()).default([]),
  stack_summary: z.string().optional(),
  method: z.string().optional(),
  outcome: z.string().optional(),
  evaluation: z.string().optional(),
  card: z
    .object({
      result: z.string(),
      facts: z.array(z.object({ key: z.string(), value: z.string() })).default([]),
    })
    .optional(),
  metrics: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        kind: z.enum(['count', 'finding', 'evidence', 'operations', 'outcome', 'scale']).optional(),
      }),
    )
    .default([]),
  links: z
    .array(
      z.object({
        label: z.string(),
        href: z.string().default(''),
        kind: z.enum(['paper', 'repo', 'demo', 'thesis', 'other']).optional(),
        public: z.boolean().default(true),
        meta: z.string().optional(),
      }),
    )
    .default([]),
  hero: z.string().optional(),
  visuals: z.array(z.object({ src: z.string(), alt: z.string(), caption: z.string() })).default([]),
  ai_note: z.string().optional().default(''),
});

const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work', generateId: ({ data }) => String(data.slug) }),
  schema,
});

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects', generateId: ({ data }) => String(data.slug) }),
  schema,
});

export const collections = { work, projects };
