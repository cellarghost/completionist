import { useDroppable } from "@dnd-kit/core"
import { Divider } from "@mui/material"

export default function DropTask({ pos } : {pos: number}) {

    const {isOver, setNodeRef} = useDroppable({
        id: 'drop' + String(pos),
        data: {
            pos: pos,
        }
    });

    const style = {
        border: isOver ? '2px solid rgba(117, 141, 158, 1)' : undefined,
    };

    return (
        <div ref={setNodeRef} style={{
            minHeight: '0.3rem'
        }}>
            <Divider sx={style}/>
        </div>
    )
}