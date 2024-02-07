import { useContext, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import TaskContext from "../context/task-context";
import AuthContext from "../context/auth-context";

const PostTaskQuestionnaire = (props) => {
    const [gainConfirmation, setGainConfirmation] = useState(-1);
    const [costConfirmation, setCostConfirmation] = useState(-1);
    const [satisfaction, setSatisfaction] = useState(-1);
    const [recommendation, setRecommendation] = useState(-1);
    const [encounteredProblems, setEncounteredProblems] = useState([]);
    const [otherChallenges, setOtherChallenges] = useState('');
    const [otherFeedback, setOtherFeedback] = useState('')

    const [isFormValid, setIsFormValid] = useState(false); // State to track form validation
    const [submitClicked, setSubmitClicked] = useState(false) // To show required field after submit button is pressed

    const taskCtx = useContext(TaskContext)
    const authCtx = useContext(AuthContext)
    
    // Array of encountered problems with subgroups
    const encounteredProblemsList = [
        {
            problems: [
                'No challenges'
            ]
        },
        {
            heading: 'Understanding and refining prompts:',
            problems: [
                'Difficulty in formulating clear and effective prompts',
                'Struggling to refine and iterate prompts for desired outputs',
        ],
        },
        {
            heading: 'Obtaining relevant and accurate information:',
            problems: [
                'Receiving irrelevant or off-topic responses',
                'Inaccurate or unreliable information provided by ChatGPT',
        ],
        },
        {
            heading: 'Handling ambiguous or complex queries:',
            problems: [
                'ChatGPT struggling to comprehend complex or nuanced questions',
                'Dealing with ambiguity in queries and getting appropriate responses',
        ],
        },
        {
            heading: 'Managing task-specific requirements:',
            problems: [
                'ChatGPT not understanding specific task requirements or constraints',
                'Challenges in conveying task-specific context or instructions effectively',
        ],
        },
        {
            heading: 'Engaging in meaningful conversations:',
            problems: [
                'Difficulty in having coherent and contextually relevant conversations with ChatGPT',
                'Limited ability of ChatGPT to sustain engaging and interactive dialogue',
        ],
        },
        {
            heading: 'Ensuring ethical and unbiased responses:',
            problems: [
                "Concerns about potential biases or inappropriate content in ChatGPT's responses",
                'Challenges in ensuring responsible and ethical use of ChatGPT',
        ],
        },
        {
            problems: [
                'Other challenges' 
            ]
        },];

    // Handle checkbox change
    const handleEncounteredProblemsChange = (problem) => {
        if (problem === 'No challenges') {
            // If "No challenges" is being checked, clear all other problems.
            if (!encounteredProblems.includes(problem)) {
                setEncounteredProblems(['No challenges']);
            } else {
                // If "No challenges" is being unchecked, just remove it.
                setEncounteredProblems(encounteredProblems.filter((p) => p !== problem));
            }
        } else {
            // If any other problem is being checked, remove "No challenges" from the list if it exists.
            if (encounteredProblems.includes('No challenges')) {
                setEncounteredProblems([...encounteredProblems.filter((p) => p !== 'No challenges'), problem]);
            } else {
                if (encounteredProblems.includes(problem)) {
                    setEncounteredProblems(encounteredProblems.filter((p) => p !== problem));
                } else {
                    setEncounteredProblems([...encounteredProblems, problem]);
                }
            }
        }
    };


    const handleSubmit = async () => {
        setSubmitClicked(true)
        // Check if all questions are answered
        if (isFormValid) {
            // Confirm if the user actually wants to save
            const shouldProceed = window.confirm('Are you sure you want to submit the form?');
            if (shouldProceed) {
                // Create the formData object and populate it with the values from state
                const formData = {
                    taskID: taskCtx.taskID,
                    userID: authCtx?.user.uid,
                    gainConfirmation: gainConfirmation + 1,
                    costConfirmation: costConfirmation + 1,
                    satisfaction: satisfaction + 1,
                    recommendation: recommendation + 1,
                    encounteredProblems,
                    otherChallenges,
                    otherFeedback,
                };

                try {
                    // Save the form data to Firestore
                    const docRef = await addDoc(collection(db, 'postTaskQuestionnaire'), formData);
                    console.log('Document written with ID:', docRef.id);
                    
                    // Hide the questionnaire 
                    props.setShowPostTaskQuestionnaire(false);
                    // remove the task from localstorage
                    taskCtx.removeTask();
                    window.location.reload()
                } catch (error) {
                    console.error('Error adding document:', error);
                }
                setSubmitClicked(false)
            }
        } else{
            console.log(encounteredProblems)
            alert('Please answer all questions before submitting.');
        }
    };

    const handleShowWarning = () => {
        if (
            gainConfirmation !== -1 &&
            costConfirmation !== -1 &&
            satisfaction !== -1 &&
            recommendation !== -1 &&
            (encounteredProblems.length > 0 || encounteredProblems.includes("No challenges") || otherChallenges.trim() !== '')
            ) {
            setIsFormValid(true);
        }else {
            setIsFormValid(false);
        }
    };

    
    return(
        <div 
            className="flex flex-col bg-[#142838] py-12 px-16 h-fit rounded-xl min-w-[30rem] max-h-[85%] overflow-auto"
            onChange={handleShowWarning}
        >
            <h1 className="text-white text-center">Post task Questionnaire</h1>
            {/* Questions */}
            <div className="flex flex-col text-white space-y-4 max-w-[28rem]">
                <div className="flex flex-row items-center space-x-2">
                    <h1>1. How much outcome did you obtain through this task?</h1>
                    {gainConfirmation === -1 && submitClicked && <p className="text-red-500 text-sm">required</p>}
                </div>
                <div className="flex flex-row pl-8 pr-16 justify-between">
                    {/* Array to generate the radio buttons */}
                    {Array.from({ length: 5 }).map((_, index) => {
                        return (
                            <button
                                key={index}
                                className={`w-4 h-4 rounded-full border-[1px] border-white ${gainConfirmation === index ? "bg-white" : ""}`}
                                onClick={() => setGainConfirmation(index)}
                            ></button>
                        );
                    })}
                </div>
                <div className="flex justify-between pl-4 pr-8">
                    <h1>Much less than expected</h1>
                    <h1>Just as expected</h1>
                    <h1>Much more than expected</h1>
                </div>

                {/* Question 2 */}
                <div className="flex flex-row items-center space-x-2">
                    <h1>2. How much effort did it take for you to obtain the outcome through this task?</h1>
                    {costConfirmation === -1 && submitClicked && <p className="text-red-500 text-sm">required</p>}
                </div>
                <div className="flex flex-row pl-8 pr-16 justify-between">
                    {/* Array to generate the radio buttons */}
                    {Array.from({ length: 5 }).map((_, index) => {
                        return (
                            <button
                                key={index}
                                className={`w-4 h-4 rounded-full border-[1px] border-white ${costConfirmation === index ? "bg-white" : ""}`}
                                onClick={() => setCostConfirmation(index)}
                            ></button>
                        );
                    })}
                </div>
                <div className="flex justify-between pl-4 pr-8">
                    <h1>Much less than expected</h1>
                    <h1>Just as expected</h1>
                    <h1>Much more than expected</h1>
                </div>

                {/* Question 3 */}
                <div className="flex flex-row items-center space-x-2">
                    <h1>3. Rate your satisfaction level with this task.</h1>
                    {satisfaction === -1 && submitClicked && <p className="text-red-500 text-sm">required</p>}
                </div>

                <div className="flex flex-row pl-8 pr-16 justify-between">
                    {/* Array to generate the radio buttons */}
                    {Array.from({ length: 5 }).map((_, index) => {
                        return (
                            <button
                                key={index}
                                className={`w-4 h-4 rounded-full border-[1px] border-white ${satisfaction === index ? "bg-white" : ""}`}
                                onClick={() => setSatisfaction(index)}
                            ></button>
                        );
                    })}
                </div>
                <div className="flex justify-between pl-4 pr-8 text-[13px]">
                    <h1>Very unsatisfied</h1>
                    <h1>Unsatisfied</h1>
                    <h1>Neutral</h1>
                    <h1>Satisfied</h1>
                    <h1>Very satisfied</h1>
                </div>

                {/* Question 4 */}
                <div className="flex flex-row items-center space-x-2">
                    <h1>4. If this task content will be shared in the online community to help other users with similar tasks, how likely is it for you to recommend your prompts and ChatGPT’s output?</h1>
                    {recommendation === -1 && submitClicked && <p className="text-red-500 text-sm">required</p>}
                </div>
                <div className="flex flex-row pl-8 pr-16 justify-between">
                    {/* Array to generate the radio buttons */}
                    {Array.from({ length: 5 }).map((_, index) => {
                        return (
                            <button
                                key={index}
                                className={`w-4 h-4 rounded-full border-[1px] border-white ${recommendation === index ? "bg-white" : ""}`}
                                onClick={() => setRecommendation(index)}
                            ></button>
                        );
                    })}
                </div>
                <div className="flex justify-between pl-4 pr-8">
                    <h1>Not likely</h1>
                    <h1>Somewhat likely</h1>
                    <h1>Very likely</h1>
                </div>
                <div className="flex flex-row items-center space-x-2">
                    <h1>5. Encountered problems</h1>
                    {encounteredProblems.length < 1 && submitClicked && <p className="text-red-500 text-sm">required. Select at least 1</p>}
                </div>
                {/* Question 5 */}
                <div className="flex flex-col pl-8 pr-16 space-y-3">
                    {/* Make checkboxes using array with subgroups */}
                    {encounteredProblemsList.map((group, groupIndex) => (
                        <div key={groupIndex}>
                            <h1 className="underline">{group.heading}</h1>
                            {group.problems.map((problem, index) => (
                                <div key={index} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={encounteredProblems.includes(problem)}
                                        onChange={() => handleEncounteredProblemsChange(problem)}
                                        className="form-checkbox mr-2 w-5 h-5 rounded bg-transparent border-[1px] border-white focus:ring-transparent focus:border-none"
                                    />
                                    <label htmlFor={`checkbox-${index}`}>{problem}</label>
                                </div>
                            ))}
                        </div>
                    ))}
                    {/* Text input for other problems */}
                    <div className="flex flex-row justify-between rounded-md bg-[#2F4454] py-1 mx-4">
                        <input
                            className="w-full bg-transparent outline-none px-2 h-7"
                            onChange={(e) => {
                                setOtherChallenges(e.target.value);
                            }}
                        />
                    </div>
                </div>
                {/* Question 6 */}
                <h1>6. Other feedback</h1>
                <div className="flex flex-row justify-between rounded-md bg-[#2F4454]  py-1 mx-4">
                    <input 
                        className="w-full bg-transparent outline-none px-2 h-7"
                        onChange={(e) => {
                            setOtherFeedback(e.target.value)
                        }}>    
                    </input>
                </div>
            </div>
            <div className="flex flex-row justify-around mt-8">
                <button className="underline text-white"onClick={() => props.setShowPostTaskQuestionnaire(false)}>Cancel</button>
                <button className="bg-white px-6 py-2 rounded-2xl" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}

export default PostTaskQuestionnaire;