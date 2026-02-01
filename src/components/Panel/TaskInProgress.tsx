import type { Task } from "../../interfaces/state";
import dayjs from "dayjs";
import { StateContext } from "../../App";
import { useContext, useState, useEffect } from "react";
import { Button } from "@mui/material";

export default function TaskInProgress({task} : {task: Task}) {

    const {state, dispatch, timerRef} = useContext(StateContext);

    const [taskPos, setTaskPos] = useState<number | null>(null)
    
    useEffect(() => {
        setTaskPos(state.timeline.findIndex((e) => e == task.id))
    }, [state.timeline])

    const handleNextTask = () => {
        dispatch({type: "INCREMENT_TASK_NO", payload: null})
    }

    return (
        <>
            <h1>{task.title}</h1>
            <Button onClick={handleNextTask} variant="contained">Complete / Skip</Button>
            <h2>{dayjs.duration(
                task.duration_ms - state.playbackState.elapsed_task
                ).format("HH:mm:ss")}</h2>
            <p>
                {task.description}
            </p>
        </>
    )
}