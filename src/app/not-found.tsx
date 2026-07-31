import Link from "next/link";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center p-6"><div className="text-center"><p className="text-sm font-semibold text-brand-600">404</p><h1 className="mt-2 text-3xl font-semibold">Page not found</h1><Link href="/dashboard" className="btn-primary mt-6">Go to dashboard</Link></div></main>;
}
