"use client"


import { useState, useEffect } from "react";

export default function Home() {
  const [results, setResults] = useState<any[] | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [fileExtensionFilter, setFileExtensionFilter] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };


  const handleSortOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const handleFindClick = async () => {
    setLoading(true);
    setTimer(0);
    setTimeoutReached(false);
    setResults(null);

    const response = await fetch("IFF/api/server", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ searchTerm }),
    });
    const data = await response.json();
    setResults(data);
    setLoading(false);
  };

  const filteredAndSortedResults = () => {
    let filteredResults = results || [];
    
    // Filter by file extension
    if (fileExtensionFilter) {
      filteredResults = filteredResults.filter((result) => result.link.split('.').pop() === fileExtensionFilter);
    }
    
    // Sort results
    switch (sortOption) {
      case "size>":
        filteredResults.sort((a, b) => parseInt(b.fileSize) - parseInt(a.fileSize));
        break;
        case "size<":
          filteredResults.sort((a, b) => parseInt(a.fileSize) - parseInt(b.fileSize));
          break;
  
      case "name":
        filteredResults.sort((a, b) => a.link.localeCompare(b.link));
        break;
      default:
        break;
    }

    return filteredResults;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (timer < 60 && loading) {
      interval = setInterval(() => setTimer(timer + 1), 1000);
      if (timer === 59) setTimeoutReached(true);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, loading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-gray-100">
      <div className="sticky top-0 z-10 flex flex-col items-center bg-gray-800 p-4 rounded shadow-lg space-y-2">
        {/* Logo and Search Input */}
        <div className="w-full flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <img src="https://main.gigasoft.com.pl/logo.png" alt="Logo" className="mb-4 w-24" />
          <input
            type="text"
            className="w-full px-4 py-2 text-gray-900 bg-gray-300 rounded-md shadow-md focus:outline-none"
            placeholder="Enter your search term"
            value={searchTerm}
            onChange={handleInputChange}
          />
        </div>

        {/* Filters and Sorting */}
        <div className="w-full flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <select onChange={handleSortOptionChange} className="w-full px-4 py-2 bg-gray-600 rounded-md shadow-md">
            <option value="">Sort by</option>
            <option value="size>">size Descending </option>
            <option value="size<">size Ascending </option>
            <option value="name">Name</option>
            {/* Add more sorting options here */}
          </select>
        </div>

        {/* Buttons and Timer */}
        <div className="flex justify-between w-full mt-2 space-x-2">
          <button
            className="w-full sm:w-2/5 px-4 py-2 text-white bg-gray-600 rounded-md shadow-md hover:bg-gray-700 focus:outline-none"
            onClick={handleFindClick}
          >
            Find
          </button>
          <div className="w-full sm:w-2/5 flex justify-between">
            {loading && (
              <div className="relative w-16 h-16 flex justify-center items-center">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="text-gray-400"
                    d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    style={{ strokeDasharray: "100, 100", strokeDashoffset: `${100 - (timer / 120) * 100}` }}
                  />
                  <path
                    className="text-green-400"
                    d="M18 2.0845a15.9155 15.9155 0 0 0 0 31.831"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xs">{60 - timer}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full max-w-2xl mt-4 p-4 rounded shadow-lg bg-gray-800 overflow-auto" style={{ maxHeight: "60vh" }}>
        {timeoutReached && !results ? (
          <div className="text-center text-gray-400">
            <p>We apologize, but no files were found for your search term.</p>
          </div>
        ) : (
          filteredAndSortedResults().map((result, index) => (
            <div key={index} className="mt-4 p-4 rounded shadow-lg bg-gray-900 border-l-4 border-green-400 flex flex-col">
              <a href={result.link} className="text-green-300 hover:underline">
                Download {result.link.split('/').pop() || "File"}
              </a>
              <div className="flex items-center mt-2">
                <img src={result.favicon} alt="File icon" className="mr-2"/>
                <span className="text-gray-300">{result.fileSize ? (parseInt(result.fileSize) / (1024 * 1024)).toFixed(2) + " MB" : "Unknown size"}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
