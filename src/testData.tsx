import type { ProgramState } from "./interfaces/state"

export const testData: ProgramState = {
    user: {
        playing: false,
        progress_ms: 0,
        currentTask: 0,
        taskProgress_ms: 0,
    },
    taskMap: {
    },
    timeline: [],
    playbackState: {
        elapsed_task: 0, 
        currentTask: 0,
        paused: true,
        started: false,
    }
}