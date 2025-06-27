import googleAI, { gemini20Flash } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit';

const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
});

export const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (prompt, ctx) => {
    const { stream, response } = ai.generateStream({
      prompt,
    });

    for await (const chunk of stream) {
      ctx.sendChunk(chunk);
    }
    return (await response).text;
  }
);
