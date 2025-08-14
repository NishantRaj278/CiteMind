"use client";

import PaperItems from "@/components/PaperItems";
import Image from "next/image";
import { useState } from "react";

// Type definitions for the search result data
interface PaperMetadata {
  title: string;
  authors: string;
  abstract: string;
  year: number;
  citationCount: number;
  url: string;
  references: string;
}

interface SearchMatch {
  id: string;
  metadata: PaperMetadata;
  score: number;
}

interface SearchData {
  matches?: SearchMatch[];
  generatedAnswer?: string;
  query?: string;
}

function Homepage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<SearchData>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchTerm }),
      });

      const searchData = await response.json();
      console.log("Search response:", searchData); // Debug log
      setData(searchData);
    } catch (error) {
      console.error("Search error:", error);
      setData({});
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press for search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-6 shadow-lg p-2">
              <Image
                src="/citemind.png"
                alt="CiteMind Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-blue-600 bg-clip-text text-transparent mb-6">
              CiteMind
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover Healthcare related research papers with{" "}
              <span className="font-semibold text-blue-600">
                AI-powered insights
              </span>
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex max-w-2xl mx-auto shadow-2xl rounded-2xl overflow-hidden bg-white border border-gray-200/50">
            <input
              type="text"
              placeholder="Search research papers..."
              className="flex-1 px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-inner"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Searching
                </div>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* AI Analysis Section */}
        {data.generatedAnswer && (
          <div className="mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    AI Research Synthesis
                  </h2>
                  <p className="text-sm text-gray-500">
                    Generated insights from your search
                  </p>
                </div>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {data.generatedAnswer}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search Results Header */}
        {data.matches && data.matches.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Research Papers
            </h3>
            <p className="text-gray-600 text-lg">
              Found {data.matches.length} relevant papers for &ldquo;
              {searchTerm}&rdquo;
            </p>
          </div>
        )}

        {/* Content Area */}
        <div>
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16">
              <div className="inline-flex items-center px-6 py-4 font-semibold leading-6 text-lg shadow-xl rounded-2xl text-blue-600 bg-white/80 backdrop-blur-sm border border-blue-200">
                <svg
                  className="animate-spin -ml-1 mr-4 h-6 w-6 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing research papers...
              </div>
            </div>
          )}

          {/* Papers Grid */}
          {!isLoading && data.matches && data.matches.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {data.matches.map((match) => (
                <PaperItems
                  key={match.id}
                  title={match.metadata.title}
                  authors={match.metadata.authors}
                  year={match.metadata.year}
                  abstract={match.metadata.abstract}
                  citationCount={match.metadata.citationCount}
                  url={match.metadata.url}
                  score={match.score}
                />
              ))}
            </div>
          )}

          {/* Empty States */}
          {!isLoading &&
            searchTerm &&
            data.matches &&
            data.matches.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12H6.008z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No papers found
                </h3>
                <p className="text-gray-500 text-lg">
                  Try adjusting your search terms or check for typos.
                </p>
              </div>
            )}

          {!isLoading && !searchTerm && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Start your research journey
              </h3>
              <p className="text-gray-500 text-lg">
                Enter keywords to discover relevant research papers related to
                health and AI-powered insights.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
