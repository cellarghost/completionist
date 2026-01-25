
import './App.css'
import { Box } from '@mui/material'
import Timeline from './components/Timeline/Timeline'
import { testData } from './testData';
import { createContext, useReducer } from 'react';
import { useState } from 'react';
import type { ProgramState, Action, Context } from './interfaces/state';


export const StateContext = createContext<Context>(null!);

function reducer(state: ProgramState, action: Action) {

  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        taskMap: {
          ...state.taskMap,
          [action.payload.id]: action.payload,
        },
        timeline: [...state.timeline, action.payload.id]
      };

    case "REMOVE_TASK":
      const newMap = { ...state.taskMap };
      delete newMap[action.payload];
      return { 
        ...state, 
        taskMap: newMap,
        timeline: state.timeline.filter(tId => tId !== action.payload)
      };

    case "UPDATE_TASK":
      return {
        ...state,
        taskMap: {
          ...state.taskMap,
          [action.payload.id]: action.payload,
        },
      };

    default:
      return state;
  }
}

function getNextID(state: ProgramState) {
  return Object.keys(state.taskMap).length;
}

function App() {

  const [programState, dispatch] = useReducer(
    reducer,
    testData
  )

  return (
    <>
      <StateContext.Provider value={{state: programState, dispatch: dispatch, getNextID: getNextID}}>
        <Box sx={{
          border: "3px solid blue",
          minWidth: "15vw",
          minHeight: "50vh",
          padding: "1rem"
          }}>
          <Timeline />
        </Box>
      </StateContext.Provider>
    </>
  )
}

export default App
