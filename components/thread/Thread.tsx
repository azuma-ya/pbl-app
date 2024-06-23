import { AppBar, Box, Button, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

const Thread = () => {
  return  
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

      <Box sx={{backgroundColor:"#aaa",display:"flex"}}>作成者</Box>
      <Box sx={{backgroundColor:"#aaa",display:"flex"}}>タイトル</Box>
      <Box sx={{backgroundColor:"#aaa",display:"flex"}}>カテゴリ</Box>
      <Box sx={{backgroundColor:"#aaa",display:"flex"}}>ステータス</Box>
      <Box sx={{backgroundColor:"#aaa",display:"flex"}}>作成日</Box>
      <Box sx={{backgroundColor:"#aaa",display:"flex"}}>更新日</Box>
      <Box sx={{backgroundColor:"#aaa",display:"flex"}}>マニュアル</Box>
      
      <Box sx={{display:"flex"}}>user1</Box>
      <Box sx={{display:"flex"}}>タイトル</Box>
      <Box sx={{display:"flex"}}>1</Box>
      <Box sx={{display:"flex"}}>完了</Box>
      <Box sx={{display:"flex"}}>20xx/xx/xx</Box>
      <Box sx={{display:"flex"}}>20xx/xx/xx</Box>
      <Box sx={{background:"#2f4f4f", display:"flex"}}>閲覧</Box>

      <Box sx={{display:"flex"}}>user2</Box>
      <Box sx={{display:"flex"}}>タイトル</Box>
      <Box sx={{display:"flex"}}>1</Box>
      <Box sx={{display:"flex"}}>完了</Box>
      <Box sx={{display:"flex"}}>20xx/xx/xx</Box>
      <Box sx={{display:"flex"}}>20xx/xx/xx</Box>
      <Box sx={{background:"#2f4f4f", display:"flex"}}>閲覧</Box>

      <Box sx={{display:"flex"}}>user3</Box>
      <Box sx={{display:"flex"}}>タイトル</Box>
      <Box sx={{display:"flex"}}>1</Box>
      <Box sx={{display:"flex"}}>完了</Box>
      <Box sx={{display:"flex"}}>20xx/xx/xx</Box>
      <Box sx={{display:"flex"}}>20xx/xx/xx</Box>
      <Box sx={{background:"#2f4f4f", display:"flex"}}>閲覧</Box>

      <Box sx={{textAlign:"right", background:"#2f4f4f"}}>新規スレッド作成</Box>
    </Box>;
};

export default Thread;
