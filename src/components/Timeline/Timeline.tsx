import { Button } from "@mui/material";
import { testData } from "../../testData";
import TaskBox from "./TaskBox";


export default function Timeline() {
    return (
        <>
            <Button variant="contained">Add Task</Button>
            {Object.keys(testData.timeline).map((str_id) => {
                const id = Number(str_id)
                const taskID: number = testData.timeline[id].taskID;
                return (
                    <TaskBox task={testData.taskMap[taskID]}/>
                )
            })}
            
        </>
    )
}