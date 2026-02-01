import { Box, Button, ClickAwayListener, Menu, MenuItem, MenuList, Paper, Popper } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import TaskBox from "./TaskBox";
import { StateContext } from "../../App";
import { useContext } from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import type { SortOrder, Task, TaskEditorProperties, TaskOverlay } from "../../interfaces/state";
import TaskEdit from "./TaskEdit";
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import DropTask from "./DropTask";
import { motion } from "motion/react";
import PlaybackBar from "./PlaybackBar";

export default function Timeline({currentlySelected, handleSelectTask} : 
    {currentlySelected: number | null, handleSelectTask: Function}) 
{

    const [sortMenuOpen, setSortMenuOpen] = useState(false);

    const anchorRef = useRef<HTMLButtonElement>(null);

    const handleSortMenuToggle = () => {
        setSortMenuOpen((prevOpen) => !prevOpen);
    };

    const {state: programState, dispatch, getNextID} = useContext(StateContext);

    const [openDialog, setOpenDialog] = useState(false);

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    useEffect(() => {
        handleSelectTask(programState.timeline[programState.timeline.length-1])
    }, [programState.timeline.length])

    const [activeId, setActiveId] = useState<null | TaskOverlay>(null);

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

    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (
        anchorRef.current &&
        anchorRef.current.contains(event.target as HTMLElement)
        ) {
        return;
        }

        setSortMenuOpen(false);
    };

    const handleAddTask = () => {

        const nextID = getNextID(programState);

        dispatch({
            type: "ADD_TASK",
            payload: { id: nextID, title: "New Task", duration_ms: 60000, description: "" }
        });
    }

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

        setActiveId(null);
    }

    const handleDragStart = (e: DragStartEvent) => {

        const active: TaskOverlay = {
            taskID: Number(e.active.id),
            pos: e.active.data.current?.pos
        }

        setActiveId(active);
    }

    const handleSortBy = (order: SortOrder) => {
        dispatch({type: "SORT_DURATION", payload: order})
    }

    const prevOpen = useRef<any>(sortMenuOpen);

    useEffect(() => {
        if (prevOpen.current === true && sortMenuOpen === false) {
            anchorRef.current!.focus();
        }

        prevOpen.current = sortMenuOpen;
    }, [sortMenuOpen]);
    
    return (
        <Box onMouseDown={() => {handleSelectTask(null)}}>
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Button 
                        variant="contained" 
                        onClick={() => {handleAddTask()}}
                        sx={{
                            bgcolor: 'rgba(80, 56, 67, 1)', 
                            marginBottom: '0rem',
                            fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
                            color: 'white',
                        }}
                    >
                        Add Task
                    </Button>
                    <Button 
                        ref={anchorRef}
                        variant="contained" 
                        onClick={handleSortMenuToggle}
                        aria-controls={sortMenuOpen ? 'composition-menu' : undefined}
                        aria-expanded={sortMenuOpen ? 'true' : undefined}
                        aria-haspopup="true"
                        sx={{
                            bgcolor: 'rgba(80, 56, 67, 1)', 
                            marginBottom: '0rem',
                            fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
                            color: 'white',
                        }}
                    >
                        Sort
                    </Button>
                    <Popper
                        open={sortMenuOpen}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        placement="bottom-start"
                        transition
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <Menu
                                    anchorEl={anchorRef.current}
                                    open={sortMenuOpen}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={() => handleSortBy("ASC")}>
                                        Shortest Duration
                                    </MenuItem>
                                    <MenuItem onClick={() => handleSortBy("DESC")}>
                                        Longest Duration
                                    </MenuItem>
                                </Menu>
                            </ClickAwayListener>
                        </Paper>
                    </Popper>
                    <PlaybackBar />
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: '0rem', paddingTop: '1rem'}}>
                    {Object.keys(programState.timeline).map((str_id) => {
                        console.log(str_id)
                        const id = Number(str_id)
                        const taskID: number = programState.timeline[id];
                        
                        return (
                            <motion.div key={taskID} layout transition={{duration: 0.25}}>
                                <DropTask pos={id}>
                                    <TaskBox task={programState.taskMap[taskID]} 
                                    handleOpenTaskEdit={handleOpenTaskEdit} 
                                    pos={id}
                                    currentlySelected={currentlySelected}
                                    handleSelectTask={handleSelectTask}
                                    />
                                </DropTask>
                            </motion.div>
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
                <DragOverlay>
                    {activeId ? (
                            <TaskBox task={programState.taskMap[activeId.taskID]} 
                            handleOpenTaskEdit={handleOpenTaskEdit} 
                            pos={activeId.pos}
                            currentlySelected={currentlySelected}
                            handleSelectTask={handleSelectTask}
                            />
                    ): null}
                </DragOverlay>
            </DndContext>
        </Box>
    )
}