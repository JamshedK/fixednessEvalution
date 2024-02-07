import React, { useState, useEffect } from 'react';

const TaskContext = React.createContext({
    taskName: '',
    taskID: '',
    saveTask: (taskName, taskID) => {},
    removeTask: () => {},
});

export const TaskContextProvider = (props) => {
    const [taskName, setTaskName] = useState('');
    const [taskID, setTaskID] = useState('');

    useEffect(() => {
        // Check if task details are stored in localStorage
        const savedTaskName = localStorage.getItem('taskName');
        const savedTaskID = localStorage.getItem('taskID');
        
        if (savedTaskName && savedTaskID) {
            setTaskName(savedTaskName);
            setTaskID(savedTaskID);
        }
    }, []);

    const saveTask = (name, id) => {
        setTaskName(name);
        setTaskID(id);
        localStorage.setItem('taskName', name);
        localStorage.setItem('taskID', id);
    };

    const removeTask = () => {
        setTaskName('');
        setTaskID('');
        localStorage.removeItem('taskName');
        localStorage.removeItem('taskID');
    };

    const contextValue = {
        taskName: taskName,
        taskID: taskID,
        saveTask: saveTask,
        removeTask: removeTask,
    };

    return (
        <TaskContext.Provider value={contextValue}>
            {props.children}
        </TaskContext.Provider>
    );
};

export default TaskContext;
