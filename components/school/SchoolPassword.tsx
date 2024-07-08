"use client"

import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

const SchoolPassword = () => {
  return(
    <Box>
      <Alert severity="error" sx={{ width:"100%" }}>
        入力した内容が異なっています
      </Alert>
      <Box sx={{ width:"100%" , height:"100vh" , display:"flex" , alignItems:"center" , justifyContent:"center" , flexDirection:"column" , gap:"2rem" }}>
        <TextField
            id="outlined-password-input"
            label="合言葉の設定"
            type="password"
            autoComplete="current-password"
            sx={{ width:"100%" , maxWidth:"40rem"}}
          />

          <TextField
            id="outlined-password-input"
            label="確認"
            type="password"
            autoComplete="current-password"
            sx={{ width:"100%" , maxWidth:"40rem"}}
          />

          <Button variant="contained" sx={{ width:"100%" , maxWidth:"40rem" , paddingY:"0.7rem" , marginTop:"4rem" }}>決定</Button>
      </Box>
    </Box>
  );
};

export default SchoolPassword;
