"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import type { SelectChangeEvent } from "@mui/material/Select";
import Select from "@mui/material/Select";
import * as React from "react";

const SchoolPosition = () => {
  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "6rem",
      }}
    >
      <Box sx={{ width: "100%", minWidth: "20rem", maxWidth: "24rem" }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">教員名</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="教員名"
            onChange={handleChange}
          >
            <MenuItem value={0}>〇〇先生</MenuItem>
            <MenuItem value={1}>〇〇先生</MenuItem>
            <MenuItem value={2}>〇〇先生</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ width: "100%", minWidth: "20rem", maxWidth: "24rem" }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">役職</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="役職"
            onChange={handleChange}
          >
            <MenuItem value={0}>校長</MenuItem>
            <MenuItem value={1}>教頭</MenuItem>
            <MenuItem value={2}>学年主任</MenuItem>
            <MenuItem value={3}>担任</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box>
        <Checkbox />
        権限を付与
      </Box>

      <Button
        variant="contained"
        sx={{ width: "100%", maxWidth: "50rem", paddingY: "1rem" }}
      >
        決定
      </Button>
    </Box>
  );
};

export default SchoolPosition;
