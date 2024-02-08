import edit_icon from "../assets/navbar/edit_icon.svg"
import star_filled from "../assets/navbar/star_filled.svg"
import tick_icon from "../assets/navbar/tick_icon.svg"

import { useState, useRef, useContext } from "react";
import { collection, query, orderBy, getDocs, where, addDoc } from 'firebase/firestore';
import { db } from "../firebase-config";

const Navbar = (props) => {

    return(
        <div className="bg-[#142838] w-80 h-screen sticky flex top-0 flex-col text-[18px] pb-10 pt-10 justify-between" >
            <div className="pl-8 text-white">
                <label className ='' >Current task</label>
            </div>
        </div>
    );
}

export default Navbar;