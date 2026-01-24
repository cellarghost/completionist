import { Box } from "@mui/material";
import type { Task } from "../../interfaces/state";


export default function TaskBox({ task }: { task: Task }) {
    return (
        <Box>
            <h2>{task.title}</h2>
            <h3>Duration: {task.duration_ms}</h3>
        </Box>
    )
}