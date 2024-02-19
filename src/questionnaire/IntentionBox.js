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
      <div className="text-white font-bold flex flex-col items-center text-[14px]">
        <label className="mb-2 text-center">{title}</label>
        {intentionList.map((intention, index) => (
          <IntentionTypeItem
            selectedItem={selectedItem}
            key={index}
            itemId={intention.short_text} // Create a unique ID for each item
            title={intention.short_text}
            onSelectItem={onSelectItem}
            ratings={ratings[intention.short_text]}
          />
        ))}
      </div>
    </div>
  );
};

export default IntentionBox;
