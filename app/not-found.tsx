import { Box } from "@mui/material";

const NotFound = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          fontSize: "3rem",
          fontWeight: "bold",
          mb: 3,
        }}
      >
        404
      </Box>
      <Box
        sx={{ textAlign: "center", fontSize: "1.25rem", fontWeight: "bold" }}
      >
        Not Found
      </Box>
    </Box>
  );
};

export default NotFound;
