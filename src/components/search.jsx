import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle search submission here
    console.log('Search query:', searchQuery);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="relative flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter your delivery location"
            className="w-full px-10 py-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent shadow-lg"
          />
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={18}
          />
        </div>
        <button
          type="submit"
          className="bg-black/80 hover:bg-black text-white px-5 py-2.5 text-xs md:text-sm font-thin transition-all hover:shadow-lg rounded"
        >
          Get Started
        </button>
      </form>
    </div>
  );
};

export default SearchBar;