import ai_profile from '../assets/chatbox/ai_profile.svg';

const SearchResultContainer = () => {
    const title = "Jude Victor William Bellingham | Borussia Dortmund";
    const url = "https://www.bundesliga.com/bundesliga/player/jude-bellingham";
    const description = "Jude Bellingham was born on 29 June 2003 in Stourbridge and plays for Borussia Dortmund. He played for Birmingham City FC from 2010-2020 and has played for ...";

    return (
        <div className="bg-white p-4">
            <div className="flex gap-2 items-center">
                <img src={ai_profile} alt="Profile" className="h-6 w-6" />
                <p className="text-sm text-gray-500 truncate">{title}</p>
            </div>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline visited:text-purple-600 text-lg font-medium">
                {url}
            </a>
            <p className="text-gray-900">{description}</p>
        </div>
    );
};

export default SearchResultContainer;
