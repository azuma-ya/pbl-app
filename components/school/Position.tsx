import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import type { SelectChangeEvent } from "@mui/material/Select";
import Select from "@mui/material/Select";
import * as React from "react";

const Position = () => {
  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  return (
    <Box>
      {/* //"Age"でなく"教員名"にするには？ labelを変更？ //教員名の選択 */}
      <Box sx={{ minWidth: 120, textAlign: "center" }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Age"
            onChange={handleChange}
          >
            {/* //valueとかは何にしたらよいか？ */}
            <MenuItem value={10}>〇〇先生</MenuItem>
            <MenuItem value={10}>〇〇先生</MenuItem>
            <MenuItem value={10}>〇〇先生</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {/* //役職の選択 */}
      <Box sx={{ minWidth: 120, textAlign: "center" }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Age"
            onChange={handleChange}
          >
            <MenuItem value={10}>〇〇先生</MenuItem>
            <MenuItem value={10}>〇〇先生</MenuItem>
            <MenuItem value={10}>〇〇先生</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {/* //チェックボックス ??? */}
      <Checkbox />
      <Button
        variant="contained"
        sx={{ background: "#2f4f4f", textAlign: "center", padding: "5px,50%" }}
      >
        決定
      </Button>
    </Box>
  );
};

export default Position;
