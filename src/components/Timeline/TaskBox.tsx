import { Box, IconButton } from "@mui/material";
import type { Task } from "../../interfaces/state";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext } from "react";
import { StateContext } from "../../App";
import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import durationFormat from "dayjs/plugin/duration";
dayjs.extend(duration);
dayjs.extend(durationFormat);
import { useDraggable } from "@dnd-kit/core";
import {CSS} from '@dnd-kit/utilities';

export default function TaskBox({ task, handleOpenTaskEdit, pos }: { task: Task, handleOpenTaskEdit: Function, pos: number }) {

    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: task.id,
        data: {
            pos: pos
        }
    });
    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const {state, dispatch, } = useContext(StateContext);

    const handleDelete = (ev: MouseEvent) => {
        ev.stopPropagation();
        console.log('[handleDelete]: ', task)
        console.log('[state]', state)
        try {
            dispatch({
                type: "REMOVE_TASK",
                payload: task.id
            })
        }
        catch(e) {
            console.error(e)
            console.log(state)
        }
    }

    const handleEditTask = (ev: MouseEvent) => {
        ev.stopPropagation();
        handleOpenTaskEdit(false, task.id)
    }

    return (
        <div ref={setNodeRef} style={style}>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                bgcolor: 'rgba(142, 105, 121, 1)',
                padding: '0.5rem',
                borderRadius: '0.4rem',
                color: "white",
            }}
            >
                <div {...listeners} {...attributes} className="drag-handle"
                style={{
                    fontSize: 24
                }}
                >
                    ⠿
                </div>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: '100%'
                }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        flexWrap: 'nowrap'
                    }}>
                        <h2>{task.title}</h2>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            <IconButton onClick={handleEditTask}>
                                <EditIcon 
                                    sx={{justifySelf: 'end'}}
                                />
                            </IconButton>
                            <IconButton onClick={handleDelete}>
                                <DeleteIcon 
                                    sx={{justifySelf: 'end'}}
                                />
                            </IconButton>
                        </Box>
                    </Box>
                    <h3>{dayjs.duration(task.duration_ms).format("HH:mm:ss")}</h3>
                </Box>
            </Box>
        </div>
    )
}