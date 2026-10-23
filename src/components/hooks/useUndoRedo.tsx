import { useEffect, useState } from "react";
import { applyDiff, getDiff } from "recursive-diff";

export interface UndoRedo {
    store_undo: (prev: any, next: any) => any;
    apply_undo: (current: any) => any;
    apply_redo: (current: any) => any;
}

export default function useUndoRedo() {
    const [undoQueue, setUndoQueue] = useState<any[]>([])
    const [redoQueue, setRedoQueue] = useState<any[]>([])

    const store_undo = (prev: any, next: any) => {
        const undo_diff = getDiff(next, prev);
        console.log('UNDO DIFF: ', undo_diff);
        if (undo_diff.length < 1) {
            console.error('Empty diff, aborting -');
            return;
        }
        setUndoQueue((prv) => {return [...prv, [...undo_diff]]});
    }

    const apply_undo = (current: any) => {

        if (undoQueue.length < 1) {
            console.error('Cannot undo: Queue empty.')
            return;
        }

        const diff = undoQueue[undoQueue.length - 1]
        const result = applyDiff(structuredClone(current), diff);
        const redo_diff = getDiff(result, current);

        setUndoQueue((prv) => {
            const arr = [...prv];
            arr.pop();
            return arr;
        })

        setRedoQueue((prev) => {return [...prev, [...redo_diff]]});

        return result;
    }

    const apply_redo = (current: any) => {
        if (redoQueue.length < 1) {
            console.error('Cannot redo: Queue empty.')
            return;
        }

        const redo_diff = redoQueue[redoQueue.length - 1];
        const result = applyDiff(current, redo_diff);
        setRedoQueue((prv) => {
            const arr = [...prv];
            arr.pop();
            return arr;
        })

        return result;
    }

    useEffect(() => {
        console.log('UNDOREDO ::')
        console.log(undoQueue)
        console.log(redoQueue)
        console.log('/////')
    }, [undoQueue, redoQueue]);

    return {store_undo, apply_undo, apply_redo}
}