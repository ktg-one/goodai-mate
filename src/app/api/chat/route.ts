import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
<<<<<<< HEAD
import { convertToModelMessages, streamText, generateText, UIMessage } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/chatPersona';
=======
import { convertToModelMessages, streamText, generateText } from 'ai';
import { getSystemPrompt } from '@/lib/chatPersona';
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
<<<<<<< HEAD
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
=======
    const { messages, message, model, agent } = await req.json();

    const gatewayApiKey = process.env.AI_GATEWAY_API_KEY;

    // Use selected model, default to DeepSeek V4 Flash
    const selectedModel = model || 'deepseek/deepseek-v4-flash';
    const systemPrompt = getSystemPrompt(agent);

    let modelInstance;

    // Direct API fallback mapping for local development/showcases bypassing Gateway
    if (selectedModel.startsWith('groq/') && process.env.GROQ_API_KEY) {
      const groqClient = createOpenAICompatible({
        name: 'groq',
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
      });
      const modelName = selectedModel.replace('groq/', '');
      modelInstance = groqClient(modelName);
    } else if (selectedModel.startsWith('google/') && process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      const googleClient = createOpenAICompatible({
        name: 'google',
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      });
      const modelName = selectedModel.replace('google/', '');
      modelInstance = googleClient(modelName);
    } else {
      // Standard path: Vercel AI Gateway
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
      modelInstance = gateway(selectedModel);
    }

    if (message) {
      const result = await generateText({
        model: modelInstance,
        system: systemPrompt,
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
        prompt: message,
        maxOutputTokens: 300,
      });
      return Response.json({ reply: result.text });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Messages array required' }, { status: 400 });
    }

    const result = streamText({
<<<<<<< HEAD
      model: gateway('anthropic/claude-sonnet-4-20250514'),
      system: SYSTEM_PROMPT,
=======
      model: modelInstance,
      system: systemPrompt,
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 300,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Chat error occurred';
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
