import { useState, createContext } from "react";
import React from "react";

export const FlowContext = React.createContext({
  preTaskCompleted: false,
  demographyCompleted: false,
  postTaskCompleted: false,
  setPreTaskCompleted: () => {},
  setDemographyCompleted: () => {},
  setPostTaskCompleted: () => {},
});

// create a context provider for the flow
export const FlowContextProvider = (props) => {
  const [preTaskCompleted, setPreTaskCompleted] = useState(false);
  const [demographyCompleted, setDemographyCompleted] = useState(false);
  const [postTaskCompleted, setPostTaskCompleted] = useState(false);

  const contextValue = {
    preTaskCompleted: preTaskCompleted,
    demographyCompleted: demographyCompleted,
    postTaskCompleted: postTaskCompleted,
    setPreTaskCompleted: setPreTaskCompleted,
    setDemographyCompleted: setDemographyCompleted,
    setPostTaskCompleted: setPostTaskCompleted,
  };

  return (
    <FlowContext.Provider value={contextValue}>
      {props.children}
    </FlowContext.Provider>
  );
};
