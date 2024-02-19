import { useState } from "react";

const Questions = () => {
  const expectationList = [
    "ChatGPT can always fully fulfill the intention",
    "ChatGPT may be able to fully fulfill the intention if/once an effective query/prompt is successfully formulated (e.g. after several rounds of query/prompt modifications).",
    "ChatGPT may be able to partially fulfill the intention if/once an effective query/prompt is successfully formulated.",
    "ChatGPT is unlikely to fulfill this intention at all.",
  ];

  const usageFrequency = [
    "Never or Rarely Used: less than once a month",
    "Infrequently Used: about once a month",
    "Moderately Used: engage with the system on a weekly basis",
    "Frequently Used: use the system several times a week",
    "Heavily Used: use the system daily or almost daily",
  ];

  // States to track selections
  const [expectationRating, setExpectationRating] = useState("");
  const [usageFrequencyRating, setUsageFrequencyRating] = useState("");

  return (
    <div
      className="flex flex-col py-12 px-16 h-fit rounded-xl max-w-[50rem] 
        max-h-[85%] overflow-auto space-y-4 text-[18px] text-white"
    >
      <div className="bg-[#142838] py-12 px-16">
        <h1 className="text-[20px] mb-5">Expectation Rating:</h1>
        {expectationList.map((item, index) => (
          <div key={index} className="flex flex-row space-x-4 items-center">
            <input
              type="radio"
              id={`expectation-${index}`}
              name="expectationRating"
              value={index}
              checked={expectationRating === `${index}`}
              onChange={(e) => setExpectationRating(e.target.value)}
              className="w-4 h-4"
            />
            <label htmlFor={`expectation-${index}`}>{item}</label>
          </div>
        ))}
      </div>
      <div className="bg-[#142838] py-12 px-16">
        <h1 className="text-[20px] mb-5">
          In your prior interaction experiences, how often did you try to use
          Search Engine/ChatGPT to fulfill this intention?
        </h1>
        <div className="flex flex-col space-y-2">
          {usageFrequency.map((item, index) => (
            <div key={index} className="flex flex-row space-x-4 items-center">
              <input
                type="radio"
                id={`usage-${index}`}
                name="usageFrequencyRating"
                value={index}
                checked={usageFrequencyRating === `${index}`}
                onChange={(e) => setUsageFrequencyRating(e.target.value)}
                className="w-4 h-4"
              />
              <label htmlFor={`usage-${index}`}>{item}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Questions;
