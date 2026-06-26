import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId } = await req.json();

    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'Text is required' }), { status: 400 });
    }

    const apiKey = process.env.ELEVEN_API_KEY || process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'ElevenLabs API key not configured. Add ELEVENLABS_API_KEY=... to .env.local and to Vercel env vars.' }),
        { status: 500 }
      );
    }

    const effectiveVoiceId = voiceId || process.env.ELEVEN_DEFAULT_VOICE || 'vr54y8Xovf4AEnfNrGqH';

    // Use the streaming endpoint for lower latency
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${effectiveVoiceId}/stream`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5', // fast, high quality for conversational
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.75,
          style: 0.2,
          use_speaker_boost: true,
        },
        output_format: 'mp3_44100_128',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: `ElevenLabs error (${response.status}): ${errorText}` }),
        { status: 502 }
      );
    }

    // Pipe the audio stream back to the client
    return new Response(response.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'TTS error';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
