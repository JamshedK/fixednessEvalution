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
import MainSearchTask from "./search/MainSearchTask";
import ExperienceSurveyMain from "./questionnaire/ExperienceSurveyMain";
import EndOfStudy from "./questionnaire/EndOfStudy";
import ConsentForm from "./common/Consent";
import InsertTasks from "./admin/InsertTasks";
import ShowCurrentTasks from "./admin/InsertTasks/ShowCurrentTasks";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ManageExperienceSurvey from "./admin/ManageExperienceSurvey";
import ManageDemographySurvey from "./admin/ManageDemographySurvey";
import ManageTopology from "./admin/ManageTopology";

// Admin protected route component
const AdminProtectedRoute = ({ component: Component }) => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const isAdmin = authCtx.isAdmin;
  const isAuthLoading = authCtx.isAuthLoading; // Add loading state check
  
  console.log("AdminProtectedRoute - isLoggedIn:", isLoggedIn, "isAdmin:", isAdmin, "isAuthLoading:", isAuthLoading);
  
  // Show loading while authentication is being checked
  if (isAuthLoading) {
    console.log("Authentication still loading, showing loading state");
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // Only redirect if auth is complete and user is not admin
  if (!isLoggedIn || !isAdmin) {
    console.log("Redirecting to admin login");
    return <Navigate to="/admin/login" replace />;
  }
  
  console.log("Allowing access to admin component");
  return <Component />;
};

function App() {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const isAdmin = authCtx.isAdmin;
  const flowCtx = useContext(FlowContext);

  console.log("Loggin in as admin ans checking if logged in:", isAdmin, isLoggedIn);
  console.log("Admin route condition:", isLoggedIn && isAdmin);
  
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
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={<AdminProtectedRoute component={AdminDashboard} />} 
        />
        <Route 
          path="/admin/dashboard" 
          element={<AdminProtectedRoute component={AdminDashboard} />} 
        />
        <Route 
          path="/admin/insert-tasks" 
          element={<AdminProtectedRoute component={InsertTasks} />} 
        />
        <Route 
          path="/admin/experience-survey" 
          element={<AdminProtectedRoute component={ManageExperienceSurvey} />} 
        />
        <Route 
          path="/admin/demography-survey" 
          element={<AdminProtectedRoute component={ManageDemographySurvey} />} 
        />
        <Route 
          path="/admin/topology" 
          element={<AdminProtectedRoute component={ManageTopology} />} 
        />
      </Routes>
    </div>
  );
}

export default App;
