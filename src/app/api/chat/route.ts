import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { convertToModelMessages, streamText, generateText, UIMessage } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/chatPersona';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages, message } = await req.json();

    const gatewayApiKey = process.env.AI_GATEWAY_API_KEY;

    if (!gatewayApiKey) {
      return new Response(
        "Chat is temporarily unavailable while the AI gateway is being configured. Leave your details and we'll get back to you.",
        { status: 503 },
      );
    }

    const gateway = createOpenAICompatible({
      name: 'openai',
      apiKey: gatewayApiKey,
      baseURL: 'https://ai-gateway.vercel.sh/v1',
    });

    if (message) {
      const result = await generateText({
        model: gateway('anthropic/claude-sonnet-4-20250514'),
        system: SYSTEM_PROMPT,
        prompt: message,
        maxOutputTokens: 300,
      });
      return Response.json({ reply: result.text });
    }

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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Chat error occurred';
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
