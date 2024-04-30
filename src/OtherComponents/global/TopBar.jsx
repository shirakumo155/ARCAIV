import { useContext } from "react"
import { ColorModeContext, tokens } from "../../theme";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import InputBase from "@mui/material/InputBase";
import { useCsvDataStore } from "../../Store"

export default function TopBar(){
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

    return (
        <Box display="flex" justifyContent="space-between" backgroundColor={colors.primary[400]}>
            {/* LOGO TITILE */}
            
            <Box display="flex" alignItems="center" p={1}>
                <Box display="flex" justifyContent="center" alignItems="center" ml={2}>
                    <img
                        alt="profile-user"
                        width="50px"
                        height="50px"
                        src={`../../public/ATLA.svg`}
                        style={{ cursor: "pointer", borderRadius: "50%" }}
                />
                </Box>
                <Box display="flex" flexDirection="column" ml={3}>
                    <Box display="flex">
                        <Typography
                        variant="h2"
                        color={colors.greenAccent[400]}
                        fontWeight="bold"
                        sx={{ m: "0 0 0 0" }}
                        >
                            ARCAIV
                        </Typography>
                        <Typography variant="h2" color={colors.grey[100]} ml={1}>
                        by ASRC
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6" color={colors.grey[100]} >
                        AiR Combat AI Visualizer
                        </Typography>
                    </Box>
                </Box>
            </Box>
            {/* SEARCH BAR */}
            {/*<Box
                display="flex"
                backgroundColor={"#1F2A40"}
                borderRadius="3px"
            >
                <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
                <IconButton type="button" sx={{ p: 1 }}>
                <SearchIcon />
                </IconButton>
            </Box>
            */}

            {/* ICONS */}
            <Box display="flex" alignItems="center" mr="25px">
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? (
                <DarkModeOutlinedIcon />
                    ) : (
                <LightModeOutlinedIcon />
                    )}
                </IconButton>
            </Box>
            </Box>
        
    )
}