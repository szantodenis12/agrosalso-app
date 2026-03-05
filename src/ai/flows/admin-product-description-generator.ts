
'use server';
/**
 * @fileOverview A Genkit flow for generating detailed, short product descriptions and brand reasoning.
 *
 * - adminProductDescriptionGenerator - A function that handles the generation process.
 * - AdminProductDescriptionGeneratorInput - The input type for the function.
 * - AdminProductDescriptionGeneratorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminProductDescriptionGeneratorInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  brandName: z.string().describe('The brand of the product.'),
  categoryName: z.string().describe('The category of the product.'),
  specifications: z
    .record(z.string(), z.string())
    .optional()
    .describe('A key-value pair of product specifications.'),
});
export type AdminProductDescriptionGeneratorInput = z.infer<
  typeof AdminProductDescriptionGeneratorInputSchema
>;

const AdminProductDescriptionGeneratorOutputSchema = z.object({
  detailedDescription: z
    .string()
    .describe(
      'A comprehensive, detailed product description for a premium B2B agricultural machinery distributor, targeting Romanian agricultural businesses. The tone should be industrial-precise and professional.'
    ),
  shortDescription: z
    .string()
    .max(160)
    .describe(
      'A concise product description, maximum 160 characters, optimized for SEO and intended for meta descriptions.'
    ),
  whyBrand: z
    .string()
    .describe(
      'A compelling section titled "Why [brandName]?" highlighting the legacy, reliability, and technological strengths of the manufacturer for the Romanian market.'
    ),
});
export type AdminProductDescriptionGeneratorOutput = z.infer<
  typeof AdminProductDescriptionGeneratorOutputSchema
>;

export async function adminProductDescriptionGenerator(
  input: AdminProductDescriptionGeneratorInput
): Promise<AdminProductDescriptionGeneratorOutput> {
  return adminProductDescriptionGeneratorFlow(input);
}

const adminProductDescriptionGeneratorPrompt = ai.definePrompt({
  name: 'adminProductDescriptionGeneratorPrompt',
  input: {schema: AdminProductDescriptionGeneratorInputSchema},
  output: {schema: AdminProductDescriptionGeneratorOutputSchema},
  prompt: `You are an expert copywriter for AgroSalso, a premium B2B distributor of agricultural machinery in Romania. Your goal is to create compelling, industrial-precise, and professional product content. The target audience is Romanian agricultural businesses.

Based on the following product information, generate the descriptions in Romanian.

Product Name: {{{productName}}}
Brand: {{{brandName}}}
Category: {{{categoryName}}}
{{#if specifications}}
Key Specifications:
{{#each specifications}}
- {{{@key}}}: {{{this}}}
{{/each}}
{{/if}}

Please output a JSON object with three fields: 
1. "detailedDescription": The full product presentation.
2. "shortDescription": A concise 160-char SEO meta.
3. "whyBrand": A persuasive section about the manufacturer (Legacy, Quality, Tech).

The "whyBrand" section should be written in a way that builds massive trust for Romanian farmers.`,
});

const adminProductDescriptionGeneratorFlow = ai.defineFlow(
  {
    name: 'adminProductDescriptionGeneratorFlow',
    inputSchema: AdminProductDescriptionGeneratorInputSchema,
    outputSchema: AdminProductDescriptionGeneratorOutputSchema,
  },
  async input => {
    const {output} = await adminProductDescriptionGeneratorPrompt(input);
    return output!;
  }
);
