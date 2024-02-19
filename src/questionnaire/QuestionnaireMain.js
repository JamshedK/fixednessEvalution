import { useContext, useState } from "react";
import IntentionBox from "./IntentionBox";
import topologyJSON from "./../topology.json";
import IntentionTypeItem from "./IntentionTypeItem";
import ProgressBar from "@ramonak/react-progress-bar";
import Questions from "./Questions";

const QuestionnnaireMain = () => {
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
              key={index}
              title={item.intention_type}
              intentionList={item.intention_list}
            />
          ))}
        </div>
        <div className="text-white p-4 bg-[#142838] flex flex-col space-y-2">
          <label>Progress</label>
          <ProgressBar completed={60} />{" "}
        </div>
      </div>
      <div className="w-full flex justify-center mr-16">{<Questions />}</div>
    </div>
  );
};

export default QuestionnnaireMain;
