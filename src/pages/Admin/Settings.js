import React, { useState } from "react";
import {
  Box,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

const schools = ["Engineering", "Sciences", "Arts", "Medicine"];
const semesters = ["First Semester", "Second Semester"];
const levels = ["100", "200", "300", "400", "500"];

export default function Settings() {
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [visibility, setVisibility] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const makeKey = (school, semester, level) => `${school}-${semester}-${level}`;

  const handleToggle = () => {
    const key = makeKey(selectedSchool, selectedSemester, selectedLevel);
    setVisibility({ ...visibility, [key]: !visibility[key] });
    setSnackbar({
      open: true,
      message: `${selectedSchool} - ${selectedSemester} - Level ${selectedLevel} results ${
        !visibility[key] ? "shown" : "hidden"
      }`,
      severity: "info",
    });
  };

  return (
    <Box p={3} display="flex" justifyContent="center">
      <Box width="50%">
        <h2>System Settings</h2>

        {/* School Dropdown */}
        <InputLabel>Select School</InputLabel>
        <Select
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        >
          {schools.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>

        {/* Semester Dropdown */}
        <InputLabel>Select Semester</InputLabel>
        <Select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        >
          {semesters.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>

        {/* Level Dropdown */}
        <InputLabel>Select Level</InputLabel>
        <Select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        >
          {levels.map((lvl) => (
            <MenuItem key={lvl} value={lvl}>
              {lvl}
            </MenuItem>
          ))}
        </Select>

        {/* Toggle Visibility */}
        {selectedSchool && selectedSemester && selectedLevel && (
          <FormControlLabel
            control={
              <Switch
                checked={
                  visibility[makeKey(selectedSchool, selectedSemester, selectedLevel)] || false
                }
                onChange={handleToggle}
              />
            }
            label={
              visibility[makeKey(selectedSchool, selectedSemester, selectedLevel)]
                ? `${selectedSchool} - ${selectedSemester} - Level ${selectedLevel} Results Visible`
                : `${selectedSchool} - ${selectedSemester} - Level ${selectedLevel} Results Hidden`
            }
          />
        )}

        {/* Snackbar Notification */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
