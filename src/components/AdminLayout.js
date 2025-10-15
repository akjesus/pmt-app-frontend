import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Toolbar,
  Paper,
  Button,
  AppBar,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard,
  BusAlert,
  Book,
  BarChart,
  Logout,
  Money,
  AccountCircle,
} from "@mui/icons-material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 220;

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
  { text: "Loading Info", icon: <BusAlert />, path: "/admin/loading-info" },
  { text: "Bus Expenses", icon: <Money />, path: "/admin/bus-expenses" },
  { text: "Reports", icon: <BarChart />, path: "/admin/reports" },
  { text: "Fleet Management", icon: <Book />, path: "/admin/fleet-management" },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const username = localStorage.getItem("username");
  // const drawerContent = (
  //   <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
  //     <List>
  //       {menuItems.map((item) => (
  //         <ListItem
  //           button
  //           key={item.text}
  //           component={Link}
  //           to={item.path}
  //           onClick={() => isMobile && setMobileOpen(false)}
  //           sx={{
  //             backgroundColor:
  //               location.pathname === item.path ? "#f4f4f4ff" : "transparent",
  //             "&:hover": { backgroundColor: "#f4f4f4ff" },
  //           }}
  //         >
  //           <ListItemIcon sx={{ color: "#2C2C78" }}>{item.icon}</ListItemIcon>
  //           <ListItemText primary={item.text} />
  //         </ListItem>
  //       ))}
  //     </List>
  //     <Box sx={{ flexGrow: 1 }} />
  //     <Box sx={{ p: 2 }}>
  //       <Button
  //         variant="contained"
  //         fullWidth
  //         startIcon={<Logout />}
  //         onClick={handleLogout}
  //         sx={{
  //           bgcolor: "#2C2C78",
  //           ":hover": { bgcolor: "#1f1f5c" },
  //         }}
  //       >
  //         Logout
  //       </Button>
  //     </Box>
  //   </Box>
  // );

  // Responsive Drawer: Hamburger menu for mobile
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* AppBar for all screens */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#f58522ff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <Button
                color="inherit"
                onClick={handleDrawerToggle}
                sx={{ minWidth: 0, mr: 2, p: 1 }}
              >
                <MenuIcon sx={{ fontSize: 28, color: "white" }} />
              </Button>
            )}
            <Typography variant="h6" sx={{ color: "white" }}>
              Admin Menu
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AccountCircle sx={{ color: "white", mr: 1 }} />
            <Typography
              variant="body1"
              sx={{
                color: "white",
                fontWeight: 500,
                mr: { xs: 1, sm: 2 },
                fontSize: { xs: "0.95rem", sm: "1rem" },
                display: { xs: "none", sm: "block" },
              }}
            >
              {username}
            </Typography>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                borderColor: "white",
                color: "white",
                minWidth: { xs: 32, sm: 80 },
                px: { xs: 1, sm: 2 },
                fontSize: { xs: "0.8rem", sm: "1rem" },
                ":hover": { borderColor: "#1f1f5c", bgcolor: "#f4f4f422" },
              }}
            >
              <span style={{ display: isMobile ? "none" : "inline" }}>Logout</span>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#f58522ff",
            color: "white",
            boxSizing: "border-box",
            mt: { xs: 7, sm: 8 },
            height: "100vh",
          },
          display: { xs: "block", sm: "block" },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  backgroundColor:
                    location.pathname === item.path ? "#f4f4f4ff" : "transparent",
                  "&:hover": { backgroundColor: "#f4f4f4ff" },
                  whiteSpace: "nowrap",
                }}
              >
                <ListItemIcon sx={{ color: "#2C2C78" }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: { fontSize: { xs: "0.95rem", sm: "1rem" } },
                  }}
                />
              </ListItem>
            ))}
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ p: 2 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                bgcolor: "#2C2C78",
                ":hover": { bgcolor: "#1f1f5c" },
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f4f6f8",
          p: { xs: 1, sm: 3 },
          pt: { xs: 9, sm: 11 },
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: { xs: 1, sm: 3 },
            width: { xs: "100%", sm: "90%" },
            minHeight: "80vh",
            borderRadius: 3,
            boxSizing: "border-box",
            overflowX: "auto",
          }}
        >
          <Outlet />
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminLayout;
