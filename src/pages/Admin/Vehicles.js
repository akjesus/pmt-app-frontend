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
  TextField,
  DialogActions,
  IconButton,
  Input,
  TablePagination,
  MenuItem,
} from "@mui/material";
import { Edit, Delete, UploadFile} from "@mui/icons-material";

// Mock API imports (replace with actual API calls)
import { getVehicles } from "../../api/vehicles";

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    getAllVehicles();
  }, []);

  const getAllVehicles = async () => {
    try {
      const response = await getVehicles();
      setVehicles(response.data.vehicles);
    }
    catch (error) {
      console.error("Failed to fetch vehicles", error);
    }

  }
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newVehicle, setNewVehicle] = useState({
    vehicleId: "",
    plateNumber: "",
    make: "",
    model: "",
    year: "",
    });

  // Filters
  const [search, setSearch] = useState("");
  const [filterId, setFilterId] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

 
  const handleOpen = (vehicle = null, index = null) => {
    if (vehicle) {
      setNewVehicle (vehicle);
      setEditIndex(index);
    } else {
      setNewVehicle({ vehicleId: "", plateNumber: "", make: "", model: "", year: "" });
      setEditIndex(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleChange = (e) => setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value });

  const handleSaveVehicle = () => {
    if (editIndex !== null) {
      const updated = [...vehicles];
      updated[editIndex] = newVehicle;
      setVehicles(updated);
    } else {
      setVehicles([...vehicles, newVehicle]);
    }
    handleClose();
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      const updated = vehicles.filter((_, i) => i !== index);
      setVehicles(updated);
    }
  };

  // Filtered vehicles
  const filteredVehicles = vehicles.filter(
    (v) =>
      v.name.toString().includes(search.toString()) &&
      (filterId ? v.id === filterId : true)
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Manage Vehicles</Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="contained" sx={{ bgcolor: "#2C2C78", ":hover": { bgcolor: "#1f1f5c" } }} onClick={() => handleOpen()}>Add Vehicle</Button>
        <Button variant="outlined" component="label" startIcon={<UploadFile />}>
          Bulk Upload (CSV)
          <Input type="file" accept=".csv" sx={{ display: "none" }} />
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField label="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} size="small" />
      </Box>

      {/* Vehicles Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Vehicle ID</TableCell>
            <TableCell>Vehicle Plate Number</TableCell>
            <TableCell>Make</TableCell>
            <TableCell>Reg No</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredVehicles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vehicle, index) => (
            <TableRow key={vehicle._id}>
              <TableCell>PMT{vehicle.name}</TableCell>
              <TableCell>{vehicle.plateNo}</TableCell>
              <TableCell>{vehicle.vehiclemake}</TableCell>
              <TableCell>{vehicle.regNo}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleOpen(vehicle, index)}><Edit /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(index)}><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={filteredVehicles.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
      />

      {/* Add/Edit Student Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIndex !== null ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Vehicle ID" name="vehicleId" fullWidth value={newVehicle.vehicleId} onChange={handleChange} />
          <TextField margin="dense" label="Plate Number" name="plateNumber" fullWidth value={newVehicle.plateNumber} onChange={handleChange} />
          <TextField margin="dense" label="Make" name="make" fullWidth value={newVehicle.make} onChange={handleChange} />
          <TextField margin="dense" label="Model" name="model" fullWidth value={newVehicle.model} onChange={handleChange} />
          <TextField margin="dense" label="Year" name="year" fullWidth value={newVehicle.year} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: "#2C2C78" }} onClick={handleSaveVehicle}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
