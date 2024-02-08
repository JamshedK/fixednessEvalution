import { useState } from 'react';
import Navbar from './navbar';
import Chatbox from './chatbox';

const Main = () => {
  

  return (
      <div className='flex flex-row'>
          <Navbar />
          <Chatbox />
      </div>
  );
};

export default Main;