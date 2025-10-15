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
  Tabs,
  Tab,
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
  const [tab, setTab] = useState(0);

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
    <Box
      p={{ xs: 1, sm: 3 }}
      sx={{
        width: "100%",
        maxWidth: 900,
        mx: "auto",
        bgcolor: "#fff",
        borderRadius: { xs: 0, sm: 3 },
        boxShadow: { xs: 0, sm: 2 },
        minHeight: "80vh",
      }}
    >
      {/* Header */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#2C2C78",
          fontSize: { xs: "1.2rem", sm: "2rem" },
          textAlign: { xs: "center", sm: "left" },
          mb: { xs: 2, sm: 3 },
        }}
      >
        Loading Info
      </Typography>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        <Tab label="Get Loading Info" />
        <Tab label="Add Loading Info" />
      </Tabs>

      {/* Tab Panels */}
      {tab === 0 && (
        <>
          {/* Date Range Form */}
          <Box
            component="form"
            onSubmit={handleFetchLoadingInfo}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 2,
              alignItems: { xs: "stretch", sm: "center" },
            }}
          >
            <TextField
              label="Date From"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Date To"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#2C2C78",
                flex: 1,
                minWidth: { xs: "100%", sm: "auto" },
              }}
              disabled={!dateFrom || !dateTo}
            >
              Get Loading Info
            </Button>
          </Box>

          <Paper
            sx={{
              width: "100%",
              overflowX: "auto",
              mb: 2,
              boxShadow: { xs: 0, sm: 2 },
            }}
          >
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", minWidth: 80 }}>Vehicle</TableCell>
                    <TableCell sx={{ fontWeight: "bold", minWidth: 80 }}>Route</TableCell>
                    <TableCell sx={{ fontWeight: "bold", minWidth: 60 }}>Fare</TableCell>
                    <TableCell sx={{ fontWeight: "bold", minWidth: 60 }}>Passengers</TableCell>
                    <TableCell sx={{ fontWeight: "bold", minWidth: 80 }}>Total Income</TableCell>
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
              sx={{
                ".MuiTablePagination-toolbar": {
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                  gap: 1,
                },
              }}
            />
          </Paper>
        </>
      )}

      {tab === 1 && (
        <>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenModal}
            sx={{
              mb: 2,
              minWidth: { xs: "100%", sm: "auto" },
            }}
          >
            Add Loading Info
          </Button>
          {/* Modal for creating loading info */}
          <Dialog
            open={openModal}
            onClose={handleCloseModal}
            maxWidth="xs"
            fullWidth
            PaperProps={{
              sx: { minWidth: { xs: "90vw", sm: 320 }, maxWidth: 350 }
            }}
          >
            <DialogTitle sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>Create Loading Info</DialogTitle>
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
            <DialogActions sx={{ flexDirection: { xs: "column", sm: "row" }, gap: 1 }}>
              <Button fullWidth={true} onClick={handleCloseModal}>Cancel</Button>
              <Button
                fullWidth={true}
                variant="contained"
                sx={{ bgcolor: "#2C2C78" }}
                onClick={handleSaveLoadingInfo}
                disabled={
                  !modalForm.vehicle ||
                  !modalForm.date ||
                  !modalForm.route ||
                  !modalForm.fare ||
                  !modalForm.passengers ||
                  !modalForm.fuel ||
                  !modalForm.feeding
                }
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

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