import PapersList from "@/components/PapersList";
import Searchbar from "@/components/Searchbar";
import React from "react";

function Homepage() {
  return (
    <div className="px-12">
      <Searchbar />
      <div className="h-100 w-full shadow-lg p-12">
        <h1>Generated Answer</h1>
      </div>
      <PapersList />
    </div>
  );
}

export default Homepage;
