import { useState, useRef, useContext } from "react";
import send_message_icon from "../assets/msg_entry/send_message_icon.svg";
import AuthContext from "../context/auth-context";
import { db } from "../firebase-config";
import {
  addDoc,
  collection,
  setDoc,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { uid } from "uid";
import TaskContext from "../context/task-context";

const MsgEntry = (props) => {
  const [prompt, setPrompt] = useState(null);
  const [typingStartTime, setTypingStartTime] = useState(null); // Timestamp for when user starts typing

  const textRef = useRef();
  const authCtx = useContext(AuthContext);
  const taskCtx = useContext(TaskContext);

  const handleTextareaChange = () => {
    if (props.isLoading) {
      textRef.current.value = "";
      return;
    }
    if (!props.isAllResponsesRated) {
      alert(
        "Not all responses are rated! Please click the star next to the ChatGPT response before sending the next prompt. You may need to scroll to the top of each response to see the star. "
      );
      textRef.current.value = "";
    } else if (taskCtx.showEditNoteReminder) {
      taskCtx.setShowPopUp(true);
      textRef.current.value = "";
    } else if (textRef.current) {
      textRef.current.style.height = "7px"; // Reset the height 7px
      textRef.current.style.height = `${textRef.current.scrollHeight}px`; // Set the height to the scrollHeight
      if (!typingStartTime) {
        setTypingStartTime(new Date()); // Record the typing start time
      }
    }
  };

  const sendPrompt = async (e) => {
    if (props.isLoading) {
      textRef.current.value = "";
      return;
    }
    if (taskCtx.showEditNoteReminder) {
      taskCtx.setShowPopUp(true);
      textRef.current.value = "";
      return;
    }
    // show data quality reminder after 2 queries
    if (taskCtx.queryCount === 2) {
      props.setShowDataQualityReminder(true);
    }
    taskCtx.setQueryCount();
    const newMessage = textRef.current.value;
    if (newMessage.trim() != "") {
      // Save the prompt to Firestore database
      try {
        const promptRef = collection(db, "chatsIndividual");
        const promptID = uid();
        props.setPromptID(promptID);
        const formData = {
          id: promptID,
          responseTo: props.responseID,
          prompt: newMessage,
          userID: authCtx?.user.uid || "",
          role: "user",
          typingStartTime,
          typingEndTime: new Date(),
        };
        await props.saveChatHistory(formData);
        const docRef = await addDoc(promptRef, formData);
        props.setPrompt(newMessage);
        const updatedMessagesArray = [
          ...props.promptResponseArray,
          { role: "user", content: newMessage, id: promptID },
        ];
        // get the response from API
        props.setPromptResponseArray(updatedMessagesArray);
        textRef.current.value = "";
        handleTextareaChange();
        // get API response
        await props.getAPIResponse(updatedMessagesArray, promptID);
        window.scrollTo(0, document.documentElement.scrollHeight);
        taskCtx.setIsRatingNeeded(true);
        taskCtx.setShowEditNoteReminder(true);
      } catch (error) {
        console.error("Error saving prompt:", error);
      }
      setTypingStartTime(null); // Reset typing start time when message is sent
    }
  };

  return (
    <div className="flex flex-row space-x-6 ">
      <div className="rounded-2xl bg-[#e3e3e3] px-8 py-3 min-h-11 flex flex-grow ml-2">
        <textarea
          className="bg-transparent focus:outline-none h-7 text-black resize-none w-full"
          ref={textRef}
          placeholder="Type a prompt... "
          onChange={handleTextareaChange}
        ></textarea>
        <button
          className="disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={sendPrompt}
          disabled={props.isLoading}
          title="Send prompt"
        >
          <img src={send_message_icon} />
        </button>
      </div>
    </div>
  );
};

export default MsgEntry;
