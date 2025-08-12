"use client";

function Searchbar() {
  return (
    <div className="flex items-center justify-center p-4 w-full">
      <input
        type="text"
        placeholder="Search..."
        className="border border-gray-300 rounded-l-md p-2 w-2/3"
      />
      <button className="bg-blue-500 text-white rounded-r-md p-2">
        Search
      </button>
    </div>
  );
}

export default Searchbar;
