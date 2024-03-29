import ai_profile from "../assets/chatbox/ai_profile.svg";

const SingleResultContainer = ({ name, displayUrl, snippet, onClick }) => {
  return (
    <div className="p-4 bg-[#e3e3e3] text-black rounded-lg">
      <div className="flex gap-2 items-center">
        <img src={ai_profile} alt="Profile" className="h-6 w-6" />
        <a
          href={displayUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onClick(displayUrl)}
          className="text-black hover:text-black-300 hover:underline text-sm font-[14px]"
        >
          {displayUrl}
        </a>
      </div>
      <a
        href={displayUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onClick(displayUrl)}
        className="text-black hover:text-black-300 hover:underline text-md font-medium"
      >
        {name}
      </a>
      <p className="text-[14px]">{snippet}</p>
    </div>
  );
};

export default SingleResultContainer;
