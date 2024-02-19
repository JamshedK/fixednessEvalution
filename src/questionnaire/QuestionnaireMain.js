import { useContext, useState, useMemo } from "react";
import IntentionBox from "./IntentionBox";
import topologyJSON from "./../topology.json";
import IntentionTypeItem from "./IntentionTypeItem";
import ProgressBar from "@ramonak/react-progress-bar";
import Questions from "./Questions";

const QuestionnnaireMain = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [ratings, setRatings] = useState({});

  const handleSelectItem = (itemId) => {
    setSelectedItem(itemId);
  };

  const handleRatingsChange = (
    itemId,
    expectationRating,
    usageFrequencyRating
  ) => {
    console.log(
      `Item ID: ${itemId}\nExpectation Rating: ${expectationRating}\nUsage Frequency Rating: ${usageFrequencyRating} \n`
    );
    console.log(ratings);
    setRatings((prevRatings) => ({
      ...prevRatings,
      [itemId]: { expectationRating, usageFrequencyRating },
    }));
  };

  // Calculate the progress percentage
  const progressPercentage = useMemo(() => {
    const totalItems = topologyJSON.reduce(
      (acc, curr) => acc + curr.intention_list.length,
      0
    );
    const completedItems = Object.values(ratings).filter(
      (rating) =>
        rating.expectationRating !== undefined &&
        rating.usageFrequencyRating !== undefined
    ).length;
    return (completedItems / totalItems) * 100;
  }, [ratings]);

  return (
    <div className="flex flex-row bg-[#2F4454] items-center">
      <div className="flex flex-col w-[30%] h-screen">
        <div
          className="bg-[#142838]  max-h-screen overflow-y-auto scrollbar 
                scrollbar-thumb-[#ffffff] scrollbar-thumb-rounded-full text-[14px] 
                pb-10 pt-10 sticky top-0"
        >
          {topologyJSON.map((item, index) => (
            <IntentionBox
              selectedItem={selectedItem}
              key={index}
              title={item.intention_type}
              intentionList={item.intention_list}
              onSelectItem={handleSelectItem}
              ratings={ratings}
            />
          ))}
        </div>
        <div className="text-white p-4 bg-[#142838] flex flex-col space-y-2">
          <label>Progress</label>
          <ProgressBar completed={Number(progressPercentage.toFixed(0))} />
        </div>
      </div>
      <div className="w-full flex justify-center mr-16">
        {selectedItem && (
          <Questions
            itemId={selectedItem}
            ratings={ratings[selectedItem]}
            onRatingsChange={handleRatingsChange}
          />
        )}
      </div>
    </div>
  );
};

export default QuestionnnaireMain;
