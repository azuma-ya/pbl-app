import { Box, CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        height: "100vh",
        zIndex: 50,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;
