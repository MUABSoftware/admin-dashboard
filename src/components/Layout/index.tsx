import * as React from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CustomAppBar from "../Appbar";
import CustomDrawer from "../Drawer";

interface LayoutProps {
  children: React.ReactNode;
  mode: string;
  toggleMode: () => void;
  setPageTitle: any;
}

const Layout: React.FC<LayoutProps> = ({ children, mode, toggleMode, setPageTitle }) => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <CssBaseline />
      <CustomDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} setPageTitle={setPageTitle} />
      <CustomAppBar mode={mode} toggleMode={toggleMode} handleDrawerToggle={handleDrawerToggle} setPageTitle={setPageTitle} />
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: theme.palette.background.default,
          ml: { sm: `240px` },
          width: { sm: `calc(100% - 240px)` },
          overflowY: "auto",
          height: "100%",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </>
  );
};

export default Layout;
