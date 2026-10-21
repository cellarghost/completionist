import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { Box, IconButton } from '@mui/material';
import { useContext } from 'react';
import { StateContext } from '../../App';
import usePlaybackTimeline from '../hooks/useTimeline';

export default function PlaybackBar({useTimeline} : {useTimeline: any}) {

    const {state: programState, dispatch} = useContext(StateContext)

    const handleTogglePlayback = () => {
        useTimeline.togglePause()
    }

    const handleStop = () => {
        useTimeline.stopPlayback(
            programState.taskMap[0] ? programState.taskMap[0].duration_ms : 0,
            true
        )
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
                {(useTimeline.playbackState.isPaused == 'playing') ? <PauseIcon/> : <PlayArrowIcon />}
            </IconButton>
            <IconButton>
                <SkipNextIcon onClick={useTimeline.nextTask}/>
            </IconButton>
            <IconButton onClick={handleStop}>
                <StopIcon />
            </IconButton>
        </Box>
    )
}