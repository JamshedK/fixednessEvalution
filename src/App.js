import { useContext } from "react";
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
