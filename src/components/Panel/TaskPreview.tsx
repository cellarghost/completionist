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
    const [newDesc, setNewDesc] = useState<String| null>(task.description)

    useEffect(() => {
        setNewTitle(task.title);
        setNewDuration_ms(task.duration_ms);
        setNewDesc(task.description);
    }, [currentlySelected])

    useEffect(() => {
        dispatch({
            type: "UPDATE_TASK",
            payload: { id: task.id, title: newTitle, duration_ms: newDuration_ms, description: newDesc }
        });
    }, [newDuration_ms, newTitle, newDesc])

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
        <Box sx={{
            borderRadius: '0.5rem',
            border: 'solid 1px rgba(0, 0, 0, 0.03) ',
            boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.18)',
            padding: '1rem',
            bgcolor: 'rgba(110, 87, 98, 0.93)',
            color: 'white',
        }}>
            {task && (
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
                    <TextField 
                        sx={{
                                "& .MuiInput-root": {
                                    fontSize: "2.5rem",       // h1 size
                                    fontWeight: "bold",
                                    lineHeight: 1.2,
                                    color: "white"
                                },
                                "& .MuiInput-underline:before": {
                                    borderBottomWidth: "2px", // thicker underline
                                    color: "white",
                                },
                                "& .MuiInput-underline:after": {
                                    borderBottomWidth: "3px", // thicker active underline
                                    color: "white",
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
                        sx={{}}
                        slotProps={{
                            textField: { 
                                label: "Duration",
                                InputProps: {
                                    sx: {
                                    // THIS controls the visible time text
                                    '& input': {
                                        color: 'white',
                                        WebkitTextFillColor: 'white',
                                        opacity: 1,
                                        
                                    },
                                    },
                                },
                                sx: {
                                    color: 'white',
                                    bgcolor: 'rgba(0, 0, 0, 0.34)',
                                    borderRadius: '4px',
                                    '& .MuiPickersSection-root': {
                                        color: 'white',
                                        
                                    },
                                    // INPUT TEXT (not placeholder)
                                    '& .MuiPickersInputBase-input': {
                                        color: 'white !important',
                                        
                                    },
                                    '& input': {
                                        color: 'white !important',
                                        WebkitTextFillColor: 'white', // fixes Safari / Chrome autofill
                                        
                                    },
                                    // PLACEHOLDER (when empty)
                                    '& .MuiPickersInputBase-input::placeholder': {
                                    color: 'white',
                                    opacity: 1,
                                    },

                                    // LABEL
                                    '& .MuiInputLabel-root': {
                                    color: 'white !important',
                                    
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'white !important',
                                    },

                                    // OUTLINE - default
                                    '& .MuiPickersOutlinedInput-notchedOutline': {
                                    borderColor: 'white !important',
                                    },

                                    // OUTLINE - hover
                                    '&:hover .MuiPickersOutlinedInput-notchedOutline': {
                                    borderColor: 'white !important',
                                    },

                                    // OUTLINE - focused (this kills the blue)
                                    '& .MuiPickersOutlinedInput-root.Mui-focused .MuiPickersOutlinedInput-notchedOutline':
                                    {
                                        borderColor: 'white !important',
                                    },

                                    // CLOCK ICON
                                    '& .MuiSvgIcon-root': {
                                    color: 'white !important',
                                    },
                                },
                            },
                        }}
                    />
                    <TextField
                        label="Description"
                        value={newDesc}
                        onChange={(e) => {setNewDesc(e.target.value)}}
                        multiline
                        maxRows={Infinity}
                        minRows={4}
                        sx={{
                            bgcolor: 'rgba(0, 0, 0, 0.34)',
                            borderRadius: '4px'
                        }}
                    />
                </form>
            )}
        </Box>
    )
}