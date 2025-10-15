import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {addTown, getTowns, updateTown, deleteTown} from '../../api/towns';

  export default function Towns() {

  useEffect(() => {
    fetchTowns();
  }, []);

  const fetchTowns = async () => {
    try {
      const response = await getTowns();
      setTowns(response.data);
    } catch (error) {
      showSnackbar(error.message || "Failed to fetch towns", "error");

    }
  };
  const [towns, setTowns] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  }
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async() => {
    if (!form.name ) {
      showSnackbar("All fields are required", "error");
      return;
    }
    if (editId) {
      setTowns(towns.map((g) => (g.id === editId ? { id: editId, ...form } : g)));
      showSnackbar("Town updated successfully", "success");
    } else {
      try {
        const response = await addTown(form);
        setTowns([...towns, response.data]);
        showSnackbar("Town added successfully", "success");
      } catch (error) {
        showSnackbar("Failed to add town", "error");
      }
    }
    setForm({ name: "" });
    setEditId(null);
  };

  const handleEdit = (towns) => {
    setForm(towns);
    setEditId(towns.id);
  };

  const handleDelete = (id) => {
    setTowns(towns.filter((g) => g.id !== id));
    setSnackbar({ open: true, message: "Town deleted", severity: "info" });
  };

  return (
    <Box p={3}>
      <h2>Towns Management</h2>
      <Box display="flex" gap={2} mb={2}>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} />
        <Button variant="contained" onClick={handleSubmit}>
          {editId ? "Update" : "Add"}
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {towns.map((t) => (
            <TableRow key={t.id}>
              <TableCell>{t.name}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleEdit(t)}><Edit /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(t.id)}><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // set position to top center
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
