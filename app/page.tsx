import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 shadow-xl">
          <h1 className="text-4xl font-bold">EasyTalk AI</h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            AI-powered Messenger automation for businesses. Connect a Facebook
            Page, manage business information, and let AI help answer customer
            messages.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Open Dashboard
            </Link>

            <Link
              href="/debug"
              className="rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-200 hover:bg-slate-800"
            >
              Webhook Debugger
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}