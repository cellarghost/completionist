import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { Box, IconButton } from '@mui/material';
import { useContext } from 'react';
import { StateContext } from '../../App';

export default function PlaybackBar() {

    const {state: programState, dispatch} = useContext(StateContext)

    const handleTogglePlayback = () => {
        dispatch({type: "TOGGLE_PLAYBACK", payload: null})
    }

    const handleStop = () => {
        dispatch({type: "STOP_PROGRESS", payload: null})
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row'
        }}>
            <IconButton>
                <SkipPreviousIcon />
            </IconButton>
            <IconButton onClick={handleTogglePlayback}>
                {programState.playbackState.paused ? <PlayArrowIcon /> : <PauseIcon/>}
            </IconButton>
            <IconButton>
                <SkipNextIcon />
            </IconButton>
            <IconButton onClick={handleStop}>
                <StopIcon />
            </IconButton>
        </Box>
    )
}