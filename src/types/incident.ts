import { z } from 'zod'

export const LocationType = z.enum(['school', 'public_space', 'private_residence', 'workplace', 'other'])
export const SuspectGender = z.enum(['male', 'female', 'nonbinary', 'unknown'])
export const SuspectRace = z.enum(['White', 'Black', 'Latino', 'Asian', 'Native', 'Other', 'Unknown'])
export const SuspectStatus = z.enum(['apprehended', 'killed_by_self', 'killed_by_police', 'at_large', 'deceased_other', 'unknown'])

export const IncidentSchema = z.object({
  id: z.string().uuid().optional(),
  incident_code: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  city: z.string().min(1),
  state: z.string().length(2),
  location_type: LocationType,
  fatalities: z.number().int().min(0).default(0),
  injuries: z.number().int().min(0).default(0),
  involves_children: z.boolean().default(false),
  involves_women_and_children: z.boolean().default(false),
  hate_crime: z.boolean().default(false),
  hate_crime_target: z.string().nullable().optional(),
  context: z.string().min(1),
  description: z.string().min(1),
  notes: z.string().nullable().optional(),
  is_published: z.boolean().default(false),
  last_verified_at: z.string().optional()
})

export const SuspectSchema = z.object({
  id: z.string().uuid().optional(),
  incident_id: z.string().uuid(),
  suspect_code: z.string().optional(),
  name: z.string().nullable().optional(),
  age: z.number().int().min(0).max(120).nullable().optional(),
  gender: SuspectGender.default('unknown'),
  race: SuspectRace.default('Unknown'),
  nationality: z.string().nullable().optional(),
  status: SuspectStatus.default('unknown'),
  motive: z.string().nullable().optional(),
  notes: z.string().nullable().optional()
})

export const IncidentSourceSchema = z.object({
  id: z.number().optional(),
  incident_id: z.string().uuid(),
  url: z.string().url(),
  title: z.string().min(1),
  publisher: z.string().min(1),
  accessed_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
})

export const SuspectWeaponSchema = z.object({
  id: z.number().optional(),
  suspect_id: z.string().uuid(),
  type: z.string().min(1),
  legally_purchased: z.boolean().nullable().optional(),
  source: z.string().nullable().optional()
})

export const SuspectPriorHistorySchema = z.object({
  suspect_id: z.string().uuid(),
  criminal_record: z.boolean().nullable().optional(),
  prior_mental_health_issues: z.boolean().nullable().optional(),
  prior_domestic_violence: z.boolean().nullable().optional()
})

// Extended suspect type with related data
export const SuspectWithDetailsSchema = SuspectSchema.extend({
  weapons: z.array(SuspectWeaponSchema).optional(),
  history: SuspectPriorHistorySchema.nullable().optional()
})

export type Incident = z.infer<typeof IncidentSchema>
export type Suspect = z.infer<typeof SuspectSchema>
export type SuspectWithDetails = z.infer<typeof SuspectWithDetailsSchema>
export type SuspectWeapon = z.infer<typeof SuspectWeaponSchema>
export type SuspectPriorHistory = z.infer<typeof SuspectPriorHistorySchema>
export type IncidentSource = z.infer<typeof IncidentSourceSchema>
