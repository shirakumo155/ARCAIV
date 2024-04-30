import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";

export default function Footer() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

    return (
        <Box display="flex" justifyContent="right" >
        <Typography
          variant="h6"
          color={colors.grey[500]}
          sx={{ m: "0 0 0 0" }}
        >
          © 2024 Developed by Yoshiki Takagi. All rights reserved.
        </Typography>
        </Box>
    )
}