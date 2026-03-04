'use server';
/**
 * @fileOverview A Genkit flow to automatically generate SEO-optimized meta titles and descriptions for product pages.
 *
 * - generateProductMeta - A function that handles the meta generation process.
 * - AdminProductMetaGeneratorInput - The input type for the generateProductMeta function.
 * - AdminProductMetaGeneratorOutput - The return type for the generateProductMeta function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminProductMetaGeneratorInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  brandName: z.string().describe('The brand name of the product.'),
  productCategory: z.string().describe('The category of the product (e.g., "tractoare", "combine").'),
  shortDescription: z.string().describe('A concise, short description of the product (max 160 characters).'),
});
export type AdminProductMetaGeneratorInput = z.infer<typeof AdminProductMetaGeneratorInputSchema>;

const AdminProductMetaGeneratorOutputSchema = z.object({
  metaTitle: z.string().max(60).describe('An SEO-optimized meta title for the product page (max 60 characters).'),
  metaDescription: z.string().max(160).describe('An SEO-optimized meta description for the product page (max 160 characters).'),
});
export type AdminProductMetaGeneratorOutput = z.infer<typeof AdminProductMetaGeneratorOutputSchema>;

export async function generateProductMeta(input: AdminProductMetaGeneratorInput): Promise<AdminProductMetaGeneratorOutput> {
  return adminProductMetaGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminProductMetaGeneratorPrompt',
  input: {schema: AdminProductMetaGeneratorInputSchema},
  output: {schema: AdminProductMetaGeneratorOutputSchema},
  prompt: `You are an expert SEO specialist for an agricultural machinery distributor named AgroSalso.
Your task is to generate an SEO-optimized meta title and meta description for a product page.

Keep the meta title under 60 characters and the meta description under 160 characters.
Focus on including relevant keywords like "utilaje agricole", "tractoare Romania", "combine agricole", and "echipamente agricole" where appropriate, but prioritize natural language and user appeal.
Make sure the meta description clearly describes the product and encourages clicks.

Product Name: {{{productName}}}
Brand: {{{brandName}}}
Category: {{{productCategory}}}
Short Description: {{{shortDescription}}} 

Generate the meta title and meta description:`,
});

const adminProductMetaGeneratorFlow = ai.defineFlow(
  {
    name: 'adminProductMetaGeneratorFlow',
    inputSchema: AdminProductMetaGeneratorInputSchema,
    outputSchema: AdminProductMetaGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
