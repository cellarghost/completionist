import type { ProgramState } from "./interfaces/state"

export const testData: ProgramState = {
    user: {
        playing: false,
        progress_ms: 0,
        currentTask: 0,
        taskProgress_ms: 0,
    },
    taskMap: {
        0: {
            id: 0,
            title: "Task 1",
            duration_ms: 120000,
            hasSubtasks: false,
            completed: false,
            description: ""
        }
    },
    timeline: [0],
    playbackState: {
        elapsed_task: 0, 
        currentTask: 0,
        paused: true,
    }
}