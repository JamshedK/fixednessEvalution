import { useState } from 'react';
import Navbar from './navbar';
import Chatbox from './chatbox';
import Questionnaire from './Questionnaire';
import PostTaskQuestionnaire from './PostTaskQuestionnaire';

const Main = () => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showPostTaskQuestionnaire, setShowPostTaskQuestionnaire] = useState(false)

  return (
      <div className='flex flex-row'>
          <Navbar 
              setShowQuestionnaire={setShowQuestionnaire} 
              setShowPostTaskQuestionnaire={setShowPostTaskQuestionnaire} 
            />
          <Chatbox />
          {showQuestionnaire && (
              <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
                  <Questionnaire setShowQuestionnaire={setShowQuestionnaire} />
              </div>
          )}
          {showPostTaskQuestionnaire && (
              <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
                  <PostTaskQuestionnaire setShowPostTaskQuestionnaire={setShowPostTaskQuestionnaire} />
              </div>
          )}    
      </div>
  );
};

export default Main;