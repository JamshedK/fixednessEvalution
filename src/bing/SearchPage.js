import React, { useEffect, useState } from "react";
import ai_profile from "../assets/chatbox/ai_profile.svg";

const SearchPage = () => {
  const [searchResult, setSearchResult] = useState({
    title: "",
    url: "",
    description: "",
  });

  useEffect(() => {
    const subscriptionKey = process.env.REACT_APP_BING_API_KEY;
    const endpoint = "https://api.bing.microsoft.com/v7.0/search";
    const query = "ou hscir";
    const params = new URLSearchParams({ q: query, mkt: "en-US" });

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`${endpoint}?${params}`, {
          headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
        });

        if (!response.ok) {
          throw new Error("Search API request failed");
        }

        const data = await response.json();
        const firstResult = data.webPages.value[0];
        setSearchResult({
          title: firstResult.name,
          url: firstResult.url,
          description: firstResult.snippet,
        });
        console.log(firstResult);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, []);

  return (
    <div className="bg-white p-4">
      <div className="flex gap-2 items-center">
        <img src={ai_profile} alt="Profile" className="h-6 w-6" />
        <p className="text-sm text-gray-500 truncate">{searchResult.title}</p>
      </div>
      <a
        href={searchResult.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 hover:underline visited:text-purple-600 text-lg font-medium"
      >
        {searchResult.url}
      </a>
      <p className="text-gray-900">{searchResult.description}</p>
    </div>
  );
};

export default SearchPage;
