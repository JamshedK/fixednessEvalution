import { useState, useEffect } from "react";

const Questions = ({ itemId, ratings, onRatingsChange }) => {
  console.log(`Questions: ${itemId} was selected\n ratings: ${ratings}`);
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

  // Initialize states with the passed ratings if available
  const [expectationRating, setExpectationRating] = useState(
    ratings?.expectationRating || ""
  );
  const [usageFrequencyRating, setUsageFrequencyRating] = useState(
    ratings?.usageFrequencyRating || ""
  );

  // Update local state when the passed ratings change
  useEffect(() => {
    // Update local state based on the presence of ratings or reset to initial state if ratings are undefined
    setExpectationRating(ratings?.expectationRating ?? "");
    setUsageFrequencyRating(ratings?.usageFrequencyRating ?? "");
  }, [ratings]);

  // Update parent state when either rating changes
  const handleRatingChange = () => {
    if (expectationRating !== "" && usageFrequencyRating !== "") {
      onRatingsChange(itemId, expectationRating, usageFrequencyRating);
    }
  };

  // Call handleRatingChange whenever the ratings change
  useEffect(() => {
    handleRatingChange();
  }, [expectationRating, usageFrequencyRating]);
  console.log(`Expectation rating: ${expectationRating}`);

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
              value={item}
              checked={expectationRating === item}
              onChange={(e) => setExpectationRating(e.target.value)}
              className="w-4 h-4 form-radio bg-black"
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
        {usageFrequency.map((item, index) => (
          <div key={index} className="flex flex-row space-x-4 items-center">
            <input
              type="radio"
              id={`usage-${index}`}
              name="usageFrequencyRating"
              value={item}
              checked={usageFrequencyRating === item}
              onChange={(e) => setUsageFrequencyRating(e.target.value)}
              className="w-4 h-4 form-radio bg-black"
            />
            <label htmlFor={`usage-${index}`}>{item}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;
