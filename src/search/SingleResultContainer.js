import ai_profile from "../assets/chatbox/ai_profile.svg";

const SingleResultContainer = ({ displayUrl, name, snippet, favicon, onClick }) => {
  return (
    <div 
      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        {/* Favicon */}
        <img 
          src={favicon} 
          alt="Site icon"
          className="w-4 h-4 mt-1 flex-shrink-0"
        />
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* URL */}
          <p className="text-sm text-green-600 truncate">{displayUrl}</p>
          
          {/* Title */}
          <h3 className="text-lg font-medium text-blue-600 hover:underline line-clamp-2">
            {name}
          </h3>
          
          {/* Snippet */}
          <p className="text-sm text-gray-600 mt-1 line-clamp-3">
            {snippet}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SingleResultContainer;
