import { useState, useRef } from "react";
import { collection, addDoc, query, where, getDocs} from "firebase/firestore";
import { db } from "../firebase-config";
import { uid } from "uid";
import { useContext, useEffect } from "react";
import TaskContext from "../context/task-context";

const CommentPopUp = (props) => {
    const [comment, setComment] = useState('');

    // Inside the component
    const textRef = useRef(null);
  
    const taskCtx = useContext(TaskContext);
  
    // useEffect(() => {
    //     const fetchComment = async () => {
    //       if (props.promptID) {
    //         try {
    //           const commentsRef = collection(db, 'comments');
    //           const q = query(commentsRef, where('promptID', '==', props.promptID));
    //           const querySnapshot = await getDocs(q);
    
    //           if (!querySnapshot.empty) {
    //             // Assuming there is only one comment for a specific promptID
    //             const commentData = querySnapshot.docs[0].data();
    //             textRef.current.value = commentData?.comment
    //           }
    //         } catch (error) {
    //           console.error("Error fetching comment:", error);
    //         }
    //       }
    //     };
    
    //     fetchComment();
    //   }, [props.promptID]);
    
    const handleTextareaChange = (e) => {
        if (textRef.current) {
            textRef.current.style.height = 'auto'; // Reset the height to auto
            textRef.current.style.height = `${textRef.current.scrollHeight}px`; // Set the height to the scrollHeight
            setComment(e.target.value)
        }
    };
  
    // TODO: Update if useEffect pulls anything
    const handleSubmit = async () => {
      try {
            const commentsRef = collection(db, 'comments');
            const commentID = uid(); // Generate a unique ID for the comment
    
            // Save the comment to Firestore
            await addDoc(commentsRef, {
                id: commentID,
                taskID: taskCtx?.taskID || '',
                comment: comment,
                timestamp: new Date(),
                promptID:props.promptID,
            });
    
            // Close the comment popup
            props.setShowCommentPopup(false);
      } catch (error) {
            console.error("Error saving comment:", error);
      }
    };
  
    
    return(
        <div className="flex flex-col bg-[#142838] py-12 px-16 h-fit rounded-xl">
            <textarea 
                ref = {textRef}
                className="bg-transparent overflow-hidden focus:outline-none text-white resize-none h-auto w-[21rem]" 
                placeholder="Type your comment"
                onChange={handleTextareaChange}
                >
            </textarea>
            <div className="flex flex-row justify-around mt-8">
                <button 
                    className="underline text-white"
                    onClick={()=> props.setShowCommentPopup(false)}>Cancel</button>
                <button 
                    className="bg-white px-6 py-2 rounded-2xl"
                    onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );

}

export default CommentPopUp;