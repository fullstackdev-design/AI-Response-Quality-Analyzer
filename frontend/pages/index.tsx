import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { asClick } from "../utils/handlers";

export default function Home() {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [prompt, setPrompt] = useState(
    "Explain recursion using a real-world analogy."
  );
  const [temps, setTemps] = useState("0.2,0.6,1.0");
  const [topps, setTopps] = useState("0.8");
  const [n, setN] = useState(2);
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("gal_token");
    if (t) {
      setToken(t);
      fetchExps(t);
    }
  }, []);

  async function register() {
    try {
      await axios.post(API + "/auth/register", { email, password });
      alert("Registered successfully! Now login.");
    } catch (e: any) {
      alert(e.response?.data?.error || e.message);
    }
  }

  async function login() {
    try {
      const r = await axios.post(API + "/auth/login", { email, password });
      localStorage.setItem("gal_token", r.data.token);
      setToken(r.data.token);
      fetchExps(r.data.token);
    } catch (e: any) {
      alert(e.response?.data?.error || e.message);
    }
  }

  async function fetchExps(tok?: string) {
    try {
      const r = await axios.get(API + "/api/experiments", {
        headers: { Authorization: "Bearer " + (tok || token) },
      });
      setExperiments(r.data);
    } catch (e: any) {
      console.error(e);
    }
  }

  async function generate() {
    setLoading(true);
    try {
      await axios.post(
        API + "/generate",
        {
          prompt,
          temps: temps.split(",").map((s) => parseFloat(s.trim())),
          topps: topps.split(",").map((s) => parseFloat(s.trim())),
          n,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      await fetchExps();
    } catch (e: any) {
      alert(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  }

  async function downloadLatest() {
    const r = await axios.get(API + "/api/experiments", {
      headers: { Authorization: "Bearer " + token },
    });
    const exps = r.data;
    if (!exps.length) {
      alert("No experiments yet.");
      return;
    }
    const latest = exps[exps.length - 1];
    const res = await fetch(
      API + "/api/experiments/export/" + latest.id,
      { headers: { Authorization: "Bearer " + token } }
    );
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `experiment-${latest.id}.json`;
    a.click();
  }

  const latest = experiments[experiments.length - 1];
  const chartData = latest
    ? latest.results.map((r: any, i: number) => ({
        name: i + 1,
        score: Math.round(r.metrics.qualityScore * 100),
      }))
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            AI Response Quality Analyzer
          </h1>
          <div className="text-sm text-gray-600">
            Mock LLM • Next.js + Express • PostgreSQL
          </div>
        </header>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
            <label className="block text-sm font-medium text-gray-700">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full mt-2 p-3 border rounded"
            />
            <div className="flex gap-3 mt-3">
              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">
                  Temperatures (comma)
                </div>
                <input
                  value={temps}
                  onChange={(e) => setTemps(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="w-40">
                <div className="text-xs text-gray-600 mb-1">top_p (comma)</div>
                <input
                  value={topps}
                  onChange={(e) => setTopps(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="w-24">
                <div className="text-xs text-gray-600 mb-1">n</div>
                <input
                  type="number"
                  value={n}
                  onChange={(e) => setN(parseInt(e.target.value || "1"))}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={asClick(() => generate())}
                disabled={loading || !token}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                {loading ? "Running..." : "Generate"}
              </button>
              <button
                onClick={asClick(() => fetchExps())}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Refresh
              </button>
            </div>
          </div>

          <aside className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium">Account</h3>
            <input
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
            />
            <input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={asClick(() => register())}
                className="flex-1 px-3 py-2 rounded bg-green-500 text-white"
              >
                Register
              </button>
              <button
                onClick={asClick(() => login())}
                className="flex-1 px-3 py-2 rounded bg-indigo-600 text-white"
              >
                Login
              </button>
            </div>
            <div className="mt-4">
              <h4 className="font-medium">Experiments</h4>
              <div className="max-h-40 overflow-auto mt-2">
                {experiments.length === 0 ? (
                  <div className="text-sm text-gray-500">No experiments yet</div>
                ) : (
                  experiments
                    .slice()
                    .reverse()
                    .map((e: any) => (
                      <div key={e.id} className="border rounded p-2 my-2">
                        <div className="text-xs text-gray-500">
                          {new Date(e.created_at).toLocaleString()}
                        </div>
                        <div className="font-semibold text-sm truncate">
                          {e.prompt}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded shadow">
            <h3 className="font-medium">Latest Results</h3>
            {!latest ? (
              <div className="text-sm text-gray-500 mt-4">No results yet</div>
            ) : (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  {latest.results.map((r: any) => (
                    <div key={r.id} className="border rounded p-3 mb-3">
                      <div className="text-xs text-gray-500">
                        T={r.params.temperature} top_p={r.params.top_p}
                      </div>
                      <div className="mt-2 text-sm whitespace-pre-wrap">
                        {r.text}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <div className="px-2 py-1 bg-teal-600 text-white rounded text-xs">
                          Quality {r.metrics.qualityScore.toFixed(2)}
                        </div>
                        <div className="px-2 py-1 bg-yellow-500 text-white rounded text-xs">
                          Coherence {r.metrics.coherence}
                        </div>
                        <div className="px-2 py-1 bg-blue-400 text-white rounded text-xs">
                          Relevance {r.metrics.relevance}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    Parameter Sweep — Quality Scores
                  </h4>
                  <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#3b82f6"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <button
                    onClick={asClick(() => downloadLatest())}
                    className="px-4 py-2 bg-gray-800 text-white rounded mt-4"
                  >
                    Download Latest JSON
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-medium">Help</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Register then Login before generating.</li>
              <li>Use comma-separated ranges for temperature and top_p.</li>
              <li>Click Download to export the latest experiment JSON.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
