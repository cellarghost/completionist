import { useDroppable } from "@dnd-kit/core"
import { Divider } from "@mui/material"
import type { ReactNode } from "react";

export default function DropTask({ pos, children } : {pos: number, children: ReactNode}) {

    const {isOver, setNodeRef} = useDroppable({
        id: 'drop' + String(pos),
        data: {
            pos: pos,
        }
    });

    return (
        <div ref={setNodeRef} style={{
            minHeight: '0.3rem',
            backgroundColor: isOver ? 'rgba(158, 183, 194, 0.23)' : undefined,
            border: isOver ? '1px solid rgba(158, 193, 218, 1)' : undefined,
            borderRadius: '3px'
        }}>
            <Divider/>
            <div style={{
                padding: '0.3rem',
                opacity: isOver ? 0.5 : undefined
                }}>
                {children}
            </div>
        </div>
    )
}