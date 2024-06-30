import Box from '@mui/material/Button';
import Button from '@mui/material/Button';
import * as React from 'react';

const SchoolSetting = () => {
  return <div>SchoolSetting</div>;

  <Box>
    <Button 
      variant="contained"
      sx={{ background: "#003B46", textAlign: "center", padding: "5px,50%" }}  
    >
      合言葉の設定
    </Button>

    <Button 
    variant="contained"
    sx={{ background: "#07575B", textAlign: "center", padding: "5px,50%" }}
    >
      役職の割り当て
    </Button>
  </Box>
};

export default SchoolSetting;
