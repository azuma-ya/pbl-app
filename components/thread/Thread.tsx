import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

const Thread = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            学校名
          </Typography>
          <Button color="inherit">名前</Button>
        </Toolbar>
      </AppBar>

      <Box>
        <Box sx={{ backgroundColor: "#aaa", display: "flex" }}>作成者</Box>
      </Box>
    </Box>
  );
};

export default Thread;
