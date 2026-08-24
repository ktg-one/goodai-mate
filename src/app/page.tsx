/**
 * `/` is rewritten in middleware to public/index.html (the GoodAIt film).
 * Iframe is the fallback if the rewrite is skipped — never mount HomeClient.
 */
export default function Home() {
  return (
    <iframe
      src="/index.html"
      title="good'Ai"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        border: 0,
      }}
    />
  );
}
