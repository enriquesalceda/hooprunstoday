"use client";

export default function Error({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
      <section>
        <h1>Something went wrong</h1>
        <button onClick={() => unstable_retry()}>Try again</button>
      </section>
    </main>
  );
}
