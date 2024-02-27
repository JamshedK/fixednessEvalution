import React, { useEffect, useState, useRef, useContext } from "react";
import AuthContext from "../context/auth-context";
import TaskContext from "../context/task-context";
import send_message_icon from "../assets/msg_entry/send_message_icon.svg";
import search_icon from "../assets/common/search_icon.svg";
import { db } from "../firebase-config";
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore";
import SingleResultContainer from "./SingleResultContainer";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [typingStartTime, setTypingStartTime] = useState(null);
  const [searchResults, setSearchResults] = useState([]); // New state to hold search results
  const [isLoading, setIsLoading] = useState(false);

  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  const textRef = useRef();

  const handleSearchResultClick = async (searchResultName) => {
    // Store the click interaction
    const searchTaskRef = doc(db, "searchTask", user.uid);

    await updateDoc(searchTaskRef, {
      queryInteractions: arrayUnion({
        query: query,
        clickedResult: searchResultName,
      }),
    });
  };

  const storeSearchResults = async (query, searchResults) => {
    // Create a simplified version of the search results to store in Firestore
    const simplifiedSearchResults = searchResults.map((result) => ({
      snippet: result.snippet,
      name: result.name,
      displayUrl: result.displayUrl,
    }));

    // Get a reference to the searchTask document
    const searchTaskRef = doc(db, "searchTask", user.uid);

    // Check if the document exists
    const docSnap = await getDoc(searchTaskRef);

    if (docSnap.exists()) {
      // If it exists, append the new query interaction
      await updateDoc(searchTaskRef, {
        queryInteractions: arrayUnion({
          query: query,
          searchResults: simplifiedSearchResults,
          clickedResults: [], // Initialize with an empty array
        }),
      });
    } else {
      // If the document does not exist, create it with the new query interaction
      await setDoc(searchTaskRef, {
        queryInteractions: [
          {
            query: query,
            searchResults: simplifiedSearchResults,
            clickedResults: [],
          },
        ],
      });
    }
  };

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
      setSearchResults(data.webPages.value); // Store the search results
      await storeSearchResults(query, searchResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false); // Stop loading regardless of the outcome
    }
  };

  return (
    <div className="p-4 w-full bg-[#2F4454]">
      <div className="flex flex-row space-x-6">
        <div className="rounded-3xl bg-[#3c586e] px-8 py-3 min-h-11 flex flex-grow items-start">
          <textarea
            className="bg-transparent focus:outline-none h-7 text-white resize-none w-full"
            ref={textRef}
            value={query}
            placeholder="Search the web..."
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                search();
              }
            }}
            onChange={handleTextareaChange}
          ></textarea>
          <button onClick={search} title="Send prompt">
            <img src={search_icon} alt="Send message" />
          </button>
        </div>
      </div>
      <div className="flex flex-col space-y-2 mt-4">
        {isLoading ? (
          <p className="text-white text-center">Searching...</p>
        ) : (
          searchResults.map((page, index) => (
            <SingleResultContainer
              key={index}
              displayUrl={page.displayUrl}
              name={page.name}
              snippet={page.snippet}
              onClick={handleSearchResultClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPage;
