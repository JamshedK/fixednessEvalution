import ai_profile from "../assets/chatbox/ai_profile.svg";

const SingleResultContainer = ({ name, displayUrl, snippet, onClick }) => {
  return (
    <div className="p-4 bg-[#293A47] text-white rounded-lg">
      <div className="flex gap-2 items-center">
        <img src={ai_profile} alt="Profile" className="h-6 w-6" />
        <p className="text-sm truncate">{name}</p>
      </div>
      <a
        href={displayUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onClick(displayUrl)}
        className="text-blue-200 hover:text-blue-300 hover:underline visited:text-purple-600 text-lg font-medium"
      >
        {displayUrl}
      </a>
      <p>{snippet}</p>
    </div>
  );
};

export default SingleResultContainer;
