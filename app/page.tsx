import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950 min-h-screen">
      <main className="flex flex-1 w-full max-w-3xl flex-col justify-between py-20 px-8 bg-white dark:bg-zinc-900 sm:rounded-2xl sm:shadow-sm sm:my-12">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:items-start">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👋</span>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Welcome to the team!
            </h1>
          </div>
          <p className="max-w-xl text-lg leading-7 text-zinc-600 dark:text-zinc-400">
            We are thrilled to have you here. This is your local development environment. 
            Let's get your workspace configured so you can start building.
          </p>
        </div>

        <hr className="my-8 border-zinc-200 dark:border-zinc-800" />

        {/* Quick Start Checklist */}
        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            🚀 Quick Start Checklist
          </h2>
          <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 rounded border-zinc-300 text-black focus:ring-black" />
              <span>Copy <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-sm">.env.example</code> to <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-sm">.env.local</code> and fill in secrets.</span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 rounded border-zinc-300 text-black focus:ring-black" />
              <span>Read the internal <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-sm">README.md</code> for architecture guidelines.</span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 rounded border-zinc-300 text-black focus:ring-black" />
              <span>To start customizing this dashboard, edit <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-sm">app/page.tsx</code>.</span>
            </li>
          </ul>
        </div>

        <hr className="my-8 border-zinc-200 dark:border-zinc-800" />

        {/* Team Resource Links */}
        <div className="flex flex-col gap-4 sm:flex-row w-full sm:justify-start">
          <a
            className="flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            href="https://github.com" // Swap with your repo / wiki link
            target="_blank"
            rel="noopener noreferrer"
          >
            Team Wiki / Docs
          </a>
          <a
            className="flex h-11 items-center justify-center rounded-lg border border-zinc-200 px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800"
            href="https://slack.com" // Swap with your Slack / Discord invite link
            target="_blank"
            rel="noopener noreferrer"
          >
            Join Slack Channel
          </a>
        </div>

      </main>
    </div>
  );
}