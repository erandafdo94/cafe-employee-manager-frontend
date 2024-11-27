import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Café Manager
        </Typography>
        <Box sx={{ "& > :not(style)": { ml: 2 } }}>
          <Button color="inherit" component={RouterLink} to="/cafes">
            Cafés
          </Button>
          <Button color="inherit" component={RouterLink} to="/employees">
            Employees
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
