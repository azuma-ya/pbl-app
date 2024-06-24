import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const Manual = () => {
  return
  <Box>
    <Box sx={{background:"#d3d3d3"}}>
      <Box sx={{textAlign:"center"}}>Group</Box>

      <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      >
        <TextField id="outlined-basic" label="Search" variant="outlined" />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex" }}>Group名</Box>
        <Box sx={{ display: "flex" }}>Group名</Box>
        <Box sx={{ display: "flex" }}>Group名</Box>
        <Box sx={{ display: "flex" }}>Group名</Box>
        <Box sx={{ display: "flex" }}>Group名</Box>
      </Box>
    //card ?
    </Box>
  </Box>
};

export default Manual;