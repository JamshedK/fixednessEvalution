import React from "react";
import search from "../assets/common/search.jpeg";
import virtual from "../assets/common/virtual.jpeg";

const IntroPage = (props) => {
  let instructions;
  let imgSrc;
  if (props.currentTask === "search") {
    instructions =
      "Think about your previous use of search engines (e.g., Google, Bing) and respond to the questions on the next page based on those experiences. ";
    imgSrc = search;
  }
  if (props.currentTask === "virtual-assistant") {
    instructions =
      "Think about your previous use of virtual assistants (e.g., Siri, Cortana, Google Assistant, Amazon Alexa) and respond to the questions on the next page based on those experiences.";
    imgSrc = virtual;
  }
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center ">
      <img
        src={imgSrc}
        alt="Reflect on your experience"
        className="max-w-[50%] flex items-center"
      />
      <p className="mt-8 text-2xl mx-[20%] text-center">{instructions}</p>
      <button
        className="absolute bottom-4 right-4 px-4 py-2 bg-blue-500 text-white text-lg rounded hover:bg-blue-600"
        onClick={() => props.setShowIntroPage(false)}
      >
        Go to questionnaire
      </button>
    </div>
  );
};

export default IntroPage;
