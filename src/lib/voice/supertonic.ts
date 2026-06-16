/**
 * Supertonic Local ASR Provider
 * Adapter for the user's local "Supertonic" voice instance.
 *
 * Expected shape (common for local Whisper / Voxtral / similar):
 *   POST /transcribe
 *   FormData: { file: Blob, language?: string }
 *   Response: { text: string } | { transcription: string } | { result: string }
 *
 * You can tweak this file as soon as you give me the exact endpoint shape.
 */

export async function transcribeWithSupertonic(
  audioBlob: Blob,
  endpoint?: string
): Promise<string> {
  const actualEndpoint = endpoint || process.env.NEXT_PUBLIC_ASR_URL || 'http://localhost:8000/transcribe';
  const formData = new FormData();
  formData.append('file', audioBlob, 'input.webm');
  formData.append('language', 'en');

  const res = await fetch(actualEndpoint, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Supertonic returned ${res.status}`);
  }

  const data = await res.json();

  // Be generous with response shapes
  return (
    data.text ||
    data.transcription ||
    data.result ||
    data.output ||
    ''
  ).trim();
}
