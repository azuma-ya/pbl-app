import { Box, Button } from "@mui/material";

const SchoolSetting = () => {
  return (
    <Box sx={{ width:"100%" , height:"100vh" , display:"flex" , alignItems:"center" , justifyContent:"center" , flexDirection:"column" , gap:"8rem"}}>
      <Button
        variant="contained"
        sx={{ width:"100%" , maxWidth:"24rem" , paddingY:"1rem"}}
      >
        合言葉の設定
      </Button>
      <Button
        variant="contained"
        sx={{ width:"100%" , maxWidth:"24rem" , paddingY:"1rem"}}
        >
          役職の割り当て
      </Button>
    </Box>
  );
};

export default SchoolSetting;
