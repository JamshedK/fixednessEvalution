import IntentionTypeItem from "./IntentionTypeItem";

const IntentionBox = ({
  title,
  intentionList,
  onSelectItem,
  ratings,
  selectedItem,
}) => {
  return (
    <div>
      <div className="text-black font-medium flex flex-col items-center text-[14px] bg-white">
        <label className="mb-2 text-center text-gray-600 font-bold">{title}</label>
        {intentionList.map((intention, index) => (
          <IntentionTypeItem
            selectedItem={selectedItem}
            key={index}
            itemId={`${
              intention.short_text
            } - ${intention.long_text.toLowerCase()}`} // Create a unique ID for each item
            title={intention.short_text}
            onSelectItem={onSelectItem}
            ratings={
              ratings[
                `${intention.short_text} - ${intention.long_text.toLowerCase()}`
              ]
            }
          />
        ))}
      </div>
    </div>
  );
};

export default IntentionBox;
