"use client";

import { useEffect, useState } from "react";

interface Paper {
  id: string;
  title: string;
  authors: Array<{ name: string; authorId?: string }> | string[];
  year: number;
  citationCount: number;
  url: string;
}

export default function SeminalPapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPapers, setLoadingPapers] = useState(false);

  const loadPapers = async () => {
    setLoadingPapers(true);
    try {
      const response = await fetch("/api/load-papers", { method: "POST" });
      const result = await response.json();
      console.log("Load papers result:", result);

      // Refresh seminal papers data after loading
      fetchSeminalPapers();
    } catch (error) {
      console.error("Error loading papers:", error);
    }
    setLoadingPapers(false);
  };

  const fetchSeminalPapers = () => {
    setLoading(true);
    fetch("/api/seminal-papers")
      .then((res) => res.json())
      .then((data) => {
        console.log("Seminal papers data received:", data);
        console.log("Papers count:", data.length);
        setPapers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching seminal papers:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSeminalPapers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="relative mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent text-center mb-2 flex items-center justify-center gap-3">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-yellow-600"
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="currentColor"
              />
            </svg>
            Top 10 Seminal Papers in Healthcare
          </h1>
          <p className="text-gray-600 text-center text-lg">
            Discover the most influential research papers that shaped healthcare
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
                    Loading Seminal Papers
                  </h3>
                  <p className="text-gray-600 font-medium">
                    Fetching the most influential healthcare research...
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : papers.length === 0 ? (
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl"></div>
            <div className="relative bg-white/60 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-12">
              <div className="text-center space-y-6">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-yellow-600"
                  >
                    <path
                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    No Seminal Papers Found
                  </h3>
                  <p className="text-gray-600 font-medium max-w-md mx-auto">
                    Please load papers first to discover the most influential
                    healthcare research.
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
            <div className="relative bg-white/60 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
              {/* Modern Table Header */}
              <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-white/20 px-6 py-4">
                <div className="grid grid-cols-12 gap-4 font-semibold text-gray-700">
                  <div className="col-span-5">Title</div>
                  <div className="col-span-3">Authors</div>
                  <div className="col-span-2">Year</div>
                  <div className="col-span-2">Citations</div>
                </div>
              </div>

              {/* Modern Table Body */}
              <div className="divide-y divide-gray-100/50">
                {papers.map((paper, index) => (
                  <div
                    key={paper.id}
                    className="group hover:bg-blue-50/50 transition-all duration-200 px-6 py-4"
                  >
                    <div className="grid grid-cols-12 gap-4 items-start">
                      {/* Title */}
                      <div className="col-span-5">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-sm font-bold text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <a
                              href={paper.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium leading-tight transition-colors duration-200 line-clamp-3"
                            >
                              {paper.title}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Authors */}
                      <div className="col-span-3">
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                          {Array.isArray(paper.authors)
                            ? paper.authors
                                .map((author) => {
                                  return typeof author === "string"
                                    ? author
                                    : author.name;
                                })
                                .join(", ")
                            : "Unknown Authors"}
                        </p>
                      </div>

                      {/* Year */}
                      <div className="col-span-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                          {paper.year}
                        </span>
                      </div>

                      {/* Citations */}
                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-gray-400"
                          >
                            <path
                              d="M7 9L10 12L7 15"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M13 9L16 12L13 15"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="font-semibold text-gray-700">
                            {paper.citationCount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
