const InstructionsPopUp = (props) => {
  return (
    <div className="flex flex-col items-center justify-center bg-[#e3e3e3] py-12 px-16 h-fit rounded-xl max-w-lg mx-auto">
      <div className="text-black text-lg ">
        <span className="font-bold">Instructions </span>
        <span>{"("}</span>
        <span className="text-md text-red-500">read carefully!</span>
        <span>{")"}</span>
      </div>
      <p className="text-black mb-8">{props.instructionText}</p>
      <div className="flex space-x-4">
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
