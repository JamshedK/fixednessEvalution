import React, { useEffect, useState, useRef, useContext } from "react";
import AuthContext from "../context/auth-context";
import TaskContext from "../context/task-context";
import send_message_icon from "../assets/msg_entry/send_message_icon.svg";
import SingleResultContainer from "./SingleResultContainer";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [typingStartTime, setTypingStartTime] = useState(null);
  const [searchPages, setSearchPages] = useState([]); // New state to hold search results
  const [isLoading, setIsLoading] = useState(false);

  const textRef = useRef();

  const handleTextareaChange = (event) => {
    setQuery(event.target.value);
    if (textRef.current) {
      textRef.current.style.height = "7px";
      textRef.current.style.height = `${textRef.current.scrollHeight}px`;
      if (!typingStartTime) {
        setTypingStartTime(new Date());
      }
    }
  };

  const search = async () => {
    setIsLoading(true); // Start loading
    setTypingStartTime(null);
    if (!query) return;

    const subscriptionKey = process.env.REACT_APP_BING_API_KEY;
    const endpoint = "https://api.bing.microsoft.com/v7.0/search";
    const params = new URLSearchParams({ q: query, mkt: "en-US" });

    try {
      const response = await fetch(`${endpoint}?${params}`, {
        headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
      });

      if (!response.ok) {
        throw new Error("Search API request failed");
      }

      const data = await response.json();
      console.log(data.webPages);
      setSearchPages(data.webPages.value); // Store the search results
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false); // Stop loading regardless of the outcome
    }
  };

  return (
    <div className="p-4 w-full bg-[#2F4454]">
      <div className="flex flex-row space-x-6">
        <div className="rounded-3xl bg-[#3c586e] px-8 py-3 min-h-11 flex flex-grow">
          <textarea
            className="bg-transparent focus:outline-none h-7 text-white resize-none w-full"
            ref={textRef}
            value={query}
            placeholder="Search Bing..."
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                search();
              }
            }}
            onChange={handleTextareaChange}
          ></textarea>
        </div>
        <button onClick={search} title="Send prompt">
          <img src={send_message_icon} alt="Send message" />
        </button>
      </div>
      <div className="flex flex-col space-y-2 mt-4">
        {isLoading ? (
          <p className="text-white text-center">Searching...</p>
        ) : (
          searchPages.map((page, index) => (
            <SingleResultContainer
              key={index}
              displayUrl={page.displayUrl}
              name={page.name}
              snippet={page.snippet}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPage;
