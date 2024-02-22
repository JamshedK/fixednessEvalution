import { useState, createContext } from "react";

export const FlowContext = createContext({
  preTaskCompleted: false,
  demographyCompleted: false,
  postTaskCompleted: false,
  setPreTaskCompleted: () => {},
  setDemographyCompleted: () => {},
  setPostTaskCompleted: () => {},
});

export const FlowContextProvider = (props) => {
  const [preTaskCompleted, setPreTaskCompleted] = useState(
    localStorage.getItem("preTaskCompleted") === "true"
  );
  const [demographyCompleted, setDemographyCompleted] = useState(
    localStorage.getItem("demographyCompleted") === "true"
  );
  const [postTaskCompleted, setPostTaskCompleted] = useState(
    localStorage.getItem("postTaskCompleted") === "true"
  );

  const contextValue = {
    preTaskCompleted,
    demographyCompleted,
    postTaskCompleted,
    setPreTaskCompleted: (value) => {
      setPreTaskCompleted(value);
      localStorage.setItem("preTaskCompleted", value.toString());
    },
    setDemographyCompleted: (value) => {
      setDemographyCompleted(value);
      localStorage.setItem("demographyCompleted", value.toString());
    },
    setPostTaskCompleted: (value) => {
      setPostTaskCompleted(value);
      localStorage.setItem("postTaskCompleted", value.toString());
    },
  };

  return (
    <FlowContext.Provider value={contextValue}>
      {props.children}
    </FlowContext.Provider>
  );
};
