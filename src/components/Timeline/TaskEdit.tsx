import { Box } from "@mui/material";
import type { TaskEditorProperties } from "../../interfaces/state";
import { useContext } from "react";
import { TextField, Button } from "@mui/material";
import { StateContext } from "../../App";
import { useState } from "react";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import durationFormat from "dayjs/plugin/duration";
dayjs.extend(duration);
dayjs.extend(durationFormat);



export default function TaskEdit({handleCloseDialog, taskEditProperties}: {
    handleCloseDialog: Function,
    taskEditProperties: TaskEditorProperties;
    }) 
{

    // const msToTimeFormat = (duration: number) => {
    //     const sec:number = Math.floor(duration/1000);
    //     const min:number = Math.floor(sec/60)
    //     const hr:number = Math.floor(min / 60)
    //     const r_mins:number = Math.floor(min % 60)
    //     const r_sec:number = Math.floor(sec % 60)

    //     console.log('[msTTFM] :: _MS: ', duration, '| ', hr, ':', r_mins, ':', r_sec)

    // }

    const dispatch = useContext(StateContext).dispatch;
    const [title, setTitle] = useState(taskEditProperties.title);
    const [duration_ms, setDuration_ms] = useState(taskEditProperties.duration_ms);
    // const [duration, setDuration] = useState(dayjs.duration(Number(duration_ms)).format("HH:mm:ss"));
    const [isNew, ] = useState(taskEditProperties.isNew);


    const handleChangeDurationMS = (newValue: Dayjs | null) => {
        if (!newValue) return;

        const ms =
            newValue.hour() * 3600000 +
            newValue.minute() * 60000 +
            newValue.second() * 1000;

        setDuration_ms(ms);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isNew) {
            dispatch({
            type: "ADD_TASK",
            payload: { id: taskEditProperties.id, title: title, duration_ms: duration_ms, description: "" }
        });
        }
        dispatch({
            type: "UPDATE_TASK",
            payload: { id: taskEditProperties.id, title: title, duration_ms: duration_ms, description: "" }
        });
        handleCloseDialog();
        // console.log(msToTimeFormat(Number(duration)))
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
                <TimePicker
                    ampm={false}
                    views={['hours', 'minutes', 'seconds']}
                    value={dayjs().startOf("day").add(Number(duration_ms), "millisecond")}
                    onChange={handleChangeDurationMS}
                    format="HH:mm:ss"   // NEW replacement for inputFormat
                    slotProps={{ 
                        textField: { label: "Duration" } 
                    }}
                />
                <Box sx={{display: 'flex', justifyContent: 'space-around'}}>
                    <Button variant="contained" type="submit">Save</Button>
                    <Button variant="contained" onClick={() => handleCloseDialog()}>Cancel</Button>
                </Box>
            </Box>
        </form>
    )
}