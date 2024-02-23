import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import SignUp from "./common/SignUp";
import MainChatTask from "./chat/MainChatTask";
import Login from "./common/Login";
import AuthContext from "./context/auth-context";
import QuestionnnaireMain from "./questionnaire/QuestionnaireMain";
import { FlowContext } from "./context/flow-context";
import { Navigate } from "react-router-dom";
import DemographyMain from "./questionnaire/DemographyMain";
import Logout from "./common/Logout";
import Home from "./Home";

function App() {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const flowCtx = useContext(FlowContext);
  console.log(isLoggedIn);
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/home" /> : <Login />}
        />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/pre-task"
          element={
            flowCtx.demographyCompleted ? (
              <QuestionnnaireMain />
            ) : (
              <Navigate to="/demography" />
            )
          }
        />
        <Route path="/demography" element={<DemographyMain />} />
        <Route
          path="/chat"
          element={
            flowCtx.demographyCompleted ? (
              <MainChatTask />
            ) : (
              <Navigate to="/pre-task" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
