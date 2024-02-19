import IntentionTypeItem from "./IntentionTypeItem";

const IntentionTypeBox = ({ key, title, intentionList }) => {
  return (
    <div>
      <div className="text-white font-bold flex flex-col items-center text-[14px]">
        <label className="mb-2 text-center">{title}</label>
        {intentionList.map((intention, index) => (
          <IntentionTypeItem
            key={index}
            title={intention.short_text}
            completed={false}
          />
        ))}
      </div>
    </div>
  );
};

export default IntentionTypeBox;
