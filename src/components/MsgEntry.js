import {useState, useRef, useContext} from 'react';
import send_message_icon from "../assets/msg_entry/send_message_icon.svg"
import microphone_icon from "../assets/msg_entry/microphone_icon.svg"
import TaskContext from '../context/task-context';
import AuthContext from '../context/auth-context';
import { db } from '../firebase-config';
import { addDoc, collection } from 'firebase/firestore';
import { uid } from 'uid';

const MsgEntry = (props) => {
     
    const [prompt, setPrompt] = useState(null);
    const [typingStartTime, setTypingStartTime] = useState(null); // Timestamp for when user starts typing

    const textRef = useRef();  
    const taskCtx = useContext(TaskContext)
    const authCtx = useContext(AuthContext)

    const handleTextareaChange = () => {
        if (textRef.current) {
            textRef.current.style.height = '7px'; // Reset the height 7px
            textRef.current.style.height = `${textRef.current.scrollHeight}px`; // Set the height to the scrollHeight
            if (!typingStartTime) {
                setTypingStartTime(new Date()); // Record the typing start time
            }
        }
    };

    if(props.msgEntryText){
        textRef.current.value = props.msgEntryText
    }

    const sendPrompt = async (e) => {
        const newMessage = textRef.current.value
        props.setMsgEntryText('')
        if (newMessage.trim() != ''){
            // Save the prompt to Firestore database
            try {
                const promptRef = collection(db, 'chatsIndividual');
                const promptID = uid()
                props.setPromptID(promptID)
                const docRef = await addDoc(promptRef, {
                        id: promptID,
                        ratingID: null,
                        taskID: taskCtx?.taskID || '',
                        responseTo: props.responseID,
                        prompt: newMessage,
                        userID: authCtx?.user.uid || '', 
                        role: 'user',
                        typingStartTime,
                        typingEndTime: new Date(),
                    });
                props.setPrompt(newMessage)
                const updatedMessagesArray = [...props.promptResponseArray, {role: "user", content: newMessage, id: promptID}];
                // get the response from API
                props.setPromptResponseArray(updatedMessagesArray);
                textRef.current.value = '';
                handleTextareaChange()
                // get API response
                await props.getAPIResponse(updatedMessagesArray, promptID);
                window.scrollTo(0, document.documentElement.scrollHeight);
            } catch (error) {
                console.error("Error saving prompt:", error);
            }
        setTypingStartTime(null); // Reset typing start time when message is sent
        }
    }

    return(
        <div className="flex flex-row space-x-6" >
            <div className='rounded-3xl bg-[#3c586e] px-8 py-3 min-h-11 flex flex-grow'>
                <textarea className="bg-transparent focus:outline-none h-7 text-white resize-none w-full" 
                        ref={textRef}
                        placeholder="Type a prompt... "
                        onKeyDown={(event) => {
                            if (event.keyCode === 13) {
                                sendPrompt();
                            }
                        }}
                        onChange={handleTextareaChange}>
                    </textarea>
                    <button
                        title='Microphone recording'
                    >
                        <img src={microphone_icon}/>
                    </button>
            </div>
            <button 
                onClick={sendPrompt}
                title='Send prompt'
            >
                <img src={send_message_icon}/>
            </button>

        </div>
    );
}

export default MsgEntry;