export interface UserState {
    playing: boolean
    progress_ms: number 
    currentTask: number 
    taskProgress_ms: number 
}

export interface TaskMap {
    [id: number]: Task;
}

export interface Task {
    title: string
    duration_ms: number
    hasSubtasks: boolean
    subTasks?: number[]
}

export interface TaskProgress {
    taskID: number 
    inProgress: boolean
    completed: boolean
}

export interface Timeline {
    [id: number]: TaskProgress
}

export interface ProgramState {
    user: UserState
    taskMap: TaskMap 
    timeline: Timeline 
}