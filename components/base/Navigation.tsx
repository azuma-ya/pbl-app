import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

const Navigation = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            学校名
          </Typography>
          <Button color="inherit">スレッド一覧</Button>
          <Button color="inherit">名前</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navigation;
