import { useState } from "react"
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar"
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CreateNewFolderSharpIcon from '@mui/icons-material/CreateNewFolderSharp';
import LeaderboardSharpIcon from '@mui/icons-material/LeaderboardSharp';
import QueryStatsSharpIcon from '@mui/icons-material/QueryStatsSharp';
import VideoLibrarySharpIcon from '@mui/icons-material/VideoLibrarySharp';
import StorageIcon from '@mui/icons-material/Storage';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
    return (
      <MenuItem
        active={selected === title}
        style={{
          color: colors.grey[100],
        }}
        onClick={() => setSelected(title)}
        icon={icon}
      >
        <Typography variant="h5">{title}</Typography>
        <Link to={to} />
      </MenuItem>
    );
  };

const SideBar = () =>{
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Replay");
    return (
        <Box
          sx={{
            "& .pro-sidebar-inner": {
              background: `${colors.primary[400]} !important`,
            },
            "& .pro-icon-wrapper": {
              backgroundColor: "transparent !important",
            },
            "& .pro-inner-item": {
              padding: "5px 35px 5px 20px !important",
            },
            "& .pro-inner-item:hover": {
              color: "#868dfb !important",
            },
            "& .pro-menu-item.active": {
              color: "#6870fa !important",
            },
            }
          }
        >
          <ProSidebar collapsed={isCollapsed}>
            <Menu iconShape="square">
              {/* LOGO AND MENU ICON */}
              <MenuItem
                onClick={() => setIsCollapsed(!isCollapsed)}
                icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                style={{
                  margin: "10px 0 20px 0",
                  color: colors.grey[100],
                }}
              >
                {!isCollapsed && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    ml="15px"
                  >
                    <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                      <MenuOutlinedIcon />
                    </IconButton>
                  </Box>
                )}
              </MenuItem>
    
              <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                <Typography
                  variant="h4"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Home
                </Typography>
                <Item
                  title="Quick View"
                  to="/"
                  icon={<HomeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
    
                <Typography
                  variant="h4"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Agent
                </Typography>
                <Item
                  title="Ranking"
                  to="/agentstats"
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
    
                <Typography
                  variant="h4"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Game
                </Typography>
                <Item
                  title="Stats"
                  to="/battlestats"
                  icon={<LeaderboardSharpIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Videos"
                  to="/videos"
                  icon={<VideoLibrarySharpIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
    
                <Typography
                  variant="h4"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  XAI SandBox
                </Typography>
                <Item
                  title="ChatGPT"
                  to="/chatgpt"
                  icon={<SmartToyIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Typography
                  variant="h4"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Data
                </Typography>
                <Item
                  title="Import Logs"
                  to="/import"
                  icon={<CreateNewFolderSharpIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Export Database"
                  to="/export"
                  icon={<StorageIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                
              </Box>
            </Menu>
          </ProSidebar>
        </Box>
    );
}

export default SideBar