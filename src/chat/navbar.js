import edit_icon from "../assets/navbar/edit_icon.svg"
import star_filled from "../assets/navbar/star_filled.svg"
import tick_icon from "../assets/navbar/tick_icon.svg"

import { useState, useRef, useContext } from "react";
import { collection, query, orderBy, getDocs, where, addDoc } from 'firebase/firestore';
import { db } from "../firebase-config";
import TaskContext from "../context/task-context";


const Navbar = (props) => {
    const taskCtx = useContext(TaskContext)
    return(
        <div className="bg-[#142838] w-[25%] h-screen sticky flex top-0 flex-col text-[18px] pb-10 pt-10 justify-start space-y-5" >
            <div className="pl-8 text-white font-bold underline">
                <label className ='' >Current task</label>
            </div>
            <div className="bg-[#2F4454] h-fit rounded-xl mx-5 px-6 py-4 w-80 text-md text-white">
                <label className ='' >{taskCtx.LLMTask?.taskContent}</label>
            </div>
        </div>
    );
}

export default Navbar;