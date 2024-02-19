import { useContext } from 'react';
import {Route, Routes } from 'react-router-dom';
import SignUp from './chat/SignUp';
import Main from './common/Main';
import Login from './chat/Login';
import AuthContext from './context/auth-context';
import QuestionnnaireMain from './questionnaire/QuestionnaireMain';

function App() {
    const authCtx = useContext(AuthContext)
    const isLoggedIn = authCtx.isLoggedIn

    return (
      <div>
          <Routes>
            <Route path="/" element={isLoggedIn ? <Main/> : <Login />} />
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path='/pre-task' element={<QuestionnnaireMain/>}/>
          </Routes>
      </div>
    );
}

export default App;
