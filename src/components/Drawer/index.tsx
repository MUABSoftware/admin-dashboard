import * as React from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Divider, Tooltip, useMediaQuery, useTheme, Typography } from "@mui/material";
import { Business, Home, MonetizationOn, People, PostAdd, Report, Settings, Inventory as Product, AccountBalance, KeyboardArrowDown, KeyboardArrowUp, Category, Tag } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Store } from "lucide-react";

type NavigationItem = {
  text: string;
  icon: React.JSX.Element;
  route?: string;
  subItems?: NavigationItem[];
};

interface DrawerProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  setPageTitle: any;
}

const CustomDrawer: React.FC<DrawerProps> = ({ mobileOpen, handleDrawerToggle, setPageTitle }) => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openSubMenu, setOpenSubMenu] = React.useState<string | null>(null);

  const navigationItems: NavigationItem[] = [
    { text: "Dashboard", icon: <Home />, route: "/" },
    { text: "Business Spaces", icon: <Business />, route: "/business-spaces/" },
    { text: "Market Place", icon: <Store />, route: "/marketplace/" },
    { text: "Digital Products", icon: <Product />, route: "/digitalProducts/" },
    // { text: "Categories", icon: <Category />, route: "/categories/" },
    {
      text: "Categories",
      icon: <Category />,
      subItems: [
        { text: "Category", icon: <Category />, route: "/categories/" },
        { text: "Hashtag", icon: <Tag />, route: "/categories/hashtag" },
      ],
    },
    { text: "Users", icon: <People />, route: "/users" },
    { text: "Posts", icon: <PostAdd />, route: "/posts" },
    { text: "Revenue Share Reports", icon: <MonetizationOn />, route: "/revenue-share" },
    {
      text: "Bank Account",
      icon: <AccountBalance />,
      subItems: [
        { text: "PayPal Payouts", icon: <MonetizationOn />, route: "/bankaccount/paypal" },
        { text: "Payoneer Payouts", icon: <MonetizationOn />, route: "/bankaccount/payoneer" },
      ],
    },
    { text: "Reports", icon: <Report />, route: "/reports" },
    { text: "Settings", icon: <Settings />, route: "/settings" },
  ];

  const handleNavigation = (route: NavigationItem) => {
    if (route.route) {
      setPageTitle(route.text + " - " + "Muab Admin");
      router.push(route.route);

      if (!route.route.includes('/bankaccount') && !route.route.includes('/categories')) {
        setOpenSubMenu(null);
      }

      if (isMobile) handleDrawerToggle();
    }
  };

  const handleSubMenuToggle = (text: string) => {
    setOpenSubMenu(openSubMenu === text ? null : text);
  };

  const isPathActive = (itemRoute: string) => {
    const normalizedPath = pathname?.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const normalizedRoute = itemRoute.endsWith('/') ? itemRoute.slice(0, -1) : itemRoute;
    return normalizedPath === normalizedRoute;
  };

  const drawerContent = (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          cursor: "pointer",
        }}
        onClick={() => handleNavigation(navigationItems[0])}
      >
        <img src="/assets/logo.png" alt="Logo" style={{ width: "28px", marginRight: "8px" }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          MUAB Dashboard
        </Typography>
      </Box>
      <Divider />

      <List>
        {navigationItems.map((item) => (
          <React.Fragment key={item.text}>
            <Tooltip title={item.text} placement="right" arrow>
              <ListItemButton
                selected={item.route ? isPathActive(item.route) : false}
                onClick={() => item.subItems ? handleSubMenuToggle(item.text) : handleNavigation(item)}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.action.selected,
                    color: theme.palette.primary.main,
                    "& .MuiListItemIcon-root": {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.subItems && (
                  openSubMenu === item.text ? <KeyboardArrowUp /> : <KeyboardArrowDown />
                )}
              </ListItemButton>
            </Tooltip>

            {item.subItems && openSubMenu === item.text && (
              <List component="div" disablePadding>
                {item.subItems.map((subItem) => (
                  <ListItemButton
                    key={subItem.text}
                    selected={subItem.route ? isPathActive(subItem.route) : false}
                    onClick={() => handleNavigation(subItem)}
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon>{subItem.icon}</ListItemIcon>
                    <ListItemText primary={subItem.text} />
                  </ListItemButton>
                ))}
              </List>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: "block", sm: "block" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: 250,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default CustomDrawer;
