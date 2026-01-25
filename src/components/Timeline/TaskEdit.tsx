import { Box } from "@mui/material";
import type { Task, TaskEditorProperties } from "../../interfaces/state";
import { useContext, type FormEventHandler } from "react";
import { TextField, Button } from "@mui/material";
import { StateContext } from "../../App";
import { useState } from "react";

export default function TaskEdit({handleCloseDialog, taskEditProperties}: {
    handleCloseDialog: Function,
    taskEditProperties: TaskEditorProperties;
    }) 
{

    const dispatch = useContext(StateContext).dispatch;
    const [title, setTitle] = useState(taskEditProperties.title);
    const [duration, setDuration] = useState(taskEditProperties.duration_ms);
    const [isNew, setIsNew] = useState(taskEditProperties.isNew);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isNew) {
            dispatch({
            type: "ADD_TASK",
            payload: { id: taskEditProperties.id, title: title, duration_ms: duration }
        });
        }
        dispatch({
            type: "UPDATE_TASK",
            payload: { id: taskEditProperties.id, title: title, duration_ms: duration }
        });
        handleCloseDialog();
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                padding: "0.5rem",
                textAlign: "start",
                gap: '0.5rem'
            }}>
                <TextField 
                    value={title} 
                    size="small" 
                    label="Title" 
                    onChange={e => setTitle(e.target.value)} 
                />
                <TextField 
                    value={duration} 
                    size="small" 
                    label="Duration" 
                    onChange={e => setDuration(+e.target.value)} 
                />
                <Box sx={{display: 'flex', justifyContent: 'space-around'}}>
                    <Button variant="contained" type="submit">Save</Button>
                    <Button variant="contained" onClick={() => handleCloseDialog()}>Cancel</Button>
                </Box>
            </Box>
        </form>
    )
}