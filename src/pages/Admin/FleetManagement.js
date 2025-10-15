import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TablePagination,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  Snackbar,
  TextField,
  Tabs,
  Tab,
  Paper,
  TableContainer,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { addRoutes, getRoutes, addFares, getAllFares } from "../../api/routes";
import { getTowns, addTown } from "../../api/towns";
import { getVehicles } from "../../api/vehicles";
import { getUsers, addUser } from "../../api/auth";

export default function AdminRoutes() {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const [routes, setRoutes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newRoute, setnewRoute] = useState({
    active: "",
    origin: "",
    arriving: "",
  });

  // Towns state
  const [towns, setTowns] = useState([]);
  const [fares, setFares] = useState([]);
  const [openFare, setOpenFare] = useState(false);
  const [newFare, setNewFare] = useState({
    route: "",
    fareAmount: "",
    feeding: "",
    routeFuel: "",
  });

  // Tabs state
  const [tab, setTab] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);

  // Pagination state
  const [routesPage, setRoutesPage] = useState(0);
  const [routesRowsPerPage, setRoutesRowsPerPage] = useState(10);

  const [faresPage, setFaresPage] = useState(0);
  const [faresRowsPerPage, setFaresRowsPerPage] = useState(10);

  const [vehiclesPage, setVehiclesPage] = useState(0);
  const [vehiclesRowsPerPage, setVehiclesRowsPerPage] = useState(10);

  const [townsPage, setTownsPage] = useState(0);
  const [townsRowsPerPage, setTownsRowsPerPage] = useState(10);

  const [usersPage, setUsersPage] = useState(0);
  const [usersRowsPerPage, setUsersRowsPerPage] = useState(10);

  // User modal handlers
  const [openUser, setOpenUser] = useState(false);
  const [newUser, setNewUser] = useState({ firstName: "", lastName: "", username: "", email: "", role: "", password: "" });

  const handleOpenUser = () => {
    setNewUser({ firstName: "", lastName: "", username: "", email: "", role: "", password: "" });
    setOpenUser(true);
  };
  const handleCloseUser = () => setOpenUser(false);
  const handleUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };
  const handleSaveUser = async () => {
    // Implement API call to add user here if needed
    setUsers([...users, { ...newUser, _id: Date.now().toString() }]);
    await addUser(newUser)
    showSnackbar("User added!", "success");
    handleCloseUser();
  };

  // Vehicle modal handlers
  const [openVehicle, setOpenVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ name: "", plateNo: "", vehiclemake: "", vehiclemodel: "", capacity: "" });

  const handleOpenVehicle = () => {
    setNewVehicle({ name: "", plateNo: "", vehiclemake: "", vehiclemodel: "", capacity: "" });
    setOpenVehicle(true);
  };
  const handleCloseVehicle = () => setOpenVehicle(false);
  const handleVehicleChange = (e) => {
    setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value });
  };
  const handleSaveVehicle = async () => {
    // Implement API call to add vehicle here if needed
    setVehicles([...vehicles, { ...newVehicle, _id: Date.now().toString() }]);
    showSnackbar("Vehicle added!", "success");
    handleCloseVehicle();
  };

  // Fetch towns, routes, fares, vehicles, and users from backend
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const townsRes = await getTowns();
        setTowns(townsRes.data);
        const routesRes = await getRoutes();
        setRoutes(routesRes.data);
        const faresRes = await getAllFares();
        setFares(faresRes.data);
        const vehiclesRes = await getVehicles();
        setVehicles(vehiclesRes.data.vehicles);
        const usersRes = await getUsers();
        setUsers(usersRes.data.users);
      } catch (err) {
        setTowns([]);
        setVehicles([]);
        setUsers([]);
        showSnackbar(err.response?.data?.message || "Failed to get data", "error");
      }
    };
    fetchAll();
  }, []);

  // Open modal for Add/Edit Route
  const handleOpen = (route = null, index = null) => {
    if (route) {
      setnewRoute(route);
      setEditIndex(index);
    } else {
      setnewRoute({
        active: "",
        origin: "",
        arriving: "",
      });
      setEditIndex(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setnewRoute({ ...newRoute, [e.target.name]: e.target.value });
  };

  // Add or Update Route
  const handleSaveRoute = async () => {
    try {
      if (editIndex !== null) {
        const updated = [...routes];
        updated[editIndex] = newRoute;
        setRoutes(updated);
      } else {
        await addRoutes(newRoute);
        showSnackbar("Route added successfully!", "success");
        const updatedRoutes = await getRoutes();
        setRoutes(updatedRoutes.data);
      }
    } catch (error) {
      showSnackbar(error?.response?.data?.message || "Failed to create route", "error");
      console.log(error);
    }
    handleClose();
  };

  // Delete Route
  const handleDelete = (routeId) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      const updated = routes.filter((route) => route._id !== routeId);
      setRoutes(updated);
    }
  };

  // Fares handlers
  const handleOpenFare = () => {
    setNewFare({ route: "", fareAmount: "", feeding: "", routeFuel: "" });
    setOpenFare(true);
  };
  const handleCloseFare = () => setOpenFare(false);
  const handleFareChange = (e) => {
    setNewFare({ ...newFare, [e.target.name]: e.target.value });
  };
  const handleSaveFare = async () => {
    const addedFares = await addFares(newFare);
    setFares(addedFares.fare);
    showSnackbar("Fare added successfully!", "success");
    handleCloseFare();
  };
  const handleDeleteFare = (index) => {
    if (window.confirm("Are you sure you want to delete this fare?")) {
      const updated = fares.filter((_, i) => i !== index);
      setFares(updated);
    }
  };

  // Open modal for Add/Edit Town
  const [openTown, setOpenTown] = useState(false);
  const [editTownIndex, setEditTownIndex] = useState(null);
  const [newTown, setNewTown] = useState({ name: "", state: "" });

  const handleOpenTown = (town = null, index = null) => {
    if (town) {
      setNewTown({ name: town.name, state: town.state });
      setEditTownIndex(index);
    } else {
      setNewTown({ name: "", state: "" });
      setEditTownIndex(null);
    }
    setOpenTown(true);
  };
  const handleCloseTown = () => setOpenTown(false);

  const handleTownChange = (e) => {
    setNewTown({ ...newTown, [e.target.name]: e.target.value });
  };

  // Save Town (add/edit)
  const handleSaveTown = async () => {
    try {
      if (editTownIndex !== null) {
        // Edit town locally
        const updated = [...towns];
        updated[editTownIndex] = { ...updated[editTownIndex], ...newTown };
        setTowns(updated);
        showSnackbar("Town updated!", "success");
      } else {
        // Add town locally
        setTowns([...towns, { ...newTown, _id: Date.now().toString() }]);
        const res = await addTown(newTown);
        if(res.status === 201) showSnackbar("Town added!", "success");
        else showSnackbar("Failed to add town", "info");
      }
    } catch (error) {
      showSnackbar("Failed to save town", "error");
    }
    handleCloseTown();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Fleet Management
      </Typography>

      {/* Tabs for Routes, Fares, Vehicles, Towns, Users */}
      <Tabs
        value={tab}
        onChange={(e, newTab) => setTab(newTab)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 2 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Routes" />
        <Tab label="Fares" />
        <Tab label="Vehicles" />
        <Tab label="Towns" />
        <Tab label="Users" />
      </Tabs>

      {/* Routes Tab */}
      {tab === 0 && (
        <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              sx={{ bgcolor: "#2C2C78", ":hover": { bgcolor: "#1f1f5c" } }}
              onClick={() => handleOpen()}
            >
              Add Route
            </Button>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Route Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Active</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {routes
                  .slice(routesPage * routesRowsPerPage, routesPage * routesRowsPerPage + routesRowsPerPage)
                  .map((route, idx) => (
                    <TableRow key={route._id}>
                      <TableCell>{route.desc}</TableCell>
                      <TableCell>{route.active === "true" ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleOpen(route, idx)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(route._id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={routes.length}
            page={routesPage}
            onPageChange={(e, newPage) => setRoutesPage(newPage)}
            rowsPerPage={routesRowsPerPage}
            onRowsPerPageChange={(e) => {
              setRoutesRowsPerPage(parseInt(e.target.value, 10));
              setRoutesPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Paper>
      )}

      {/* Fares Tab */}
      {tab === 1 && (
        <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleOpenFare}
              sx={{ bgcolor: "#2C2C78", ":hover": { bgcolor: "#1f1f5c" } }}
            >
              Add Fare
            </Button>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Route</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Fuel</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Feeding</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fares
                  .slice(faresPage * faresRowsPerPage, faresPage * faresRowsPerPage + faresRowsPerPage)
                  .map((fare, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        {fare.routeId?.desc}
                      </TableCell>
                      <TableCell>₦{fare.fareAmount}</TableCell>
                      <TableCell>₦{fare.routeFuel}</TableCell>
                      <TableCell>₦{fare.feeding}</TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => handleDeleteFare(idx)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={fares.length}
            page={faresPage}
            onPageChange={(e, newPage) => setFaresPage(newPage)}
            rowsPerPage={faresRowsPerPage}
            onRowsPerPageChange={(e) => {
              setFaresRowsPerPage(parseInt(e.target.value, 10));
              setFaresPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Paper>
      )}

      {/* Vehicles Tab */}
      {tab === 2 && (
        <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenVehicle}
              sx={{ bgcolor: "#2C2C78", ":hover": { bgcolor: "#1f1f5c" } }}
            >
              Add Vehicle
            </Button>
          </Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Vehicles List</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Vehicle ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Plate Number</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Make</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles
                  .slice(vehiclesPage * vehiclesRowsPerPage, vehiclesPage * vehiclesRowsPerPage + vehiclesRowsPerPage)
                  .map((vehicle) => (
                    <TableRow key={vehicle._id}>
                      <TableCell>PMT{vehicle.name}</TableCell>
                      <TableCell>{vehicle.plateNo}</TableCell>
                      <TableCell>{vehicle.vehiclemake}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={vehicles.length}
            page={vehiclesPage}
            onPageChange={(e, newPage) => setVehiclesPage(newPage)}
            rowsPerPage={vehiclesRowsPerPage}
            onRowsPerPageChange={(e) => {
              setVehiclesRowsPerPage(parseInt(e.target.value, 10));
              setVehiclesPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Paper>
      )}

      {/* Towns Tab */}
      {tab === 3 && (
        <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenTown()}
              sx={{ bgcolor: "#2C2C78", ":hover": { bgcolor: "#1f1f5c" } }}
            >
              Add Town
            </Button>
          </Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Towns List</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Town Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>State</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {towns
                  .slice(townsPage * townsRowsPerPage, townsPage * townsRowsPerPage + townsRowsPerPage)
                  .map((town, idx) => (
                    <TableRow key={town._id}>
                      <TableCell>{town.name}</TableCell>
                      <TableCell>{town.state}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleOpenTown(town, idx)}>
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={towns.length}
            page={townsPage}
            onPageChange={(e, newPage) => setTownsPage(newPage)}
            rowsPerPage={townsRowsPerPage}
            onRowsPerPageChange={(e) => {
              setTownsRowsPerPage(parseInt(e.target.value, 10));
              setTownsPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Paper>
      )}

      {/* Users Tab */}
      {tab === 4 && (
        <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenUser}
              sx={{ bgcolor: "#2C2C78", ":hover": { bgcolor: "#1f1f5c" } }}
            >
              Add User
            </Button>
          </Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Users List</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>S/NO</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Userame</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .slice(usersPage * usersRowsPerPage, usersPage * usersRowsPerPage + usersRowsPerPage)
                  .map((user, idx) => (
                    <TableRow key={user._id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{user.firstName} {user.lastName}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={users.length}
            page={usersPage}
            onPageChange={(e, newPage) => setUsersPage(newPage)}
            rowsPerPage={usersRowsPerPage}
            onRowsPerPageChange={(e) => {
              setUsersRowsPerPage(parseInt(e.target.value, 10));
              setUsersPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Paper>
      )}

      {/* Add/Edit Route Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth={false}
        PaperProps={{
          sx: { minWidth: 350, maxWidth: 400 }
        }}
      >
        <DialogTitle>{editIndex !== null ? "Edit Route" : "Add Route"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Originating Town</InputLabel>
            <Select
              label="Originating Town"
              name="origin"
              value={newRoute.origin}
              onChange={handleChange}
            >
              {towns.map((town) => (
                <MenuItem key={town._id} value={`${town._id}:${town.name}`}>
                  {town.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel>Arriving Town</InputLabel>
            <Select
              label="Arriving Town"
              name="arriving"
              value={newRoute.arriving}
              onChange={handleChange}
            >
              {towns.map((town) => (
                <MenuItem key={town._id} value={`${town._id}:${town.name}`}>
                  {town.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel>Active</InputLabel>
            <Select
              label="Active"
              name="active"
              value={newRoute.active}
              onChange={handleChange}
            >
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#2C2C78" }}
            onClick={handleSaveRoute}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Fare Modal */}
      <Dialog
        open={openFare}
        onClose={handleCloseFare}
        maxWidth="xs"
        fullWidth={false}
        PaperProps={{
          sx: { minWidth: 300, maxWidth: 350 }
        }}
      >
        <DialogTitle>Add Fare</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Route</InputLabel>
            <Select
              label="Route"
              name="route"
              value={newFare.route}
              onChange={handleFareChange}
            >
              {routes.map((route) => (
                <MenuItem key={route._id} value={route._id}>
                  {route.desc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="dense"
            label="Amount"
            name="fareAmount"
            type="number"
            value={newFare.fareAmount}
            onChange={handleFareChange}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Feeding"
            name="feeding"
            type="number"
            value={newFare.feeding}
            onChange={handleFareChange}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Fuel"
            name="routeFuel"
            type="number"
            value={newFare.routeFuel}
            onChange={handleFareChange}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFare}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#2C2C78" }}
            onClick={handleSaveFare}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Town Modal */}
      <Dialog
        open={openTown}
        onClose={handleCloseTown}
        maxWidth="xs"
        fullWidth={false}
        PaperProps={{
          sx: { minWidth: 300, maxWidth: 350 }
        }}
      >
        <DialogTitle>{editTownIndex !== null ? "Edit Town" : "Add Town"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Town Name"
            name="name"
            value={newTown.name}
            onChange={handleTownChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="State"
            name="state"
            value={newTown.state}
            onChange={handleTownChange}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTown}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#2C2C78" }}
            onClick={handleSaveTown}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add User Modal */}
      <Dialog
        open={openUser}
        onClose={handleCloseUser}
        maxWidth="xs"
        fullWidth={false}
        PaperProps={{
          sx: { minWidth: 300, maxWidth: 350 }
        }}
      >
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="First Name"
            name="firstName"
            value={newUser.firstName}
            onChange={handleUserChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Last Name"
            name="lastName"
            value={newUser.lastName}
            onChange={handleUserChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Username"
            name="username"
            value={newUser.username}
            onChange={handleUserChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Email"
            name="email"
            value={newUser.email}
            onChange={handleUserChange}
          />
          <TextField
            type="password"
            fullWidth
            margin="dense"
            label="Password"
            name="password"
            value={newUser.password}
            onChange={handleUserChange}
          />
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              name="role"
              value={newUser.role}
              onChange={handleUserChange}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUser}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#2C2C78" }}
            onClick={handleSaveUser}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}