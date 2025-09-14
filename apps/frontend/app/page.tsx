"use client";

import React from "react";
import { Activity, Bell, Clock, Server, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Appbar from "../components/Appbar";
import { useTheme } from "../components/theme-provider";

export default function LandingPage() {
  const { darkMode } = useTheme();
  const router = useRouter();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-[#121212] text-green-400" : "bg-white text-black"}`}>
      <main className="pt-20 font-mono transition-colors duration-300">
        {/* Hero */}
        <section className="mb-12 p-6">
          <h1 className="text-3xl font-bold mb-4">Monitor Your Services with Confidence</h1>
          <p className={darkMode ? "text-green-300 mb-4" : "text-gray-700 mb-4"}>
            Get instant alerts when your services go down. Monitor uptime, performance, and ensure your business never misses a beat.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded transition flex items-center gap-2"
            >
              Start Monitoring <ArrowRight className="w-4 h-4" />
            </button>
            <button className={`px-4 py-2 border border-green-600 rounded hover:bg-green-800 transition ${darkMode ? "text-green-400" : "text-black"}`}>
              View Demo
            </button>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12 p-6">
          <h2 className="text-2xl font-bold mb-6">Everything you need for reliable monitoring</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <FeatureCard icon={<Bell className="w-5 h-5 text-green-400" />} title="Instant Alerts" description="Get notified immediately when your services experience downtime." darkMode={darkMode} />
            <FeatureCard icon={<Clock className="w-5 h-5 text-green-400" />} title="24/7 Monitoring" description="Round-the-clock monitoring from multiple locations worldwide." darkMode={darkMode} />
            <FeatureCard icon={<Server className="w-5 h-5 text-green-400" />} title="Detailed Reports" description="Comprehensive reports and analytics to track your service performance." darkMode={darkMode} />
          </div>
        </section>

        {/* Console */}
        <section className="mb-12 p-6">
          <h2 className="text-2xl font-bold mb-6">UpLink Console</h2>
          <div className={`p-4 rounded border border-green-600 ${darkMode ? "bg-[#1a1a1a]" : "bg-gray-100 text-black"}`}>
            <p>$ uptime-check --all-services</p>
            <p><span className="text-green-400">✔</span> API Server: Online</p>
            <p><span className="text-red-500">✖</span> Payments Service: Offline</p>
            <p><span className="text-green-400">✔</span> Auth Server: Online</p>
            <p className={darkMode ? "text-green-300 mt-2" : "text-gray-700 mt-2"}>
              Monitor your infrastructure like a pro. Real-time alerts, logs, and status at your fingertips.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className={`border-t border-green-600 pt-6 p-6 text-sm flex justify-between flex-wrap gap-6 ${darkMode ? "text-green-400" : "text-black"}`}>
          <span>&copy; 2025 UpLink. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#">Features</a>
            <a href="#">API</a>
            <a href="#">About</a>
            <a href="#">Privacy</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  darkMode: boolean;
};
function FeatureCard({ icon, title, description, darkMode }: FeatureCardProps) {
  return (
    <div className={`p-4 border border-green-600 rounded transition hover:bg-[#1a1a1a] ${darkMode ? "text-green-400" : "text-black"}`}>
      <div className="mb-2">{icon}</div>
      <h3 className="font-bold mb-1">{title}</h3>
      <p className={darkMode ? "text-green-300" : "text-gray-700"}>{description}</p>
    </div>
  );
}
