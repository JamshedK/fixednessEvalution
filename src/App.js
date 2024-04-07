import { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import SignUp from "./common/SignUp";
import MainChatTask from "./chat/MainChatTask";
import Login from "./common/Login";
import AuthContext from "./context/auth-context";
import QuestionnnaireMain from "./questionnaire/PreTaskQuestionnaireMain";
import PostTaskQuestionnaireMain from "./questionnaire/PostTaskQuesionnaireMain";
import { FlowContext } from "./context/flow-context";
import { Navigate } from "react-router-dom";
import DemographyMain from "./questionnaire/BackgroundMain";
import Logout from "./common/Logout";
import Home from "./Home";
import MainSearchTask from "./bing/MainSearchTask";
import ExperienceSurveyMain from "./questionnaire/ExperienceSurveyMain";
import EndOfStudy from "./questionnaire/EndOfStudy";
import ConsentForm from "./common/Consent";

function App() {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const flowCtx = useContext(FlowContext);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Standard way to trigger the confirmation dialog
      event.preventDefault();
      // Chrome requires returnValue to be set
      event.returnValue =
        "Are you ready to exit the study by closing this page?";
    };

    // Add the event listener for 'beforeunload'
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/home" /> : <Login />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/consent" element={<ConsentForm />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<MainSearchTask />} />
        <Route path="/session-experience" element={<ExperienceSurveyMain />} />
        <Route path="/end" element={<EndOfStudy />} />
        <Route path="/pre-task" element={<QuestionnnaireMain />} />
        <Route path="/post-task" element={<PostTaskQuestionnaireMain />} />
        <Route path="/demography" element={<DemographyMain />} />
        <Route path="/chat" element={<MainChatTask />} />
      </Routes>
    </div>
  );
}

export default App;
