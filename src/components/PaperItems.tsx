interface PaperItemsProps {
  title: string;
  authors: string;
  year: number;
  abstract: string;
  citationCount: number;
  url: string;
  score: number;
}

function PaperItems({
  title,
  authors,
  year,
  abstract,
  citationCount,
  url,
  score,
}: PaperItemsProps) {
  // Truncate abstract if too long
  const truncatedAbstract =
    abstract.length > 200 ? abstract.substring(0, 200) + "..." : abstract;

  // Format score as percentage
  const relevanceScore = Math.round(score * 100);

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
      {/* Header with title and relevance score */}
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-lg font-bold text-gray-900 leading-tight pr-3 group-hover:text-blue-700 transition-colors duration-200">
          {title}
        </h1>
        <div className="flex-shrink-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {relevanceScore}% match
          </span>
        </div>
      </div>

      {/* Authors and year */}
      <div className="mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="w-4 h-4 mr-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="font-medium">{authors}</span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="font-medium">{year}</span>
        </div>
      </div>

      {/* Abstract */}
      <div className="mb-6 flex-grow">
        <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
          {truncatedAbstract}
        </p>
      </div>

      {/* Footer with citations and link */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-1">
          <div className="flex items-center px-3 py-1 bg-gray-50 rounded-lg">
            <svg
              className="w-4 h-4 mr-2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="text-xs font-medium text-gray-600">
              {citationCount} citations
            </span>
          </div>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl group"
        >
          <span>View Paper</span>
          <svg
            className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default PaperItems;
