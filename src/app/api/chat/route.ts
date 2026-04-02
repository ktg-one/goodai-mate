import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/chatPersona';

export const maxDuration = 60;

const gateway = createOpenAICompatible({
  name: 'openai',
  apiKey: process.env.AI_GATEWAY_API_KEY!,
  baseURL: 'https://ai-gateway.vercel.sh/v1',
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Messages array required' }, { status: 400 });
    }

    // Map frontend 'ai' role to 'assistant' for API compatibility
    const formattedMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
      content: m.content,
    }));

    const result = await generateText({
      model: gateway('anthropic/claude-sonnet-4-20250514'),
      system: SYSTEM_PROMPT,
      messages: formattedMessages,
      maxOutputTokens: 300,
    });

    return Response.json({ response: result.text });
  } catch (error: unknown) {
    console.error('Chat API error:', error);

    if (error && typeof error === 'object' && 'status' in error && (error as { status: number }).status === 429) {
      return Response.json(
        { response: "We're getting a lot of traffic right now. Give it a sec and try again." },
        { status: 429 }
      );
    }

    return Response.json(
      { response: "Something broke on our end. Try again in a moment." },
      { status: 500 }
    );
  }
}
