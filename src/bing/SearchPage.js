import React, { useEffect, useState, useRef, useContext } from "react";
import AuthContext from "../context/auth-context";
import TaskContext from "../context/task-context";
import send_message_icon from "../assets/msg_entry/send_message_icon.svg";
import search_icon from "../assets/common/search_icon.svg";
import { db } from "../firebase-config";
import { uid } from "uid";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  setDoc,
  runTransaction,
  Timestamp,
} from "firebase/firestore";
import SingleResultContainer from "./SingleResultContainer";
import EditNoteReminder from "../chat/EditNoteReminder";
import RatePrompt from "../chat/RatePrompt";
import RateSearchResults from "../bing/RateSearchResults";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [queryID, setQueryID] = useState("");
  const [typingStartTime, setTypingStartTime] = useState(null);
  const [searchResults, setSearchResults] = useState([]); // New state to hold search results
  const [isLoading, setIsLoading] = useState(false);

  const authCtx = useContext(AuthContext);
  const taskCtx = useContext(TaskContext);
  const user = authCtx.user;

  const textRef = useRef();

  const handleSearchResultClick = async (clickedObj) => {
    // Reference to the searchTask document
    const searchTaskRef = doc(db, "searchTask", user.uid);

    // Transaction to ensure atomic update
    await runTransaction(db, async (transaction) => {
      const searchTaskDoc = await transaction.get(searchTaskRef);
      if (!searchTaskDoc.exists()) {
        console.error("Document does not exist!");
        return;
      }

      // Extract current data
      const data = searchTaskDoc.data();
      const { queryInteractions } = data;

      // Find the specific query interaction, assuming `query` is unique per interaction
      const interactionIndex = queryInteractions.findIndex(
        (interaction) => interaction.query === query
      );
      if (interactionIndex === -1) {
        console.error("Query interaction not found!");
        return;
      }

      // Clone the interactions to avoid direct mutation
      const updatedQueryInteractions = [...queryInteractions];

      // Update the clickedResults for the specific query interaction
      const interaction = updatedQueryInteractions[interactionIndex];
      console.log(interaction);
      const updatedClickedResults = interaction.clickedResults
        ? [...interaction.clickedResults, clickedObj]
        : [clickedObj];
      updatedQueryInteractions[interactionIndex] = {
        ...interaction,
        clickedResults: updatedClickedResults,
      };

      // Update the document with the new interactions
      transaction.update(searchTaskRef, {
        queryInteractions: updatedQueryInteractions,
      });
    });
  };

  const storeSearchResults = async (query, searchResults) => {
    // Create a simplified version of the search results to store in Firestore
    const simplifiedSearchResults = searchResults.map((result) => ({
      snippet: result.snippet,
      name: result.name,
      displayUrl: result.displayUrl,
      customID: result.customID,
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
          ts: Timestamp.now(),
          searchResults: simplifiedSearchResults,
          clickedResults: [], // Initialize with an empty array
        }),
      });
    } else {
      // If the document does not exist, create it with the new query interaction
      await setDoc(searchTaskRef, {
        queryInteractions: [
          {
            ts: Timestamp.now(),
            query: query,
            searchResults: simplifiedSearchResults,
            clickedResults: [],
          },
        ],
        userID: user.uid,
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
    if (!query) return;
    if (taskCtx.isRatingNeeded) {
      taskCtx.setShowRatingPopUp(true);
      return;
    } else if (taskCtx.showEditNoteReminder) {
      taskCtx.setShowPopUp(true);
      return;
    }
    setIsLoading(true); // Start loading
    setTypingStartTime(null);
    setQueryID(uid());
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
      const localSearchResults = data.webPages.value.map((result) => ({
        ...result,
        customID: uid(),
      }));

      setSearchResults(localSearchResults); // Store the search results
      // Update the context to show the pop-up
      taskCtx.setIsRatingNeeded(true);
      taskCtx.setShowEditNoteReminder(true);
      await storeSearchResults(query, localSearchResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false); // Stop loading regardless of the outcome
    }
  };

  return (
    <div className="p-4 w-full bg-[#FFFFFF]">
      <div className="flex flex-row space-x-6">
        <div className="rounded-3xl bg-[#e3e3e3] px-8 py-3 min-h-11 flex flex-grow items-center">
          <textarea
            className="bg-transparent focus:outline-none h-7 text-black resize-none w-full"
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
            <img className="h-5 w-5" src={search_icon} alt="Send message" />
          </button>
        </div>
      </div>
      <div className="flex flex-col space-y-2 mt-4">
        {isLoading ? (
          <p className="text-black text-center">Searching...</p>
        ) : (
          searchResults.map((page, index) => (
            <SingleResultContainer
              key={index}
              displayUrl={page.displayUrl}
              name={page.name}
              snippet={page.snippet}
              onClick={() =>
                handleSearchResultClick({
                  url: page.displayUrl,
                  customID: page.customID,
                })
              }
            />
          ))
        )}
      </div>
      {taskCtx.showPopUp && !taskCtx.isRatingNeeded && (
        <div className="fixed top-0 z-10 left-0 w-screen h-screen flex items-center justify-center">
          <EditNoteReminder />
        </div>
      )}
      {taskCtx.showRatingPopUp && (
        <div className="fixed top-0 left-0 z-10 w-screen h-screen flex items-center justify-center">
          <RateSearchResults queryID={queryID} />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
