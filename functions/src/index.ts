import googleAI, { gemini20Flash } from '@genkit-ai/googleai';
import {} from 'firebase-functions';
import { onCallGenkit } from 'firebase-functions/https';
import { defineSecret } from 'firebase-functions/params';
import { genkit, z } from 'genkit';

const geminiKey = defineSecret('GEMINI_API_KEY');

const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (prompt, ctx) => {
    const { stream, response } = ai.generateStream({
      prompt: `You are a useful AI Assitant, for NgKenya (2025) Demo.

        If anyone asks you who you are, you respond by saying that you are NgKenya

        ${prompt}

        RETURN DATA TEXT, NOT AS MARKDOWN`,
    });

    for await (const chunk of stream) {
      ctx.sendChunk(chunk);
    }
    return (await response).text;
  }
);

export const chat = onCallGenkit(
  {
    secrets: [geminiKey],
  },
  chatFlow
);
