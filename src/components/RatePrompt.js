import React, { useState } from "react";
import { collection, addDoc, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";

const RatePrompt = (props) => {
  const [usefulnessRating, setUsefulnessRating] = useState(null);
  const [credibilityRating, setCredibilityRating] = useState(null);
  const [recommendationRating, setRecommendationRating] = useState(null);
  const [satisfactionRating, setSatisfactionRating] = useState(null);

  const handleSubmit = async () => {
        const shouldProceed = window.confirm("Are you sure you want to submit the form?");
        if (shouldProceed) {
            const formData = {
                promptID: props.promptID,
                usefulnessRating: usefulnessRating + 1,
                credibilityRating: credibilityRating + 1,
                recommendationRating: recommendationRating + 1,
                satisfactionRating: satisfactionRating + 1,
            };

            try {
                // Save the form data to Firestore
                const docRef = await addDoc(collection(db, "promptRatings"), formData);
                console.log("Document written with ID:", docRef.id);
                // Query for the chat document matching the promptID
                const chatsCollection = collection(db, "chatsIndividual"); 
                const q = query(chatsCollection, where("id", "==", props.promptID));

                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    // Get the first document (assuming only one document will match)
                    const chatDoc = querySnapshot.docs[0];

                    // Update the chat document with the new ratingID
                    await updateDoc(chatDoc.ref, {
                        ratingID: docRef.id
                    });
                } else {
                    console.error("No matching chat document found for promptID:", props.promptID);
                }
                // Close the prompt and handle any further actions here (if needed)
                props.setShowRatePrompt(false);
                props.setIsPromptRated(new Date()) // to force rerender of useEffect to fetch the ratingID
            } catch (error) {
                console.error("Error adding document:", error);
            }
        }
  };


  return (
    <div className="fixed flex flex-col bg-[#142838] py-12 px-16 h-fit rounded-xl min-w-[30rem] max-h-[85%] overflow-auto space-y-4">
        <h1 className="text-white text-center mb-2">Rate Prompt Questionnaire</h1>
        {/* Usefulness Rating */}
        <div className="flex flex-col text-white space-y-4 max-w-[28rem]">
            <h1>1. How useful was the prompt in guiding ChatGPT's response?</h1>
            <div className="flex flex-row pl-8 pr-16 justify-between">
                {/* Array to generate the radio buttons */}
                {Array.from({ length: 5 }).map((_, index) => {
                    return (
                    <button
                        key={index}
                        className={`w-4 h-4 rounded-full border-[1px] border-white ${
                        usefulnessRating === index ? "bg-white" : ""
                        }`}
                        onClick={() => setUsefulnessRating(index)}
                    ></button>
                    );
                })}
            </div>
            <div className="flex justify-between pl-4 pr-8">
                <h1>Not Useful</h1>
                <h1>Moderately Useful</h1>
                <h1>Extremely Useful</h1>
            </div>
        </div>

        {/* Credibility Rating */}
        <div className="flex flex-col text-white space-y-4 max-w-[28rem]">
            <h1>2. How credible was the output provided by ChatGPT?</h1>
            <div className="flex flex-row pl-8 pr-16 justify-between">
                {/* Array to generate the radio buttons */}
                {Array.from({ length: 5 }).map((_, index) => {
                    return (
                    <button
                        key={index}
                        className={`w-4 h-4 rounded-full border-[1px] border-white ${
                        credibilityRating === index ? "bg-white" : ""
                        }`}
                        onClick={() => setCredibilityRating(index)}
                    ></button>
                    );
                })}
            </div>
            <div className="flex justify-between pl-4 pr-8">
                <h1>Not Credible</h1>
                <h1>Moderately Credible</h1>
                <h1>Extremely Credible</h1>
            </div>
         </div>

        {/* Recommendation Rating */}
        <div className="flex flex-col text-white space-y-4 max-w-[28rem]">
            <h1>
                3. If this prompt and output will be shared in the online community to
                help other users with similar questions, how likely are you to
                recommend your prompts and ChatGPT’s output?
            </h1>
            <div className="flex flex-row pl-8 pr-16 justify-between">
                {/* Array to generate the radio buttons */}
                {Array.from({ length: 5 }).map((_, index) => {
                    return (
                    <button
                        key={index}
                        className={`w-4 h-4 rounded-full border-[1px] border-white ${
                        recommendationRating === index ? "bg-white" : ""
                        }`}
                        onClick={() => setRecommendationRating(index)}
                    ></button>
                    );
                })}
            </div>
            <div className="flex justify-between pl-4 pr-8">
                <h1>Not likely</h1>
                <h1>Somewhat likely</h1>
                <h1>Very likely</h1>
            </div>
        </div>

        {/* Satisfaction Rating */}
        <div className="flex flex-col text-white space-y-4 max-w-[28rem]">
            <h1>4. Rate your satisfaction level with this prompt and its output.</h1>
            <div className="flex flex-row pl-8 pr-16 justify-between">
                {/* Array to generate the radio buttons */}
                {Array.from({ length: 5 }).map((_, index) => {
                    return (
                    <button
                        key={index}
                        className={`w-4 h-4 rounded-full border-[1px] border-white ${
                        satisfactionRating === index ? "bg-white" : ""
                        }`}
                        onClick={() => setSatisfactionRating(index)}
                    ></button>
                    );
            })}
            </div>
            <div className="flex justify-between pl-4 pr-8">
                <h1>Very unsatisfied</h1>
                <h1>Neutral</h1>
                <h1>Very satisfied</h1>
            </div>
        </div>
        <div className="flex flex-row justify-around mt-12">
                <button
                    className="underline text-white"
                    onClick={() => props.setShowRatePrompt(false)}
                >
                    Cancel
                </button>
                <button
                    className="bg-white px-6 py-2 rounded-2xl"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
        </div>
    </div>
  );
};

export default RatePrompt;
