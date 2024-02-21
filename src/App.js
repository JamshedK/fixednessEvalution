import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import SignUp from "./chat/SignUp";
import Main from "./common/Main";
import Login from "./chat/Login";
import AuthContext from "./context/auth-context";
import QuestionnnaireMain from "./questionnaire/QuestionnaireMain";
import { FlowContext } from "./context/flow-context";
import { Navigate } from "react-router-dom";
import DemographyMain from "./questionnaire/DemographyMain";

function App() {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const flowCtx = useContext(FlowContext);

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn &&
            flowCtx.demographyCompleted &&
            flowCtx.preTaskCompleted ? (
              <Main />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
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
      </Routes>
    </div>
  );
}

export default App;
