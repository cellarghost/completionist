
import './App.css'
import { Box } from '@mui/material'
import Timeline from './components/Timeline/Timeline'
import { testData } from './testData';
import { createContext, useEffect, useReducer } from 'react';
import { useState } from 'react';
import type { ProgramState, Action, Context } from './interfaces/state';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TaskPreview } from './components/Panel/TaskPreview';
import TaskInProgress from './components/Panel/TaskInProgress';
import { useRef } from 'react';


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
    
    case "MOVE_TASK":
      console.log('[MOVE_TASK]: ', action.payload);
      const taskInd = action.payload.startPos
      // taskInd: 0
      const timeline_noTask = state.timeline.toSpliced(taskInd, 1)
      
      return {
        ...state,
        timeline: timeline_noTask.toSpliced(action.payload.moveTo, 0, action.payload.taskID)
      }
    
    case "TOGGLE_PLAYBACK":
      return {
        ...state,
        playbackState: {
          ...state.playbackState,
          paused: !state.playbackState.paused,
          started: true
        }
      }
    
    case "INCREMENT_TASK_NO": {

      let list_complete = false;
      if ((state.playbackState.currentTask + 1) >= state.timeline.length) {
        list_complete = true;
      }
      return {
        ...state,
        playbackState: {
          paused: list_complete,
          elapsed_task: 0,
          currentTask: list_complete ? 0 : state.playbackState.currentTask + 1,
          started : !list_complete
        }
      }
    }

    case "INCREMENT_TIMER_100MS": {
      let pause = false;
      const task = state.taskMap[state.timeline[state.playbackState.currentTask]];
      if ((state.playbackState.elapsed_task + 100) >= task.duration_ms) {
        pause = true;
      }
      return {
        ...state,
        playbackState: {
          ...state.playbackState,
          paused: pause,
          elapsed_task: state.playbackState.elapsed_task + 100,
        }
      }
    }

    case "STOP_PROGRESS": {
      return {
        ...state,
        playbackState: {
          elapsed_task: 0, 
          currentTask: 0,
          paused: true,
          started: false
        }
      }
    }

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

  const timerRef = useRef<any>(null);

  useEffect(() => {
  if (programState.playbackState.paused) {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return;
  }

  // restart interval on unpause or task change
  timerRef.current = setInterval(() => {
    dispatch({ type: "INCREMENT_TIMER_100MS", payload: null });
  }, 100);

  return () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };
}, [
  programState.playbackState.paused,
  programState.playbackState.currentTask
]);

  useEffect(() => {
    console.log('[Debug] programState: ', programState)
    console.log('[Timeline]: ', programState.timeline)
  }, [programState])

  const [currentlySelected, setCurrentlySelected] = useState<number | null>(null);

  const handleSelectTask = (id:number | null) => {
      setCurrentlySelected(id);
  }

  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StateContext.Provider value={{state: programState, dispatch: dispatch, getNextID: getNextID, timerRef: timerRef}}>
        <Box sx={{display: 'flex', 
          flexDirection: 'row', 
          border: 'none', 
          minWidth: '80vw',
          justifyContent: 'space-evenly'
          }}>
          <Box sx={{
            borderRadius: "0.5rem",
            bgcolor: "rgba(234, 221, 225, 1)",
            minWidth: "20vw",
            minHeight: "85vh",
            padding: "1rem"
            }}>
            <Timeline currentlySelected={currentlySelected} handleSelectTask={handleSelectTask}/>
          </Box>
          <Box sx={{minWidth: '40vw'}}>
            {programState.playbackState.started ? 
              <TaskInProgress task={programState.taskMap[programState.timeline[programState.playbackState.currentTask]]}/> : 
              (currentlySelected != null) ? 
              ( programState.taskMap[currentlySelected] &&
                <TaskPreview task={programState.taskMap[currentlySelected]} currentlySelected={currentlySelected}/>
              )
            : null 
            }
          </Box>
        </Box>
      </StateContext.Provider>
    </LocalizationProvider>
    </>
  )
}

export default App
