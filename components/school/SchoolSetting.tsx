import { Box, Button, Link as MuiLink } from "@mui/material";
import Link from "next/link";

const SchoolSetting = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "8rem",
      }}
    >
      <Button
        variant="contained"
        sx={{ width: "100%", maxWidth: "24rem", paddingY: "1rem" }}
      >
        <MuiLink
          component={Link}
          href="/school/setting/password"
          underline="none"
          color="inherit"
        >
          合言葉の設定
        </MuiLink>
      </Button>
      <Button
        variant="contained"
        sx={{ width: "100%", maxWidth: "24rem", paddingY: "1rem" }}
      >
        <MuiLink
          component={Link}
          href="/school/setting/position"
          underline="none"
          color="inherit"
        >
          役職の割り当て
        </MuiLink>
      </Button>
    </Box>
  );
};

export default SchoolSetting;
