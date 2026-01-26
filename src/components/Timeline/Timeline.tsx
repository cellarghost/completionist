import { Box, Button } from "@mui/material";
import { useState } from "react";
import TaskBox from "./TaskBox";
import { StateContext } from "../../App";
import { useContext } from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import type { Task, TaskEditorProperties } from "../../interfaces/state";
import TaskEdit from "./TaskEdit";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import DropTask from "./DropTask";

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

    const handleDragEnd = (e: DragEndEvent) => {
        console.log('[handleDragEnd] : ', e)
        const taskID = e.active.id;
        const moveTo = e.over?.data.current?.pos;

        if (!(moveTo == null)) {
            console.log('yup')
            const startPos = e.active.data.current?.pos;
            dispatch({type: "MOVE_TASK", payload: {
                taskID: taskID,
                moveTo: moveTo,
                startPos: startPos
            }})
        }
    }
    
    return (
        <>
            <DndContext onDragEnd={handleDragEnd}>
                <Button variant="contained" onClick={() => {handleOpenTaskEdit(true)}}>Add Task</Button>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    {Object.keys(programState.timeline).map((str_id) => {
                        console.log(str_id)
                        const id = Number(str_id)
                        const taskID: number = programState.timeline[id];
                        
                        return (
                            <>
                                <DropTask pos={id}>
                                    <TaskBox task={programState.taskMap[taskID]} handleOpenTaskEdit={handleOpenTaskEdit} pos={id}/>
                                </DropTask>
                            </>
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
            </DndContext>
        </>
    )
}