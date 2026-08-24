import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

interface PingResponse {
  message: string;
  timestamp: string;
}

function HomePage() {
  const { data, isLoading, isError, error } = useQuery<PingResponse>({
    queryKey: ["ping"],
    queryFn: async () => {
      const res = await api.get<PingResponse>("/api/ping");
      return res.data;
    },
    retry: 1,
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30 mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Adhikar
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            AI-powered legal assistant
          </p>
        </div>

        {/* Connection status card */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-6 shadow-xl">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
            Server Connection
          </h2>

          {isLoading && (
            <div className="flex items-center gap-3 text-slate-300">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500" />
              </span>
              Checking connection…
            </div>
          )}

          {isError && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
              <div className="flex items-center gap-3 text-red-400 font-medium mb-1">
                <span className="h-2 w-2 rounded-full bg-red-400 flex-shrink-0" />
                Connection failed
              </div>
              <p className="text-slate-400 text-sm mt-1">
                {(error as Error)?.message ?? "Could not reach the server"}
              </p>
              <p className="text-slate-500 text-xs mt-2">
                Make sure the server is running on{" "}
                <code className="text-slate-300">
                  {import.meta.env.VITE_API_URL}
                </code>
              </p>
            </div>
          )}

          {data && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
              <div className="flex items-center gap-3 text-emerald-400 font-semibold mb-1">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                Connected
              </div>
              <p className="text-slate-200 font-mono text-sm mt-1">
                {data.message}
              </p>
              <p className="text-slate-500 text-xs mt-2">
                {new Date(data.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Scaffolding complete — ready for feature development
        </p>
      </div>
    </main>
  );
}

export default HomePage;
