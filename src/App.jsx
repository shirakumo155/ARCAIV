import { useState } from "react";
import { Routes, Route } from "react-router-dom"
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import TopBar from "./OtherComponents/global/TopBar"
import Footer from "./OtherComponents/global/Footer"
import SideBar from "./OtherComponents/global/SideBar"
import QuickView from "./OtherComponents/QuickView.jsx"
import AgentStats from "./OtherComponents/AgentStats"
import ChatGPT from "./OtherComponents/ChatGPT.jsx"
import BattleStats from "./OtherComponents/BattleStats"
import Videos from "./OtherComponents/Videos.jsx"
import ImportData from "./OtherComponents/ImportData"
import ExportData from "./OtherComponents/ExportData"

export default function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
      <>
      <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <TopBar setIsSidebar={setIsSidebar}/>
        <div className="main-window">
          <SideBar isSidebar={isSidebar}/>
          <div className="content">
            <Routes>
              <Route path="/" element={<QuickView />} />
              <Route path="/agentstats" element={<AgentStats />} />
              <Route path="/battlestats" element={<BattleStats />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/import" element={<ImportData />} />
              <Route path="/export" element={<ExportData />} />
              <Route path="/chatgpt" element={<ChatGPT />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
      </ThemeProvider>
      </ColorModeContext.Provider>
      </>
  )
}

