"use client";
import React, { useEffect, useState } from "react";
import { Activity, Bell, Clock, Server, ArrowRight, Check, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-[#121212] text-green-400 font-mono p-6">
      {/* Hero */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-4">Monitor Your Services with Confidence</h1>
        <p className="mb-4 text-green-300">
          Get instant alerts when your services go down. Monitor uptime, performance, and ensure your business never misses a beat.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded transition flex items-center gap-2"
          >
            Start Monitoring <ArrowRight className="w-4 h-4" />
          </button>
          <button className="px-4 py-2 border border-green-600 rounded hover:bg-green-800 transition">
            View Demo
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Everything you need for reliable monitoring</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <FeatureCard
            icon={<Bell className="w-5 h-5 text-green-400" />}
            title="Instant Alerts"
            description="Get notified immediately when your services experience downtime."
          />
          <FeatureCard
            icon={<Clock className="w-5 h-5 text-green-400" />}
            title="24/7 Monitoring"
            description="Round-the-clock monitoring from multiple locations worldwide."
          />
          <FeatureCard
            icon={<Server className="w-5 h-5 text-green-400" />}
            title="Detailed Reports"
            description="Comprehensive reports and analytics to track your service performance."
          />
        </div>
      </section>

      {/* Creative Console / Stats */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">UpLink Console</h2>
        <div className="bg-[#1a1a1a] border border-green-600 rounded p-4 font-mono">
          <p>$ uptime-check --all-services</p>
          <p>
            <span className="text-green-400">✔</span> API Server: Online
          </p>
          <p>
            <span className="text-red-500">✖</span> Payments Service: Offline
          </p>
          <p>
            <span className="text-green-400">✔</span> Auth Server: Online
          </p>
          <p className="mt-2 text-green-300">Monitor your infrastructure like a pro. Real-time alerts, logs, and status at your fingertips.</p>
        </div>
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded transition flex items-center gap-2"
          >
            Launch Dashboard <ArrowRight className="w-4 h-4" />
          </button>
          <button className="px-4 py-2 border border-green-600 rounded hover:bg-green-800 transition">
            Explore Logs
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-600 pt-6 text-green-400 text-sm font-mono">
        <div className="flex justify-between flex-wrap gap-6">
          <span>&copy; 2025 UpLink. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#">Features</a>
            <a href="#">API</a>
            <a href="#">About</a>
            <a href="#">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};
function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-4 border border-green-600 rounded hover:bg-[#1a1a1a] transition">
      <div className="mb-2">{icon}</div>
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-green-300">{description}</p>
    </div>
  );
}

export default App;
