import checkbox_icon from "./../assets/common/checkbox.svg";
import show_more_icon from "./../assets/common/show_more.svg";
import circle_icon from "./../assets/common/circle_icon.svg";

const IntentionTypeItem = ({ title, completed }) => {
  return (
    <div
      className="flex items-center justify-between p-4 bg-[#2F4454] text-white w-full 
            border-b-[1px] border-[#142838] text-[14px] hover:cursor-pointer"
    >
      <span className="text-green-600">
        {completed && (
          <img
            src={checkbox_icon}
            alt="Completed"
            className="h-5 w-5 text-green-600"
          />
        )}
        {!completed && (
          <img
            src={circle_icon}
            alt="Completed"
            className="h-5 w-5 text-green-600"
          />
        )}{" "}
      </span>
      <span className={`${completed ? "" : "ml-4"} w-full px-4`}>{title}</span>
      <span>
        <button>
          <img
            src={show_more_icon}
            alt="Completed"
            className="h-5 w-5 text-green-600"
          />
        </button>
      </span>
    </div>
  );
};

export default IntentionTypeItem;
