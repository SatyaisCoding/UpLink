"use client";

import React, { useState, useMemo, useEffect } from "react";
import { API_BACKEND_URL } from "@/config";
import { Plus, Signal } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

// --- Temporary stubs ---
const axios = {
  post: async (url: string, data?: any, config?: any) => Promise.resolve(),
};
const refreshWebsites = () => console.log("Refreshing websites...");
const websites: any[] = []; // placeholder
// ---------------------------------------------------

type UptimeStatus = "good" | "bad" | "unknown";

function StatusDot({ status }: { status: UptimeStatus }) {
  const color =
    status === "good"
      ? "text-green-500"
      : status === "bad"
      ? "text-red-500"
      : "text-gray-500";
  return <span className={`mr-2 ${color}`}>●</span>;
}

function WebsiteRow({ website }: { website: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="p-3 cursor-pointer hover:bg-gray-800 transition-all"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-center font-mono">
        <div>
          <StatusDot status={website.status} />
          {website.url}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">
            {website.uptimePercentage.toFixed(1)}% uptime
          </span>
          <span className="text-gray-500">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>
      {expanded && (
        <div className="mt-2 ml-6 text-gray-400 font-mono text-sm">
          <div>Last checked: {website.lastChecked}</div>
          <div className="flex gap-1 mt-1">
            {website.uptimeTicks.map((tick: UptimeStatus, idx: number) => (
              <span
                key={idx}
                className={`w-2 h-2 ${
                  tick === "good"
                    ? "bg-green-500"
                    : tick === "bad"
                    ? "bg-red-500"
                    : "bg-gray-600"
                } inline-block`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true); // header controls this
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const { getToken } = useAuth();

  const processedWebsites = useMemo(() => {
    return websites.map((website: any) => ({
      id: website.id ?? "1",
      url: website.url ?? "https://example.com",
      status: website.status ?? "unknown",
      uptimePercentage: 100,
      lastChecked: "Never",
      uptimeTicks: Array(12).fill("unknown" as UptimeStatus),
    }));
  }, [websites]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleAddWebsite = async () => {
    if (!urlInput) return;
    const token = await getToken();
    setIsModalOpen(false);
    axios
      .post(`${API_BACKEND_URL}/api/v1/website`, { url: urlInput }, { headers: { Authorization: token ?? "" } })
      .then(() => refreshWebsites());
    setUrlInput("");
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono transition-colors duration-300">
      <div className="max-w-4xl mx-auto py-10 px-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">uptime-monitor$</h1>

          {/* Right-side header buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1 bg-green-700 hover:bg-green-600 rounded"
            >
              <Plus className="w-4 h-4" /> add-website
            </button>
          </div>
        </div>

        {/* Websites list */}
        {processedWebsites.length === 0 ? (
          <div className="text-center mt-10">
            <Signal className="mx-auto w-8 h-8 text-green-600 mb-2" />
            <p className="text-green-400">No websites added yet</p>
            <p className="text-sm text-green-500">Use "add-website" to start monitoring 🚀</p>
          </div>
        ) : (
          <div className="border border-green-700 rounded">
            {processedWebsites.map((w) => (
              <WebsiteRow key={w.id} website={w} />
            ))}
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-black border border-green-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="font-bold mb-4 text-lg">add-website$</h2>
            <input
              type="url"
              placeholder="https://example.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full px-3 py-2 mb-4 bg-black border border-green-700 rounded outline-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 border border-green-700 rounded hover:bg-green-900"
              >
                cancel
              </button>
              <button
                onClick={handleAddWebsite}
                className="px-3 py-1 bg-green-700 rounded hover:bg-green-600"
              >
                add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
