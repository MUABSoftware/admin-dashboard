// components/AppBarComponent.tsx
import * as React from "react";
import { AppBar, Toolbar, IconButton, Avatar, Menu, MenuItem, InputBase, useTheme, Tooltip } from "@mui/material";
import { Menu as MenuIcon, Search as SearchIcon, Brightness4, Brightness7 } from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { usePathname } from "next/navigation";

// Search styling for subtle background and spacing
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.light, 0.1), // Softer light blue tint
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.light, 0.2),
  },
  marginLeft: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

interface AppBarProps {
  mode: string;
  toggleMode: () => void;
  handleDrawerToggle: () => void;
  setPageTitle: () => void;
}

const CustomAppBar: React.FC<AppBarProps> = ({ mode, toggleMode, handleDrawerToggle }) => {
  const theme = useTheme();
  const path = usePathname();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  console.log({ path });

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - 240px)` },
        ml: { sm: `240px` },
        backgroundColor: theme.palette.primary.dark, // Neutral background color
        boxShadow: theme.shadows[3],
        py: 0,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
          <MenuIcon />
        </IconButton>

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search…" inputProps={{ "aria-label": "search" }} />
        </Search>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Tooltip title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}>
            <IconButton onClick={toggleMode} color="inherit" aria-label="toggle light/dark mode">
              {mode === "light" ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
          </Tooltip>

          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar alt="Admin" src="/static/images/avatar/1.jpg" />
          </IconButton>
        </div>

        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
