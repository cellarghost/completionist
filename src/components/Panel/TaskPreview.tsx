import { Box } from "@mui/material";
import type { Task, TaskEditorProperties } from "../../interfaces/state";
import { useContext, useEffect, type FormEventHandler } from "react";
import { TextField, Button } from "@mui/material";
import { StateContext } from "../../App";
import { useState } from "react";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import durationFormat from "dayjs/plugin/duration";
dayjs.extend(duration);
dayjs.extend(durationFormat);



export function TaskPreview({task, currentlySelected} : {task: Task, currentlySelected: null | number}) {
    
    const {state: programState, dispatch, getNextID} = useContext(StateContext);

    const [newTitle, setNewTitle] = useState<String | null>(task.title);
    const [newDuration_ms, setNewDuration_ms] = useState<number | null>(task.duration_ms);

    useEffect(() => {
        setNewTitle(task.title);
        setNewDuration_ms(task.duration_ms);
    }, [currentlySelected])

    useEffect(() => {
        dispatch({
            type: "UPDATE_TASK",
            payload: { id: task.id, title: newTitle, duration_ms: newDuration_ms }
        });
    }, [newDuration_ms, newTitle])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({
            type: "UPDATE_TASK",
            payload: { id: task.id, title: newTitle, duration_ms: newDuration_ms }
        });
        // console.log(msToTimeFormat(Number(duration)))
    };

    const handleChangeDurationMS = (newValue: Dayjs | null) => {
        if (!newValue) return;

        const ms =
            newValue.hour() * 3600000 +
            newValue.minute() * 60000 +
            newValue.second() * 1000;

        setNewDuration_ms(ms);
    };

    return (
        <Box>
            {task && (
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
                    <TextField 
                        sx={{
                                "& .MuiInput-root": {
                                    fontSize: "2.5rem",       // h1 size
                                    fontWeight: "bold",
                                    lineHeight: 1.2,
                                },
                                "& .MuiInput-underline:before": {
                                    borderBottomWidth: "2px", // thicker underline
                                },
                                "& .MuiInput-underline:after": {
                                    borderBottomWidth: "3px", // thicker active underline
                                }
                            }}
                        value={newTitle}
                        variant="standard"
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <TimePicker
                        ampm={false}
                        views={['hours', 'minutes', 'seconds']}
                        value={dayjs().startOf("day").add(Number(newDuration_ms), "millisecond")}
                        onChange={handleChangeDurationMS}
                        format="HH:mm:ss"   // NEW replacement for inputFormat
                        slotProps={{ 
                            textField: { label: "Duration" } 
                        }}
                    />
                </form>
            )}
        </Box>
    )
}