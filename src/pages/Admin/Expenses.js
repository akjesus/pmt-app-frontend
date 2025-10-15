import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TablePagination,
  Tabs,
  Tab
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { getVehicles } from "../../api/vehicles";
import { getBusexpenses, createBusExpenses } from "../../api/busLoading";
import { getExpenseItems, addExpenseItem } from "../../api/busLoading"; // Use correct import
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Expenses() {
  const [tab, setTab] = useState(0);

  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState("");
  const [expenseItem, setExpenseItem] = useState({ name: "", amount: "", quantity: "" });
  const [expenseItems, setExpenseItems] = useState([]);
  const [date, setDate] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [openDialog, setOpenDialog] = useState(false);

  // For expense table
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [tableBusFrom, setTableBusFrom] = useState("");
  const [tableBusTo, setTableBusTo] = useState("");
  const [expensesData, setExpensesData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // For expense items
  const [allExpenseItems, setAllExpenseItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  // Modal state for adding expense item
  const [openExpenseModal, setOpenExpenseModal] = useState(false);

  useEffect(() => {
    // Fetch buses from backend
      getVehicles().then((res) => {
      setBuses(res.data.vehicles)
    });
  }, []);

  useEffect(() => {
    if (tab === 1) {
      fetchExpenseItems();
    }
    // eslint-disable-next-line
  }, [tab]);

  const fetchExpenseItems = async () => {
    setLoadingItems(true);
    try {
      const res = await getExpenseItems();
      setAllExpenseItems(res.data.items || []);
    } catch {
      setAllExpenseItems([]);
      showSnackbar("Failed to fetch expense items", "error");
    } finally {
      setLoadingItems(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleBusChange = (e) => setSelectedBus(e.target.value);

  const handleExpenseChange = (e) => {
    setExpenseItem({ ...expenseItem, [e.target.name]: e.target.value });
  };

  const handleAddExpenseItem = () => {
    if (expenseItem.name && expenseItem.amount && expenseItem.quantity) {
      setExpenseItems([...expenseItems, expenseItem]);
      setExpenseItem({ name: "", amount: "", quantity: "" });
    }
  };

  const handleDeleteExpenseItem = (idx) => {
    setExpenseItems(expenseItems.filter((_, i) => i !== idx));
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleSaveExpenses = async () => {
    try {
      const res = await createBusExpenses(selectedBus, expenseItems, date);
        if(res.status === 201) {
          showSnackbar("Expenses saved!", "success");
          setOpenDialog(false);
          setSelectedBus("");
          setExpenseItems([]);
          }
          else {
            showSnackbar("Expenses not saved!", "info");
          }
    }
    catch(error) {
      console.log(error.response)
      showSnackbar(error.response.data.nessage || "There was an error!", "error");
    }
    
          setOpenDialog(false);
          setSelectedBus("");
          setExpenseItems([]);  
  };

  // Expense Table Handlers
  const handleTableBusFromChange = (e) => setTableBusFrom(e.target.value);
  const handleTableBusToChange = (e) => setTableBusTo(e.target.value);
  const handleFetchExpenses = async (e) => {
    e.preventDefault();
    try {
      const res = await getBusexpenses(tableBusFrom, tableBusTo, dateFrom, dateTo);
      if (res.status === 200 && res.data.expenses.length > 1){
        console.log(res.data)
        setExpensesData(res.data.expenses);
      setPage(0);
      showSnackbar("Expenses fetched!", "success");
      } else {
        setExpensesData([]);
        showSnackbar(res.data.message, "info");
      }
      
    } catch (err) {
      console.log(err)
      setExpensesData([]);
      showSnackbar(err.response.data.error || "Failed to fetch expenses", "error");
    }
  };

  // Print to PDF handler
  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Peace Extra Comfort Bus Expenses Report", 14, 16);
    doc.setFontSize(12);
    doc.text(`PMT${tableBusFrom.split(":")[1]} to PMT${tableBusTo.split(":")[1]}`, 14, 24);
    doc.text(`From ${dayjs(dateFrom).format("MMM D, YYYY")} to ${dayjs(dateTo).format("MMM D, YYYY")}`, 14, 29);

    // Prepare table data
    const tableData = expensesData
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((row) => {
        const totalAmount = row.expensesItems
          .reduce((sum, item) => sum + (Number(item.amount) * Number(item.quantity)), 0);

        const itemsList = row.expensesItems
          .map(item => `${item.name}: ₦${item.amount} x ${item.quantity} = ₦${Number(item.amount) * Number(item.quantity)}`)
          .join("\n");

        const formattedDate = row.transDate
          ? dayjs(row.transDate).format("MMM D, YYYY")
          : "";

        return [
          `PMT${row.name}`,
          itemsList + `\nTotal: ₦${totalAmount}`,
          formattedDate
        ];
      });

     autoTable(doc, {
      head: [["Bus", "Items / Amount", "Date"]],
      body: tableData,
      startY: 33,
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [44, 44, 120] }
    });

    doc.save("bus_expenses.pdf");
  };
  const handleEditExpenseItem = (item) => {
    setExpenseItem(item);
    setOpenExpenseModal(true);
  }
  

  // Add new expense item to API and refresh list
  const handleAddExpenseItemAPI = async () => {
    if (expenseItem.name && expenseItem.amount && expenseItem.quantity) {
      try {
        await addExpenseItem(expenseItem);
        showSnackbar("Expense item added!", "success");
        setExpenseItem({ name: "", amount: "", quantity: "" });
        fetchExpenseItems();
        setOpenExpenseModal(false);
      } catch (err) {
        showSnackbar("Failed to add expense item", "error");
      }
    }
  };

  return (
    <Box p={{ xs: 1, sm: 3 }}>
      <Typography
        variant="h5"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold", color: "#2C2C78", mb: { xs: 2, sm: 4 } }}
      >
        Bus Expenses
      </Typography>

      <Tabs
        value={tab}
        onChange={(e, newTab) => setTab(newTab)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 2 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Add/Fetch Bus Expenses" />
        <Tab label="Add Expense Items" />
      </Tabs>

      {/* Tab 1: Add/Fetch Bus Expenses */}
      {tab === 0 && (
        <>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              sx={{ bgcolor: "#2C2C78" }}
              onClick={handleOpenDialog}
              fullWidth={true}
            >
              Add Bus Expenses
            </Button>
          </Box>

          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="xs"
            fullWidth
            PaperProps={{
              sx: { m: { xs: 1, sm: 3 }, width: { xs: "100%", sm: 350 } },
            }}
          >
            <DialogTitle>Add Bus Expenses</DialogTitle>
            <DialogContent>
              <FormControl fullWidth margin="dense">
                <InputLabel>Bus</InputLabel>
                <Select
                  label="Bus"
                  name="bus"
                  value={selectedBus}
                  onChange={handleBusChange}
                >
                  {buses.map((bus) => (
                    <MenuItem key={bus._id} value={`${bus._id}:${bus.name}`}>
                      PMT{bus.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                <TextField
                  type="date"
                  fullWidth
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  margin="dense"
                />
                <TextField
                  label="Expense Item"
                  name="name"
                  value={expenseItem.name}
                  onChange={handleExpenseChange}
                  fullWidth
                  margin="dense"
                />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    label="Amount"
                    name="amount"
                    type="number"
                    value={expenseItem.amount}
                    onChange={handleExpenseChange}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={expenseItem.quantity}
                    onChange={handleExpenseChange}
                    fullWidth
                    margin="dense"
                  />
                </Box>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={handleAddExpenseItem}
                  disabled={!expenseItem.name || !expenseItem.amount || !expenseItem.quantity || !date}
                  fullWidth
                >
                  Add Expense Item
                </Button>
              </Box>
              <List sx={{ mt: 2 }}>
                {expenseItems.map((item, idx) => (
                  <ListItem key={idx} sx={{ display: "flex", justifyContent: "space-between" }}>
                    <ListItemText
                      primary={item.name}
                      secondary={`₦${item.amount} x ${item.quantity}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" color="error" onClick={() => handleDeleteExpenseItem(idx)}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "#2C2C78" }}
                onClick={handleSaveExpenses}
                disabled={!selectedBus || expenseItems.length === 0}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Expense Table Form */}
          <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 2 }}>
            <Box
              component="form"
              onSubmit={handleFetchExpenses}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: { sm: "center" },
              }}
            >
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Bus From</InputLabel>
                <Select
                  label="Bus"
                  InputLabelProps={{ shrink: true }}
                  name="tableBusFrom"
                  value={tableBusFrom}
                  onChange={handleTableBusFromChange}
                >
                  {buses.map((bus) => (
                    <MenuItem key={bus._id} value={`${bus._id}:${bus.name}`}>
                      PMT{bus.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Bus To</InputLabel>
                <Select
                  label="Bus"
                  InputLabelProps={{ shrink: true }}
                  name="tableBusTo"
                  value={tableBusTo}
                  onChange={handleTableBusToChange}
                >
                  {buses.map((bus) => (
                    <MenuItem key={bus._id} value={`${bus._id}:${bus.name}`}>
                      PMT{bus.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Date From"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                fullWidth={true}
              />
              <TextField
                label="Date To"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                fullWidth={true}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ bgcolor: "#2C2C78" }}
                fullWidth={true}
                disabled={!dateTo || !dateFrom || !tableBusTo || !tableBusFrom}
              >
                Fetch Expenses
              </Button>
            </Box>
          </Paper>

          {/* Expense Table */}
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Bus</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Items / Amount</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expensesData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const totalAmount = row.expensesItems
                        .reduce((sum, item) => sum + (Number(item.amount) * Number(item.quantity)), 0);

                      const formattedDate = row.transDate
                        ? dayjs(row.transDate).format("MMM D, YYYY")
                        : "";

                      const itemsList = row.expensesItems
                        .map(item => (
                          <Box key={item.name} sx={{ mb: 0.5 }}>
                            <span>
                              <strong>{item.name}</strong>: ₦{item.amount} x {item.quantity} = <strong>₦{Number(item.amount) * Number(item.quantity)}</strong>
                            </span>
                          </Box>
                        ));

                      return (
                        <TableRow key={row._id}>
                          <TableCell>PMT{row.name}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                              {itemsList}
                              <Box sx={{ mt: 1 }}>
                                <strong>Total: ₦{totalAmount}</strong>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{formattedDate}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={expensesData.length}
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

          {/* Print to PDF Button at the bottom */}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              sx={{ bgcolor: "#fff", color: "#2C2C78", borderColor: "#2C2C78" }}
              onClick={handlePrintPDF}
              fullWidth={false}
              disabled={expensesData.length === 0}
            >
              Print to PDF
            </Button>
          </Box>
        </>
      )}

      {/* Tab 2: Add Expense Items */}
      {tab === 1 && (
              <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenExpenseModal(true)}
                    sx={{ bgcolor: "#2C2C78", ":hover": { bgcolor: "#1f1f5c" } }}
                  >
                    Add Expenses Items
                  </Button>
                </Box>
                <Dialog
                  open={openExpenseModal}
                  onClose={() => setOpenExpenseModal(false)}  
                  maxWidth="xs"
                  fullWidth
                  PaperProps={{
                    sx: { m: { xs: 1, sm: 3 }, width: { xs: "100%", sm: 350 } },
                  }}
                >
                  <DialogTitle>{expenseItem.id ? `Edit Expense Item` : `Add Expense Item`}</DialogTitle>
                  <DialogContent>
                    <TextField
                      label="Expense Name"
                      name="name"
                      value={expenseItem.name}
                      onChange={handleExpenseChange}
                      fullWidth
                      margin="dense"
                      sx={{ mt: 1 }}
                    />
                    <TextField
                      label="Amount"
                      name="amount"
                      type="number"
                      value={expenseItem.amount}
                      onChange={handleExpenseChange}
                      fullWidth
                      margin="dense"
                      sx={{ mt: 2 }}
                    />
                    <TextField
                      label="Quantity"
                      name="quantity"
                      type="number"
                      value={expenseItem.quantity}
                      onChange={handleExpenseChange}
                      fullWidth
                      margin="dense"
                      sx={{ mt: 2 }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenExpenseModal(false)}>Cancel</Button>
                    <Button
                      variant="contained"
                      sx={{ bgcolor: "#2C2C78" }}
                      onClick={handleAddExpenseItemAPI}
                      disabled={!expenseItem.name || !expenseItem.amount || !expenseItem.quantity}
                    >
                      Save
                    </Button>
                  </DialogActions>
                </Dialog>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>S/NO</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Expense Item</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allExpenseItems.map((expense, idx) => (
                        <TableRow key={expense._id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{expense.name}</TableCell>
                          <TableCell>{expense.amount}</TableCell>
                          <TableCell>{expense.quantity}</TableCell>
                          <TableCell>
                            <IconButton
                              edge="end"
                              color="error"
                              // onClick={() => handleDeleteExpenseItem(expense._id)} // Implement delete if needed
                            >
                              <Delete />
                            </IconButton>
                            <IconButton
                              edge="end"
                              color="primary"
                              onClick={() => handleEditExpenseItem(expense)}
                            >
                              <Edit />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
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