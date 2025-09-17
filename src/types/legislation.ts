import { z } from 'zod'

export const LegislationCategory = z.enum([
  'regulation',
  'rights_expansion',
  'background_checks',
  'assault_weapon_ban',
  'concealed_carry',
  'red_flag',
  'other'
])

export const LegislationSchema = z.object({
  id: z.string().uuid().optional(),
  law_code: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  jurisdiction: z.string().min(2),
  title: z.string().min(1),
  summary: z.string().min(1),
  category: LegislationCategory,
  notes: z.string().nullable().optional(),
  is_published: z.boolean().default(false),
  last_verified_at: z.string().optional()
})

export const LegislationSourceSchema = z.object({
  id: z.number().optional(),
  legislation_id: z.string().uuid(),
  url: z.string().url(),
  title: z.string().min(1),
  publisher: z.string().min(1),
  accessed_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
})

export const CorrectionSchema = z.object({
  id: z.number().optional(),
  incident_id: z.string().uuid().nullable().optional(),
  legislation_id: z.string().uuid().nullable().optional(),
  correction_type: z.enum(['factual_error', 'missing_info', 'suggestion']),
  description: z.string().min(1),
  suggested_correction: z.string().nullable().optional(),
  status: z.enum(['pending', 'reviewed', 'accepted', 'rejected']).default('pending'),
  submitted_by: z.string().nullable().optional(),
  reviewed_by: z.string().nullable().optional(),
  reviewed_at: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  created_at: z.string().optional()
})

export type Legislation = z.infer<typeof LegislationSchema>
export type LegislationSource = z.infer<typeof LegislationSourceSchema>
export type Correction = z.infer<typeof CorrectionSchema>
