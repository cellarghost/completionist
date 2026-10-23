import { useEffect, useState } from "react";
import type { TaskMap } from "../../interfaces/state";

type IsPaused = 'playing' | 'paused' | 'stopped';

interface PlaybackState_new {
    currentTask: number,
    currentTaskDuration: number,
    completionPct: number,
    taskStartTimestamp: number,
    taskPauseOffset: number,
    isPaused: IsPaused
}


export default function usePlaybackTimeline(taskMap: TaskMap) {

    const get_init_taskdur = () => {
        if (taskMap[0]) {
            return taskMap[0].duration_ms;
        } else {
            return 0;
        }
    }

    const init_playback_state = (current_task_duration?: number, paused?: IsPaused): PlaybackState_new => {
        // const timestamp = Date.now();
        return {
            currentTask: 0,
            currentTaskDuration: current_task_duration || get_init_taskdur(),
            completionPct: 0,
            taskStartTimestamp: -1,
            taskPauseOffset: 0,
            isPaused: paused || 'stopped'
        }
    }

    const [playbackState, setPlaybackState] = useState(
        {...init_playback_state(get_init_taskdur())}
    );
    
    const stopPlayback = (current_task_duration?: number) => {
        setPlaybackState(init_playback_state(current_task_duration, 'stopped'));
    }

    const [pauseTimestamp, setPauseTimestamp] = useState(-1);

    const incPlayback = (diff: number) => {

        
        // check if task completed since last tap
        // console.log('INCPLAYBACK')
        // console.log('DIFF : ', diff)
        // console.log('CTD : ', playbackState.currentTaskDuration);
        if (diff >= playbackState.currentTaskDuration) {

            if ((playbackState.currentTask + 1) > (Object.keys(taskMap).length - 1)) {
                init_playback_state(0, 'stopped');
                return;
            }

            const remainder_ms = diff - playbackState.currentTaskDuration;
            const next_taskStartTimestamp = Date.now() - remainder_ms;
            const next_task_id = playbackState.currentTask + 1;
            // find the progress of next task
            const next_task_dur = taskMap[next_task_id].duration_ms;
            const next_task_completion = remainder_ms / next_task_dur;
            
            setPlaybackState(() => {return {
                currentTask: next_task_id,
                currentTaskDuration: next_task_dur,
                completionPct: next_task_completion,
                taskStartTimestamp: next_taskStartTimestamp,
                taskPauseOffset: 0,
                isPaused: 'playing',
            }})

            return;
        }

        const completion = (diff / playbackState.currentTaskDuration);

        setPlaybackState((prev) => {return {
            ...prev,
            completionPct: completion
        }})
    }

    useEffect(() => {

        if (playbackState.isPaused !== 'playing') return; 

        const inc = setTimeout(() => {
            const currentTime = Date.now();
            const diff = (currentTime - playbackState.taskPauseOffset) - (playbackState.taskStartTimestamp);
            incPlayback(diff);
        }, 250)

        return () => clearTimeout(inc);

    }, [playbackState])

    const nextTask = () => {

        console.log('NEXT TASK::')
        console.log('PBS: ', playbackState)
        console.log('TSKMP: ', taskMap)
        console.log('TSKMP LEN: ', Object.keys(taskMap).length)

        if ((playbackState.currentTask + 1) > (Object.keys(taskMap).length - 1)) {
            console.log('TASKS FINISHED - STOPPING')
            stopPlayback(0)
            return;
        }

        const timestamp = Date.now();

        setPlaybackState((prev) => { return {
            ...prev,
            currentTask: prev.currentTask + 1,
            currentTaskDuration: taskMap[prev.currentTask + 1].duration_ms,
            completionPct: 0,
            isPaused: 'playing',
            taskStartTimestamp: timestamp,
            taskPauseOffset: 0,
            }}
        )
    }

    const togglePause = () => {

        const is_paused: IsPaused = playbackState.isPaused 
        // 
        if (is_paused === 'stopped') {

            if (!taskMap[0]) {
                console.error('No tasks in timeline.')
                return;
            }

            const timestamp = Date.now();
            setPauseTimestamp(-1);

            setPlaybackState((prev) => {return {
                ...prev,
                currentTaskDuration: taskMap[0].duration_ms,
                taskStartTimestamp: timestamp,
                isPaused: 'playing',
            }})

        } else if (is_paused === 'playing') {

            const pause_start_timestamp = Date.now();
            setPauseTimestamp(pause_start_timestamp);
            setPlaybackState((prev) => {return {
                ...prev,
                isPaused: 'paused'
            }})

        } else if (is_paused === 'paused') {

            // if unpausing

            const pause_end_timestamp = Date.now();

            if (pauseTimestamp === -1) {
                console.error('No pause timestamp set.')
                return;
            }
            
            const pause_offset = pause_end_timestamp - pauseTimestamp;
            setPauseTimestamp(-1);
            setPlaybackState((prev) => {return {
                ...prev,
                taskPauseOffset: prev.taskPauseOffset + pause_offset,
                isPaused: 'playing',
            }})
            // add to pause offset
        }
    }

    useEffect(() => {
        // console.log('PLAYBACKSTATE CHANGED :: ', playbackState);
    }, [playbackState])

    return {togglePause, playbackState, stopPlayback, nextTask};

}