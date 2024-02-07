import star_icon from '../assets/common/star_icon.svg'
import star_filled_icon from '../assets/common/star_filled_icon.svg'
import more_icon from '../assets/chatbox/more_icon.svg'
import comment_icon from '../assets/chatbox/comment_icon.svg'
import CommentPopUp from './CommentPopUp';
import {useContext, useEffect, useState } from 'react';
import FavouritesContext from '../context/favorites-context';
import MoreActionsPopUp from './MoreActionsPopUp';
import RatePrompt from './RatePrompt';

const Prompt = (props) => {
    const favCtx = useContext(FavouritesContext)
    const [isStarred, setIsStarred] = useState(props.isStarred)
    const [showRatePrompt, setShowRatePrompt] = useState(false)
    const [showCommentPopup, setShowCommentPopup] = useState(false)
    const [showMoreActionsPopUp, setShowMoreActionsPopUp] = useState(false)
    const promptID = props.promptID
    const handleStarred = () => {
        if (isStarred){
            setIsStarred(false)
            favCtx.removeFavourite(props.promptID)
        }
        else{
            favCtx.saveFavourite(props.promptID, props.stringText, props.divKey)
            setIsStarred(true)
        }
    }
    return(
        <div className={"flex flex-row space-x-4 justify-center align-top p-4 pl-14 " + props.bgColor} >
            <div className='w-full xl:max-w-[55%] lg:max-w-[60%]'>
                <div className='inline-flex  w-full space-x-4 '>
                    <img className='w-9 h-9' src={props.profile_image}/>
                    <p className="text-white  w-full leading-7">{props.text}</p>
                </div>
            </div>
            <div className='flex-shrink-0 inline-flex space-x-4 pr-1 h-fit'>
                <button 
                    onClick={handleStarred}
                    title="Favourite the prompt"
                >
                    <img className='w-7' src={isStarred ? star_filled_icon : star_icon}/>
                </button>
                <button 
                    onClick={() => {
                        setShowCommentPopup((prevValue) => !prevValue)
                    }}
                    title='Comment'    
                >
                    <img className='w-6' src={comment_icon}/>
                </button>
                <button 
                    onClick={() => {
                            setShowMoreActionsPopUp(true) 
                    }}
                    title='More actions (Summarize, rate prompt)'
                >
                    <img className='w-6' src={more_icon}/>
                </button>
            </div>
            {props.role == 'assistant' && !props.ratingID && 
                <p className="absolute top-50% transform -translate-y-50% right-20 text-red-400 text-sm">Not rated. Click ... button</p>
            }
            {showCommentPopup && <div className='fixed top-0 left-0 w-screen h-screen flex items-center justify-center'>
                <CommentPopUp 
                    setShowCommentPopup={setShowCommentPopup}
                    promptID = {promptID}
                />
            </div>}
            {showMoreActionsPopUp && <div className='fixed top-0 left-0 w-screen h-screen flex items-center justify-center'>
                <MoreActionsPopUp 
                    setShowRatePrompt={setShowRatePrompt}
                    setShowMoreActionsPopUp={setShowMoreActionsPopUp}
                    promptID = {props.promptID}
                />
            </div>}
            {showRatePrompt && <div className='fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50'>
                <RatePrompt 
                    setIsPromptRated={props.setIsPromptRated}
                    setShowRatePrompt={setShowRatePrompt}
                    promptID = {props.promptID}
                />
            </div>}
        </div>
    );
}

export default Prompt;