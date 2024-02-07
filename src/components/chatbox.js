import {useState, useContext} from 'react';
import { useRef, useEffect } from 'react';
import MsgEntry from './MsgEntry'
import Prompt from './prompt';

import { openai } from '../openai-config';
import user_profile from '../assets/chatbox/user_profile.svg'
import ai_profile from '../assets/chatbox/ai_profile.svg'
import CommentPopUp from './CommentPopUp';
import { collection, query, orderBy, getDocs, where, addDoc } from 'firebase/firestore';
import TaskContext from '../context/task-context';
import AuthContext from '../context/auth-context';
import { db } from '../firebase-config';
import { uid } from 'uid';
import FavouritesContext from '../context/favorites-context';
import QueContext from '../context/que-context';
import ReactMarkdown from 'react-markdown';
import hljs from 'highlight.js';

function ChatBox (){
    const [showCommentPopup, setShowCommentPopup] = useState(false)
    const [showMoreActionsPopUp, setShowMoreActionsPopUp] = useState(false)
    const [isPromptRated, setIsPromptRated] = useState(null) // to force a rerender of useEffect to see if a prompt has been rated
    const [prompt, setPrompt] = useState('')
    const [response, setResponse] = useState('')
    const [promptID, setPromptID] = useState('')
    const [responseID, setResponseID] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [promptResponseArray, setPromptResponseArray] = useState([])
    const [msgEntryText, setMsgEntryText] = useState() // for handling whenever the user clicked the question or prompt suggestions
    const taskCtx = useContext(TaskContext)
    const authCtx = useContext(AuthContext)
    const favCtx = useContext(FavouritesContext)
    const queCtx = useContext(QueContext)

    // gpt related states
    const [promptSuggestions, setPromptSuggestions] = useState([])
    const [questionsSuggestions, setQuestionsSuggestions] = useState([])

    const bgObj = {"user": "bg-[#3c586e]",
                    "ai": "bg-[#2f4454]"}
    
    const getPromptSuggestions = async (promptResponseArray) => {
        if (response !== '' || promptResponseArray.length >=2 ){
            try{
                const arrLength = promptResponseArray.length
                const {taskTopic, taskType, topicFamiliaritySpecificOptions, topicFamiliaritySpecificSelectedOption,expectedComplexitySpecificOptions, expectedComplexitySpecificSelectedOption, expectedSpendingTime, expectedOutcome,} = queCtx.formData
                const messages = [
                        {
                            "role": "system",
                            "content": `You are a teacher help the user ${taskType +' about '+ taskTopic}. The user has a familiarity degree of (${topicFamiliaritySpecificSelectedOption + 1} out of 5), stating ${topicFamiliaritySpecificOptions[topicFamiliaritySpecificSelectedOption]}".  The user think the complexity of this task (${expectedComplexitySpecificSelectedOption + 1} out of 5), ${expectedComplexitySpecificOptions[expectedComplexitySpecificSelectedOption]}. The user expects to spend ${expectedSpendingTime} to ${expectedOutcome}. Given the familiarity level, complexity level, and user expectations, adjust your answers so that the user can understand better.`
                        },
                    ];
                const filteredPromptResponseArray = promptResponseArray.map(({ id, ratingID, ...rest }) => rest);

                // Push the second-to-last element without the 'id' property
                messages.push(filteredPromptResponseArray[arrLength - 2]);
                
                // Push the last element without the 'id' property
                messages.push(filteredPromptResponseArray[arrLength - 1]);
                messages.push({
                    "role": "user",
                    "content": "Please generate five follow up questions related to this task and topic that the user is most likely to ask. You need to consider the probability of whether the user may ask each question and arrange the questions from the highest probability to the lowest. You output must be as a json array of just the questions"
                    
                })
                const response = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: messages,
                    max_tokens: 256,
                });
            
                const res = JSON.parse(response.data.choices[0].message.content);
                setPromptSuggestions(res)
                } catch(e){
                    console.log(e)
                }
        }
    }
    // to get prompt suggestions and question suggestions
    useEffect(() => {
        const getQuestionSuggestions = async (formData) => {
            try{
                const {
                    taskTopic,
                    taskType,
                    topicFamiliaritySpecificOptions,
                    topicFamiliaritySpecificSelectedOption,
                    expectedComplexitySpecificOptions,
                    expectedComplexitySpecificSelectedOption,
                    expectedSpendingTime,
                    expectedOutcome,
                } = formData
        
                const messages = [
                        {
                            "role": "system",
                            "content": `You are a teacher help the user ${taskType +' about '+ taskTopic}. The user has a familiarity degree of (${topicFamiliaritySpecificSelectedOption + 1} out of 5), stating ${topicFamiliaritySpecificOptions[topicFamiliaritySpecificSelectedOption]}".  The user think the complexity of this task (${expectedComplexitySpecificSelectedOption + 1} out of 5), ${expectedComplexitySpecificOptions[expectedComplexitySpecificSelectedOption]}. The user expects to spend ${expectedSpendingTime} to ${expectedOutcome}. Given the familiarity level, complexity level, and user expectations, adjust your answers so that the user can understand better.`
                        },
                        {
                            "role": "user",
                            "content": "Please generate five questions related to this task and topic that the user is most likely to ask. You need to consider the probability of whether the user may ask each question and arrange the questions from the highest probability to the lowest. You output must be as a json array of just the questions"
                        },
                    ];
            
                const response = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: messages,
                    max_tokens: 256,
                });
            
                const res = JSON.parse(response.data.choices[0].message.content);
                setQuestionsSuggestions(res)
                } catch(e){
                    console.log(e)
                }
        }
        if (queCtx.formData !== null) {
            getQuestionSuggestions(queCtx.formData);
            getPromptSuggestions(promptResponseArray)
        }
    }, [queCtx.formData?.taskTopic]);                      

    // to handle automatic scrolling to the end
    useEffect(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
    }, [promptResponseArray]);
    
    // To get the chat history
    useEffect(() => {
        const fetchChatHistory = async () => {
            if (taskCtx.taskID){
                try {
                    const chatsRef = collection(db, 'chatsIndividual');
            
                    // Add a where clause to filter by taskID
                    const q = query(
                        chatsRef,
                        where('taskID', '==', taskCtx?.taskID),
                        orderBy('typingEndTime', 'asc')
                    );
            
                    const querySnapshot = await getDocs(q);
                    const chatHistory = [];
                    
                    querySnapshot.forEach((doc) => {
                        const { role, prompt, id, ratingID} = doc.data();
                        chatHistory.push({ role, content: prompt, id, ratingID });
                    });
                    setPromptResponseArray(chatHistory);
                } catch (error) {
                    console.error('Error fetching chat history:', error);
                }
            }
            };
        fetchChatHistory();
      }, [taskCtx?.taskID, isPromptRated]);

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
            getPromptSuggestions(array)
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
                taskID: taskCtx?.taskID || '',
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
    
    const handleQuestionClicked = (value) => {
        setMsgEntryText(value)
    }
    var questionSuggestionsComp = null
    var promptSuggestionsComp = null
    if (questionsSuggestions.length > 0){
        questionSuggestionsComp = questionsSuggestions.map((question, index) => {
            return (
                <div
                    value={question} 
                    key={'q-div-' + index} 
                    className='bg-[#D9D9D9] px-2 py-2 rounded-md cursor-pointer text-[11px] max-w-[223px] text-[#142838]' 
                    onClick={() => handleQuestionClicked(question)}
                  >
                    <p>{question}</p>
                </div>
            )
        })
    }
    if (promptSuggestions.length > 0){
        promptSuggestionsComp = promptSuggestions.map((question, index) => {
            return (
                <div
                    value={question} 
                    key={'q-div-' + index} 
                    className='bg-[#D9D9D9] px-2 py-2 rounded-md cursor-pointer text-[11px] max-w-[223px] text-[#142838]' 
                    onClick={() => handleQuestionClicked(question)}
                  >
                    <p>{question}</p>
                </div>
            )
        })
    }


    // const renderers = {
    //     code: ({ language, value }) => {
    //         return <code>{value}</code>;
    //     }
    // };

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
        var isStarred = false
        if (favCtx.favourites && favCtx.favourites.find(e => e.promptID == message.id)){
            isStarred =true
        }
        return (
            <div key={`message-${index}`}>
                {message.role === 'user' ? (
                    <Prompt
                        divKey={`message-${index}`}
                        role='user'
                        promptID = {message.id}
                        setIsPromptRated={setIsPromptRated}
                        text={message.content}
                        stringText={message.content}
                        showCommentPopup={showCommentPopup}
                        setShowCommentPopup={setShowCommentPopup}
                        showMoreActionsPopUp={showMoreActionsPopUp}
                        setShowMoreActionsPopUp={setShowMoreActionsPopUp}
                        bgColor={bgObj.user}
                        profile_image={user_profile}
                        isStarred={isStarred}
                    />
                ) : (
                    <Prompt
                        divKey={`message-${index}`}
                        promptID = {message.id}
                        setIsPromptRated={setIsPromptRated}
                        role='assistant'
                        ratingID={message?.ratingID}
                        showCommentPopup={showCommentPopup}
                        setShowCommentPopup={setShowCommentPopup}
                        showMoreActionsPopUp={showMoreActionsPopUp}
                        setShowMoreActionsPopUp={setShowMoreActionsPopUp}
                        stringText={message.content}
                        text=<ReactMarkdown components={renderers} children={message.content} />
                        bgColor={bgObj.ai}
                        profile_image={ai_profile}
                        isStarred={isStarred}
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
            {questionsSuggestions.length > 0 && <div className="fixed bottom-[170px] flex flex-row space-x-4 w-fit max-w-[75%] ml-4">
                <h1 className='text-[#D9D9D9]'>Questions</h1>
                {questionSuggestionsComp}
            </div>}
            {promptSuggestions.length > 0 && <div className="fixed bottom-[100px] flex flex-row space-x-4 w-fit max-w-[75%] ml-4 mt-4">
                <h1 className='text-[#D9D9D9]'>Prompts</h1>
                {promptSuggestionsComp}
            </div>}
            <div className='fixed bottom-0 mb-8 w-[50%] flex flex-col left-[60%] transform -translate-x-1/2 '>
                <MsgEntry 
                    msgEntryText={msgEntryText}
                    setPromptSuggestions={setPromptSuggestions}
                    setMsgEntryText={setMsgEntryText}
                    setPromptID = {setPromptID}
                    responseID = {responseID}
                    setPromptResponseArray={setPromptResponseArray} promptResponseArray={promptResponseArray}
                    setPrompt={setPrompt} getAPIResponse={getAPIResponse}/>
            </div>
        </div>
    );

    
}

export default ChatBox;