import { Box, Button, TextField, Typography } from "@mui/material";

const ThreadNew = () => {
  return(
  <Box sx={{
    width:"100%",
    height:"75vh",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    flexDirection: 'column',
  }}>
    <Typography component="h1" variant="h5">
      スレッド作成
    </Typography>
      　
    <TextField fullWidth id="outlined-basic" label="タイトル" variant="outlined" />
      　
    <TextField fullWidth multiline rows={10} id="outlined-basic" label="詳細" variant="outlined" />
    <Button
      variant="contained"
      sx={{ mt: 3, mb: 2 }}
    >
    教師選択
    </Button>
    <Button
      fullWidth
      variant="contained"
      sx={{ mt: 3, mb: 2 }}
    >
    作成
    </Button>
  </Box>
  )
  //return <div>ThreadNew</div>;
};

export default ThreadNew;
