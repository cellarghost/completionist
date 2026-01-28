import { Box, IconButton } from "@mui/material";
import type { Task } from "../../interfaces/state";
import { useEffect, useRef, useState } from "react";
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


export default function TaskBox({ task, handleOpenTaskEdit, pos, currentlySelected, handleSelectTask }: { 
    task: Task, 
    handleOpenTaskEdit: Function, 
    pos: number 
    currentlySelected: number | null,
    handleSelectTask: Function
}) {
    
    const [elapsed, setElapsed] = useState<number | null>(null)

    const {state, dispatch, } = useContext(StateContext);

    const [taskPos, setTaskPos] = useState<number | null>(null)

    useEffect(() => {
        setTaskPos(state.timeline.findIndex((e) => e == task.id))
    }, [state.timeline])

    useEffect(() => {
        if (state.playbackState.currentTask == taskPos) {
            setElapsed(state.playbackState.elapsed_task);
        }
        console.log('[playbackstate]: ', elapsed, task.duration_ms)
    }, [state.playbackState])

    const timerRef = useRef<any>(null);

    // const timer = setInterval(() => {
    //     dispatch({type: "INCREMENT_TIMER_100MS", payload: null})
    // })

    useEffect(() => {
        if (state.playbackState.paused) {
            clearInterval(timerRef.current)
        } else {
            timerRef.current = setInterval(() => {
                dispatch({type: "INCREMENT_TIMER_100MS", payload: null})
            }, 100)
        }
    }, [state.playbackState.paused])

    useEffect(() => {
        if ((state.playbackState.currentTask == task.id) && !state.playbackState.paused) {
            if (!timerRef.current) {
                timerRef.current = setInterval(() => {
                    dispatch({type: "INCREMENT_TIMER_100MS", payload: null})
                }, 100)
            }
        }
    }, [state.playbackState.currentTask])

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

    const handleEditTask = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation();
        handleOpenTaskEdit(false, task.id)
    }

    const handleMouseDown = (ev: React.MouseEvent) => {
        ev.stopPropagation();
        if (currentlySelected == task.id) {
            handleSelectTask(null);
        } else {
            handleSelectTask(task.id)
        }
    }

    return (
        <div ref={setNodeRef} style={style}>
            <Box>
                <Box sx={{
                    display: 'flex',
                    bgcolor: (currentlySelected == task.id) ? 'rgba(116, 82, 98, 1)' : 'rgba(142, 105, 121, 1)',
                    flexDirection: 'column',
                    borderRadius: '0.4rem',
                    color: "white",
                    transform: (currentlySelected == task.id) ? 'scale(1.01)' : 'scale(1)',
                    transition: 'transform 0.2s',
                    userSelect: 'none',
                    boxShadow: (currentlySelected == task.id) ? 'inset rgba(0, 0, 0, 0.22) 0px 0px 10px' : undefined,
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

                        <div {...listeners} {...attributes} className="drag-handle"
                        onMouseDown={(e) => {e.stopPropagation()}}
                        style={{
                            fontSize: 24
                        }}
                        >
                            ⠿
                        </div>
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
                                    <IconButton onClick={handleDelete} onMouseDown={(e) => e.stopPropagation()}>
                                        <DeleteIcon 
                                            sx={{justifySelf: 'end'}}
                                        />
                                    </IconButton>
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
                <progress value={Number(elapsed)} max={task.duration_ms} style={{
                    width: '100%', 
                    margin: 0, 
                    padding: 0, 
                    height: '7px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(0, 0, 0, 0)'
                    }}/>
                </Box>
            </Box>
        </div>
    )
}