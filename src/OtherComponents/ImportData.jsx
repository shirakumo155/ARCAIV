import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';
import { tokens } from "../theme";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState, useEffect } from "react";
import Header from "./global/Header";
import { useCsvDataListStore } from "../Store"
import {csvToArr, readUploadedFileAsText, getBattleStats} from '../Utils'
import PropTypes from 'prop-types';

const columns = [
    { field: 'id', headerName: 'ID'},
    { field: 'name', headerName: 'File Name' , flex: 2, cellClassName: "name-column--cell"},
    { field: 'size', headerName: 'File Size' },
    { field: 'lastModified', headerName: 'Modified Date', flex: 1 }
  ]

async function analyzeFiles(file) {
    const fileContents = await readUploadedFileAsText(file) 
    const data= csvToArr(fileContents, ",")
    const battleStats = getBattleStats(data)
    file.stats = battleStats
    return new Promise(resolve => {
        resolve(file)
    })
}

LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
  };

function LinearProgressWithLabel(props) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} 
            sx={{
            backgroundColor: colors.grey[100],
            '& .MuiLinearProgress-bar': {
            backgroundColor: colors.greenAccent[400]
        }}}/>
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="h3" color="text.secondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

const ImportData = () =>{
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [files, setFile] = useState()
    const [tableData, setTableData] = useState()
    const [selectedData, setSelectedData] = useState()
    const setFileArr = useCsvDataListStore((state)=>(state.setFileArr))
    const resetFileArr = useCsvDataListStore((state)=>(state.resetFileArr))
    const [progress, setProgress] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    function handleFileSelect(event) {
        setFile(event.target.files)   
    }

    const handleImport = async (e) => {
        setProgress(0)
        setIsLoading(true)

        const importedData = selectedData.map((item, i)=>{
            return files[item-1]
        })
        
        // reset
        resetFileArr()

        let importedDataWithStats =[]
        let dataLength = importedData.length
        
        const promises = importedData.map(
            (item) => analyzeFiles(item)
            .then((val) => {
                importedDataWithStats.push(val)
                setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 1/dataLength*100 ));
            }))
        await Promise.all(promises)
        

        // set
        setFileArr(importedDataWithStats)
        setProgress(100)
        setTimeout(() => {
            setIsLoading(false)
          }, "1200");
        //console.log(importedDataWithStats)
    }

    useEffect(() => {
        //console.log(files)
        if(files){
            for (let i=0; i < files.length; i++) {
                files[i].id = i+1;
                //console.log(files[i].name.split("_")[2])
                files[i].nameB = files[i].name.split("_")[0];
                files[i].nameR = files[i].name.split("_")[2];
            }
            setTableData(Array.from(files))
        }
        //console.log(new Date(1707958238983).getDate())
    },[files])
    
    return(
        <Box pl={4} pr={4} pb={0} height="100%" display="flex" flexDirection="column" justifyContent="space-between" alignItems="center" position= "relative">
            <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
                <Header title='IMPORT LOGS' subtitle="Select a directory including log files & Import them" />
                <Box>
                    <form>
                        <Button variant="contained" component="label" 
                        sx={{backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100], 
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                             '&:hover': {
                                backgroundColor: colors.blueAccent[600],
                            }}}>
                            Select Folder
                        <input type="file" id="filepicker" name="fileList" webkitdirectory="true" multiple onChange={handleFileSelect} hidden/>
                        </Button>
                    </form> 
                </Box>
            </Box>
            
            <Box
                width="100%"
                flexGrow={1}
                
                sx={{
                "& .MuiDataGrid-root": {
                    border: "none",
                },
                "& .MuiDataGrid-cell": {
                    borderBottom: "none",
                    
                },
                "& .name-column--cell": {
                    color: colors.greenAccent[300],
                },
                "& .MuiDataGrid-columnHeaders": {
                    borderBottom: "none",
                    backgroundColor: colors.blueAccent[700],
                    
                },
                "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: colors.primary[400],
                },
                "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: colors.blueAccent[700],
                    
                },
                "& .MuiTablePagination-root": {
                    
                },
                "& .MuiCheckbox-root": {
                    color: `${colors.greenAccent[200]} !important`,
                },
            }}
            >
            { tableData &&
                <DataGrid
                checkboxSelection
                rows={tableData}
                columns={columns}
                components={{Toolbar: GridToolbar}}
                onSelectionModelChange={(newSelectionData) => {
                    setSelectedData(newSelectionData)
                    }}
                />
            }      
            </Box>
            {isLoading &&
            <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, 
                width: "100%", Height: "100%", 
                backgroundColor: colors.loadingBackground, 
                display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box sx={{ width: '60%', display: "flex", justifyContent: "center", flexDirection: "column" }}>
                    <Typography variant="h3">Loading</Typography>
                    <LinearProgressWithLabel value={progress} />
                </Box> 
            </Box>
            }
            
            <Box width="100%" pt={2} pb={2} display="flex" justifyContent="right" alignItems="center" >
                <Button variant="contained" component="label" onClick={handleImport}
                sx={{backgroundColor: colors.blueAccent[700],
                    color: colors.grey[100], 
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    '&:hover': {
                        backgroundColor: colors.blueAccent[600],
                    }}}>
                    Import
                </Button>
            </Box>
        </Box>
        
    )
}

export default ImportData