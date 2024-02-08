import {useState, useContext} from 'react';
import { useRef, useEffect } from 'react';
import MsgEntry from './MsgEntry'
import Prompt from './prompt';

import { openai } from '../openai-config';
import user_profile from '../assets/chatbox/user_profile.svg'
import ai_profile from '../assets/chatbox/ai_profile.svg'
import { collection, query, orderBy, getDocs, where, addDoc } from 'firebase/firestore';
import AuthContext from '../context/auth-context';
import { db } from '../firebase-config';
import { uid } from 'uid';
import ReactMarkdown from 'react-markdown';
import hljs from 'highlight.js';

function ChatBox (){
    const [prompt, setPrompt] = useState('')
    const [response, setResponse] = useState('')
    const [promptID, setPromptID] = useState('')
    const [responseID, setResponseID] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [promptResponseArray, setPromptResponseArray] = useState([])
    const authCtx = useContext(AuthContext)

    // gpt related states
    const [promptSuggestions, setPromptSuggestions] = useState([])
    const [questionsSuggestions, setQuestionsSuggestions] = useState([])

    const bgObj = {"user": "bg-[#3c586e]",
                    "ai": "bg-[#2f4454]"}
                
    // to handle automatic scrolling to the end
    useEffect(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
    }, [promptResponseArray]);

    const getAPIResponse = async (array, promptID) => {  
        try {
            setIsLoading(true)
            // Filter out the IDs from the array
            const filteredMessages = array.map((message) => {
                const { role, content } = message;
                return { role, content };
            });
            const typingStartTime = new Date()
            const completion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: filteredMessages,
                });
            const message = completion.data.choices[0].message
            const typingEndTime = new Date()
            const tempResponseID = uid()
            setResponseID(tempResponseID)
            array.push({...message, id: tempResponseID});
            setPromptResponseArray([...array])
            // Save the response to Firestore database
            await saveResponseToFirestore(message, promptID, tempResponseID, typingStartTime, typingEndTime);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setIsLoading(false)
    }

    const saveResponseToFirestore = async (message, promptID, tempResponseID, typingStartTime, typingEndTime) => {
        try {
            const promptRef = collection(db, 'chatsIndividual');
            await addDoc(promptRef, {
                id: tempResponseID,
                ratingID: null,
                prompt: message.content,
                responseTo: promptID,
                userID: authCtx?.user.uid || '',
                role: 'assistant',
                typingStartTime, 
                typingEndTime,
            });
        } catch (error) {
            console.error("Error saving prompt:", error);
        }
      };
    

    const renderers = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match && match[1] ? match[1] : "";
            
            const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
            const highlighted = hljs.highlight(validLanguage, children[0]).value;

            if (inline) {
                return <code className={className} {...props} dangerouslySetInnerHTML={{ __html: highlighted }} />;
            }
            return <pre className={className} {...props}><code dangerouslySetInnerHTML={{ __html: highlighted }} /></pre>;
        }
    };


    // Create an array of message components
    const messageComponents = promptResponseArray.map((message, index) => {
        
        return (
            <div key={`message-${index}`}>
                {message.role === 'user' ? (
                    <Prompt
                        divKey={`message-${index}`}
                        role='user'
                        promptID = {message.id}
                        text={message.content}
                        stringText={message.content}
                        bgColor={bgObj.user}
                        profile_image={user_profile}
                    />
                ) : (
                    <Prompt
                        divKey={`message-${index}`}
                        promptID = {message.id}
                        role='assistant'
                        ratingID={message?.ratingID}
                        stringText={message.content}
                        text=<ReactMarkdown components={renderers} children={message.content} />
                        bgColor={bgObj.ai}
                        profile_image={ai_profile}
                    />
                )}
                </div>
            )
    });

    return(
        <div className="bg-[#2f4454] flex w-full h-full justify-center flex-col" >         
            <div className='w-full mb-56'>
                {messageComponents}
                {isLoading && <Prompt text='Loading...' bgColor={bgObj.ai} profile_image={ai_profile} />}
            </div>
            <div className='fixed bottom-0 mb-8 w-[50%] flex flex-col left-[60%] transform -translate-x-1/2 '>
                <MsgEntry 
                    setPromptID = {setPromptID}
                    responseID = {responseID}
                    setPromptResponseArray={setPromptResponseArray} 
                    promptResponseArray={promptResponseArray}
                    setPrompt={setPrompt} 
                    getAPIResponse={getAPIResponse}/>
            </div>
        </div>
    );

    
}

export default ChatBox;