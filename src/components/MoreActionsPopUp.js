const MoreActionsPopUp = (props) => {
    const handleRateResponseClick = () => {
        props.setShowMoreActionsPopUp(false)
        props.setShowRatePrompt(true)
    }
    return(
        <div className="flex flex-col bg-[#142838] py-12 px-16 h-fit rounded-xl">
            <div className="flex flex-col space-y-2">
                <button 
                    onClick={handleRateResponseClick}
                    className="bg-white px-6 py-2 rounded-2xl"
                    >
                    Rate the response
                </button>
                <button 
                    className="bg-white px-6 py-2 rounded-2xl"
                    >
                    Explain the prompt (short)
                </button>
                <button 
                    className="bg-white px-6 py-2 rounded-2xl"
                    >
                    Explain the prompt (detailed)
                </button>
            </div>
            <div className="flex flex-row justify-around mt-8">
                <button 
                    className="underline text-white"
                    onClick={()=> props.setShowMoreActionsPopUp(false)}
                    >
                    Cancel
                </button>
            </div>
        </div>
    );
}
export default MoreActionsPopUp;
