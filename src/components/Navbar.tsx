import Link from "next/link";
import Image from "next/image";

function Navbar() {
  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-gray-200/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 p-1">
              <Image
                src="/citemind.png"
                alt="CiteMind Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-blue-600 bg-clip-text text-transparent">
              CiteMind
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link
              href="/citation"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-sm"
            >
              Citation Network
            </Link>
            <Link
              href="/trends"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-sm"
            >
              Trends
            </Link>
            <Link
              href="/seminal-papers"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-sm"
            >
              Seminal Papers
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
