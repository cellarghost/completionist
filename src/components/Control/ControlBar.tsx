import { Box, Typography } from "@mui/material";
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import NavMenu from "../NavMenu/NavMenu";
import { useContext } from "react";
import { StateContext } from "../../App";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function ControlBar() {

    const {state, dispatch, undoManager} = useContext(StateContext);

    const applyUndo = () => {
        const result = undoManager.apply_undo({...state});
        if (result) {
            dispatch({type: 'APPLY_DIFF', payload: {...result}});
        }
    }

    const applyRedo = () => {
        const result = undoManager.apply_redo({...state});
        if (result) {
            dispatch({type: 'APPLY_DIFF', payload: {...result}});
        }
    }

    return (
        <Box sx={{
            minWidth: "100%", 
            paddingTop: '0.7rem',
            paddingBottom: '0.7rem',
            display: 'flex', 
            flexDirection: 'row',
            bgcolor: 'rgba(0, 0, 0, 0.1)',
            justifyContent: 'center',
            borderBottom: '1px solid rgba(247, 244, 244, 0.1)'
            }}>
            <Box sx={{marginLeft: '1rem', display: 'flex', flexDirection: 'row', minWidth: '66.5vw', justifyContent: 'space-between'}}>
                <Box sx={{display: 'flex', flexDirection: 'row'}}>
                    <NavMenu />
                    <IconButton onClick={applyUndo}>
                        <UndoIcon />
                    </IconButton>
                    <IconButton onClick={applyRedo}>
                        <RedoIcon /> 
                    </IconButton>
                </Box>
                <Box sx={{display: 'flex',  alignItems: 'center'}}>
                    <a href="https://tjordan.dev" style={{color: 'white'}}>
                        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.4rem'}}>
                            <Typography sx={{fontFamily: 'monospace'}}>tjordan.dev</Typography>
                            <OpenInNewIcon />
                        </Box>
                    </a>
                </Box>
            </Box>
        </Box>

    )
}