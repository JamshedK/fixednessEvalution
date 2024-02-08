import { useState } from 'react';
import Navbar from './navbar';
import Chatbox from './chatbox';
import NoteBar from './NoteBar';

const Main = () => {
  

  return (
      <div className='flex flex-row '>
          <Navbar />
          <Chatbox />
          <NoteBar/>
      </div>
  );
};

export default Main;