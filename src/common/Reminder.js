const Reminder = (props) => {
  return (
    <div className="flex flex-col items-center justify-center bg-[#e3e3e3] py-12 px-16 h-fit rounded-xl max-w-lg mx-auto">
      <div className="text-black text-lg ">
        <span className="font-bold">Reminder! </span>
      </div>
      <div>
        <p className="text-black mb-4 mt-4">
          Data quality is important for this study.
        </p>
        <p className="text-black mb-4 text-bold">
          We check the quality of your prompts and your response to the task.
        </p>
      </div>
      <div className="flex space-x-4 mt-4">
        <button
          className="bg-white text-black px-6 py-2 rounded-lg"
          onClick={() => props.setShowReminder(false)}
        >
          Okay
        </button>
      </div>
    </div>
  );
};

export default Reminder;
