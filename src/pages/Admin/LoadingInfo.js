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
  TableContainer,
  Paper,
  TablePagination,
  TextField,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { getBusLoading, createLoadingInfo } from "../../api/busLoading";
import { getVehicles } from "../../api/vehicles";
import { getRoutes } from "../../api/routes";

export default function LoadingInfo() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loadingData, setLoadingData] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutesList] = useState([]);
  const [modalForm, setModalForm] = useState({
    vehicle: "",
    date: "",
    route: "",
    fare: "",
    feeding: "",
    passengers: "",
    fuel: ""
  });

 const showSnackbar = (message, severity) => {
      setSnackbar({ open: true, message, severity });
    };
  
const handleCloseSnackbar = () => {
      setSnackbar({ ...snackbar, open: false });
    };

  // Fetch loading info from backend
  const handleFetchLoadingInfo = async (e) => {
    e.preventDefault();
    try {
      const res = await getBusLoading(dateFrom, dateTo);
      if (res.status === 200) {
        showSnackbar("Loading info retrieved", "success");
        setLoadingData(res.data);
        setPage(0);
      } else {
        setLoadingData([]);
        showSnackbar(res.data.message || "No Loading info retrieved", "info");
      }
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Error retrieving loading info", "error");
      setLoadingData([]);
    }
  };

  // Get vehicles and routes for modal
  useEffect(() => {
    if (openModal) {
        getVehicles().then((res) => {
        setVehicles(res.data.vehicles || [])}
    );
      getRoutes().then((res) => setRoutesList(res.data || []));
    }
  }, [openModal]);

  const handleOpenModal = () => {
    setModalForm({
      vehicle: "",
      date: "",
      route: "",
      fare: "",
      feeding: "",
      passengers: "",
      fuel: ""
    });
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);
  const handleModalChange = (e) => {
    setModalForm({ ...modalForm, [e.target.name]: e.target.value });
  };

  // Save loading info (mocked, replace with API call)
  const handleSaveLoadingInfo = async () => {
    try {
        
    setOpenModal(false);
    const res = await createLoadingInfo(modalForm);
    if(res.status === 201){
    showSnackbar("Loading info created!", "success");
    handleCloseModal();
    }
    else {
    showSnackbar("Loading info not created!", "info");
    }
    }
    catch(error) {
    showSnackbar(error.response.data.message || "Loading info not created!", "error");
    }
    
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#2C2C78" }}>
        Loading Info
      </Typography>

      {/* Date Range Form */}
      <Box
        component="form"
        onSubmit={handleFetchLoadingInfo}
        sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}
      >
        <TextField
          label="Date From"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <TextField
          label="Date To"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ bgcolor: "#2C2C78" }}
          disabled = {!dateFrom || !dateTo}
        >
          Get Loading Info
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleOpenModal}
        >
          Add Loading Info
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Vehicle</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Route</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Fare</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Passengers</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Total Income</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>PMT{row.name}</TableCell>
                    <TableCell>{row.routeId.desc}</TableCell>
                    <TableCell>₦{row.fare}</TableCell>
                    <TableCell>{row.passengers}</TableCell>
                    <TableCell>₦{row.income}</TableCell>
                    <TableCell>
                      {/* Add actions here if needed */}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={loadingData.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Paper>

      {/* Modal for creating loading info */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="xs"
        fullWidth={false}
        PaperProps={{
          sx: { minWidth: 320, maxWidth: 350 }
        }}
      >
        <DialogTitle>Create Loading Info</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Vehicle</InputLabel>
            <Select
              label="Vehicle"
              name="vehicle"
              value={modalForm.vehicle}
              onChange={handleModalChange}
            >
              {vehicles.map((v) => (
                <MenuItem key={v._id} value={`${v._id}:${v.name}`}>
                  PMT{v.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="dense"
            label="Date"
            name="date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={modalForm.date}
            onChange={handleModalChange}
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel>Route</InputLabel>
            <Select
              label="Route"
              name="route"
              value={modalForm.route}
              onChange={handleModalChange}
            >
              {routes.map((r) => (
                <MenuItem key={r._id} value={r._id}>
                  {r.desc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="dense"
            label="Passengers"
            name="passengers"
            type="number"
            value={modalForm.passengers}
            onChange={handleModalChange}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Fare"
            name="fare"
            type="number"
            value={modalForm.fare}
            onChange={handleModalChange}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Fuel"
            name="fuel"
            type="number"
            value={modalForm.fuel}
            onChange={handleModalChange}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Feeding"
            name="feeding"
            type="number"
            value={modalForm.feeding}
            onChange={handleModalChange}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#2C2C78" }}
            onClick={handleSaveLoadingInfo}
            disabled={!modalForm.vehicle || !modalForm.date || !modalForm.route || !modalForm.fare || !modalForm.passengers || !modalForm.fuel || !modalForm.feeding}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
          open={snackbar.open}
          autoHideDuration={1000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
    </Box>
  );
}