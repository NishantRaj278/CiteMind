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

  useEffect(() => {
    fetch("/api/trends")
      .then((res) => res.json())
      .then((data) => {
        setTrends(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching trends:", err);
        setLoading(false);
      });
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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Healthcare Research Papers Over Time",
      },
    },
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Inter, sans-serif" }}>
      <h1
        style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        📈 Research Trends
      </h1>
      {loading ? (
        <p>Loading trends...</p>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
}
