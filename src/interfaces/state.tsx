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
    id: number
    title: string
    duration_ms: number
    hasSubtasks: boolean
    subTasks?: number[]
    completed: boolean,
    description: String
}

export interface TaskProgress {
    taskID: number 
    inProgress: boolean
    completed: boolean
}

// export interface Timeline {
//     [id: number]: TaskProgress
// }

export interface ProgramState {
    user: UserState
    taskMap: TaskMap 
    timeline: number[],
    playbackState: PlaybackState
}

export interface Context {
    state: ProgramState,
    dispatch: Function
    getNextID: Function
}

export interface PlaybackState {
    elapsed_task: number, 
    currentTask: number,
    paused: boolean,
    started: boolean
}

export interface TaskDrop {
    taskID: number,
    moveTo: number,
    startPos: number,
}

export interface TaskOverlay {
    taskID: number,
    pos: number
}

export type Action =
  | { type: "ADD_TASK"; payload: Task }
  | { type: "REMOVE_TASK"; payload: number }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "MOVE_TASK"; payload: TaskDrop}
  | { type: "TOGGLE_PLAYBACK"; payload: any}
  | { type: "INCREMENT_TASK_NO"; payload: any}
  | { type: "INCREMENT_TIMER_100MS"; payload: any}
  | { type: "STOP_PROGRESS"; payload: any}

export interface TaskEditorProperties {
    isNew: boolean | null,
    id: number | null,
    title: string | null,
    duration_ms: number | null
}