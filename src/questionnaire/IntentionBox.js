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
        <label className="mb-2 text-center text-gray-600 font-bold">
          {title}
        </label>
        {intentionList.map((intention, index) => {
          // Construct the itemId conditionally based on attentionCheck
          let itemId = `${
            intention.short_text
          } - ${intention.long_text.toLowerCase()}`;
          return (
            <IntentionTypeItem
              selectedItem={selectedItem}
              key={index} // Note: Using index as a key is not recommended if the list can change
              itemId={itemId} // Use the conditionally modified itemId here
              title={intention.short_text}
              onSelectItem={onSelectItem}
              ratings={ratings[itemId]} // Access ratings using the modified itemId
            />
          );
        })}
      </div>
    </div>
  );
};

export default IntentionBox;
