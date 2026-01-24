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
            title: "Task 1",
            duration_ms: 120000,
            hasSubtasks: false
        },
        1: {
            title: "Task 2",
            duration_ms: 120000,
            hasSubtasks: false
        }
    },
    timeline: {
        0: {
            taskID: 0,
            inProgress: false,
            completed: false
        },
        1: {
            taskID: 1,
            inProgress: false,
            completed: false
        }
    }
}