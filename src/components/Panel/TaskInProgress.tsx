import type { Task } from "../../interfaces/state";
import dayjs from "dayjs";
import { StateContext } from "../../App";
import { useContext } from "react";
import { Button, Typography } from "@mui/material";
import { btnStyle } from "../../styles";

export default function TaskInProgress({task, useTimeline} : {task: Task, useTimeline: any}) {

    const {state} = useContext(StateContext);

    const handleNextTask = () => {
        // dispatch({type: "INCREMENT_TASK_NO", payload: null})
        useTimeline.nextTask();
    }

    return (
        <div className="taskInProgress" key={task.id}>
            {/* <title>{task.title}:{dayjs.duration(task.duration_ms).format("mm:ss")}</title> */}
            {(useTimeline.playbackState.isPaused === 'playing') && (
                <title>
                    {dayjs.duration(
                task.duration_ms - (useTimeline.playbackState.completionPct * task.duration_ms)
                ).format((useTimeline.playbackState.completionPct * task.duration_ms < 3600000) ? "mm:ss" : "HH:mm:ss")}
                </title>
            )}
            <h1>{task.title}</h1>
            <h2>{dayjs.duration(
                task.duration_ms - (useTimeline.playbackState.completionPct * task.duration_ms)
                ).format("HH:mm:ss")}</h2>
            <Typography sx={{ whiteSpace: 'pre-line', color: "white" }}>
                {task.description}
            </Typography>
            <Button onClick={handleNextTask} variant="contained" sx={btnStyle}>
                {(state.playbackState.currentTask >= state.timeline.length - 1) ? 
                    "Finish"
                :
                    `Next Task: ${state.taskMap[state.playbackState.currentTask + 1].title}`
                }
            </Button>
        </div>
    )
}