import { useContext, useState } from 'react';
import Navbar from './navbar';
import Chatbox from './chatbox';
import NoteBar from './NoteBar';
import TaskContext from '../context/task-context';
import EndTaskPopUp from './EndTaskPopUp';

const Main = () => {

    const taskCtx = useContext(TaskContext)
  

  return (
      <div className='flex flex-row '>
          <Navbar />
          <Chatbox />
          <NoteBar/>
          {taskCtx.showEndTaskPopUp && 
                <div className='fixed top-0 left-0 w-screen h-screen flex items-center justify-center'>
                    <EndTaskPopUp />
                </div>
            }
      </div>
  );
};

export default Main;