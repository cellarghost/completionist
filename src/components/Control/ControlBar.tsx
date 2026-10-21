import { Box, Typography } from "@mui/material";
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import NavMenu from "../NavMenu/NavMenu";

export default function ControlBar() {
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
            <Box sx={{marginLeft: '1rem', display: 'flex', flexDirection: 'row', minWidth: '66.5vw'}}>
                <NavMenu />
                <IconButton>
                    <UndoIcon />
                </IconButton>
                <IconButton>
                    <RedoIcon />
                </IconButton>
            </Box>
        </Box>

    )
}