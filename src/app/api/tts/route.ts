import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId } = await req.json();

    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'Text is required' }), { status: 400 });
    }

<<<<<<< HEAD
    const apiKey = process.env.ELEVEN_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'ElevenLabs API key not configured. Add ELEVEN_API_KEY=... to .env.local and to Vercel env vars.' }),
=======
    const apiKey = process.env.ELEVEN_API_KEY || process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'ElevenLabs API key not configured. Add ELEVENLABS_API_KEY=... to .env.local and to Vercel env vars.' }),
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
        { status: 500 }
      );
    }

<<<<<<< HEAD
    const effectiveVoiceId = voiceId || process.env.ELEVEN_DEFAULT_VOICE || 'vr54y8Xovf4AEnfNrGqH';

    // Use the streaming endpoint for lower latency
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${effectiveVoiceId}/stream`;
=======
    // 🛡️ Sentinel: Validate user-provided voiceId to prevent path traversal and API abuse
    if (voiceId && !/^[a-zA-Z0-9_-]+$/.test(voiceId)) {
      return new Response(JSON.stringify({ error: 'Invalid voiceId format' }), { status: 400 });
    }

    const effectiveVoiceId = voiceId || process.env.ELEVEN_DEFAULT_VOICE || 'vr54y8Xovf4AEnfNrGqH';

    // Use the streaming endpoint with latency optimization query parameter
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${effectiveVoiceId}/stream?optimize_streaming_latency=4`;
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
<<<<<<< HEAD
        model_id: 'eleven_turbo_v2_5', // fast, high quality for conversational
=======
        model_id: 'eleven_flash_v2_5', // Flash model for ultra-low latency conversational agents
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.75,
          style: 0.2,
<<<<<<< HEAD
          use_speaker_boost: true,
=======
          use_speaker_boost: false, // Disabled to save server processing time and reduce latency
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
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
