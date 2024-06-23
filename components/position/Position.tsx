import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


export default function BasicSelect() {
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

//const label = { inputProps: { 'aria-labelhsh': 'Checkbox demo' } };

const Position = () => {
  return
    <Box>
      //"Age"でなく"教員名"にするには？ labelを変更？
      //教員名の選択
      <Box sx={{ minWidth: 120, textAlign:"center" }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Age"
            onChange={handleChange}
          >
             //valueとかは何にしたらよいか？
            <MenuItem value={10}>〇〇先生</MenuItem>
            <MenuItem value={10}>〇〇先生</MenuItem>
            <MenuItem value={10}>〇〇先生</MenuItem>
          </Select>
        </FormControl>
      </Box>

      //役職の選択
      <Box sx={{ minWidth: 120, textAlign:"center" }}>
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

      //チェックボックス ???
      <Checkbox {...label} />

      <Button variant="contained" sx={{background:"#2f4f4f", textAlign:"center", padding:"5px,50%"}}>決定</Button>
    </Box>
};

export default Position;