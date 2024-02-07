import { useContext } from 'react';
import {Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';
import Main from './components/Main';
import Login from './components/Login';
import AuthContext from './context/auth-context';

function App() {
    const authCtx = useContext(AuthContext)
    const isLoggedIn = authCtx.isLoggedIn

    return (
      <div>
          <Routes>
            <Route path="/" element={isLoggedIn ? <Main/> : <Login />} />
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/login" element={<Login/>}/>
          </Routes>
      </div>
    );
}

export default App;
