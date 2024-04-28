const InstructionsPopUp = (props) => {
  // if url contains /search or /chat, then it's a task
  const isTask =
    window.location.pathname.includes("/search") ||
    window.location.pathname.includes("/chat");

  return (
    <div className="flex flex-col items-center justify-center bg-[#e3e3e3] py-12 px-16 h-fit rounded-xl max-w-lg mx-auto">
      <div className="text-black text-lg ">
        <span className="font-bold">Instructions </span>
        <span>{"("}</span>
        <span className="text-md text-red-500">read carefully!</span>
        <span>{")"}</span>
      </div>
      <p className="text-black mb-4">{props.instructionText}</p>
      {isTask && (
        <p className="font-bold">
          We will evaluate participants’ performance based on the quality and
          comprehensiveness of the submitted responses (on the right)
        </p>
      )}
      <div className="flex space-x-4 mt-4">
        <button
          className="bg-white text-black px-6 py-2 rounded-lg"
          onClick={() => props.setShowInstructions(false)}
        >
          Okay
        </button>
      </div>
    </div>
  );
};

export default InstructionsPopUp;
