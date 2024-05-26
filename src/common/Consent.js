import React, { useEffect } from "react";
import { useState, useContext } from "react";
import AuthContext from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase-config";
import { doc, setDoc, updateDoc } from "firebase/firestore";

const ConsentForm = () => {
  // State to store the responses
  const [archiveConsent, setArchiveConsent] = useState("");
  const [futureContactConsent, setFutureContactConsent] = useState("");
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // check if url has refresh query param
    const urlParams = new URLSearchParams(window.location.search);
    const refresh = urlParams.get("refresh");
    if (!refresh) {
      navigate("/consent");
    }
  }, []);

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!archiveConsent || !futureContactConsent) {
      alert("Please answer both questions before submitting.");
      return;
    }
    // Save the data in firestore
    const consentData = {
      archiveConsent,
      futureContactConsent,
    };
    const usersRef = doc(db, "users", authCtx.user.uid);
    try {
      await updateDoc(usersRef, consentData);
      console.log("Consent form submitted successfully");
      navigate("/home?refresh=true");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Consent to Participate in Research
      </h1>
      <h2 className="text-xl mb-2 text-center">University of Oklahoma</h2>
      <p className="mb-4">
        <strong>
          Would you like to be involved in research at the University of
          Oklahoma?
        </strong>
      </p>
      <p>
        I am Jiqun Liu from the library and information studies department and I
        invite you to participate in my research entitled Functional Fixedness
        Evaluation in Human-LLM Interaction. This research is being conducted at
        the usability lab at the school of library and information studies, but
        you as our online participant will be participating remotely via your
        own computer. You were selected as a possible participant because you
        meet the eligibility requirement for the study. You must be at least 18
        years of age to participate in this research.
      </p>
      <p className="mt-4 underline font-bold">
        Please read this document and contact me to ask any questions you may
        have BEFORE agreeing to participate in my research.
      </p>
      <br />
      <p className="mb-4">
        <strong>What is the purpose of this research? </strong>
        This research aims to study the functional fixedness in human-Large
        Language Model (LLM) interaction, specifically focusing on users'
        intention distribution and interaction behaviors in both search engine
        and ChatGPT settings.
      </p>
      <p className="mb-4">
        <strong>How many participants will be in this research? </strong>
        About 800-1,000 online participants will take part in this research.
      </p>
      <p className="mb-4">
        <strong>What will I be asked to do? </strong>
        If you agree to be in this research, you will be asked to perform a task
        using ChatGPT and answer a questionnaire about your search engine usage.
      </p>
      <p className="mb-4">
        <strong>How long will this take? </strong>
        Your participation will take 35-40 minutes.
      </p>
      <p className="mb-4">
        <strong>What are the risks and benefits if I participate? </strong>
        We will keep the logs of your task performance. We will not ask for
        names or any personal information. These logs are not identifiable to
        each participant.
      </p>
      <p className="mb-4">
        <strong>Will I be compensated for participating? </strong>
        Each participant will receive a $8 upon completion.
      </p>
      <p className="mb-4">
        <strong>Who will see my information? </strong>
        There will be no information in research reports that will make it
        possible to identify you. Research records will be stored securely, and
        only approved researchers and the OU Institutional Review Board will
        have access to the records.
      </p>
      <p className="mb-4">
        <strong>Do I have to participate? </strong>
        No. If you do not participate, you will not be penalized or lose
        benefits or services unrelated to the research. If you decide to
        participate, you don't have to answer any questions and can stop
        participating at any time.
      </p>
      <p className="mb-4">
        <strong>Will my identity be anonymous or confidential? </strong>
        Your name will not be retained or linked with your responses
        <underline> unless you agree</underline> to be identified. Please check
        all of the options that you agree to:
      </p>
      {/* Data archive consent */}
      <div>
        <p>
          I agree for my data to be archived for scholarly and public access
        </p>
        <div className="flex items-center mb-2">
          <input
            id="archiveYes"
            name="archiveConsent"
            type="radio"
            value="Yes"
            className="form-radio h-3 w-3 text-blue-600"
            onChange={() => setArchiveConsent("Yes")}
            checked={archiveConsent === "Yes"}
          />
          <label
            htmlFor="archiveYes"
            className="ml-2  font-medium text-gray-700"
          >
            Yes
          </label>
        </div>
        <div className="flex items-center mb-2">
          <input
            id="archiveNo"
            name="archiveConsent"
            type="radio"
            value="No"
            className="form-radio h-3 w-3 text-blue-600"
            onChange={() => setArchiveConsent("No")}
            checked={archiveConsent === "No"}
          />
          <label
            htmlFor="archiveNo"
            className="ml-2  font-medium text-gray-700"
          >
            No
          </label>
        </div>
      </div>

      <p className="mt-4">
        <strong>What will happen to my data in the future? </strong>
        We might re-use and re-analyze your <strong>de-identified</strong> data
        in future research without obtaining additional consent from you.
      </p>
      <p className="mt-4">
        <strong>Will I be contacted again? </strong>
        The researcher might contact you to gather additional data or recruit
        you for new research.
      </p>
      <p>I give my permission for the researcher to contact me in the future</p>
      <div className="flex items-center mb-2">
        <input
          id="contactYes"
          name="futureContact"
          type="radio"
          value="Yes"
          className="form-radio h-3 w-3 text-blue-600"
          onChange={() => setFutureContactConsent("Yes")}
          checked={futureContactConsent === "Yes"}
        />
        <label htmlFor="contactYes" className="ml-2  font-medium text-gray-700">
          Yes
        </label>
      </div>
      <div className="flex items-center">
        <input
          id="contactNo"
          name="futureContact"
          type="radio"
          value="No"
          className="form-radio h-3 w-3 text-blue-600"
          onChange={() => setFutureContactConsent("No")}
          checked={futureContactConsent === "No"}
        />
        <label htmlFor="contactNo" className="ml-2  font-medium text-gray-700">
          No
        </label>
      </div>

      <p className="mt-4">
        <strong>
          Who do I contact with questions, concerns, or complaints?{" "}
        </strong>
        If you have questions, concerns, or complaints about the research or
        have experienced a research-related injury, contact me at
        jiqunliu@ou.edu or mahdieh.nazari-1@ou.edu or mobile number at (405)
        723-1741.
      </p>
      <p className="mt-4">
        You can also contact the University of Oklahoma – Norman Campus
        Institutional Review Board (OU-NC IRB) at 405-325-8110 or irb@ou.edu if
        you have questions about your rights as a research participant,
        concerns, or complaints about the research and wish to talk to someone
        other than the researcher(s) or if you cannot reach the researcher(s).
      </p>
      <p className="mt-4">
        Please print a copy of this document. By providing information to the
        researcher, I confirm that I am at least 18 years old and agree to
        participate in this research.
      </p>
      <p className="mt-4">
        <strong>IRB # 16867 IRB Approval Date: 03/02/2024</strong>
      </p>
      <button
        className="w-fit bg-[#e3e3e3] text-black py-2 px-8 rounded-xl flex mt-4"
        onClick={handleSubmit}
      >
        I agree to participate
      </button>
    </div>
  );
};

export default ConsentForm;
