import { Box, IconButton } from "@mui/material";
import type { Task } from "../../interfaces/state";
import { useEffect,  useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext } from "react";
import { StateContext } from "../../App";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import durationFormat from "dayjs/plugin/duration";
dayjs.extend(duration);
dayjs.extend(durationFormat);
import { useDraggable } from "@dnd-kit/core";
import {CSS} from '@dnd-kit/utilities';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


export default function TaskBox({ task, pos, currentlySelected, handleSelectTask, useTimeline}: { 
    task: Task,
    pos: number 
    currentlySelected: number | null,
    handleSelectTask: Function,
    useTimeline: any
}) {
    
    // const [elapsed, setElapsed] = useState<number | null>(null)

    const {state, dispatch} = useContext(StateContext);

    // const [taskPos, setTaskPos] = useState<number | null>(null)

    // useEffect(() => {
    //     setTaskPos(state.timeline.findIndex((e) => e == task.id))
    // }, [state.timeline])

    const [collapsed, setCollapsed] = useState(true);

    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: task.id,
        data: {
            pos: pos
        }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const handleDelete = (ev: React.MouseEvent<HTMLButtonElement>) => {
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

    const [isComplete, setIsComplete] = useState<boolean>(false)

    useEffect(() => {
        console.log('IS COMPLETE :: ', task.title, 'POS::', pos, 'CT::', useTimeline.playbackState.currentTask)
        if (useTimeline.playbackState.isPaused !== 'stopped') {
            if (useTimeline.playbackState.currentTask > pos) {
                setIsComplete(true)
            } else {
                setIsComplete(false)
            }
        } else {
            setIsComplete(false);
        }
    }, [useTimeline.playbackState.currentTask])

    const handleMouseDown = (ev: React.MouseEvent) => {
        ev.stopPropagation();
        if (!state.playbackState.started) {
            if (currentlySelected == task.id) {
                handleSelectTask(null);
            } else {
                handleSelectTask(task.id)
            }
        }
    }

    return (
        <div ref={setNodeRef} style={style}>
            <Box>
                <Box sx={{
                    display: 'flex',
                    bgcolor: (currentlySelected == task.id) ? 'rgba(130, 153, 182, 0.36)' : 
                    (isComplete ? 'rgba(55, 139, 93, 0.45)' : 'rgba(83, 104, 131, 0.27)'),
                    flexDirection: 'column',
                    borderRadius: '0.4rem',
                    color: "white",
                    userSelect: 'none',
                    boxShadow: (currentlySelected == task.id) ? 'inset rgba(0, 0, 0, 0.22) 0px 0px 10px' : undefined,
                    border: (currentlySelected == task.id) ? '1px solid rgba(255, 255, 255, 0.06)' : undefined,
                    pointerEvents: (isComplete) ? 'none' : undefined,
                    gap: 0,
                }}
                onMouseDown={(e) => {
                    handleMouseDown(e)
                }}
                >
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        padding: '0.5rem',
                        paddingBottom: '0'
                    }}>

                        {(useTimeline.playbackState.isPaused === 'stopped') && <div {...listeners} {...attributes} className="drag-handle"
                        onMouseDown={(e) => {e.stopPropagation()}}
                        style={{
                            fontSize: 24
                        }}
                        >
                            ⠿
                        </div>}
                        {(useTimeline.playbackState.isPaused !== 'stopped') && <div className="drag-handle"
                        onMouseDown={(e) => {e.stopPropagation()}}
                        style={{
                            fontSize: 24,
                            opacity: 0.2
                        }}
                        >
                            ⠿
                        </div>}
                        <IconButton 
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                setCollapsed((prev) => (!prev))
                            }}
                            sx={{maxHeight: '0.5rem', maxWidth: '0.5rem', marginTop: '0.6rem', marginRight: '0.2rem'}}
                        >
                            {collapsed ? (
                                <ExpandMoreIcon />
                            ) : (
                                <ExpandLessIcon />
                            )}
                        </IconButton>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: '100%',
                        }}>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                flexWrap: 'nowrap'
                            }}>
                                <h2>{task.title}</h2>
                                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                    {(useTimeline.playbackState.isPaused !== 'playing') ? (
                                        <IconButton onClick={handleDelete} onMouseDown={(e) => e.stopPropagation()}>
                                            <DeleteIcon 
                                                sx={{justifySelf: 'end'}}
                                            />
                                        </IconButton>
                                    ) : (
                                        <IconButton onMouseDown={(e) => e.stopPropagation()} sx={{opacity: '0.3', cursor: 'not-allowed'}}>
                                            <DeleteIcon 
                                                    sx={{justifySelf: 'end'}}
                                            />
                                        </IconButton>
                                    )}
                                </Box>
                            </Box>
                            <Box sx={{
                                overflowY: 'hidden',
                                maxHeight: collapsed ? 0 : 100,
                                transition: 'max-height 0.2s ease-out'
                            }}
                            >
                                <h3>{dayjs.duration(task.duration_ms).format("HH:mm:ss")}</h3>
                            </Box>
                        </Box>
                    </Box>
                    <progress max={100} value={useTimeline.playbackState.completionPct * 100
                    } style={{
                        width: '100%', 
                        margin: 0, 
                        padding: 0, 
                        height: '7px',
                        border: 'none',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        opacity: (useTimeline.playbackState.currentTask === pos) ? 1 : 0
                        }}/>

                </Box>
            </Box>
        </div>
    )
}