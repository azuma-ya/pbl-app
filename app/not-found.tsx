import { Box } from "@mui/material";

const NotFound = () => {
  return (
    <Box>
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
