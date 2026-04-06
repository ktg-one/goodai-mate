import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/chatPersona';

export const maxDuration = 60;

const gateway = createOpenAICompatible({
  name: 'openai',
  apiKey: process.env.AI_GATEWAY_API_KEY!,
  baseURL: 'https://ai-gateway.vercel.sh/v1',
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'Messages array required' }, { status: 400 });
  }

  const result = streamText({
    model: gateway('anthropic/claude-sonnet-4-20250514'),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 300,
  });

  return result.toUIMessageStreamResponse();
}
