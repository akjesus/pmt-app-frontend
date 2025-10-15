import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  ListItemIcon,
} from "@mui/material";
import {
  BusAlert,
  BarChart,
  Money,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";


export default function AdminDashboard() {
  const navigate = useNavigate();

  const labels = [
    { key: "totalVehicles", label: "Fleet Management", value: 50, icon: <BarChart />, path: "/admin/fleet-management" },
    { key: "busExpenses", label: "Bus Expenses", value: 85, icon: <Money />, path: "/admin/bus-expenses" },
    { key: "loadingInfo", label: "Loading Info", value: 12, icon: <BusAlert />, path: "/admin/loading-info" },
    { key: "reports", label: "Reports", value: 12, icon: <BarChart />, path: "/admin/reports" },
  ];


  return (

    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom align="center">
        Admin Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        {labels.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.key} sx={{ display: "flex", justifyContent: "center" }}>
            <Card
              sx={{
                bgcolor: "#f5f5f5",
                borderRadius: 2,
                cursor: item.path ? "pointer" : "default",
                "&:hover": item.path ? { bgcolor: "#e0e0e0" } : {},
                width: "100%",
                maxWidth: 250,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              onClick={() => item.path && navigate(item.path)}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 120,
                }}
              >
                <ListItemIcon sx={{ color: "#000000ff", fontSize: 40, justifyContent: "center", alignItems: "center", display: "flex" }}>
                  {React.cloneElement(item.icon, { fontSize: "large" })}
                </ListItemIcon>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mt: 1, textAlign: "center" }}>
                  {item.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
