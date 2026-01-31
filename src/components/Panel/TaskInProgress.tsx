import type { Task } from "../../interfaces/state";
import dayjs from "dayjs";
import { StateContext } from "../../App";
import { useContext } from "react";
import { Button } from "@mui/material";

export default function TaskInProgress({task} : {task: Task}) {

    const {state, dispatch, } = useContext(StateContext);

    const handleNextTask = () => {
        dispatch({type: "INCREMENT_TASK_NO", payload: null})
    }

    return (
        <>
            <h1>{task.title}</h1>
            <Button onClick={handleNextTask}>Complete / Skip</Button>
            <h2>{dayjs.duration(task.duration_ms - state.playbackState.elapsed_task).format("HH:mm:ss")}</h2>
            <p>
                {task.description}
            </p>
        </>
    )
}