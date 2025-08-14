"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TrendData {
  _id: number;
  count: number;
}

export default function TrendsPage() {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPapers, setLoadingPapers] = useState(false);

  const loadPapers = async () => {
    setLoadingPapers(true);
    try {
      const response = await fetch("/api/load-papers", { method: "POST" });
      const result = await response.json();
      console.log("Load papers result:", result);

      // Refresh trends data after loading papers
      fetchTrends();
    } catch (error) {
      console.error("Error loading papers:", error);
    }
    setLoadingPapers(false);
  };

  const fetchTrends = () => {
    setLoading(true);
    fetch("/api/trends")
      .then((res) => res.json())
      .then((data) => {
        console.log("Trends data received:", data);
        console.log("Data length:", data.length);
        setTrends(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching trends:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const chartData = {
    labels: trends.map((t) => t._id),
    datasets: [
      {
        label: "Papers Published",
        data: trends.map((t) => t.count),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  console.log("Chart data:", chartData);
  console.log("Chart labels:", chartData.labels);
  console.log("Chart values:", chartData.datasets[0].data);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Healthcare Research Papers Over Time",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Inter, sans-serif" }}>
      <div className="relative mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent text-center mb-2 flex items-center justify-center gap-3">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-blue-600"
          >
            <path
              d="M3 17L9 11L13 15L21 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 7L16 7L16 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Research Trends
        </h1>
        <p className="text-gray-600 text-center text-lg">
          Discover emerging patterns in research data
        </p>
      </div>

      {loading ? (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl"></div>
          <div className="relative bg-white/60 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-12">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Loading Trends
                </h3>
                <p className="text-gray-600 font-medium">
                  Analyzing research patterns and insights...
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : trends.length === 0 ? (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl"></div>
          <div className="relative bg-white/60 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-12">
            <div className="text-center space-y-6">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">📊</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  No Trend Data Available
                </h3>
                <p className="text-gray-600 font-medium max-w-md mx-auto">
                  Please make sure papers are loaded in the database to generate
                  trend insights.
                </p>
              </div>
              <button
                onClick={loadPapers}
                disabled={loadingPapers}
                className={`relative overflow-hidden px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                  loadingPapers
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                }`}
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center space-x-2">
                  {loadingPapers ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Loading Papers...</span>
                    </>
                  ) : (
                    <>
                      <span>📚</span>
                      <span>Load Sample Papers</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl"></div>
          <div
            className="relative bg-white/60 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6"
            style={{ height: "500px" }}
          >
            <Line data={chartData} options={options} />
          </div>
        </div>
      )}
    </div>
  );
}
