import edit_icon from "../assets/navbar/edit_icon.svg"
import star_filled from "../assets/navbar/star_filled.svg"
import tick_icon from "../assets/navbar/tick_icon.svg"

import { useState, useRef, useContext } from "react";
import { collection, query, orderBy, getDocs, where, addDoc } from 'firebase/firestore';
import { db } from "../firebase-config";
import TaskContext from "../context/task-context";
import FavouritesContext from "../context/favorites-context";
//TODO: Add scrolling when a favourites is clicked
const Navbar = (props) => {
    const taskCtx = useContext(TaskContext)
    const [isTaskNameEditable, setIsTaskNameEditable ] = useState(false)
    const [taskName, setTaskName] = useState(taskCtx.taskName || 'Task name');
    const taskNameLabelRef = useRef()
    const favCtx = useContext(FavouritesContext)

    const changeTaskName = (e) => {
        setTaskName(taskNameLabelRef.current.textContent)
        setIsTaskNameEditable(false)
    }

    const canEndTask = async () => {
        // get the chat history
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
            for (const chatObj of chatHistory){
                console.log(chatObj)
                if (chatObj.role == 'assistant' && chatObj.ratingID === null ){
                    console.log('here')
                    return false
                }
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
        return true
    }

    const handleEndTask = async () => {
        // Check if all the outputs are rated
        if (await canEndTask()){

            // Confirm is the user actually wants to save
            const shouldProceed = window.confirm('Are you sure you want to finish the task?');
            if(shouldProceed){
                props.setShowPostTaskQuestionnaire(true)
            }
        }else{
            window.confirm('Please annotate (rate) all the prompts marked with red by clicking the three dots and "Rate response" button')
        }

    }
    var favouritesComp = null;
    if (favCtx.favourites){
        favouritesComp = favCtx.favourites.map((doc, i)=> {
            return (
                <div key={'div-' + i} 
                    value={doc.divKey}
                    className="flex flex-col bg-[#2F4454] rounded-md px-4 py-2 text-[15px] max-h-[4.5rem] overflow-hidden leading-7 cursor-pointer"
                >
                        <label className="cursor-pointer" value={doc.divKey}>{doc.text}</label>
                </div>
            )
        })
    }


    return(
        <div className="bg-[#142838] w-80 h-screen sticky flex top-0 flex-col text-[18px] pb-10 pt-10 justify-between" >
            <div className="pl-8 text-white">
                <label className ='' >Current task</label>
                <div className="flex flex-col mt-4">
                    {!taskCtx.taskID && 
                        <label
                            className="text-red-500 py-1 pr-1">No task started. Your interactions will not be saved properly. Please start a task</label>}
                    {taskCtx.taskID && <div className="flex flex-row justify-between rounded-md bg-[#2F4454] mr-9 px-4 py-1">
                        <label className="w-[12rem] outline-none" contentEditable={isTaskNameEditable} ref={taskNameLabelRef}>{taskName}</label>
                        {isTaskNameEditable && 
                            <button onClick={changeTaskName}>
                            <img src={tick_icon}/>
                            </button>}
                        {!isTaskNameEditable && <button onClick={()=> setIsTaskNameEditable(true)}>
                            <img src={edit_icon}/>
                        </button>}
                    </div>}
                    <div className="mt-3">
                        <button 
                            onClick={()=>props.setShowQuestionnaire(true)}
                            className="rounded-md px-4 py-1 bg-[#D9D9D9] text-[#142838]">Start Task
                        </button>
                    </div>
                    <div className="flex space-x-3 w-fit mt-16">
                        <img src={star_filled}/>
                        <label className="">Favourites</label>
                    </div>
                    <div className="flex flex-col w-fit mr-8 space-y-2 mt-3 ml-7">
                        {favouritesComp}
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <button 
                    className="rounded-md border-2 px-8 py-2 border-[#2F4454] text-white"
                    onClick={handleEndTask}>End task
                </button>
            </div>
        </div>
    );
}

export default Navbar;