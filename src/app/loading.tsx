import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-8">
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl"></div>
        
        {/* Main loading container */}
        <div className="relative bg-white/60 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-12 max-w-md w-full">
          <div className="flex flex-col items-center justify-center space-y-8">
            
            {/* Logo Section */}
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl p-3 animate-pulse">
                <Image
                  src="/citemind.png"
                  alt="CiteMind Logo"
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
              {/* Pulsing ring around logo */}
              <div className="absolute -inset-2 border-4 border-blue-300/30 rounded-3xl animate-ping"></div>
            </div>

            {/* App Name */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                CiteMind
              </h1>
              <p className="text-gray-600 font-medium">
                AI-Powered Research Discovery
              </p>
            </div>

            {/* Loading Spinner */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute top-2 left-2 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDelay: '0.15s' }}></div>
            </div>

            {/* Loading Text */}
            <div className="text-center space-y-3">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Loading CiteMind
              </h2>
              <div className="space-y-2">
                <p className="text-gray-600 text-sm">
                  Initializing AI research engine...
                </p>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="w-full space-y-3">
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Loading components</span>
                <span>Setting up AI models</span>
                <span>Ready</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
              </div>
            </div>

          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-400/20 rounded-full animate-bounce"></div>
        <div className="absolute -top-2 -right-6 w-6 h-6 bg-purple-400/20 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute -bottom-4 -left-2 w-10 h-10 bg-blue-300/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute -bottom-2 -right-4 w-4 h-4 bg-purple-300/20 rounded-full animate-bounce" style={{ animationDelay: '0.7s' }}></div>
      </div>
    </div>
  );
}
