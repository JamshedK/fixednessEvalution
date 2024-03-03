import { useContext, useState, useMemo } from "react";
import IntentionBox from "./IntentionBox";
import topologyJSON from "./../topology.json";
import IntentionTypeItem from "./IntentionTypeItem";
import ProgressBar from "@ramonak/react-progress-bar";
import Questions from "./Questions";
import DemographyQuestions from "./DemographyQuestions";

const DemographyMain = () => {
  const [selectedItem, setSelectedItem] = useState("demography");
  const [demographyResponses, setDemographyResponses] = useState({});

  const handleSelectItem = (itemId) => {
    setSelectedItem(itemId);
  };

  const handleDemographyResponsesChange = (responses) => {
    setDemographyResponses(responses);
  };

  return (
    <div className="flex flex-row bg-[#2F4454] items-center ">
      <div className="flex flex-col w-[30%] h-screen">
        <div className="bg-[#142838] h-screen text-[14px] pb-10 pt-10 sticky top-0">
          {/* Demography Questions */}
          <div>
            <IntentionTypeItem
              selectedItem={selectedItem}
              itemId={"demography"} // Create a unique ID for each item
              title={"Background Information"}
              onSelectItem={handleSelectItem}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center mr-16">
        {selectedItem === "demography" && (
          <DemographyQuestions
            onResponsesChange={handleDemographyResponsesChange}
          />
        )}
      </div>
    </div>
  );
};

export default DemographyMain;
