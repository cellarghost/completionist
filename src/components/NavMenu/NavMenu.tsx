import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useContext, useRef, useState } from "react";
import { StateContext } from "../../App";
import { testData } from "../../testData";

export default function NavMenu() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { state, dispatch } = useContext(StateContext);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClose = () => setAnchorEl(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(state, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tasks-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        handleClose();
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
        handleClose();
    };

    const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const parsed = JSON.parse(await file.text());
            // TODO: validate `parsed` matches your state shape before loading
            dispatch({ type: "LOAD_STATE", payload: {idbState: parsed}});
        } catch (err) {
            console.error("Failed to import file", err);
            alert("That file couldn't be loaded. Is it a valid export?");
        } finally {
            // lets the user re-select the same file later
            e.target.value = "";
        }
    };

    const handleClearTasks = () => {
        dispatch({type: "LOAD_STATE", payload: {idbState: testData}});
        handleClose();
    };

    return (
        <Box>
            <IconButton onClick={handleClick}>
                <MenuIcon />
            </IconButton>

            {/* Kept outside <Menu> so it isn't unmounted when the menu closes */}
            <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                hidden
                onChange={handleFileSelected}
            />

            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                sx={{ marginTop: '2rem' }}
            >
                <MenuItem onClick={handleImportClick}>Import tasks</MenuItem>
                <MenuItem onClick={handleExport}>Export tasks</MenuItem>
                <MenuItem onClick={handleClearTasks}>Clear tasks</MenuItem>
            </Menu>
        </Box>
    );
}