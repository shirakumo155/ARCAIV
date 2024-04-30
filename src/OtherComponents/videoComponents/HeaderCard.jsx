import { Box, Button, Typography, useTheme, Grid } from "@mui/material";
import { tokens } from "../../theme";

export default function HeaderCard(props) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    let result = ""
    let resultColor = colors.grey[200]
    if(props.blueScore>props.redScore){
        result = "Winner: Blue"
        resultColor = "#3399FF"
    }else if(props.blueScore<props.redScore){
        result = "Winner: Red"
        resultColor = "#FF007F"
    }else{
        result = "Draw"
    }

    return(
    <Grid container >
        <Grid container mb={0.5}>
        <Grid item xs={5}>
            <Typography 
            align="center"
            variant="h2"
            color={"#FF007F"}
            fontWeight="bold"
            sx={{ m: "0 0 3px 0" }}>
            {props.redName}</Typography>
        </Grid>
        <Grid item xs>
            <Typography 
            align="center"
            variant="h3"
            color={colors.grey[100]}
            fontWeight="bold"
            sx={{ m: "0 0 3px 0" }}>
            {props.time}</Typography>
        </Grid>
        <Grid item xs={5}>
            <Typography 
            align="center"
            variant="h2"
            color={"#3399FF"}
            fontWeight="bold"
            sx={{ m: "0 0 3px 0" }}>
            {props.blueName}</Typography>
        </Grid>
        </Grid>

        <Grid container>
        <Grid item xs={5}>
            <Typography 
            align="center"
            variant="h4"
            color={"#FF007F"}
            sx={{ m: "0 0 3px 0" }}>
            {props.redScore}</Typography>
        </Grid>
        <Grid item xs>
            <Typography 
            align="center"
            variant="h4"
            color={colors.grey[100]}
            sx={{ m: "0 0 3px 0" }}>
            Score</Typography>
        </Grid>
        <Grid item xs={5}>
        <Typography 
        align="center"
        variant="h4"
        color={"#3399FF"}
        sx={{ m: "0 0 3px 0" }}>
        {props.blueScore}</Typography>
        </Grid>
        </Grid>
        <Grid container>
        <Grid item xs>
            <Typography 
            align="center"
            variant="h5"
            fontWeight="bold"
            color={resultColor}
            sx={{ m: "0 0 3px 0" }}>
            {result}</Typography>
        </Grid>
        </Grid>
    </Grid>
    )
}