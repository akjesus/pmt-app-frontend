// src/pages/Auth/Login.js
import React, { useState } from "react";
import logo from "../../assets/pmt-logo.png"
import background from "../../assets/background.png"
import {
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  CardContent,
  TextField,
  Typography,
  Snackbar,
  Alert
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const navigate = useNavigate();
  
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  }

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(username, password);
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("username", res.data.username);
        showSnackbar("Login successful!", "success");
        setTimeout(() => {
          if (res.data.role === "Admin") {
            navigate("/admin/dashboard");
          } else if (res.data.role === "Staff") {
            navigate("/staff/dashboard");
          } else {
            navigate("/");
          }
        }, 1200);
      }
    } catch (err) {

      showSnackbar(err.response.data.error || "Server not reachable!", "error")
    }
  };


  return (
    <Box
      sx={{
        backgroundImage:
          `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          width: 400,
          bgcolor: "rgba(255, 255, 255, 0.9)",
          boxShadow: 5,
          borderRadius: 3,
        }}
      >
        <CardContent>
          {/* Logo */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <img
              src={logo}
              alt="Peace Extra Comfort Logo"
              style={{ height: 60, objectFit: "contain" }}
            />
          </Box>
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold" }}
          >
            Peace Extra Comfort Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, bgcolor: "#2C2C78", ":hover": { bgcolor: "#1f1f5c" } }}
            >
              Login
            </Button>
            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 2, cursor: "pointer", color: "#2C2C78" }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </Typography>
          </form>
        </CardContent>
      </Card>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;