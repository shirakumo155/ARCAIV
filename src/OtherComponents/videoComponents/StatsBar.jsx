import HorizontalBar from "./HorizontalBar"
import { Box, Button, Typography, useTheme, Grid } from "@mui/material";
import { tokens } from "../../theme";

export default function StatsBar(props) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
return(
    <Box width="90%" display="flex" alignItems="center" >
        <Grid container alignItems="center" display="flex" justifyContent="space-between">
            <Grid item width="28%">
                <HorizontalBar team={"red"}  value={props.valueR}/>
            </Grid>
            <Grid item 
                justify="center" paddingLeft={1} paddingRight={1}>
                <Typography 
                variant="h5"
                color={colors.grey[100]}
                sx={{ m: "0 0 0 0" }}>
                {props.name}
                </Typography> 
            </Grid>
            <Grid item width="28%" >
                <HorizontalBar team={"blue"} value={props.valueB} />
            </Grid>
        </Grid>
    </Box>
)
}