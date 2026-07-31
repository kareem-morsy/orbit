"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="grid min-h-screen place-items-center p-6"><div className="panel max-w-md p-8 text-center"><h1 className="text-xl font-semibold">Something went wrong</h1><p className="mt-2 text-sm text-slate-500">The application hit an unexpected error.</p><button className="btn-primary mt-5" onClick={reset}>Try again</button></div></main>;
}
