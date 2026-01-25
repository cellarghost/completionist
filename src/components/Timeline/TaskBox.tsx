import { Box, IconButton } from "@mui/material";
import type { Task } from "../../interfaces/state";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext } from "react";
import { StateContext } from "../../App";

export default function TaskBox({ task, handleOpenTaskEdit }: { task: Task, handleOpenTaskEdit: Function }) {

    const {state, dispatch, } = useContext(StateContext);

    const handleDelete = () => {
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

    const handleEditTask = () => {
        handleOpenTaskEdit(false, task.id)
    }

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            bgcolor: 'rgba(142, 105, 121, 1)',
            padding: '0.5rem',
            borderRadius: '0.4rem',
            color: "white",
        }}>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                justifySelf: 'end'
            }}>
                <h2>{task.title}</h2>
                <Box>
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
            <h3>Duration: {task.duration_ms}</h3>
        </Box>
    )
}