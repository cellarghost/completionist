import { Box, Button } from "@mui/material";
import { useState } from "react";
import TaskBox from "./TaskBox";
import { StateContext } from "../../App";
import { useContext } from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import type { Task, TaskEditorProperties } from "../../interfaces/state";
import TaskEdit from "./TaskEdit";

export default function Timeline() {

    const {state: programState, dispatch, getNextID} = useContext(StateContext);

    const [openDialog, setOpenDialog] = useState(false);

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenTaskEdit = (isNew: boolean, tid: number | null = null) => {
        console.log('[handleOpenTaskEdit]', programState)
        const id : number = !(tid===null) ? tid : getNextID(programState);
        console.log('[handleOpenTaskEdit]', tid)

        setTaskEditProperties({
            isNew: isNew,
            id: id,
            title: isNew ? null : programState.taskMap[id].title,
            duration_ms: isNew ? null : programState.taskMap[id].duration_ms
        })

        setOpenDialog(true);
    }

    const [taskEditProperties, setTaskEditProperties] = useState<TaskEditorProperties>({
        isNew: null,
        id: null,
        title: null,
        duration_ms: null
    })
    
    return (
        <>
            <Button variant="contained" onClick={() => {handleOpenTaskEdit(true)}}>Add Task</Button>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                {Object.keys(programState.timeline).map((str_id) => {
                    console.log(str_id)
                    const id = Number(str_id)
                    const taskID: number = programState.timeline[id];
                    
                    return (
                        <TaskBox task={programState.taskMap[taskID]} handleOpenTaskEdit={handleOpenTaskEdit}/>
                    )
                })}
            </Box>
            <Dialog open={openDialog}>
                <DialogTitle>Create/Edit Task</DialogTitle>
                <TaskEdit 
                    handleCloseDialog={handleCloseDialog}
                    taskEditProperties={taskEditProperties}
                />
            </Dialog>

        </>
    )
}