import { useContext, useState, useEffect } from "react";
import Navbar from "./navbar";
import Chatbox from "./chatbox";
import TaskContext from "../context/task-context";
import { Timestamp, setDoc, doc } from "firebase/firestore";
import AuthContext from "../context/auth-context";
import { db } from "../firebase-config";

const MainChatTask = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const authCtx = useContext(AuthContext);
  const taskCtx = useContext(TaskContext);

  const instructionText =
    "Your task is under 'Current Task' on the left. Interact with ChatGPT using 'Type a prompt...' and compile your answer in the note box on the right before submitting.";

  useEffect(() => {
    const saveStartTime = async () => {
      try {
        const startTime = Timestamp.now();
        const userDocRef = doc(db, "chatTasks", authCtx.user.uid);
        await setDoc(userDocRef, { startedTs: startTime }, { merge: true });
        console.log("Start time saved");
      } catch (error) {
        console.error("Error saving start time:", error);
      }
    };
    if (authCtx.user) {
      saveStartTime();
    }
  }, [authCtx.user]);

  return (
    <div className="flex flex-row bg-[#e3e3e3] w-screen border-2 border-red-600">
      <Navbar setShowInstructions={setShowInstructions} />
      <Chatbox />
    </div>
  );
};

export default MainChatTask;
