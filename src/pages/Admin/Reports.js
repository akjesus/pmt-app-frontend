import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TablePagination,
  Snackbar,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { getBusPerformance } from "../../api/busLoading";
import { getVehicles } from "../../api/vehicles";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs"; 

export default function ResultManagement() {
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Bus Performance Form State
  const [vehicleFrom, setVehicleFrom] = useState("");
  const [vehicleTo, setVehicleTo] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [busPerformanceData, setBusPerformanceData] = useState([]);
  const [busPerformanceSummary, setBusPerformanceSummary] = useState({});
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // get vehicles from API
    const fetchVehicles = async () => {
      try {
        const res = await getVehicles();
        setVehicles(res.data.vehicles || []);
      } catch (err) {
        setVehicles([]);
        showSnackbar("Failed to get vehicles", "error");
      }
    };
    fetchVehicles();
    // eslint-disable-next-line
  }, []);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const formattedDate = (date) => {
    return dayjs(date).format("MMM D, YYYY");
  };

  const handleTabChange = (event, newValue) => setTab(newValue);
  //function to format values to naira currency
  const formatToNaira = (value) => {
    return `₦${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  // Get bus performance data
  const handleBusPerformanceSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await getBusPerformance({
        vehicleFrom,
        vehicleTo,
        dateFrom,
        dateTo,
      });
      //the last item in res.data is the summary and should be made bold
      setBusPerformanceData(res.data.result || []);
      setPage(0);
      showSnackbar("Bus performance retrieved successfully!", "success");
      if (res.data.summary) {
        setBusPerformanceSummary(res.data.summary);
      } else {
        setBusPerformanceSummary({});
      }
    } catch (err) {
      setBusPerformanceData([]);
      showSnackbar("Failed to get bus performance", "error");
    }
  };

  // Print to PDF handler
  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Bus Performance Report", 14, 16);
    doc.setFontSize(10);
    doc.text(`Vehicle Range: PMT${vehicleFrom} to PMT${vehicleTo}`, 14, 22);
    doc.text(`Date Range: ${formattedDate(dateFrom)} to ${formattedDate(dateTo)}`, 14, 26);
   
    // Prepare table data
    const tableData = busPerformanceData.map((row, idx) => [
      idx + 1,
      `PMT${row.bus}`,
      row.passengers || 0,
      `${row.totalIncome || 0}.00`,
      `${row.feeding || 0}.00`,
      `${row.fuel || 0}.00`,
      `${row.maintenance || 0}.00`,
      `${row.netIncome || 0}.00`,
    ]);

    // Add summary row if present
    if (Object.keys(busPerformanceSummary).length > 0) {
      tableData.push([
        "",
        "TOTAL",
        busPerformanceSummary.passengers || 0,
        `N${busPerformanceSummary.totalIncome || 0}.00`,
        `N${busPerformanceSummary.feeding || 0}.00`,
        `N${busPerformanceSummary.fuel || 0}.00`,
        `N${busPerformanceSummary.maintenance || 0}.00`,
        `N${busPerformanceSummary.netIncome || 0}.00`,
      ]);
    }

    autoTable(doc, {
      head: [["S/NO", "Vehicle", "Pass.", "Income", "Feeding", "Fuel", "Maintenance", "Net Total"]],
      body: tableData,
      startY: 30,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [44, 44, 120] }
    });

    doc.save("bus_performance_report.pdf");
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#2C2C78" }}>
        Reports Management
      </Typography>

      {/* Tabs Navigation */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 2 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Bus Performance" />
        <Tab label="Depot Performance" />
        <Tab label="Summary" />
      </Tabs>

      {/* Tab Content */}
      {tab === 0 && (
        <Paper sx={{ mb: 2, p: { xs: 1, sm: 2 } }}>
          {/* Bus Performance Form */}
          <Box
            component="form"
            onSubmit={handleBusPerformanceSubmit}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              alignItems: { sm: "center" },
              mb: 2,
            }}
          >
            <FormControl fullWidth size="small">
              <InputLabel>Vehicle From</InputLabel>
              <Select
                label="Vehicle From"
                value={vehicleFrom}
                onChange={(e) => setVehicleFrom(e.target.value)}
              >
                {vehicles.map((vehicle) => (
                  <MenuItem key={vehicle._id} value={vehicle.name}>
                    PMT{vehicle.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Vehicle To</InputLabel>
              <Select
                label="Vehicle To"
                value={vehicleTo}
                onChange={(e) => setVehicleTo(e.target.value)}
              >
                {vehicles.map((vehicle) => (
                  <MenuItem key={vehicle._id} value={vehicle.name}>
                    PMT{vehicle.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Date From"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Date To"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              fullWidth
              size="small"
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: "#2C2C78" }}
              disabled={!vehicleFrom || !vehicleTo || !dateFrom || !dateTo}
              fullWidth
            >
              Get Bus Performance
            </Button>
          </Box>
          {/* Bus Performance Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>S/NO</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Vehicle</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Pass.</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Income</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Feeding</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Fuel</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Maintenance </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Net Income</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {busPerformanceData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, idx) => (
                    <TableRow key={row.busId || idx}>
                      <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                      <TableCell>PMT{row.bus}</TableCell>
                      <TableCell>{row.passengers || 0}</TableCell>
                      <TableCell>{formatToNaira(row.totalIncome || 0)}</TableCell>
                      <TableCell>{formatToNaira(row.feeding || 0)}</TableCell>
                      <TableCell>{formatToNaira(row.fuel || 0)}</TableCell>
                      <TableCell>{formatToNaira(row.maintenance || 0)}</TableCell>
                      <TableCell>{formatToNaira(row.netIncome || 0)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableBody>
                {Object.keys(busPerformanceSummary).length > 0 && (
                  <TableRow sx={{ fontWeight: "bold", bgcolor: "#f0f0f0" }}>
                    <TableCell colSpan={2}><strong>TOTAL</strong></TableCell>
                    <TableCell><strong>{(busPerformanceSummary.passengers || 0)}</strong></TableCell>
                    <TableCell><strong>{formatToNaira(busPerformanceSummary.totalIncome || 0)}</strong></TableCell>
                    <TableCell><strong>{formatToNaira(busPerformanceSummary.feeding || 0)}</strong></TableCell>
                    <TableCell><strong>{formatToNaira(busPerformanceSummary.fuel || 0)}</strong></TableCell>
                    <TableCell><strong>{formatToNaira(busPerformanceSummary.maintenance || 0)}</strong></TableCell>
                    <TableCell><strong>{formatToNaira(busPerformanceSummary.netIncome || 0)}</strong></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={busPerformanceData.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[50, 100, 150]}
          />
          {/* Print to PDF Button */}
          {busPerformanceData.length > 0 && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                sx={{ bgcolor: "#fff", color: "#2C2C78", borderColor: "#2C2C78" }}
                onClick={handlePrintPDF}
              >
                Print to PDF
              </Button>
            </Box>
          )}
        </Paper>
      )}

      {tab === 1 && (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Depot</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Total Buses</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Total Income</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Total Expenses</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Net Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Depot Performance Data */}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tab === 2 && (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Summary Item</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Summary Data */}
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
