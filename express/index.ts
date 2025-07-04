import { expressHandler } from '@genkit-ai/express';
import googleAI, { gemini20Flash } from '@genkit-ai/googleai';
import cors from 'cors';
import express from 'express';
import { genkit, z } from 'genkit';

const app = express();

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
      prompt,
    });

    for await (const chunk of stream) {
      ctx.sendChunk(chunk);
    }
    return (await response).text;
  }
);

app.use(cors());

app.use(express.json());

// @ts-ignore
app.post('/api/chat', expressHandler(chatFlow));

console.log('Server is running on http://localhost:3000');
app.listen(3000);
