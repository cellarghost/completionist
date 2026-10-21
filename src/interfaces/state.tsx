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
    getNextID: Function,
    timerRef:  any
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

export type SortOrder = "ASC" | "DESC"

export type Action =
  | { type: "ADD_TASK"; payload: Task }
  | { type: "REMOVE_TASK"; payload: number }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "MOVE_TASK"; payload: TaskDrop}
  | { type: "TOGGLE_PLAYBACK"; payload: any}
  | { type: "INCREMENT_TASK_NO"; payload: any}
  | { type: "INCREMENT_TIMER_100MS"; payload: any}
  | { type: "STOP_PROGRESS"; payload: any}
  | { type: "SORT_DURATION"; payload: SortOrder}
  | { type: "LOAD_STATE"; payload: {idbState: ProgramState}}

export interface TaskEditorProperties {
    isNew: boolean | null,
    id: number | null,
    title: string | null,
    duration_ms: number | null
}

/* 
re-implementing the timer system / playback state:

date.now on timer start
every 100ms, call date.now
get difference, increment

PAUSES:
keep an array of integers, and keep a pause bool
on pause,
- set pause to true
- target_pause_index: starts at 0, increments on each unpause
- store date.now in new struct

on unpause:
- collect date.now
- calculate time difference between pause and unpause
- add that to pause array at ind target_pause_idx
- increment 

*/


/* 
current issue: tabbed out pauses

task tracking:

keep index of current task 

-current_task
-task progression: % or number

timeouts n timers don't work when tabbed out

1. call date.now when a task is started
2. every 500ms, call date.now and find the difference. 
    - ordinarily this will be 100ms obviously, but may differ due to tabbing out or browser inactivity
3. difference / task duration will give completion %
4. if difference >= task duration: 
    - inc task, 
    - find remainder time, 
    - add date.now 
    - find % completion of next task, update. 



*/
