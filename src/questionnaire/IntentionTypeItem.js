import checkbox_icon from "./../assets/common/checkbox.svg";
import show_more_icon from "./../assets/common/show_more.svg";
import circle_icon from "./../assets/common/circle_icon.svg";

const IntentionTypeItem = ({
  itemId,
  title,
  onSelectItem,
  ratings,
  selectedItem,
}) => {
  const isSelected = selectedItem === itemId;
  const completed =
    ratings?.expectationRating !== undefined &&
    ratings?.usageFrequencyRating !== undefined;

  const itemStyles = isSelected
    ? "bg-[#3F5765] border-l-4 border-[#76B041]"
    : "bg-[#2F4454]";

  return (
    <div
      className={`flex items-center justify-between p-4 ${itemStyles} text-white w-full border-b-[1px] border-[#142838] text-[14px] hover:cursor-pointer`}
      onClick={() => {
        // console.log(`${itemId} selected`);
        onSelectItem(itemId);
      }}
    >
      <span className="text-green-600">
        {completed ? (
          <img
            src={checkbox_icon}
            alt="Completed"
            className="h-5 w-5 text-green-600"
          />
        ) : (
          <img
            src={circle_icon}
            alt="Not Completed"
            className="h-5 w-5 text-green-600"
          />
        )}
      </span>
      <span className={`${completed ? "font-bold" : "ml-4"} w-full px-4`}>
        {title}
      </span>
      <span>
        <button>
          <img
            src={show_more_icon}
            alt="Show More"
            className="h-5 w-5 text-green-600"
          />
        </button>
      </span>
    </div>
  );
};

export default IntentionTypeItem;
