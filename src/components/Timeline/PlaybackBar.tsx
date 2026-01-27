import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { Box, IconButton } from '@mui/material';

export default function PlaybackBar() {

    

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row'
        }}>
            <IconButton>
                <SkipPreviousIcon />
            </IconButton>
            <IconButton>
                <PlayArrowIcon />
            </IconButton>
            <IconButton>
                <PauseIcon />
            </IconButton>
            <IconButton>
                <SkipNextIcon />
            </IconButton>
            <IconButton>
                <StopIcon />
            </IconButton>
        </Box>
    )
}