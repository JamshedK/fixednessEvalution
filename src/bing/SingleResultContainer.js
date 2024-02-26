import ai_profile from "../assets/chatbox/ai_profile.svg";

const SingleResultContainer = (props) => {
  return (
    <div className="p-4 bg-[#293A47] text-white rounded-lg">
      <div className="flex gap-2 items-center">
        <img src={ai_profile} alt="Profile" className="h-6 w-6" />
        <p className="text-sm  truncate">{props.name}</p>
      </div>
      <a
        href={props.displayUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-200 hover:text-blue-300 hover:underline visited:text-purple-600 text-lg font-medium"
      >
        {props.displayUrl}
      </a>
      <p className="">{props.snippet}</p>
    </div>
  );
};

export default SingleResultContainer;
