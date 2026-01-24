
import './App.css'
import { Box } from '@mui/material'
import Timeline from './components/Timeline/Timeline'

function App() {

  return (
    <>
      <Box sx={{
        border: "3px solid blue",
        minWidth: "15vw",
        minHeight: "50vh",
        padding: "1rem"
        }}>
        <Timeline />
      </Box>
    </>
  )
}

export default App
