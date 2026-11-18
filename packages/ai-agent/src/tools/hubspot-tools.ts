import { z } from 'zod';

export const CreatePropertyToolSchema = z.object({
  objectType: z.enum(['contacts', 'companies', 'deals', 'tickets']).describe('Target HubSpot CRM object type'),
  name: z.string().regex(/^[a-z_][a-z0-9_]*$/).describe('Internal programmatic name (lowercase, underscores)'),
  label: z.string().min(2).max(100).describe('User-facing display label in HubSpot UI'),
  type: z.enum(['string', 'number', 'date', 'enumeration']).describe('HubSpot data type'),
  fieldType: z.enum(['text', 'number', 'select', 'date', 'textarea']).describe('UI form input type'),
  groupName: z.string().default('contactinformation').describe('HubSpot property group'),
  description: z.string().optional().describe('Documentation explanation of property purpose'),
});

export const CreatePipelineToolSchema = z.object({
  objectType: z.enum(['deals', 'tickets']).describe('Pipeline object type'),
  label: z.string().min(2).max(100).describe('Pipeline display name'),
  stages: z
    .array(
      z.object({
        label: z.string(),
        probability: z.number().min(0).max(1),
      })
    )
    .min(2)
    .describe('Ordered pipeline stages with win probabilities'),
});

export const SearchKnowledgeSchema = z.object({
  query: z.string().min(3).describe('Search term for HubSpot docs, HuboVerse academy transcripts, or best practices'),
  category: z.enum(['ALL', 'WORKFLOWS', 'PROPERTIES', 'REPORTING', 'ACADEMY']).default('ALL'),
});

export type CreatePropertyInput = z.infer<typeof CreatePropertyToolSchema>;
export type CreatePipelineInput = z.infer<typeof CreatePipelineToolSchema>;
export type SearchKnowledgeInput = z.infer<typeof SearchKnowledgeSchema>;
